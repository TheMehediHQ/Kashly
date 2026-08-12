"use client";

import React, { useEffect } from "react";
// Fixed lowercase import path

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "./components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Loading Skeleton State
  if (loading || !user) {
    return (
      <div className="flex min-h-screen bg-[#0B0F17]">
        {/* Placeholder for Sidebar on Desktop */}
        <div className="hidden md:block w-64 border-r border-white/10 bg-[#0B0F17]" />
        
        {/* Skeleton Content */}
        <div className="flex flex-1 items-center justify-center p-6 md:ml-64">
          <div className="w-full max-w-4xl space-y-6">
            <div className="h-10 w-48 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
            <div className="h-44 w-full rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            <div className="h-64 w-full rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F17] text-white selection:bg-[#BDFE00] selection:text-black">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area offset by Sidebar width */}
      <div className="flex flex-1 flex-col md:ml-64 min-w-0 transition-all duration-300">
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}