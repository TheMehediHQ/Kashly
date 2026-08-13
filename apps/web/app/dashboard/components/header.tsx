"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import { LuBell } from "react-icons/lu";
import { useAuth } from "@/app/context/AuthContext";

const Header = () => {
  const { user } = useAuth();

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0B0F17]/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 h-16">
      {/* Left: Date & Greeting */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
            {currentMonth} {currentYear}
          </p>
          <p className="text-sm font-semibold text-white">
            Hello, {user?.fullName?.split(" ")[0] || "User"}{" "}
            <span className="text-[#BDFE00]">👋</span>
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
          <LuBell size={16} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#BDFE00] border border-[#0B0F17]" />
        </button>

        {/* Clerk UserButton — handles profile, password, email, sessions, 2FA */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8 rounded-lg border border-white/20",
              userButtonPopoverCard: "bg-[#0B0F17] border border-white/10",
              userButtonPopoverActionButton: "text-slate-300",
              userButtonPopoverActionButtonText: "text-slate-300",
              userButtonPopoverFooter: "hidden",
            },
          }}
        />
      </div>
    </header>
  );
};

export default Header;
