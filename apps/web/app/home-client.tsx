"use client";

import React from "react";
import { LuGithub } from "react-icons/lu";

export function HomePageClient() {
  return (
    <main className="flex-1 w-full bg-[#0B0F17] text-white min-h-screen relative overflow-hidden font-sans selection:bg-[#BDFE00] selection:text-black">
      {/* Background Radial Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#BDFE00]/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[400px] bg-[#1FBFD8]/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Hero Section */}
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
    href="https://github.com/TheMehediHQ/Kashly" // আপনার গিটহাব লিংক দিন
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

      {/* Features Showcase Section */}
      <section className="w-full py-16 md:py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Powerful Core Features
            </h2>
            <p className="text-slate-400 text-sm mt-2">Everything you need to control your cash flow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Core Financial Tracking */}
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl hover:border-[#BDFE00]/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-[#BDFE00]/10 flex items-center justify-center text-[#BDFE00] mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Core Financial Tracking</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BDFE00]" />
                  Track income and expenses with pinpoint accuracy
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BDFE00]" />
                  Review categorized transaction history seamlessly
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BDFE00]" />
                  Measure monthly and yearly performance metrics
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BDFE00]" />
                  Maintain a unified, clear financial overview
                </li>
              </ul>
            </div>

            {/* Security */}
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl hover:border-[#1FBFD8]/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-[#1FBFD8]/10 flex items-center justify-center text-[#1FBFD8] mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Secure and Dependable</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1FBFD8]" />
                  Protected authentication & session handling
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1FBFD8]" />
                  Security-first backend architecture
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1FBFD8]" />
                  Straightforward interface designed for daily use
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1FBFD8]" />
                  Built for consistent long-term tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section Grid */}
      <section className="w-full py-16 md:py-24 px-4 border-t border-white/5 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-white">
            Why Choose MoneyFlow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all">
              <div className="text-[#BDFE00] font-mono text-xs mb-2">01 // VISIBILITY</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Simple Tracking</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Record daily transactions quickly and keep every financial movement visible.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all">
              <div className="text-[#BDFE00] font-mono text-xs mb-2">02 // CONTROL</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Budget Discipline</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Define spending limits and stay aligned with your monthly financial targets.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all">
              <div className="text-[#1FBFD8] font-mono text-xs mb-2">03 // PRIVACY</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Trusted Platform</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your financial data remains private, protected, and managed with extreme care.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}