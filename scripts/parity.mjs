// Visual parity: render the prototype (file://) and the built route at equal
// widths, freeze every nondeterministic surface the same way on both, then
// pixel-diff. Two passes:
//   anim-off — animations/transitions nulled, timers cleared, clocks pinned:
//              validates layout, type, color, spacing.
//   rm       — prefers-reduced-motion: validates the RM map (static centered
//              ticker, pre-solid wires, no blink) renders identically.
import { chromium } from "@playwright/test";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import fs from "node:fs";
import path from "node:path";

const APP = process.env.APP_URL || "http://localhost:3000/galas";
const PROTO = "file://" + path.resolve("prototype/frontrow-v3.html");
const OUT = "artifacts/parity";
const WIDTHS = [390, 744, 1280];
fs.mkdirSync(OUT, { recursive: true });

// Google serves *different binary builds* of the same fonts to the css2 API
// (prototype <link>) vs next/font (self-hosted) — different hinting, which
// headless-Linux FreeType quantizes differently at small sizes (e.g. Plex
// Mono 10.5px: 7.0px vs 6.0px per glyph). macOS/iOS ignore hinting, so real
// devices render both identically. To diff layout rather than rasterizer
// builds, the prototype gets the app's own font binaries, inlined as data
// URIs into its css2 response.
function buildFontCss() {
  const cssDir = ".next/static/chunks";
  let faces = "";
  for (const f of fs.readdirSync(cssDir)) {
    if (!f.endsWith(".css")) continue;
    const css = fs.readFileSync(path.join(cssDir, f), "utf8");
    for (const m of css.matchAll(/@font-face\s*\{[^}]*\}/g)) {
      if (m[0].includes("../media/")) faces += m[0] + "\n";
    }
  }
  faces = faces.replace(/url\(\.\.\/media\/([^)]+\.woff2)\)/g, (_, file) => {
    const b = fs.readFileSync(path.join(".next/static/media", file));
    return `url(data:font/woff2;base64,${b.toString("base64")})`;
  });
  if (!faces.includes("data:font/woff2")) {
    throw new Error("font extraction produced no usable @font-face rules");
  }
  return faces;
}
const FONT_CSS = buildFontCss();

async function capture(browser, url, width, mode) {
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: mode === "rm" ? "reduce" : "no-preference",
    deviceScaleFactor: 1,
    // sandbox proxy re-signs TLS; without this the prototype's Google Fonts
    // <link> dies with ERR_CERT_AUTHORITY_INVALID
    ignoreHTTPSErrors: true,
  });
  const page = await ctx.newPage();
  if (url.startsWith("file://")) {
    await page.route("**/fonts.googleapis.com/**", (route) =>
      route.fulfill({ contentType: "text/css", body: FONT_CSS }),
    );
    await page.route("**/fonts.gstatic.com/**", (route) => route.abort());
  }
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  const rmApplied = await page.evaluate(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  if (mode === "rm" && !rmApplied) throw new Error("RM emulation not applied");
  await page.evaluate(async () => {
    document
      .querySelectorAll("img")
      .forEach((i) => i.setAttribute("loading", "eager"));
    await Promise.allSettled(
      Array.from(document.images, (i) => i.decode().catch(() => {})),
    );
    await document.fonts.ready;
  });
  if (mode === "anim-off") {
    await page.addStyleTag({
      content:
        "*,*::before,*::after{animation:none !important;transition:none !important;}",
    });
  }
  // Pin the clocks: kill every pending timer (same nuke on both pages), then
  // write fixed strings.
  await page.evaluate(() => {
    let id = window.setTimeout(() => {}, 0);
    while (id--) {
      window.clearTimeout(id);
      window.clearInterval(id);
    }
    const clk = document.getElementById("clk");
    if (clk) clk.textContent = "19:38:00";
    const tc = document.getElementById("tc");
    if (tc) tc.textContent = "19:38:00:00";
  });
  await page.waitForTimeout(300);
  const buf = await page.screenshot({ fullPage: true });
  await ctx.close();
  return PNG.sync.read(buf);
}

function pad(png, w, h) {
  if (png.width === w && png.height === h) return png;
  const out = new PNG({ width: w, height: h });
  PNG.bitblt(png, out, 0, 0, png.width, png.height, 0, 0);
  return out;
}

const browser = await chromium.launch();
let worst = 0;
for (const mode of ["anim-off", "rm"]) {
  for (const width of WIDTHS) {
    const a = await capture(browser, PROTO, width, mode);
    const b = await capture(browser, APP, width, mode);
    const w = Math.max(a.width, b.width);
    const h = Math.max(a.height, b.height);
    const pa = pad(a, w, h);
    const pb = pad(b, w, h);
    const diff = new PNG({ width: w, height: h });
    const n = pixelmatch(pa.data, pb.data, diff.data, w, h, {
      threshold: 0.12,
      includeAA: false,
    });
    const ratio = n / (w * h);
    worst = Math.max(worst, ratio);
    const tag = `${mode}-${width}`;
    fs.writeFileSync(`${OUT}/proto-${tag}.png`, PNG.sync.write(pa));
    fs.writeFileSync(`${OUT}/app-${tag}.png`, PNG.sync.write(pb));
    fs.writeFileSync(`${OUT}/diff-${tag}.png`, PNG.sync.write(diff));
    console.log(
      `${tag}: proto ${a.width}x${a.height} app ${b.width}x${b.height} ` +
        `diff ${n}px (${(ratio * 100).toFixed(3)}%)`,
    );
  }
}
await browser.close();
console.log(`worst diff ratio: ${(worst * 100).toFixed(3)}%`);
