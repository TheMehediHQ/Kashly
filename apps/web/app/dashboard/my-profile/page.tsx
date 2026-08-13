"use client";

import { useAuth } from "@/app/context/AuthContext";
import React from "react";
import {
  LuMail,
  LuStar,
  LuCreditCard,
  LuShield,
  LuCalendar,
  LuCheck,
  LuSettings,
  LuUser,
  LuZap,
} from "react-icons/lu";
import { UserButton } from "@clerk/nextjs";

const MyProfile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full min-h-screen p-3 sm:p-6 lg:p-8 space-y-6">
        <div className="space-y-3">
          <div className="h-10 w-56 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
          <div className="h-5 w-72 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-3 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00] mb-2.5">
            <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
            ACCOUNT SETTINGS
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            View your account info and manage identity settings.
          </p>
        </div>
      </div>

      {/* Profile Identity Card */}
      <div className="rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden">
        <div className="h-20 bg-gradient-to-br from-[#BDFE00]/8 via-transparent to-[#1FBFD8]/8 " />
        <div className="px-5 sm:px-8 -mt-10 pb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className=" overflow-hidden rounded-xl shadow-xl">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-full w-full rounded-none",
                  },
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight truncate">
  {user?.fullName}
</h2>
              <p className="text-xs text-slate-500 font-mono truncate">
                {user?.email}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-[#BDFE00] text-[9px] font-mono font-bold uppercase tracking-wider">
                  <LuCheck size={9} /> Verified
                </span>
                {user?.role === "admin" && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1FBFD8]/10 border border-[#1FBFD8]/20 text-[#1FBFD8] text-[9px] font-mono font-bold uppercase tracking-wider">
                    <LuStar size={9} /> Admin
                  </span>
                )}
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold uppercase tracking-wider">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Credits */}
        <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Credits
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#1FBFD8]/10 flex items-center justify-center text-[#1FBFD8]">
              <LuCreditCard size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#1FBFD8] tracking-tight">
            {user?.credits ?? 0}
          </p>
          <p className="text-[10px] font-mono text-slate-500 mt-1">
            {user?.credits < 50 ? "Running low" : "1 credit per txn"}
          </p>
        </div>

        {/* Role */}
        <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Role
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#BDFE00]/10 flex items-center justify-center text-[#BDFE00]">
              <LuShield size={16} />
            </div>
          </div>
          <p className={`text-2xl sm:text-3xl font-black tracking-tight ${
            user?.role === "admin" ? "text-[#BDFE00]" : "text-slate-400"
          }`}>
            {user?.role?.toUpperCase() || "USER"}
          </p>
          <p className="text-[10px] font-mono text-slate-500 mt-1">
            {user?.role === "admin" ? "Full access" : "Standard access"}
          </p>
        </div>

        {/* Transaction Status */}
        <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Transactions
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <LuZap size={16} />
            </div>
          </div>
          <p className={`text-2xl sm:text-3xl font-black tracking-tight ${
            user?.isTransactionAllowed ? "text-emerald-400" : "text-rose-400"
          }`}>
            {user?.isTransactionAllowed ? "ACTIVE" : "LOCKED"}
          </p>
          <p className="text-[10px] font-mono text-slate-500 mt-1">
            {user?.isTransactionAllowed ? "Can add transactions" : "Blocked by admin"}
          </p>
        </div>

        {/* Member Since */}
        <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Member Since
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <LuCalendar size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </p>
          <p className="text-[10px] font-mono text-slate-500 mt-1">
            Account creation date
          </p>
        </div>
      </div>

      {/* Account Details */}
      <div className="rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-white/10">
          <LuSettings size={16} className="text-[#BDFE00]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Account Details
          </h2>
        </div>

        <div className="divide-y divide-white/5">
          {/* Full Name */}
          <div className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#BDFE00]/10 flex items-center justify-center text-[#BDFE00]">
                <LuUser size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Full Name</p>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Managed via Clerk</p>
              </div>
            </div>
            <span className="text-sm text-slate-300 font-medium">
              {user?.fullName || "—"}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1FBFD8]/10 flex items-center justify-center text-[#1FBFD8]">
                <LuMail size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Email Address</p>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Managed via Clerk</p>
              </div>
            </div>
            <span className="text-sm text-slate-300 font-mono">
              {user?.email || "—"}
            </span>
          </div>

          {/* Security */}
          <div className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <LuShield size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Security</p>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Password, 2FA, Sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold uppercase">
                Secured
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
