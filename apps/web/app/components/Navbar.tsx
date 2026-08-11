"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuLayoutDashboard,
  LuSettings,
  LuLogOut,
  LuUser,
  LuChevronDown,
} from "react-icons/lu";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Navbar = () => {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `/api/logout`,
        {},
        { withCredentials: true },
      );

      // optional: clear user state (if using context)
      // setUser(null);

      toast.success("Logout successful");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const navLinks: { name: string; href: string }[] = [];

  const profileLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LuLayoutDashboard size={18} />,
    }
    // { name: "Settings", href: "/settings", icon: <LuSettings size={18} /> },
  ];

  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-(--border) bg-(--background) transition-colors duration-300 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white font-bold">
              M
            </div>
            <span className="text-lg font-bold tracking-tight text-(--foreground)">
              MoneyFlow
            </span>
          </Link>

          {/* Center: Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-(--muted-foreground) hover:text-(--foreground) transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: Profile & Mobile */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-full border border-(--border) p-1 pr-3 transition-all hover:bg-(--hover-bg) active:scale-95"
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-100">
                    <Image
                      src={
                        user?.photoURL ||
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                      }
                      alt="User Profile"
                      fill
                      className="object-cover"
                      sizes="32px"
                      priority
                    />
                  </div>

                  <LuChevronDown
                    className={`text-gray-400 transition-transform duration-300 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-60 origin-top-right rounded-xl border border-(--border) bg-(--background) p-2 shadow-sm"
                    >
                      <div className="px-3 py-2 border-b border-(--border) mb-1">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-(--muted-foreground)">
                          Account
                        </p>
                        <p className="truncate text-sm font-medium text-(--foreground)">
                          {user?.email}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {profileLinks.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-(--muted-foreground) hover:bg-(--hover-bg) hover:text-(--foreground) transition-colors"
                          >
                            <span className="opacity-70">{item.icon}</span>
                            {item.name}
                          </Link>
                        ))}

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg text-red-500 hover:bg-(--hover-bg) transition-colors"
                        >
                          <LuLogOut size={18} />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-lg border border-(--border) px-4 py-2 text-sm font-medium text-(--foreground) hover:bg-(--hover-bg) transition-all active:scale-95"
              >
                Login
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
