import type { Metadata } from "next";
import "./home.css";
import HomeNav from "@/components/home/HomeNav";
import HomeHero from "@/components/home/HomeHero";
import HomePaths from "@/components/home/HomePaths";
import CreditBanner from "@/components/home/CreditBanner";
import WhoWeAre from "@/components/home/WhoWeAre";
import HomeSystem from "@/components/home/HomeSystem";
import WhatWeDo from "@/components/home/WhatWeDo";
import Projects from "@/components/home/Projects";
import BookingSheet from "@/components/home/BookingSheet";
import HomeFooter from "@/components/home/HomeFooter";
import StickyCta from "@/components/home/StickyCta";

export const metadata: Metadata = {
  title: "Front Row Broadcast — Cinematic Multicam Video Production | Orange County",
  description:
    "Live event films with broadcast backbone — cinematic multicam production for concerts, galas, brand events, and livestreams, engineered for the room, the stream, and the final cut.",
  alternates: { canonical: "https://www.frontrowoc.com" },
  openGraph: {
    title: "Front Row Broadcast — Cinematic Multicam Video Production",
    description:
      "Live event films with broadcast backbone — cinematic multicam production for concerts, galas, brand events, and livestreams.",
    url: "https://www.frontrowoc.com",
    siteName: "Front Row Broadcast",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/home/og.jpg",
        width: 1200,
        height: 630,
        alt: "Front Row Broadcast — cinematic multicam video production",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Front Row Broadcast — Cinematic Multicam Video Production",
    description:
      "Live event films with broadcast backbone — cinematic multicam production for concerts, galas, brand events, and livestreams.",
    images: ["/home/og.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Front Row Broadcast",
  url: "https://www.frontrowoc.com",
  telephone: "+1-949-236-7573",
  email: "hello@frontrowoc.com",
  image: "https://www.frontrowoc.com/home/og.jpg",
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Orange County, CA",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "MixOne Cinema",
  },
};

export default function Home() {
  return (
    <div className="hm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeNav />

      <main>
        <HomeHero />
        <HomePaths />
        <CreditBanner />
        <WhoWeAre />
        <HomeSystem />
        <WhatWeDo />
        <Projects />
        <BookingSheet />
      </main>

      <StickyCta />
      <HomeFooter />
    </div>
  );
}
