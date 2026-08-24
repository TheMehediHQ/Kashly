"use client";

import React from "react";

export function AppPreviewSection() {
  return (
    <section className="w-full py-16 md:py-24 px-4 border-t border-white/5 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            See It In Action
          </h2>
          <p className="text-slate-400 text-sm mt-2">Intuitive dashboard designed for clarity</p>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative rounded-2xl bg-[#0B0F17] border border-white/10 backdrop-blur-xl p-3 sm:p-6 shadow-2xl overflow-hidden">
          {/* Browser Bar */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400 font-mono">
                kashly.app/dashboard
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00] mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
                  DASHBOARD OVERVIEW
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                  Welcome back, <span className="text-[#BDFE00]">Mehedi</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Here's your financial summary for August 2026.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#BDFE00] text-black text-xs font-bold uppercase tracking-wider">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                New Transaction
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Balance */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#BDFE00]/10 via-slate-900/60 to-slate-900/40 border border-[#BDFE00]/20 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Total Balance</span>
                  <div className="w-8 h-8 rounded-lg bg-[#BDFE00]/10 flex items-center justify-center text-[#BDFE00]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">BDT 45,231</p>
                <p className="text-[10px] font-mono text-slate-500 mt-1">All time net balance</p>
              </div>

              {/* Income */}
              <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Monthly Income</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">BDT 12,500</p>
                <p className="text-[10px] font-mono text-slate-500 mt-1">8 transactions</p>
              </div>

              {/* Expense */}
              <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Monthly Expense</span>
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">BDT 8,340</p>
                <p className="text-[10px] font-mono text-slate-500 mt-1">12 transactions</p>
              </div>

              {/* Credits */}
              <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Credits Left</span>
                  <div className="w-8 h-8 rounded-lg bg-[#1FBFD8]/10 flex items-center justify-center text-[#1FBFD8]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-[#1FBFD8] tracking-tight">150</p>
                <p className="text-[10px] font-mono text-slate-500 mt-1">Per txn: 1 credit</p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Transactions */}
              <div className="lg:col-span-2 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#BDFE00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Recent Transactions</h2>
                  </div>
                  <span className="text-xs text-[#BDFE00] font-mono">View all →</span>
                </div>
                <div className="divide-y divide-white/5">
                  <div className="flex items-center gap-4 p-4">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">Salary</p>
                      <p className="text-xs text-slate-500 font-mono">Aug 25, 2026</p>
                    </div>
                    <p className="text-sm font-bold font-mono text-emerald-400">+BDT 10,000</p>
                  </div>
                  <div className="flex items-center gap-4 p-4">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-rose-500/10 text-rose-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">Groceries</p>
                      <p className="text-xs text-slate-500 font-mono">Aug 24, 2026</p>
                    </div>
                    <p className="text-sm font-bold font-mono text-rose-400">-BDT 1,250</p>
                  </div>
                  <div className="flex items-center gap-4 p-4">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-rose-500/10 text-rose-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">Transport</p>
                      <p className="text-xs text-slate-500 font-mono">Aug 23, 2026</p>
                    </div>
                    <p className="text-sm font-bold font-mono text-rose-400">-BDT 450</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#BDFE00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-300">Add Income</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-300">Add Expense</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-[#1FBFD8]/10 flex items-center justify-center text-[#1FBFD8]">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-300">Set Budget</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#BDFE00]/5 via-transparent to-transparent pointer-events-none rounded-2xl" />
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="text-[#BDFE00] font-mono text-xs mb-2">REAL-TIME</div>
            <h3 className="text-sm font-semibold text-white mb-1">Live Updates</h3>
            <p className="text-xs text-slate-400">See your financial data update instantly</p>
          </div>
          <div className="text-center">
            <div className="text-[#BDFE00] font-mono text-xs mb-2">INTUITIVE</div>
            <h3 className="text-sm font-semibold text-white mb-1">Easy Navigation</h3>
            <p className="text-xs text-slate-400">Clean interface designed for clarity</p>
          </div>
          <div className="text-center">
            <div className="text-[#1FBFD8] font-mono text-xs mb-2">RESPONSIVE</div>
            <h3 className="text-sm font-semibold text-white mb-1">Any Device</h3>
            <p className="text-xs text-slate-400">Works seamlessly on all screen sizes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
