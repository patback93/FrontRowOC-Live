import { test, expect } from "@playwright/test";
import http from "http";

// Homepage (/) — sections render, interactions work, and the booking
// sheet posts through /api/booking to the mocked HOLD_WEBHOOK_URL
// (127.0.0.1:9911, set by playwright.config.ts for the managed
// webServer — the same hook hold-form.spec.ts mocks; suites run
// sequentially with workers:1 and each closes its listener in afterAll).

type Hit = { url: string; body: Record<string, unknown> };
let server: http.Server;
let hits: Hit[] = [];

test.beforeAll(async () => {
  server = http.createServer((req, res) => {
    let buf = "";
    req.on("data", (c) => (buf += c));
    req.on("end", () => {
      hits.push({ url: req.url || "", body: buf ? JSON.parse(buf) : {} });
      res.writeHead(200, { "content-type": "application/json" });
      res.end('{"ok":true}');
    });
  });
  await new Promise<void>((r) => server.listen(9911, "127.0.0.1", r));
});

test.afterAll(async () => {
  await new Promise<void>((r) => server.close(() => r()));
});

test.beforeEach(() => {
  hits = [];
});

test("sections render in running order with slates", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Front Row Broadcast/);
  for (const id of ["who", "services", "projects", "book"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await expect(page.locator(".hm-slate")).toHaveCount(4);
  // credit banner carries all seven partner logos
  await expect(page.locator(".hm-credit-logo")).toHaveCount(7);
});

test("who-we-are statement reveals on scroll", async ({ page }) => {
  await page.goto("/");
  await page.locator("#who").scrollIntoViewIfNeeded();
  await expect(page.locator(".hm-l2")).toHaveText("Cinematic");
  await expect(page.locator(".hm-l2")).toHaveCSS("opacity", "1", { timeout: 10_000 });
});

test("services accordion: five items, first open, toggling works", async ({ page }) => {
  await page.goto("/");
  await page.locator("#services").scrollIntoViewIfNeeded();
  await expect(page.locator(".hm-svc")).toHaveCount(5);
  await expect(page.locator(".hm-svc.hm-open")).toHaveCount(1);
  await expect(page.locator(".hm-svc-panel")).toBeVisible();

  // open Technical Resources — the crew sheet lists eight roles
  await page.locator(".hm-svc-head").nth(4).click();
  await expect(page.locator(".hm-svc-role")).toHaveCount(8);
});

test("projects concourse initializes with seven posters and live plate", async ({ page }) => {
  await page.goto("/");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-frbp-case]")).toHaveCount(7);
  await expect(page.locator('[data-frbp="counter"]')).toHaveText("01 / 07", { timeout: 10_000 });
  // clicking the last contact-strip frame dollies the wall to CH 07
  await page.locator("[data-frbp-tick='6']").click();
  await expect(page.locator('[data-frbp="title"]')).toHaveText("Elton John", { timeout: 10_000 });
  await expect(page.locator('[data-frbp="counter"]')).toHaveText("07 / 07");
});

test("booking sheet: required-field validation blocks empty submit", async ({ page }) => {
  await page.goto("/");
  await page.locator("#book").scrollIntoViewIfNeeded();
  await page.locator(".hm-btn-primary").click();
  await expect(page.locator(".hm-sheet-error")).toContainText(
    "Name, email, and event date are required.",
  );
  expect(hits.length).toBe(0);
});

test("booking sheet happy path: webhook receives payload, confirmation shows", async ({ page }) => {
  await page.goto("/");
  await page.locator("#book").scrollIntoViewIfNeeded();
  await page.locator("#ct-name").fill("Jane Producer");
  await page.locator("#ct-org").fill("OC Events");
  await page.locator("#ct-email").fill("jane@ocevents.com");
  await page.locator("#ct-date").fill("10/03/2026");
  await page.locator("#ct-venue").fill("Honda Center, Anaheim");
  await page.locator(".hm-et-chip").nth(3).click(); // Gala / fundraiser
  await page.locator("#ct-notes").fill("Two IMAG screens, live giving segment.");
  await page.locator(".hm-btn-primary").click();

  await expect(page.locator(".hm-received")).toBeVisible({ timeout: 10_000 });
  await expect(page.locator(".hm-received-head")).toContainText("on the board");

  expect(hits.length).toBe(1);
  const b = hits[0].body;
  expect(b.name).toBe("Jane Producer");
  expect(b.email).toBe("jane@ocevents.com");
  expect(b.date).toBe("10/03/2026");
  expect(b.venue).toBe("Honda Center, Anaheim");
  expect(b.type).toBe("Gala / fundraiser");
  expect(b.notes).toBe("Two IMAG screens, live giving segment.");
  expect(b.page).toBe("home");
  expect(b).not.toHaveProperty("company");

  // reset returns to a clean sheet
  await page.locator(".hm-received-reset").click();
  await expect(page.locator(".hm-sheet")).toBeVisible();
  await expect(page.locator("#ct-name")).toHaveValue("");
});

test("mobile: burger menu opens, swipe rail replaces concourse", async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator(".hm-burger")).toBeVisible();
  await page.locator(".hm-burger").tap();
  await expect(page.locator(".hm-menu")).toBeVisible();
  await page.locator(".hm-menu-links a").first().tap();
  await expect(page.locator(".hm-menu")).toHaveCount(0);

  await expect(page.locator(".hm-concourse")).toBeHidden();
  await expect(page.locator(".hm-swipe-card")).toHaveCount(7);
  await ctx.close();
});
