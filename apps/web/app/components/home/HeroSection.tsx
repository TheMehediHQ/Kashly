"use client";

import React from "react";
import { LuGithub } from "react-icons/lu";

export function HeroSection() {
  return (
    <section className="w-full pt-20 pb-16 md:pt-32 md:pb-24 px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Badge Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-wide text-[#BDFE00]">
          <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
          KASHLY FINANCIAL PLATFORM
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
          Manage Your Money <br className="hidden md:block" />
          <span className="text-[#BDFE00]">Proactively & Effortlessly</span>
        </h1>

        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Simple, secure, and effective financial tracking—monitor real-time expenses, set smart budgets, and achieve financial clarity.
        </p>

        {/* CTA Group */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Primary CTA */}
          <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#BDFE00] text-black font-semibold hover:bg-[#aef000] hover:shadow-[0_0_25px_rgba(189,254,0,0.4)] transition-all duration-300 transform active:scale-95">
            Get Started For Free
          </button>

          {/* GitHub Secondary CTA */}
          <a
            href="https://github.com/TheMehediHQ/Kashly"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 hover:border-white/20 font-medium backdrop-blur-md transition-all duration-300 transform active:scale-95"
          >
            <LuGithub size={19} />
            <span>Star on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}
