"use client";

import React, { useEffect } from "react";
import Sidebar from "./components/sidebar";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { effectiveTheme } = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();
  const isDark = effectiveTheme === "dark";

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className={`flex min-h-screen ${isDark ? "bg-neutral-950" : "bg-neutral-50"}`}>
        <div className="hidden md:block w-64 border-r border-neutral-800/30" />
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-4xl space-y-4">
            <div className={`h-10 w-48 rounded-lg animate-pulse ${isDark ? "bg-neutral-800" : "bg-neutral-200"}`} />
            <div className={`h-40 w-full rounded-xl animate-pulse ${isDark ? "bg-neutral-900" : "bg-white border border-neutral-200"}`} />
            <div className={`h-64 w-full rounded-xl animate-pulse ${isDark ? "bg-neutral-900" : "bg-white border border-neutral-200"}`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${isDark ? "bg-neutral-950" : "bg-neutral-50"}`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:ml-64 min-w-0">
        <main className="min-h-screen">
          <div >{children}</div>
        </main>
      </div>
    </div>
  );
}
