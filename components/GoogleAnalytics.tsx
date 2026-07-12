import Script from "next/script";

// GA4 (gtag.js), site-wide. Rendered only on Vercel builds — same rationale
// as the <Analytics /> gate in app/layout.tsx: local prod runs and the
// Playwright suite must stay free of third-party network errors.
const GA_ID = "G-2ZRFVPD2SC";

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
