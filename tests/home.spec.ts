import { test, expect } from "@playwright/test";
import http from "http";

// Homepage (/) — sections render, interactions work, and the
// availability request posts through /api/booking to the mocked
// HOLD_WEBHOOK_URL (127.0.0.1:9911, set by playwright.config.ts for
// the managed webServer — the same hook hold-form.spec.ts mocks;
// suites run sequentially with workers:1 and each closes its
// listener in afterAll).

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
  for (const id of ["top", "selected-work", "services", "plan", "availability"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  // deleted sections are fully gone
  await expect(page.locator("#who, #paths, #system")).toHaveCount(0);
  await expect(page.locator(".hm-slate")).toHaveCount(4);
  // Selected work leads the content (just under the logo bar); slate
  // numbers ascend 01–04 in scroll order
  const sections = await page.locator("section[id]").evaluateAll((els) => els.map((e) => e.id));
  expect(sections.indexOf("selected-work")).toBeLessThan(sections.indexOf("services"));
  expect(sections.indexOf("services")).toBeLessThan(sections.indexOf("plan"));
  expect(await page.locator(".hm-slate-idx").allTextContents()).toEqual(["01", "02", "03", "04"]);
  // hero headline + proof strip with all seven partner logos
  await expect(page.locator(".hm-hero-headline")).toContainText("broadcast backbone");
  await expect(page.locator(".hm-credit-logo")).toHaveCount(7);
});

test("hero reel card opens the modal; Esc closes it", async ({ page }) => {
  await page.goto("/");
  await page.locator(".hm-reel-card").click();
  await expect(page.locator(".hm-modal-dialog")).toBeVisible();
  await expect(page.locator(".hm-modal-title")).toHaveText("Watch the reel");
  // focus lands on CLOSE; Tab is trapped inside the dialog (CLOSE ⇄ CTA)
  await expect(page.locator(".hm-modal-close")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(".hm-modal-cta")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(".hm-modal-close")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator(".hm-modal")).toHaveCount(0);
  // focus returns to the reel card that opened it
  await expect(page.locator(".hm-reel-card")).toBeFocused();
});

test("video plan: compact three-phase assertion (no cards)", async ({ page }) => {
  await page.goto("/");
  await page.locator("#plan").scrollIntoViewIfNeeded();
  await expect(page.locator(".hm-plan-title")).toContainText("already built");
  const rows = page.locator(".hm-plan-row");
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0)).toContainText("We map the video plan before load-in.");
  await expect(rows.nth(1)).toContainText("A calm video department plugs in.");
  await expect(rows.nth(2)).toContainText("The final assets are already defined.");
});

test("services accordion: five items, first open, ideal-for row, toggling works", async ({ page }) => {
  await page.goto("/");
  await page.locator("#services").scrollIntoViewIfNeeded();
  await expect(page.locator(".hm-svc")).toHaveCount(5);
  await expect(page.locator(".hm-svc.hm-open")).toHaveCount(1);
  await expect(page.locator(".hm-svc-panel")).toBeVisible();
  // first row is Corporate & Brand Broadcasts (owner-directed order)
  await expect(page.locator(".hm-svc-ideal .hm-i-desc")).toContainText("Launches");

  // accordion a11y: expanded state, labels, wired panel, hidden marker
  const first = page.locator(".hm-svc-head").first();
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await expect(first).toHaveAttribute("aria-label", /^Collapse Corporate/);
  await expect(first).toHaveAttribute("aria-controls", "svc-panel-0");
  await expect(page.locator("#svc-panel-0")).toHaveAttribute("role", "region");
  await expect(page.locator(".hm-svc-marker").first()).toHaveAttribute("aria-hidden", "true");

  // open Technical Direction & Crew — the crew sheet lists eight roles
  await page.locator(".hm-svc-head").nth(4).click();
  await expect(page.locator(".hm-svc-role")).toHaveCount(8);
  await expect(first).toHaveAttribute("aria-expanded", "false");
  await expect(first).toHaveAttribute("aria-label", /^Expand Corporate/);

  // keyboard: Enter re-opens the first service
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(first).toHaveAttribute("aria-expanded", "true");

  // every row has a per-row CTA; the open panel shows exactly one.
  // Corporate (row 0, re-opened above) links to its vertical page.
  await expect(page.locator(".hm-svc-explore")).toHaveCount(1);
  await expect(page.locator(".hm-svc-explore")).toContainText("Explore Corporate & Brand Broadcasts");
  await expect(page.locator(".hm-svc-explore")).toHaveAttribute(
    "href",
    "/corporate-event-video-production-orange-county",
  );
  // an on-page-anchor CTA: Concert Films (row 2) → View Selected Work → #selected-work
  await page.locator(".hm-svc-head").nth(2).click();
  await expect(page.locator(".hm-svc-explore")).toContainText("View Selected Work");
  await expect(page.locator(".hm-svc-explore")).toHaveAttribute("href", "#selected-work");
});

