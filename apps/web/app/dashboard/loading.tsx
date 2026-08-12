"use client";

import React from "react";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-[#0B0F17] text-white">
      {/* Sidebar Placeholder */}
      <aside className="hidden md:flex w-64 border-r border-white/10 p-6 bg-[#0B0F17] shrink-0">
        <div className="w-full space-y-6">
          {/* Logo Skeleton */}
          <div className="h-10 w-32 rounded-xl bg-white/10 animate-pulse" />
          
          {/* Nav Item Skeletons */}
          <div className="space-y-3 pt-4">
            <div className="h-10 w-full rounded-xl bg-white/5 border border-white/5 animate-pulse" />
            <div className="h-10 w-full rounded-xl bg-white/5 border border-white/5 animate-pulse" />
            <div className="h-10 w-full rounded-xl bg-white/5 border border-white/5 animate-pulse" />
            <div className="h-10 w-full rounded-xl bg-white/5 border border-white/5 animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Main Content Area Placeholder */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Header Skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-32 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 animate-pulse" />
            <div className="h-10 w-56 rounded-xl bg-white/10 animate-pulse" />
          </div>

          {/* Cards Skeleton Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-44 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            <div className="h-44 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
          </div>

          {/* Chart / Section Skeleton */}
          <div className="h-72 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
        </div>
      </main>
    </div>
  );
}