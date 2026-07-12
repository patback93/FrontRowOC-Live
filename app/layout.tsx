import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { OrgJsonLd } from "@/lib/seo";
import GoogleAnalytics from "@/components/GoogleAnalytics";

// Display depends on Archivo's variable width axis (font-stretch:125%) —
// the wdth axis is load-bearing; without it the display voice collapses.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.frontrowoc.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <OrgJsonLd />
        {children}
        {/* Analytics only where the third-party scripts actually exist /
            resolve, so local/prod-test runs stay free of console errors. */}
        {process.env.VERCEL ? <Analytics /> : null}
        {process.env.VERCEL ? <GoogleAnalytics /> : null}
      </body>
    </html>
  );
}
