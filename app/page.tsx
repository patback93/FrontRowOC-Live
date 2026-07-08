import type { Metadata } from "next";
import "./home.css";
import HomeNav from "@/components/home/HomeNav";
import HomeHero from "@/components/home/HomeHero";
import CreditBanner from "@/components/home/CreditBanner";
import WhoWeAre from "@/components/home/WhoWeAre";
import WhatWeDo from "@/components/home/WhatWeDo";
import Projects from "@/components/home/Projects";
import BookingSheet from "@/components/home/BookingSheet";
import HomeFooter from "@/components/home/HomeFooter";

export const metadata: Metadata = {
  title: "Front Row Broadcast — Cinematic Multicam Video Production | Orange County",
  description:
    "We're a premium cinematic multicam video production company — concert films, livestreams, festival IMAG, corporate and gala broadcast, engineered to hold up when there's no second take.",
  alternates: { canonical: "https://frontrowoc.com" },
  openGraph: {
    title: "Front Row Broadcast — Cinematic Multicam Video Production",
    description:
      "The look of a feature film, the reliability of live broadcast — cinema cameras on every angle, cut live.",
    url: "https://frontrowoc.com",
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
      "The look of a feature film, the reliability of live broadcast — cinema cameras on every angle, cut live.",
    images: ["/home/og.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Front Row Broadcast",
  url: "https://frontrowoc.com",
  telephone: "+1-949-236-7573",
  email: "hello@frontrowoc.com",
  image: "https://frontrowoc.com/home/og.jpg",
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
        <CreditBanner />
        <WhoWeAre />
        <WhatWeDo />
        <Projects />
        <BookingSheet />
      </main>

      <HomeFooter />
    </div>
  );
}
