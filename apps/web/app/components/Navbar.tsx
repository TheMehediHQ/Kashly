"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { LuLayoutDashboard } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0B0F17] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shrink-0">
              <Image
                src="/kashly.svg"
                alt="Kashly Logo"
                width={36}
                height={36}
                className="object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              <span className="text-[#BDFE00]">Kashly</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/#features"
              className="text-sm font-medium text-slate-300 hover:text-[#BDFE00] transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#faq"
              className="text-sm font-medium text-slate-300 hover:text-[#BDFE00] transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-slate-300 hover:text-[#BDFE00] transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Right Section: Profile & Login */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                >
                  <LuLayoutDashboard size={15} />
                  Dashboard
                </Link>
                <div className="h-6 w-px bg-white/10" />
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "h-8 w-8 rounded-full border border-[#BDFE00]/40",
                    },
                  }}
                />
              </>
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
