import type { MetadataRoute } from "next";
import { PAGES, SITE, type PageKey } from "@/lib/seo";

// All live routes, driven by the SEO config — a new vertical page
// appears here automatically once it has a PAGES entry.
export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(PAGES) as PageKey[]).map((key) => {
    const p = PAGES[key];
    return {
      url: p.path === "/" ? SITE.origin : `${SITE.origin}${p.path}`,
      lastModified: new Date(p.lastModified),
      changeFrequency: "monthly",
      priority: p.path === "/" ? 1 : 0.8,
    };
  });
}
