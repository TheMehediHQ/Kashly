"use client";

import { useTheme } from "../context/ThemeContext";

export default function DashboardLoading() {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";

  return (
    <div className={`flex min-h-screen ${isDark ? "bg-neutral-950" : "bg-neutral-50"}`}>
      <aside className={`hidden md:flex w-64 border-r p-6 ${isDark ? "border-neutral-800/50 bg-black" : "border-neutral-200/50 bg-neutral-50"}`}>
        <div className="w-full space-y-4">
          <div className={`h-10 w-32 rounded-lg animate-pulse ${isDark ? "bg-neutral-800" : "bg-neutral-200"}`} />
          <div className={`h-9 w-full rounded-lg animate-pulse ${isDark ? "bg-neutral-900" : "bg-neutral-100"}`} />
          <div className={`h-9 w-full rounded-lg animate-pulse ${isDark ? "bg-neutral-900" : "bg-neutral-100"}`} />
          <div className={`h-9 w-full rounded-lg animate-pulse ${isDark ? "bg-neutral-900" : "bg-neutral-100"}`} />
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className={`h-10 w-56 rounded-lg animate-pulse ${isDark ? "bg-neutral-800" : "bg-neutral-200"}`} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`h-40 rounded-xl animate-pulse ${isDark ? "bg-neutral-900" : "bg-white border border-neutral-200"}`} />
            <div className={`h-40 rounded-xl animate-pulse ${isDark ? "bg-neutral-900" : "bg-white border border-neutral-200"}`} />
          </div>
          <div className={`h-72 rounded-xl animate-pulse ${isDark ? "bg-neutral-900" : "bg-white border border-neutral-200"}`} />
        </div>
      </main>
    </div>
  );
}
