import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import "./home.css";
import HomeNav from "@/components/home/HomeNav";
import HomeHero from "@/components/home/HomeHero";
import CreditBanner from "@/components/home/CreditBanner";
import Projects from "@/components/home/Projects";
import WhatWeDo from "@/components/home/WhatWeDo";
import HomePlan from "@/components/home/HomePlan";
import BookingSheet from "@/components/home/BookingSheet";
import HomeFooter from "@/components/home/HomeFooter";
import StickyCta from "@/components/home/StickyCta";

export const metadata: Metadata = pageMetadata("home");

export default function Home() {
  return (
    <div className="hm">
      <HomeNav />

      <main>
        <HomeHero />
        <CreditBanner />
        <Projects />
        <WhatWeDo />
        <HomePlan />
        <BookingSheet />
      </main>

      <StickyCta />
      <HomeFooter />
    </div>
  );
}
