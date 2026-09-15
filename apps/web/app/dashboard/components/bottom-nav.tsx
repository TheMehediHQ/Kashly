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
  LuSettings,
  LuTarget,
} from "react-icons/lu";
import { useAuth } from "@/app/context/AuthContext";

const navItems = [
  { name: "Home", href: "/dashboard", icon: LuLayoutDashboard },
  { name: "Wallet", href: "/dashboard/wallet", icon: LuWallet },
  { name: "Budgets", href: "/dashboard/budgets", icon: LuArchive },
  { name: "Income", href: "/dashboard/income", icon: LuTarget },
  { name: "Profile", href: "/dashboard/my-profile", icon: LuUser },
  { name: "Settings", href: "/dashboard/user-management", icon: LuSettings, adminOnly: true },
];

const BottomNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === "admin"
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-white/10 bg-[#0B0F17]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-1 py-2">
        {visibleItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-0.5 px-1 py-1.5 rounded-xl transition-colors min-w-0"
            >
              <Icon
                size={18}
                className={`transition-colors shrink-0 ${
                  isActive ? "text-[#BDFE00]" : "text-slate-500"
                }`}
              />
              <span
                className={`text-[8px] font-mono font-bold uppercase tracking-tight transition-colors truncate w-full text-center ${
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
