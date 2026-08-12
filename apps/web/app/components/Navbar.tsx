"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuLayoutDashboard,
  LuLogOut,
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
  const [avatarError, setAvatarError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  // Reset the error flag when the avatar URL changes
  useEffect(() => {
    setAvatarError(false);
  }, [user?.photoURL]);

  const avatarSrc =
    !avatarError && user?.photoURL
      ? user.photoURL
      : "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";

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
        { withCredentials: true }
      );

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
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0B0F17] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#BDFE00] text-black font-extrabold text-lg shadow-[0_0_15px_rgba(189,254,0,0.25)] group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Nex<span className="text-[#BDFE00]">Vibe</span>
            </span>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section: Profile & Login */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-full 
                  p-1 pr-3   transition-all active:scale-95 cursor-pointer"
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[#BDFE00]/40 bg-slate-800">
                    <Image
                      src={avatarSrc}
                      alt="User Profile"
                      fill
                      className="object-cover"
                      sizes="32px"
                      priority
                      unoptimized
                      onError={() => setAvatarError(true)}
                    />
                  </div>

                  <LuChevronDown
                    className={`text-slate-400 transition-transform duration-300 ${
                      isProfileOpen ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-60 origin-top-right rounded-xl border border-white/10 bg-[#0B0F17] p-2 shadow-2xl"
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[#BDFE00]">
                          Account
                        </p>
                        <p className="truncate text-sm font-medium text-slate-200">
                          {user?.email}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1">
                        {profileLinks.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <span className="text-[#BDFE00]">{item.icon}</span>
                            {item.name}
                          </Link>
                        ))}

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
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
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
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