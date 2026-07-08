import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

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
  metadataBase: new URL("https://frontrowoc.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        {children}
        {/* Analytics only where the Vercel insights script actually exists,
            so local/prod-test runs stay free of 404 console errors. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
