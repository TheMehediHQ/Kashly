"use client";

import React from "react";

export function HowItWorksSection() {
  return (
    <section className="w-full py-16 md:py-24 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            How It Works
          </h2>
          <p className="text-slate-400 text-sm mt-2">Get started in 4 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="relative">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl hover:border-[#BDFE00]/40 transition-all duration-300 group h-full">
              <div className="w-12 h-12 rounded-xl bg-[#BDFE00]/10 flex items-center justify-center text-[#BDFE00] mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-[#BDFE00] font-mono text-xs mb-2">STEP 01</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Create Account</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sign up for free in seconds. No credit card required.
              </p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-[#BDFE00]/40 z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl hover:border-[#BDFE00]/40 transition-all duration-300 group h-full">
              <div className="w-12 h-12 rounded-xl bg-[#BDFE00]/10 flex items-center justify-center text-[#BDFE00] mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="text-[#BDFE00] font-mono text-xs mb-2">STEP 02</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Add Transactions</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Record your income and expenses with categories.
              </p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-[#BDFE00]/40 z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl hover:border-[#BDFE00]/40 transition-all duration-300 group h-full">
              <div className="w-12 h-12 rounded-xl bg-[#BDFE00]/10 flex items-center justify-center text-[#BDFE00] mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-[#BDFE00] font-mono text-xs mb-2">STEP 03</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Set Budgets</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Create spending limits for different categories.
              </p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-[#BDFE00]/40 z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl hover:border-[#1FBFD8]/40 transition-all duration-300 group h-full">
              <div className="w-12 h-12 rounded-xl bg-[#1FBFD8]/10 flex items-center justify-center text-[#1FBFD8] mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-[#1FBFD8] font-mono text-xs mb-2">STEP 04</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Track Progress</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Monitor your financial health with real-time insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
