import type { Metadata } from "next";

// ============================================================
// Site-wide SEO config — single source of truth.
// Adding a future vertical page = add one PAGES entry (title,
// description, primary phrase, OG image), then call
// pageMetadata("<key>") from the route and drop
// <ServiceJsonLd page="<key>" /> into it. sitemap.ts and the
// footer nav read from this config automatically.
// ============================================================

export const SITE = {
  origin: "https://www.frontrowoc.com",
  name: "Front Row Broadcast",
  parentOrg: "MixOne Cinema",
  // real business data only — no street address, hours, or reviews
  telephone: "+1-949-236-7573",
  email: "hello@frontrowoc.com",
  areaServed: ["Orange County, CA", "Southern California"],
} as const;

export type PageKey = "home" | "corporate" | "gala" | "galas";

export type PageSeo = {
  path: string;
  /** shown in <title> */
  title: string;
  /** 140–160 chars, contains the primary phrase naturally */
  description: string;
  /** the page's primary search phrase (documentation + audits) */
  primary: string;
  /** 1200×630 */
  ogImage: string;
  ogAlt: string;
  /** label for site-wide footer navs (keyword-bearing, compact) */
  navLabel: string;
  /** listed in the site-wide footer nav */
  inFooterNav: boolean;
  /** Service JSON-LD serviceType (vertical pages only) */
  serviceType?: string;
  /** real page-backed price band → AggregateOffer on the Service */
  offers?: { low: number; high: number };
  lastModified: string; // ISO date of last substantive content change
};

export const PAGES: Record<PageKey, PageSeo> = {
  home: {
    path: "/",
    title: "Front Row Broadcast — Cinematic Live Event Video Production | Orange County",
    description:
      "Live event video production in Orange County — cinematic multicam coverage, livestreams, and broadcast-grade records for concerts, galas, and brand events.",
    primary: "live event video production Orange County",
    ogImage: "/og/home.png",
    ogAlt: "Front Row Broadcast — live event films with broadcast backbone",
    navLabel: "Live event video production",
    inFooterNav: true,
    lastModified: "2026-07-11",
  },
  corporate: {
    path: "/corporate-event-video-production-orange-county",
    title: "Corporate Event Video Production Orange County | Front Row Broadcast",
    description:
      "Corporate event video production in Orange County — multicam coverage, livestream support, program records, and post-event content for conferences and launches.",
    primary: "corporate event video production Orange County",
    ogImage: "/og/corporate.png",
    ogAlt: "Front Row Broadcast — corporate event video production",
    navLabel: "Corporate event video production",
    inFooterNav: true,
    serviceType: "Corporate event video production",
    lastModified: "2026-07-11",
  },
  gala: {
    path: "/gala-fundraiser-video-production",
    title: "Gala & Fundraiser Video Production Orange County | Front Row Broadcast",
    description:
      "Gala and fundraiser video production in Orange County — multicam coverage, livestream support, program records, and donor-facing recaps for benefit nights.",
    primary: "gala and fundraiser video production Orange County",
    ogImage: "/og/gala.png",
    ogAlt: "Front Row Broadcast — gala and fundraiser video production",
    navLabel: "Gala & fundraiser video production",
    inFooterNav: true,
    serviceType: "Gala and fundraiser video production",
    lastModified: "2026-07-11",
  },
  // standalone gala-event campaign page — intentionally outside the main
  // nav; kept in the sitemap because it is live and indexable. Title and
  // description are the page's original campaign copy (unchanged).
  galas: {
    path: "/galas",
    title:
      "Cinematic Broadcast for Galas & Fundraisers | Front Row Broadcast — Orange County",
    description:
      "Cinematic broadcast for Orange County galas and fundraisers — live cameras to your ballroom screens during the ask, and a 90-second recap film after.",
    primary: "gala broadcast Orange County",
    ogImage: "/galas/og.png",
    ogAlt: "Front Row Broadcast — cinematic broadcast for galas & fundraisers",
    navLabel: "Gala event production",
    inFooterNav: false,
    serviceType: "Gala event broadcast and video production",
    // real, page-backed pricing bands from the /galas pricing section
    offers: { low: 4500, high: 9500 },
    lastModified: "2026-06-11",
  },
};

export function pageUrl(key: PageKey): string {
  const p = PAGES[key].path;
  return p === "/" ? SITE.origin : `${SITE.origin}${p}`;
}

/** Shared Metadata builder — canonical, OG, and Twitter from config. */
export function pageMetadata(key: PageKey): Metadata {
  const p = PAGES[key];
  const url = pageUrl(key);
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: url },
    openGraph: {
      title: p.title,
      description: p.description,
      url,
      siteName: SITE.name,
      locale: "en_US",
      type: "website",
      images: [{ url: p.ogImage, width: 1200, height: 630, alt: p.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: p.description,
      images: [p.ogImage],
    },
  };
}

// ============================================================
// JSON-LD (server-rendered)
// ============================================================

const BUSINESS_ID = `${SITE.origin}/#business`;

/** Site-wide LocalBusiness — rendered once from app/layout.tsx. */
export function OrgJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: SITE.name,
    url: SITE.origin,
    image: `${SITE.origin}${PAGES.home.ogImage}`,
    telephone: SITE.telephone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Orange County",
      addressRegion: "CA",
      addressCountry: "US",
    },
    areaServed: SITE.areaServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    parentOrganization: { "@type": "Organization", name: SITE.parentOrg },
    // sameAs intentionally omitted until the footer's social links are
    // real profiles (they are "#" placeholders today)
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Per-vertical Service schema, provider → the site-wide LocalBusiness. */
export function ServiceJsonLd({ page }: { page: PageKey }) {
  const p = PAGES[page];
  if (!p.serviceType) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: p.serviceType,
    serviceType: p.serviceType,
    url: pageUrl(page),
    description: p.description,
    provider: { "@id": BUSINESS_ID },
    areaServed: SITE.areaServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    ...(p.offers && {
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: p.offers.low,
        highPrice: p.offers.high,
      },
    }),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Pages listed in every footer nav, in order. */
export function footerNavPages(): Array<{ href: string; label: string }> {
  return (Object.keys(PAGES) as PageKey[])
    .filter((k) => PAGES[k].inFooterNav)
    .map((k) => ({ href: PAGES[k].path, label: PAGES[k].navLabel }));
}
