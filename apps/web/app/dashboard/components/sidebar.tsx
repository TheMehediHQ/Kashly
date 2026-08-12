"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuLayoutDashboard,
  LuUser,
  LuChevronRight,
  LuArchive,
  LuMenu,
  LuX,
} from "react-icons/lu";
import { IoWallet } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { LucideHome } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Menu Items
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
      adminOnly: true,
    },
  ];

  // Filter based on role
  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || user?.role === "admin"
  );

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden p-2.5 rounded-xl bg-[#0B0F17] text-white border border-white/10 shadow-lg hover:bg-white/5 transition-colors"
      >
        <LuMenu size={20} />
      </button>

      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col justify-between border-r border-white/10 bg-[#0B0F17] p-6 shadow-xl transition-transform duration-300 md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button for Mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 md:hidden transition-colors"
        >
          <LuX size={20} />
        </button>

        <div>
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mb-10 flex items-center gap-2.5 px-2 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#BDFE00] text-black font-extrabold text-lg shadow-[0_0_15px_rgba(189,254,0,0.25)] group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Nex<span className="text-[#BDFE00]">Vibe</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav>
            <ul className="space-y-1.5">
              {filteredMenuItems.map((item, index) => {
                const isActive = pathname === item.href;

                return (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group relative flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-[#BDFE00] text-black shadow-[0_0_20px_rgba(189,254,0,0.2)]"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`transition-colors ${
                            isActive
                              ? "text-black"
                              : "text-slate-400 group-hover:text-[#BDFE00]"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                      </div>

                      {/* Active Indicator Arrow */}
                      {isActive && (
                        <motion.div layoutId="activeArrow">
                          <LuChevronRight size={16} className="text-black" />
                        </motion.div>
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Footer & User Profile Info */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          {/* Return Home Link */}
          <div>
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <LucideHome size={18} className="text-[#BDFE00]" />
              <span>Return to Home</span>
            </Link>
          </div>

          {/* User Profile Summary */}
          <div className="flex items-center gap-3 rounded-xl p-3 bg-white/5 border border-white/10">
            <div className="h-9 w-9 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/30 flex items-center justify-center text-[#BDFE00] shrink-0">
              <FiUser className="text-base" />
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-semibold text-slate-100">
                {user?.fullName || user?.email || "User"}
              </p>
              <p className="truncate text-xs font-mono text-slate-400">
                Credits: <span className="text-[#BDFE00]">{user?.credits ?? 0}</span> left
              </p>
            </div>
          </div>

          {/* Copyright Tag */}
          <p className="text-center text-[10px] font-mono uppercase tracking-widest text-slate-500 pt-1">
            © {new Date().getFullYear()} NexVibe
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;