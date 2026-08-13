"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import BottomNav from "./components/bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0B0F17]">
        <div className="hidden md:block w-64 border-r border-white/10 bg-[#0B0F17]" />
        <div className="flex flex-1 flex-col md:ml-64">
          <div className="h-16 border-b border-white/10 bg-[#0B0F17]" />
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="w-full max-w-4xl space-y-6">
              <div className="h-10 w-48 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
              <div className="h-44 w-full rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
              <div className="h-64 w-full rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F17] text-white selection:bg-[#BDFE00] selection:text-black">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:ml-64 min-w-0 transition-all duration-300">
        {/* Header */}
        <Header />

        {/* Page Content — bottom padding for mobile nav */}
        <main className="min-h-[calc(100vh-4rem)] pb-20 md:pb-0">
          <div>{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
