import { track as vaTrack } from "@vercel/analytics";

// Analytics must never break the page (or surface console errors when the
// Vercel script isn't present, e.g. local runs and tests).
export function track(
  name: string,
  data?: Record<string, string | number | boolean | null>,
) {
  try {
    vaTrack(name, data);
  } catch {
    /* no-op */
  }
}
