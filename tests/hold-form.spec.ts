import { test, expect } from "@playwright/test";
import http from "http";

// Acceptance F — the date-hold form against a mocked webhook.
// The Next server must run with HOLD_WEBHOOK_URL=http://127.0.0.1:9911/hook
// (playwright.config.ts sets this for the managed webServer).

type Hit = { url: string; body: Record<string, unknown> };
let server: http.Server;
let hits: Hit[] = [];

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

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

test("happy path: submits, webhook receives enriched payload, confirmation shows", async ({ page }) => {
  await page.goto("/galas");
  await page.locator("#hold-name").fill("Jane Donor");
  await page.locator("#hold-org").fill("OC Charity");
  await page.locator("#hold-email").fill("jane@occharity.org");
  await page.locator("#hold-date").fill("11/14/2026");
  await page.locator(".form button[type=submit]").tap();

  await expect(page.locator(".form-ok")).toBeVisible({ timeout: 10_000 });
  await expect(page.locator(".form-ok")).toContainText("WE'VE GOT IT");
  await expect(page.locator(".form-ok .phone")).toHaveAttribute("href", "tel:+19492367573");

  expect(hits.length).toBe(1);
  const b = hits[0].body;
  expect(b.name).toBe("Jane Donor");
  expect(b.org).toBe("OC Charity");
  expect(b.email).toBe("jane@occharity.org");
  expect(b.date).toBe("11/14/2026");
  expect(b.page).toBe("galas");
  expect(typeof b.ts).toBe("string");
  expect(() => new Date(b.ts as string).toISOString()).not.toThrow();
  expect(String(b.ua)).not.toBe("");
  expect(b).not.toHaveProperty("company");
});

test("honeypot path: returns 200 (success UI) and forwards nothing", async ({ page }) => {
  await page.goto("/galas");
  await page.locator("#hold-name").fill("Bot Bot");
  await page.locator("#hold-date").fill("01/01/2027");
  await page.evaluate(() => {
    (document.querySelector('input[name="company"]') as HTMLInputElement).value = "SpamCo";
  });
  await page.locator(".form button[type=submit]").tap();

  await expect(page.locator(".form-ok")).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(800);
  expect(hits.length).toBe(0);
});

test("client validation: name+date required; email shape if present; form stays intact", async ({ page }) => {
  await page.goto("/galas");
  await page.locator(".form button[type=submit]").tap();
  await expect(page.locator(".form-err")).toBeVisible();
  await expect(page.locator(".form-err a")).toHaveAttribute("href", "tel:+19492367573");
  await expect(page.locator(".form")).toBeVisible();

  await page.locator("#hold-name").fill("Jane");
  await page.locator("#hold-date").fill("11/14/2026");
  await page.locator("#hold-email").fill("not-an-email");
  await page.locator(".form button[type=submit]").tap();
  await expect(page.locator(".form-err")).toBeVisible();
  expect(hits.length).toBe(0);
});

test("API hardening: oversized body 413, missing fields 400, bad email 400, honeypot 200", async ({ request }) => {
  const big = await request.post("/api/hold", {
    headers: { "content-type": "application/json" },
    data: JSON.stringify({ name: "x".repeat(3000), date: "1/1/2027" }),
  });
  expect(big.status()).toBe(413);

  const missing = await request.post("/api/hold", {
    headers: { "content-type": "application/json" },
    data: JSON.stringify({ org: "No Name Or Date" }),
  });
  expect(missing.status()).toBe(400);

  const badEmail = await request.post("/api/hold", {
    headers: { "content-type": "application/json" },
    data: JSON.stringify({ name: "Jane", date: "1/1/2027", email: "nope" }),
  });
  expect(badEmail.status()).toBe(400);

  const hp = await request.post("/api/hold", {
    headers: { "content-type": "application/json" },
    data: JSON.stringify({ name: "Bot", date: "1/1/2027", company: "SpamCo" }),
  });
  expect(hp.status()).toBe(200);
  await new Promise((r) => setTimeout(r, 500));
  expect(hits.length).toBe(0);
});
