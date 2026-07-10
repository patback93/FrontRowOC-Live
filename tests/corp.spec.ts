import { test, expect } from "@playwright/test";
import http from "http";

// Corporate landing page (/corporate-event-video-production-orange-county)
// — sections render, the mobile menu and bottom CTA behave, and the
// availability form posts through /api/booking (page:"corporate") to the
// mocked HOLD_WEBHOOK_URL (same 9911 mock pattern as the other suites;
// sequential workers:1, listener closed in afterAll).

const ROUTE = "/corporate-event-video-production-orange-county";

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

test("corporate page renders all sections with resolving anchors", async ({ page }) => {
  await page.goto(ROUTE);
  await expect(page).toHaveTitle(/Corporate Event Video Production Orange County/);
  await expect(page.locator("h1")).toContainText("cannot miss");
  for (const id of ["top", "what-we-cover", "video-plan", "engagement-types", "check-availability"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await expect(page.locator(".cp-chip")).toHaveCount(8);
  await expect(page.locator(".cp-phase")).toHaveCount(3);
  await expect(page.locator(".cp-eng-card")).toHaveCount(3);
  await expect(page.locator(".cp-proof-logo img")).toHaveCount(7);
  await expect(page.locator(".cp-intake li")).toHaveCount(6);
  // ink-on-paper CTAs keep their own color (regression: `.cp a` used to
  // out-specify them, leaving paper-on-paper invisible text)
  const solidColor = await page
    .locator(".cp-cta-solid")
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
  await expect(page.locator('.cp-nav a[aria-label="Front Row Broadcast home"]')).toHaveAttribute("href", "/");
  await expect(page.locator(".cp-footer-home")).toHaveAttribute("href", "/");
  await expect(page.locator(".cp-footer-home")).toHaveAttribute("aria-label", "Front Row Broadcast home");
  const sw = page.locator('.cp-footer-links a[href="/#selected-work"]');
  await expect(sw).toContainText("View selected work");
  // hero CTA still jumps to the availability form
  await expect(page.locator(".cp-cta-solid")).toHaveAttribute("href", "#check-availability");
  // sibling cross-link with descriptive anchor text
  await expect(page.locator(".cp-xlink a")).toHaveAttribute("href", "/gala-fundraiser-video-production");
  await expect(page.locator(".cp-xlink a")).toContainText("gala and fundraiser video production");
  // footer pages nav present
  await expect(page.locator('.cp-footer-links a[href="/gala-fundraiser-video-production"]')).toHaveCount(1);

  // header logo actually lands on the homepage
  await page.locator('.cp-nav a[aria-label="Front Row Broadcast home"]').click();
  await page.waitForURL((u) => u.pathname === "/");
  await expect(page.locator("#selected-work")).toHaveCount(1);
});

test("availability form: validation blocks, happy path tags page corporate", async ({ page }) => {
  await page.goto(ROUTE);
  await page.locator("#check-availability").scrollIntoViewIfNeeded();
  await page.locator(".cp-submit").click();
  await expect(page.locator(".cp-form-error")).toContainText("Email and event date are required.");
  expect(hits.length).toBe(0);

  await page.locator("#cp-email").fill("planner@acme.com");
  await page.locator("#cp-date").fill("11/14/2026");
  await page.locator("#cp-venue").fill("Anaheim Convention Center");
  await page.locator("#cp-notes").fill("Sales kickoff, keynote + livestream.");
  await page.locator(".cp-submit").click();

  await expect(page.locator(".cp-received-head")).toContainText("on the board", { timeout: 10_000 });
  expect(hits.length).toBe(1);
  const b = hits[0].body;
  expect(b.email).toBe("planner@acme.com");
  expect(b.date).toBe("11/14/2026");
  expect(b.page).toBe("corporate");
  expect(b).not.toHaveProperty("company");

  // reset returns a clean form
  await page.locator(".cp-received-reset").click();
  await expect(page.locator("#cp-email")).toHaveValue("");
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
  await page.locator(".cp-burger").tap();
  await expect(page.locator(".cp-menu")).toBeVisible();
  for (const href of ["#what-we-cover", "#video-plan", "#engagement-types", "#check-availability"]) {
    await expect(page.locator(`.cp-menu-links a[href="${href}"]`)).toHaveCount(1);
  }
  await expect(page.locator(".cp-menu-home")).toHaveAttribute("href", "/");
  await expect(page.locator('.cp-menu a[aria-label="Front Row Broadcast home"]')).toHaveAttribute("href", "/");
  await page.locator('.cp-menu-links a[href="#video-plan"]').tap();
  await expect(page.locator(".cp-menu")).toHaveCount(0);

  // bottom CTA: hidden at top, shown between sections, hidden at the form
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await expect(page.locator(".cp-mobile-cta")).toHaveAttribute("data-state", "hidden");
  await page.locator("#engagement-types").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await expect(page.locator(".cp-mobile-cta")).toHaveAttribute("data-state", "shown");
  await page.locator("#check-availability").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await expect(page.locator(".cp-mobile-cta")).toHaveAttribute("data-state", "hidden");
  await ctx.close();
});
