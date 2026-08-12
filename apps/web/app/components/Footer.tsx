"use client";

import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0B0F17] text-slate-400 py-6 border-t border-white/5 relative z-10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          {/* Brand & Copyright */}
          <p className="text-slate-400">
            &copy; {currentYear} <span className="text-[#BDFE00] font-semibold">Kashly</span>. All rights reserved.
          </p>

          {/* Quick Links / Status */}
          <div className="flex items-center gap-6 text-slate-500 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#BDFE00]" />
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}