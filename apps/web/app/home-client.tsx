"use client";

import React from "react";
import { HeroSection } from "./components/home/HeroSection";
import { FeaturesSection } from "./components/home/FeaturesSection";
import { HowItWorksSection } from "./components/home/HowItWorksSection";
import { AppPreviewSection } from "./components/home/AppPreviewSection";
import { WhyChooseSection } from "./components/home/WhyChooseSection";
import { FAQSection } from "./components/home/FAQSection";

export function HomePageClient() {
  return (
    <main className="flex-1 w-full bg-[#0B0F17] text-white min-h-screen relative overflow-hidden font-sans selection:bg-[#BDFE00] selection:text-black">
      {/* Background Radial Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#BDFE00]/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[400px] bg-[#1FBFD8]/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Sections */}
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AppPreviewSection />
      <WhyChooseSection />
      <FAQSection />
    </main>
  );
}
