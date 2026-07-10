import { test, expect } from "@playwright/test";
import http from "http";

// Gala landing page (/gala-fundraiser-video-production)
// — sections render, the mobile menu and bottom CTA behave, and the
// availability form posts through /api/booking (page:"gala") to the
// mocked HOLD_WEBHOOK_URL (same 9911 mock pattern as the other suites;
// sequential workers:1, listener closed in afterAll).

const ROUTE = "/gala-fundraiser-video-production";

type Hit = { body: Record<string, unknown> };
let server: http.Server;
let hits: Hit[] = [];

test.beforeAll(async () => {
  server = http.createServer((req, res) => {
    let buf = "";
    req.on("data", (c) => (buf += c));
    req.on("end", () => {
      hits.push({ body: buf ? JSON.parse(buf) : {} });
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

test("gala page renders all sections with resolving anchors", async ({ page }) => {
  await page.goto(ROUTE);
  await expect(page).toHaveTitle(/Gala & Fundraiser Video Production Orange County/);
  await expect(page.locator("h1")).toContainText("Gala & Fundraiser Video Production");
  for (const id of ["top", "what-we-cover", "video-plan", "engagement-types", "check-availability"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await expect(page.locator(".gf-chip")).toHaveCount(8);
  await expect(page.locator(".gf-phase")).toHaveCount(3);
  await expect(page.locator(".gf-eng-card")).toHaveCount(3);
  await expect(page.locator(".gf-proof-logo img")).toHaveCount(7);
  await expect(page.locator(".gf-panel li")).toHaveCount(5);
  // featured Phase 02 carries the red-edge treatment
  await expect(page.locator(".gf-phase.gf-feature")).toHaveCount(1);
  // ink-on-paper CTAs keep their own color (regression: `.cp a` used to
  // out-specify them, leaving paper-on-paper invisible text)
  const solidColor = await page
    .locator(".gf-cta-solid")
    .evaluate((el) => getComputedStyle(el).color);
  expect(solidColor).toBe("rgb(17, 16, 19)");
  // every in-page anchor points at an existing id
  const anchors = await page
    .locator('.cp a[href^="#"]:not([href="#"])')
    .evaluateAll((els) => els.map((a) => a.getAttribute("href")));
  for (const a of new Set(anchors)) {
    await expect(page.locator(a!)).toHaveCount(1);
  }

  // no dead-end microsite: header + footer lockups link home, and the
  // footer carries the subtle selected-work escape hatch
  await expect(page.locator('.gf-nav a[aria-label="Front Row Broadcast home"]')).toHaveAttribute("href", "/");
  await expect(page.locator(".gf-footer-home")).toHaveAttribute("href", "/");
  await expect(page.locator(".gf-footer-home")).toHaveAttribute("aria-label", "Front Row Broadcast home");
  const sw = page.locator('.gf-footer-links a[href="/#selected-work"]');
  await expect(sw).toContainText("View selected work");
  // hero CTA still jumps to the availability form
  await expect(page.locator(".gf-cta-solid")).toHaveAttribute("href", "#check-availability");
  // sibling cross-link with descriptive anchor text
  await expect(page.locator(".gf-xlink a")).toHaveAttribute("href", "/corporate-event-video-production-orange-county");
  await expect(page.locator(".gf-xlink a")).toContainText("corporate event video production");
  // footer pages nav present
  await expect(page.locator('.gf-footer-links a[href="/corporate-event-video-production-orange-county"]')).toHaveCount(1);

  // header logo actually lands on the homepage
  await page.locator('.gf-nav a[aria-label="Front Row Broadcast home"]').click();
  await page.waitForURL((u) => u.pathname === "/");
  await expect(page.locator("#selected-work")).toHaveCount(1);
});

test("availability form: validation blocks, happy path tags page gala", async ({ page }) => {
  await page.goto(ROUTE);
  await page.locator("#check-availability").scrollIntoViewIfNeeded();
  await page.locator(".gf-submit").click();
  await expect(page.locator(".gf-form-error")).toContainText("Email and event date are required.");
  expect(hits.length).toBe(0);

  await page.locator("#gf-email").fill("development@foundation.org");
  await page.locator("#gf-date").fill("04/18/2026");
  await page.locator("#gf-venue").fill("Balboa Bay Resort, Newport Beach");
  await page.locator("#gf-notes").fill("Annual gala, honoree program, live auction.");
  await page.locator(".gf-submit").click();

  await expect(page.locator(".gf-received-head")).toContainText("on the board", { timeout: 10_000 });
  expect(hits.length).toBe(1);
  const b = hits[0].body;
  expect(b.email).toBe("development@foundation.org");
  expect(b.date).toBe("04/18/2026");
  expect(b.page).toBe("gala");
  expect(b).not.toHaveProperty("company");

  // reset returns a clean form
  await page.locator(".gf-received-reset").click();
  await expect(page.locator("#gf-email")).toHaveValue("");
});

test("mobile: menu overlay + bottom CTA gating", async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  await page.goto(ROUTE);

  // burger opens the overlay: the four page anchors + the small
  // "Front Row Home" escape hatch; the overlay lockup links home
  await page.locator(".gf-burger").tap();
  await expect(page.locator(".gf-menu")).toBeVisible();
  for (const href of ["#what-we-cover", "#video-plan", "#engagement-types", "#check-availability"]) {
    await expect(page.locator(`.gf-menu-links a[href="${href}"]`)).toHaveCount(1);
  }
  await expect(page.locator(".gf-menu-home")).toHaveAttribute("href", "/");
  await expect(page.locator('.gf-menu a[aria-label="Front Row Broadcast home"]')).toHaveAttribute("href", "/");
  await page.locator('.gf-menu-links a[href="#video-plan"]').tap();
  await expect(page.locator(".gf-menu")).toHaveCount(0);

  // bottom CTA: hidden at top, shown between sections, hidden at the form
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await expect(page.locator(".gf-mobile-cta")).toHaveAttribute("data-state", "hidden");
  await page.locator("#engagement-types").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await expect(page.locator(".gf-mobile-cta")).toHaveAttribute("data-state", "shown");
  await page.locator("#check-availability").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await expect(page.locator(".gf-mobile-cta")).toHaveAttribute("data-state", "hidden");
  await ctx.close();
});
