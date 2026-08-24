"use client";

import React from "react";

export default function DashboardLoading() {
  return (
    <div className="w-full min-h-screen p-3 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-3">
          <div className="h-6 w-36 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 animate-pulse" />
          <div className="h-10 w-64 rounded-xl bg-white/10 animate-pulse" />
          <div className="h-4 w-48 rounded bg-white/5 animate-pulse" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-[#BDFE00]/20 animate-pulse" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#BDFE00]/10 via-slate-900/60 to-slate-900/40 border border-[#BDFE00]/20 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
            <div className="w-8 h-8 rounded-lg bg-[#BDFE00]/10 animate-pulse" />
          </div>
          <div className="h-8 w-32 rounded bg-white/10 animate-pulse" />
          <div className="h-2 w-24 rounded bg-white/5 animate-pulse mt-2" />
        </div>

        {/* Income Card */}
        <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 animate-pulse" />
          </div>
          <div className="h-8 w-28 rounded bg-white/10 animate-pulse" />
          <div className="h-2 w-20 rounded bg-white/5 animate-pulse mt-2" />
        </div>

        {/* Expense Card */}
        <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 animate-pulse" />
          </div>
          <div className="h-8 w-28 rounded bg-white/10 animate-pulse" />
          <div className="h-2 w-20 rounded bg-white/5 animate-pulse mt-2" />
        </div>

        {/* Credits Card */}
        <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
            <div className="w-8 h-8 rounded-lg bg-[#1FBFD8]/10 animate-pulse" />
          </div>
          <div className="h-8 w-16 rounded bg-white/10 animate-pulse" />
          <div className="h-2 w-28 rounded bg-white/5 animate-pulse mt-2" />
        </div>
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Skeleton */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#BDFE00]/20 animate-pulse" />
              <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
            </div>
            <div className="h-3 w-16 rounded bg-white/5 animate-pulse" />
          </div>

          <div className="divide-y divide-white/5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-white/5 animate-pulse" />
                  <div className="h-2 w-16 rounded bg-white/5 animate-pulse" />
                </div>
                <div className="h-4 w-20 rounded bg-white/5 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Quick Actions Skeleton */}
          <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3.5 h-3.5 rounded bg-[#BDFE00]/20 animate-pulse" />
              <div className="h-4 w-28 rounded bg-white/10 animate-pulse" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-white/10 animate-pulse" />
                  <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Account Info Skeleton */}
          <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3.5 h-3.5 rounded bg-[#BDFE00]/20 animate-pulse" />
              <div className="h-4 w-20 rounded bg-white/10 animate-pulse" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-3 w-10 rounded bg-white/10 animate-pulse" />
                  <div className={`h-${i === 1 ? '3' : '5'} w-${i === 1 ? '28' : '14'} rounded${i === 1 ? '' : '-md'} bg-white/10 animate-pulse`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
