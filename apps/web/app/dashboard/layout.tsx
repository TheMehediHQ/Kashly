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
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#0B0F17] text-white selection:bg-[#BDFE00] selection:text-black">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:ml-64 min-w-0 transition-all duration-300">
        {/* Header */}
        <Header />

        {/* Page Content — bottom padding for mobile nav */}
        <main className="min-h-[calc(100vh-4rem)] pb-24 md:pb-0">
          <div>{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
