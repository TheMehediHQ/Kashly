"use client";

import React, { useState, useRef, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { LuBell, LuCheck, LuTrash2, LuX } from "react-icons/lu";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";

type Notification = {
  _id: string;
  type: "success" | "warning" | "critical" | "info";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const timeAgo = (dateStr: string, now: number) => {
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const Header = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [now] = useState(() => Date.now());
  const notifRef = useRef<HTMLDivElement>(null);

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/notifications");
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = async () => {
    try {
      await axios.patch("/api/notifications/read", {});
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // silent
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      const notif = notifications.find((n) => n._id !== id);
      if (notif && !notif.read) setUnreadCount((prev) => prev - 1);
    } catch {
      // silent
    }
  };

  const typeStyles = {
    success: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", dot: "bg-emerald-400" },
    warning: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", dot: "bg-amber-400" },
    critical: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", dot: "bg-rose-400" },
    info: { bg: "bg-[#1FBFD8]/10", border: "border-[#1FBFD8]/30", text: "text-[#1FBFD8]", dot: "bg-[#1FBFD8]" },
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0B0F17]/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 h-16">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
            {currentMonth} {currentYear}
          </p>
          <p className="text-sm font-semibold text-white">
            Hello, {user?.fullName?.split(" ")[0] || "User"}{" "}
            <span className="text-[#BDFE00]">👋</span>
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              if (!isNotifOpen) fetchNotifications();
            }}
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <LuBell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-bold px-1 border-2 border-[#0B0F17]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-full mt-2 sm:mt-2 z-50 w-auto sm:w-[360px] max-w-[calc(100vw-24px)] origin-top-right rounded-2xl border border-white/10 bg-[#0B0F17] shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="text-[9px] font-bold bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-md border border-rose-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[10px] font-mono text-[#BDFE00] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <LuCheck size={10} /> Mark all read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => {
                      const style = typeStyles[notif.type] || typeStyles.info;
                      return (
                        <div
                          key={notif._id}
                          className={`flex items-start gap-3 p-4 hover:bg-white/[0.02] transition-colors ${
                            !notif.read ? "bg-white/[0.02]" : ""
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg ${style.bg} border ${style.border} flex items-center justify-center shrink-0 mt-0.5`}>
                            <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-white truncate">
                                {notif.title}
                              </p>
                              {!notif.read && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#BDFE00] shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-[9px] font-mono text-slate-600 mt-1">
                              {timeAgo(notif.createdAt, now)}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteNotification(notif._id)}
                            className="p-1 rounded-md text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                          >
                            <LuX size={12} />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center">
                      <LuBell size={24} className="mx-auto text-slate-700 mb-2" />
                      <p className="text-xs text-slate-500">No notifications yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clerk UserButton */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8 rounded-lg border border-white/20",
            },
          }}
        />
      </div>
    </header>
  );
};

export default Header;