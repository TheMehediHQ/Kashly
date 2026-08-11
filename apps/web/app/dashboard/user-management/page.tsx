/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "@/app/context/ThemeContext";
import {
  Plus,
  Search,
  X,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

// Updated Type: _id is now a direct string
interface UserData {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: { $date: string };
  credits: number;
  isTransactionAllowed: boolean;
}

const UserManagement = () => {
  const { effectiveTheme, isMounted } = useTheme();
  const isDark = effectiveTheme === "dark";
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // ১. ডাটাবেস থেকে ইউজার ফেচ করা
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/admin/users`,
        {
          withCredentials: true,
        },
      );
      setUsers(res.data.users);
    } catch (error: any) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen" />;
  }

  // ২. ট্রানজ্যাকশন স্ট্যাটাস টগল (Fixed Logic for u._id)
  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // Optimistic Update: UI সাথে সাথে পরিবর্তন হবে
    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId ? { ...u, isTransactionAllowed: newStatus } : u,
      ),
    );

    try {
      const response = await axios.patch(
        `/api/admin/users/${userId}/transaction-status`,
        { isTransactionAllowed: newStatus },
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success(response.data.message);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const msg = error.response?.data?.message || "Update failed";
      toast.error(msg);

      // এরর হলে আগের অবস্থায় রোলব্যাক
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isTransactionAllowed: currentStatus } : u,
        ),
      );
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading && users.length === 0) {
    return (
      <div className={`min-h-screen transition-colors ${isDark ? "bg-black" : "bg-white"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="space-y-3">
              <div className={`h-9 w-56 rounded-lg animate-pulse ${isDark ? "bg-neutral-800" : "bg-neutral-200"}`} />
              <div className={`h-5 w-40 rounded-lg animate-pulse ${isDark ? "bg-neutral-900" : "bg-neutral-100"}`} />
            </div>
            <div className={`h-12 w-full rounded-xl animate-pulse ${isDark ? "bg-neutral-900" : "bg-neutral-100"}`} />
            <div className={`h-[420px] w-full rounded-2xl animate-pulse ${isDark ? "bg-neutral-900" : "bg-neutral-100"}`} />
          </div>
        </div>
      </div>
    );
  }

  const handleCredits = async () => {
    if (!selectedUser) return;

    const creditsToAdd = Number(amount);
    if (isNaN(creditsToAdd) || creditsToAdd <= 0) {
      toast.error("Enter a valid credit amount");
      return;
    }

    try {
      const res = await axios.patch(
        `/api/admin/users/${selectedUser._id}/credits`,
        { credits: creditsToAdd },
        { withCredentials: true },
      );

      // Update UI: add credits locally
      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id ? { ...u, credits: res.data.credits } : u,
        ),
      );

      toast.success(res.data.message);
      setIsModalOpen(false);
      setAmount("");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update credits";
      toast.error(msg);
    }
  };

  return (
    <div className={`min-h-screen antialiased font-sans ${isDark ? "bg-black text-neutral-300" : "bg-white text-neutral-700"}`}>
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-6 lg:mb-8">
          <div>
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${isDark ? "text-white" : "text-black"}`}>
              Admin Console
            </h1>
            <p className={`text-xs sm:text-sm mt-1 uppercase tracking-widest font-bold ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
              System Management
            </p>
          </div>

          <div className="relative group w-full lg:w-80">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-all ${isDark ? "text-neutral-500 group-focus-within:text-slate-400" : "text-neutral-500 group-focus-within:text-slate-600"}`} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-neutral-400/50 focus:border-neutral-400 outline-none transition-all text-sm sm:text-base ${isDark ? "bg-neutral-900/50 border-neutral-700/50 text-white placeholder:text-neutral-400" : "bg-neutral-50/50 border-neutral-300/50 text-black placeholder:text-neutral-500"} border`}
            />
          </div>
        </header>

        {/* Mobile Cards View */}
        <div className="block md:hidden space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`rounded-2xl p-4 ${isDark ? "bg-neutral-900/40 border-neutral-800/60" : "bg-neutral-50/40 border-neutral-200/60"} border`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center font-bold text-lg transition-colors ${isDark ? "bg-slate-600/10 border-slate-600/20 text-slate-400" : "bg-slate-600/10 border-slate-600/20 text-slate-600"}`}>
                    {user.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-base font-bold flex items-center gap-2 truncate ${isDark ? "text-white" : "text-black"}`}>
                      <span className="truncate">{user.fullName}</span>
                      {user.isVerified && (
                        <CheckCircle2 size={14} className="text-slate-400 flex-shrink-0" />
                      )}
                    </div>
                    <div className={`text-sm truncate ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                      {user.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setIsModalOpen(true);
                  }}
                  className={`p-2 rounded-xl transition-all active:scale-95 ml-2 ${isDark ? "bg-neutral-800 text-white hover:bg-neutral-700" : "bg-neutral-900 text-white hover:bg-neutral-800"}`}
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className={`inline-block px-3 py-1 rounded-lg font-mono font-bold text-sm transition-colors ${isDark ? "bg-neutral-900 border-neutral-800 text-white" : "bg-neutral-50 border-neutral-200 text-black"} border`}>
                      {user.credits}
                    </div>
                    <div className={`text-xs mt-1 ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                      Credits
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(user._id, user.isTransactionAllowed)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out ${
                        user.isTransactionAllowed
                          ? "bg-slate-600 shadow-[0_0_15px_rgba(71,85,105,0.4)]"
                          : isDark ? "bg-neutral-700" : "bg-neutral-300"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
                          user.isTransactionAllowed ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest ${user.isTransactionAllowed ? "text-slate-400" : isDark ? "text-neutral-600" : "text-neutral-400"}`}
                    >
                      {user.isTransactionAllowed ? "Active" : "Locked"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className={`hidden md:block rounded-2xl sm:rounded-4xl backdrop-blur-md shadow-sm overflow-hidden ${isDark ? "bg-neutral-900/40 border-neutral-800/60" : "bg-neutral-50/40 border-neutral-200/60"} border`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0 min-w-[600px]">
              <thead>
                <tr className={`text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-black transition-colors ${isDark ? "bg-neutral-800/30 text-neutral-500" : "bg-neutral-200/30 text-neutral-500"}`}>
                  <th className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b ${isDark ? "border-neutral-800/50" : "border-neutral-200/50"}`}>
                    User Profile
                  </th>
                  <th className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b text-center ${isDark ? "border-neutral-800/50" : "border-neutral-200/50"}`}>
                    Status
                  </th>
                  <th className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b text-center ${isDark ? "border-neutral-800/50" : "border-neutral-200/50"}`}>
                    Credits
                  </th>
                  <th className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b text-right ${isDark ? "border-neutral-800/50" : "border-neutral-200/50"}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-neutral-800/30" : "divide-neutral-200/30"}`}>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={`transition-colors group ${isDark ? "hover:bg-slate-600/3" : "hover:bg-slate-600/3"}`}
                  >
                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl border flex items-center justify-center font-bold text-sm sm:text-lg transition-colors ${isDark ? "bg-slate-600/10 border-slate-600/20 text-slate-400" : "bg-slate-600/10 border-slate-600/20 text-slate-600"}`}>
                          {user.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-sm sm:text-[15px] font-bold flex items-center gap-2 truncate ${isDark ? "text-white" : "text-black"}`}>
                            <span className="truncate">{user.fullName}</span>
                            {user.isVerified && (
                              <CheckCircle2
                                size={12}
                                className="text-slate-400 flex-shrink-0"
                              />
                            )}
                          </div>
                          <div className={`text-xs font-medium truncate ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() =>
                            handleToggleStatus(
                              user._id,
                              user.isTransactionAllowed,
                            )
                          }
                          className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-all duration-300 ease-in-out ${
                            user.isTransactionAllowed
                              ? "bg-slate-600 shadow-[0_0_15px_rgba(71,85,105,0.4)]"
                              : isDark ? "bg-neutral-700" : "bg-neutral-300"
                          }`}
                        >
                          <span
                            className={`h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
                              user.isTransactionAllowed
                                ? "translate-x-5 sm:translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span
                          className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${user.isTransactionAllowed ? "text-slate-400" : isDark ? "text-neutral-600" : "text-neutral-400"}`}
                        >
                          {user.isTransactionAllowed ? "Active" : "Locked"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-center">
                      <div className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg font-mono font-bold text-xs sm:text-sm transition-colors ${isDark ? "bg-neutral-900 border-neutral-800 text-white" : "bg-neutral-50 border-neutral-200 text-black"} border`}>
                        {user.credits}
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                        }}
                        className={`p-2 sm:p-2.5 border rounded-xl transition-all hover:scale-105 active:scale-95 ${isDark ? "bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700" : "bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800"}`}
                      >
                        <Plus size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={3} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>

      {/* Credit Update Modal */}
      {isModalOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-300 ${isDark ? "bg-black/90" : "bg-white/90"}`}>
          <div className={`w-full max-w-sm mx-4 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 relative transition-colors ${isDark ? "bg-neutral-900 border-neutral-800" : "bg-neutral-50 border-neutral-200"} border`}>
            <button
              onClick={() => setIsModalOpen(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDark ? "text-neutral-500 hover:text-white hover:bg-neutral-800" : "text-neutral-500 hover:text-black hover:bg-neutral-100"}`}
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-600/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-600/20 text-slate-400">
                <ArrowUpRight size={28} className="sm:w-[32px] sm:h-[32px]" />
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`}>
                Add Credits
              </h3>
              <p className={`text-sm mt-2 truncate px-2 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                {selectedUser?.fullName}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-3 text-center ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  Enter Credit Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className={`w-full px-6 py-5 rounded-2xl text-3xl font-mono font-bold text-center focus:ring-2 focus:ring-neutral-400/50 outline-none transition-all ${isDark ? "bg-black border-neutral-800/50 text-white placeholder:text-neutral-600" : "bg-white border-neutral-200/50 text-black placeholder:text-neutral-400"} border`}
                  inputMode="numeric"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`py-4 text-sm font-bold rounded-2xl transition-all active:scale-95 ${isDark ? "text-neutral-400 hover:bg-neutral-800/50 border border-neutral-700" : "text-neutral-600 hover:bg-neutral-200/50 border border-neutral-300"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCredits}
                  className={`py-4 text-sm font-medium rounded-2xl transition-all active:scale-95 shadow-lg border ${
                    isDark
                      ? "bg-white text-black hover:bg-neutral-100 border-neutral-200"
                      : "bg-black text-white hover:bg-neutral-900 border-neutral-800"
                  }`}
                >
                  Add Credits
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
