"use client";

import React from "react";

export function WhyChooseSection() {
  return (
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
  );
}
