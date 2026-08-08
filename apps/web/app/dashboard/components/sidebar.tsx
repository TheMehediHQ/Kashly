"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuLayoutDashboard,
  LuUser,
  LuChevronRight,
  LuWallet,
  LuArchive,
  LuTarget,
  LuMenu,
  LuX,
} from "react-icons/lu";
import { IoWallet } from "react-icons/io5";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";
import { FiUser } from "react-icons/fi";
import { LucideHome } from "lucide-react";
import ThemeToggle from "@/app/components/ThemeToggle";

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 🔥 Menu Items
  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LuLayoutDashboard size={20} />,
    },
    {
      name: "My Profile",
      href: "/dashboard/my-profile",
      icon: <LuUser size={20} />,
    },
    {
      name: "Wallet",
      href: "/dashboard/wallet",
      icon: <IoWallet size={20} />,
    },
    {
      name: "Budgets",
      href: "/dashboard/budgets",
      icon: <LuArchive size={20} />,
    },
    {
      name: "User Management",
      href: "/dashboard/user-management",
      icon: <IoWallet size={20} />,
      adminOnly: true, // ✅ only admin দেখবে
    },
  ];

  // ✅ Filter based on role
  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || user?.role === "admin"
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className={`fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg transition-colors ${isDark ? "bg-neutral-900 text-white hover:bg-neutral-800" : "bg-white text-black hover:bg-neutral-100"} shadow-lg`}
      >
        <LuMenu size={20} />
      </button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: 0 }}
        animate={{
          x: 0, // Desktop: always visible, Mobile: controlled by CSS
        }}
        transition={{ type: "tween", duration: 0.3 }}
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col justify-between border-r p-6 shadow-sm transition-colors md:fixed md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${
          isDark
            ? "border-neutral-800/50 bg-black text-neutral-300"
            : "border-neutral-200/50 bg-neutral-50 text-neutral-700"
        }`}
      >
        {/* Close Button for Mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute top-4 right-4 md:hidden p-2 rounded-lg transition-colors ${isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}
        >
          <LuX size={20} />
        </button>

        <div>
          {/* Logo */}
          <div className="mb-10 flex items-center gap-3 px-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold text-white ${isDark ? "bg-neutral-800" : "bg-neutral-900"}`}>
              M
            </div>
            <h1 className={`text-lg font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`}>
              MoneyFlow
            </h1>
          </div>

          {/* Navigation */}
          <nav>
            <ul className="space-y-2">
              {filteredMenuItems.map((item, index) => {
                const isActive = pathname === item.href;

                return (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group relative flex items-center justify-between rounded-lg px-4 py-3 transition-all duration-300 ${
                        isActive
                          ? isDark ? "bg-neutral-900 text-white" : "bg-neutral-200 text-black"
                          : isDark ? "hover:bg-neutral-900 hover:text-white" : "hover:bg-neutral-100 hover:text-black"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`transition-colors ${
                            isActive
                              ? isDark ? "text-white" : "text-black"
                              : isDark ? "text-neutral-500 group-hover:text-white" : "text-neutral-600 group-hover:text-black"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="text-sm font-semibold tracking-wide">
                          {item.name}
                        </span>
                      </div>

                      {/* Active Arrow */}
                      {isActive && (
                        <motion.div layoutId="activeArrow">
                          <LuChevronRight size={16} />
                        </motion.div>
                      )}

                      {/* Hover Glow */}
                      <div className={`absolute inset-0 -z-10 rounded-lg opacity-0 transition-opacity group-hover:opacity-100 ${isDark ? "bg-neutral-900/50" : "bg-neutral-100/50"}`} />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Footer */}
        <div className={`border-t ${isDark ? "border-neutral-800/50" : "border-neutral-200/50"}`}>
          <div className="my-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300 ${isDark ? "bg-neutral-900/50 text-neutral-400 hover:bg-black hover:text-white" : "bg-neutral-200/50 text-neutral-600 hover:bg-neutral-300 hover:text-black"}`}
            >
              <LucideHome size={20} />
              <span>Return to Home</span>
            </Link>
          </div>

          <div className={`flex items-center gap-3 rounded-lg p-3 ring-1 ${isDark ? "bg-neutral-900/30 ring-neutral-800" : "bg-neutral-200/30 ring-neutral-300"}`}>
            <div className={`h-9 w-9 rounded-full flex items-center justify-center ${isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-300 text-neutral-700"}`}>
              <FiUser className="text-lg" />
            </div>
            <div className="overflow-hidden">
              <p className={`truncate text-sm font-bold ${isDark ? "text-white" : "text-black"}`}>
                {user?.fullName}
              </p>
              <p className={`truncate text-xs ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>
                Credits {user?.credits} left
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <ThemeToggle />
          </div>

          <p className={`mt-4 text-center text-[10px] font-medium uppercase tracking-[0.2em] ${isDark ? "text-neutral-600" : "text-neutral-500"}`}>
            © 2026 MoneyFlow
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;