test("selected-work concourse initializes with seven posters and live plate", async ({ page }) => {
  await page.goto("/");
  await page.locator("#selected-work").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-frbp-case]")).toHaveCount(7);
  // desktop: the inactive mobile rail is out of the accessibility tree,
  // and the title annotation no longer concatenates ("work.BUILT")
  await expect(page.locator(".hm-proj-mobile")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator(".hm-concourse")).not.toHaveAttribute("aria-hidden", "true");
  expect(await page.locator(".hm-proj-title").textContent()).toMatch(/work\.\s+BUILT/);
  await expect(page.locator('[data-frbp="counter"]')).toHaveText("01 / 07", { timeout: 10_000 });
  await expect(page.locator('[data-frbp="meta"]')).toHaveText("Concert film");
  // clicking the last contact-strip frame dollies the wall to CH 07
  await page.locator("[data-frbp-tick='6']").click();
  await expect(page.locator('[data-frbp="title"]')).toHaveText("Elton John", { timeout: 10_000 });
  await expect(page.locator('[data-frbp="counter"]')).toHaveText("07 / 07");

  // the context-plate CTA is a real link — hover raises the plate and
  // clicking navigates to #availability (regression: the stage's pointer capture
  // used to swallow the click). Re-click the tick first: the wall is
  // already centered on CH 07, so nothing moves, but it re-arms the 6s
  // idle-drift timer and gives the click a stable window.
  await page.locator("[data-frbp-tick='6']").click();
  await page.locator(".hm-poster-frame").nth(6).hover();
  await page.locator(".hm-case-cta").nth(6).click({ timeout: 5_000 });
  await expect(page).toHaveURL(/#availability$/);
});

test("availability request: required-field validation blocks empty submit", async ({ page }) => {
  await page.goto("/");
  await page.locator("#availability").scrollIntoViewIfNeeded();
  // "What happens next" numbers read as one token ("01", never "0 1")
  expect(await page.locator(".hm-next-idx").first().textContent()).toBe("01");
  await page.locator(".hm-btn-primary").click();
  await expect(page.locator(".hm-sheet-error")).toContainText(
    "Email and event date are required.",
  );
  await expect(page.locator("#ct-email")).toHaveAttribute("aria-invalid", "true");
  expect(hits.length).toBe(0);
});

test("availability request happy path: webhook receives payload, confirmation shows", async ({ page }) => {
  await page.goto("/");
  await page.locator("#availability").scrollIntoViewIfNeeded();
  await page.locator("#ct-name").fill("Jane Producer");
  await page.locator("#ct-email").fill("jane@ocevents.com");
  await page.locator("#ct-date").fill("10/03/2026");
  await page.locator("#ct-venue").fill("Honda Center, Anaheim");
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
  // each swipe card carries the metadata grid
  await expect(page.locator(".hm-swipe-specs")).toHaveCount(7);
  // mobile: the inactive desktop concourse is out of the accessibility
  // tree, and the open menu stacks above the sticky CTA
  await expect(page.locator(".hm-concourse")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator(".hm-proj-mobile")).not.toHaveAttribute("aria-hidden", "true");
  await page.locator(".hm-burger").tap();
  const zMenu = await page.locator(".hm-menu").evaluate((el) => parseInt(getComputedStyle(el).zIndex, 10));
  const zSticky = await page.locator(".hm-sticky").evaluate((el) => parseInt(getComputedStyle(el).zIndex, 10));
  expect(zMenu).toBeGreaterThan(zSticky);
  await ctx.close();
});

test("sticky CTA shows after the hero and hides at the contact section", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hm-sticky")).toHaveAttribute("data-state", "hidden");
  await page.locator("#services").scrollIntoViewIfNeeded();
  await expect(page.locator(".hm-sticky")).toHaveAttribute("data-state", "shown", { timeout: 5_000 });
  await page.locator("#availability").scrollIntoViewIfNeeded();
  await expect(page.locator(".hm-sticky")).toHaveAttribute("data-state", "hidden", { timeout: 5_000 });
});
