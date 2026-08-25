"use client";

import React from "react";
import { LuMessageCircle, LuGithub, LuHeart } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = "01747874773";
  const whatsappLink = `https://wa.me/88${whatsappNumber}`;

  return (
    <footer className="w-full bg-[#0B0F17] border-t border-white/10 relative z-10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
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
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Manage your finances proactively with smart tracking, budgeting, and real-time insights.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#features" className="text-sm text-slate-400 hover:text-[#BDFE00] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm text-slate-400 hover:text-[#BDFE00] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-sm text-slate-400 hover:text-[#BDFE00] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-[#BDFE00] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Get In Touch
            </h3>
            <div className="space-y-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-[#25D366] transition-colors"
              >
                <LuMessageCircle className="w-4 h-4" />
                <span className="text-sm">{whatsappNumber}</span>
              </a>

              <a
                href="https://github.com/TheMehediHQ/Kashly"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <LuGithub className="w-4 h-4" />
                <span className="text-sm">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 ">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <p className="text-slate-400">
              &copy; {currentYear} <span className="text-[#BDFE00] font-semibold">Kashly</span>.{" "}
              <Link href="https://github.com/TheMehediHQ/Kashly/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-[#BDFE00] transition-colors">
                MIT License
              </Link>
            </p>
           
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
              <span className="text-slate-500">System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
