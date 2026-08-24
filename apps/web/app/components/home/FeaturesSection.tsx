"use client";

import React from "react";

export function FeaturesSection() {
  return (
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
  );
}
