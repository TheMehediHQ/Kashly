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
} from "react-icons/lu";
import { useAuth } from "@/app/context/AuthContext";

const navItems = [
  { name: "Home", href: "/dashboard", icon: LuLayoutDashboard },
  { name: "Wallet", href: "/dashboard/wallet", icon: LuWallet },
  { name: "Budgets", href: "/dashboard/budgets", icon: LuArchive },
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
      <div className="flex items-center justify-around px-2 py-2">
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
  className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors"
>
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
