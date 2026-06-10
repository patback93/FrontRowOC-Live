import { test, expect, Page } from '@playwright/test';

// Front Row Broadcast — gala route acceptance suite (port of prototype QA, 19 checks)
// Run mobile-first: 390x844, touch. baseURL from playwright.config.
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

const goto = async (page: Page) => { await page.goto('/galas'); await page.waitForTimeout(1500); };
const litR = (page: Page) => page.evaluate(() => (document.querySelector('.key.lit-r') as HTMLElement)?.dataset.src);

test('no horizontal overflow', async ({ page }) => {
  await goto(page);
  const sw = await page.evaluate(() => document.scrollingElement!.scrollWidth);
  expect(sw).toBeLessThanOrEqual(391);
});

test('timecode ticks and clock populates', async ({ page }) => {
  await goto(page);
  const a = await page.locator('#tc').textContent();
  await page.waitForTimeout(700);
  expect(await page.locator('#tc').textContent()).not.toBe(a);
  expect((await page.locator('#clk').textContent())?.trim()).toBeTruthy();
});

test('credits ticker rolls with duplicated set', async ({ page }) => {
  await goto(page);
  const t1 = await page.evaluate(() => getComputedStyle(document.querySelector('.cred-track')!).transform);
  await page.waitForTimeout(800);
  const t2 = await page.evaluate(() => getComputedStyle(document.querySelector('.cred-track')!).transform);
  expect(t2).not.toBe(t1);
  expect(await page.locator('.cred-set').count()).toBe(2);
});

test('multiviewer tap-to-cut changes program', async ({ page }) => {
  await goto(page);
  await page.evaluate(() => document.querySelector('.mv')!.scrollIntoView({ block: 'center' }));
  const before = await litR(page);
  const target = before !== 'cam2' ? 'cam2' : 'cam1';
  await page.locator(`.mv [data-src=${target}]`).first().tap();
  await page.waitForTimeout(400);
  expect(await litR(page)).toBe(target);
});

test('desk: preview bus, CUT, AUTO', async ({ page }) => {
  await goto(page);
  await page.evaluate(() => document.querySelector('.desk')!.scrollIntoView({ block: 'center' }));
  await page.locator('.key[data-bus=pvw][data-src=pb]').tap();
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => (document.querySelector('.key.lit-w') as HTMLElement)?.dataset.src)).toBe('pb');
  await page.locator('.key', { hasText: 'CUT' }).first().tap();
  await page.waitForTimeout(350);
  expect(await litR(page)).toBe('pb');
  const pre = await litR(page);
  await page.locator('.key', { hasText: 'AUTO' }).first().tap();
  await page.waitForTimeout(900);
  expect(await litR(page)).not.toBe(pre);
});

test('T-bar full stroke transitions and springs back', async ({ page }) => {
  await goto(page);
  await page.evaluate(() => document.querySelector('.desk')!.scrollIntoView({ block: 'center' }));
  const pre = await litR(page);
  const tb = (await page.locator('.tbar-track').boundingBox())!;
  const sx = tb.x + tb.width / 2, sy = tb.y + 20;
  await page.mouse.move(sx, sy); await page.mouse.down();
  for (let i = 1; i <= 8; i++) { await page.mouse.move(sx, sy + i * (tb.height - 40) / 8); await page.waitForTimeout(30); }
  await page.mouse.up(); await page.waitForTimeout(700);
  expect(await litR(page)).not.toBe(pre);
});

test('FTB raises and restores the veil', async ({ page }) => {
  await goto(page);
  await page.evaluate(() => document.querySelector('.desk')!.scrollIntoView({ block: 'center' }));
  await page.locator('.key', { hasText: 'FTB' }).first().tap();
  await page.waitForTimeout(500);
  expect(parseFloat(await page.evaluate(() => getComputedStyle(document.getElementById('ftb-veil')!).opacity))).toBeGreaterThan(0.5);
  await page.locator('.key', { hasText: 'FTB' }).first().tap();
  await page.waitForTimeout(500);
  expect(parseFloat(await page.evaluate(() => getComputedStyle(document.getElementById('ftb-veil')!).opacity))).toBeLessThan(0.3);
});

test('sticky bar mounts after hero; CTA lands clear of it', async ({ page }) => {
  await goto(page);
  expect(await page.evaluate(() => document.querySelector('.sticky-bar')!.classList.contains('on'))).toBe(false);
  await page.evaluate(() => window.scrollTo(0, innerHeight * 1.6));
  await page.waitForTimeout(700);
  expect(await page.evaluate(() => document.querySelector('.sticky-bar')!.classList.contains('on'))).toBe(true);
  await page.locator('.sb-btn').tap();
  await page.waitForTimeout(1400);
  const top = await page.evaluate(() => document.getElementById('book')!.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(40); expect(top).toBeLessThanOrEqual(120);
});

test('FAQ opens; inputs are 16px; crew and Row B present', async ({ page }) => {
  await goto(page);
  await page.evaluate(() => document.querySelector('.faq')!.scrollIntoView({ block: 'center' }));
  await page.locator('.faq details summary').nth(2).tap();
  expect(await page.locator('.faq details[open]').count()).toBeGreaterThanOrEqual(1);
  await page.locator('.field input[type=email]').tap();
  expect(await page.evaluate(() => parseFloat(getComputedStyle(document.activeElement!).fontSize))).toBeGreaterThanOrEqual(16);
  expect(await page.locator('.crew-frame').count()).toBe(2);
  expect(await page.locator('.rate-row.rate-hot').count()).toBe(1);
});

test('chain replaces SVG at mobile width; no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await goto(page);
  expect(await page.locator('div.chain').isVisible()).toBe(true);
  expect(await page.locator('.flow-svg').isVisible()).toBe(false);
  expect(errors).toEqual([]);
});

test('font width axis loaded (display voice intact)', async ({ page }) => {
  await goto(page);
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('h1')!).fontStretch)).toBe('125%');
});
