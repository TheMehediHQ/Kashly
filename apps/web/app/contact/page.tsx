"use client";

import React from "react";
import { LuMessageCircle, LuMail, LuArrowRight } from "react-icons/lu";

export default function ContactPage() {
  const whatsappNumber = "01747874773";
  const whatsappMessage = encodeURIComponent(
    "Hello, I would like to get in touch with you."
  );
  const whatsappLink = `https://wa.me/88${whatsappNumber}?text=${whatsappMessage}`;
  const email = "hello@mehedi-hasan.me";
  const emailLink = `mailto:${email}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F17] text-white p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#BDFE00]/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#1FBFD8]/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00]">
            <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
            GET IN TOUCH
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Contact <span className="text-[#BDFE00]">Us</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
            Have questions or need support? Reach out to us through your preferred channel.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          {/* WhatsApp Card */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl p-8 hover:border-[#25D366]/40 transition-all duration-300 overflow-hidden"
          >
            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <LuMessageCircle className="w-8 h-8 text-[#25D366]" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">WhatsApp</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Quick response, direct communication
                </p>
                <div className="text-lg font-mono font-bold text-[#25D366]">
                  {whatsappNumber}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[#25D366] group-hover:gap-3 transition-all">
                <span>Chat Now</span>
                <LuArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#25D366]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </a>

          {/* Email Card */}
          <a
            href={emailLink}
            className="group relative rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl p-8 hover:border-[#1FBFD8]/40 transition-all duration-300 overflow-hidden"
          >
            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1FBFD8]/10 border border-[#1FBFD8]/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <LuMail className="w-8 h-8 text-[#1FBFD8]" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">Email</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Detailed inquiries and support
                </p>
                <div className="text-lg font-mono font-bold text-[#1FBFD8] break-all">
                  {email}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[#1FBFD8] group-hover:gap-3 transition-all">
                <span>Send Email</span>
                <LuArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1FBFD8]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </a>
        </div>

        {/* Footer Note */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-xs text-slate-500 font-mono">
            We typically respond within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}
