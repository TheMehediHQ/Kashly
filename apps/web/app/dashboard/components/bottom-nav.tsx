"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LuLayoutDashboard,
  LuWallet,
  LuArchive,
  LuUser,
} from "react-icons/lu";

const navItems = [
  { name: "Home", href: "/dashboard", icon: LuLayoutDashboard },
  { name: "Wallet", href: "/dashboard/wallet", icon: LuWallet },
  { name: "Budgets", href: "/dashboard/budgets", icon: LuArchive },
  { name: "Profile", href: "/dashboard/my-profile", icon: LuUser },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-white/10 bg-[#0B0F17]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[#BDFE00]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                className={`transition-colors ${
                  isActive ? "text-[#BDFE00]" : "text-slate-500"
                }`}
              />
              <span
                className={`text-[9px] font-mono font-bold uppercase tracking-wider transition-colors ${
                  isActive ? "text-[#BDFE00]" : "text-slate-500"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
