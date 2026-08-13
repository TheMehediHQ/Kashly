/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  Search,
  X,
  CheckCircle2,
  ArrowUpRight,
  Shield,
  ShieldOff,
  Trash2,
} from "lucide-react";

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
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<UserData | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/admin/users`, {
        withCredentials: true,
      });
      setUsers(res.data.users || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId ? { ...u, isTransactionAllowed: newStatus } : u
      )
    );

    try {
      const response = await axios.patch(
        `/api/admin/users/${userId}/transaction-status`,
        { isTransactionAllowed: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Update failed";
      toast.error(msg);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isTransactionAllowed: currentStatus } : u
        )
      );
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
    );

    try {
      const res = await axios.patch(
        `/api/admin/users/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update role";
      toast.error(msg);

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: currentRole } : u))
      );
    }
  };

  const handleDeleteUser = async (user: UserData) => {
    try {
      const res = await axios.delete(`/api/admin/users/${user._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        toast.success(res.data.message);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to delete user";
      toast.error(msg);
    } finally {
      setDeleteConfirm(null);
    }
  };

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
        { withCredentials: true }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id ? { ...u, credits: res.data.credits } : u
        )
      );

      toast.success(res.data.message || "Credits added successfully");
      setIsModalOpen(false);
      setSelectedUser(null);
      setAmount("");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update credits";
      toast.error(msg);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && users.length === 0) {
    return (
      <div className="w-full min-h-screen text-white p-3 sm:p-6 lg:p-8 space-y-6">
        <div className="space-y-3">
          <div className="h-8 w-56 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
          <div className="h-4 w-48 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
        </div>
        <div className="h-12 w-full rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
        <div className="h-[420px] w-full rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen text-white space-y-6 sm:space-y-8 p-3 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00] mb-2.5">
            <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
            ADMIN CONSOLE
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Control permissions, manage credits, and monitor system accounts.
          </p>
        </div>

        {/* Search Control */}
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#BDFE00] transition-colors" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#BDFE00]/60 transition-colors"
          />
        </div>
      </header>

      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="rounded-2xl p-5 bg-slate-900/40 border border-white/10 backdrop-blur-xl space-y-4 shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-[#BDFE00] flex items-center justify-center font-bold text-base shrink-0">
                    {user.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                      <span className="truncate">{user.fullName}</span>
                      {user.isVerified && (
                        <CheckCircle2 size={14} className="text-[#BDFE00] shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-mono truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsModalOpen(true);
                    }}
                    className="p-2.5 rounded-xl bg-[#BDFE00] text-black hover:bg-[#aef000] transition-all cursor-pointer"
                    title="Add Credits"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(user)}
                    className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                    title="Delete User"
                  >
                    <Trash2 size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-400">Credits:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#BDFE00] font-bold">
                    {user.credits}
                  </span>
                </div>

                <button
                  onClick={() => handleRoleToggle(user._id, user.role)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    user.role === "admin"
                      ? "bg-[#1FBFD8]/10 border border-[#1FBFD8]/30 text-[#1FBFD8] hover:bg-[#1FBFD8]/20"
                      : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"
                  }`}
                  title={user.role === "admin" ? "Remove admin" : "Make admin"}
                >
                  {user.role === "admin" ? <Shield size={12} /> : <ShieldOff size={12} />}
                  {user.role}
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${user.isTransactionAllowed ? "text-[#BDFE00]" : "text-slate-500"}`}>
                    {user.isTransactionAllowed ? "Active" : "Locked"}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(user._id, user.isTransactionAllowed)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      user.isTransactionAllowed ? "bg-[#BDFE00]" : "bg-white/10"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 transform rounded-full transition-transform ${
                        user.isTransactionAllowed ? "translate-x-6 bg-black" : "translate-x-1 bg-white"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/20 p-8 text-center text-slate-400">
            <p className="text-sm font-bold text-white">No users found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest font-mono text-slate-400 bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 border-b border-white/10">User Profile</th>
                <th className="px-6 py-4 border-b border-white/10 text-center">Role</th>
                <th className="px-6 py-4 border-b border-white/10 text-center">Status</th>
                <th className="px-6 py-4 border-b border-white/10 text-center">Credits</th>
                <th className="px-6 py-4 border-b border-white/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-[#BDFE00] flex items-center justify-center font-bold text-sm shrink-0">
                          {user.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                            <span className="truncate">{user.fullName}</span>
                            {user.isVerified && (
                              <CheckCircle2 size={14} className="text-[#BDFE00] shrink-0" />
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-mono truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleRoleToggle(user._id, user.role)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          user.role === "admin"
                            ? "bg-[#1FBFD8]/10 border border-[#1FBFD8]/30 text-[#1FBFD8] hover:bg-[#1FBFD8]/20"
                            : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"
                        }`}
                        title={user.role === "admin" ? "Remove admin" : "Make admin"}
                      >
                        {user.role === "admin" ? <Shield size={12} /> : <ShieldOff size={12} />}
                        {user.role}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(user._id, user.isTransactionAllowed)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                            user.isTransactionAllowed ? "bg-[#BDFE00]" : "bg-white/10"
                          }`}
                        >
                          <span
                            className={`h-4 w-4 transform rounded-full transition-transform ${
                              user.isTransactionAllowed ? "translate-x-6 bg-black" : "translate-x-1 bg-white"
                            }`}
                          />
                        </button>
                        <span className={`text-[9px] font-mono uppercase tracking-wider ${user.isTransactionAllowed ? "text-[#BDFE00]" : "text-slate-500"}`}>
                          {user.isTransactionAllowed ? "Active" : "Locked"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[#BDFE00] font-mono font-bold text-xs">
                        {user.credits}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsModalOpen(true);
                          }}
                          className="p-2.5 rounded-xl bg-[#BDFE00] text-black hover:bg-[#aef000] hover:shadow-[0_0_15px_rgba(189,254,0,0.3)] transition-all cursor-pointer"
                          title="Add Credits"
                        >
                          <Plus size={16} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user)}
                          className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <p className="text-sm font-bold text-white">No users found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-[#0B0F17] border border-white/10 shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedUser(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#BDFE00]/10 border border-[#BDFE00]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#BDFE00]">
                <ArrowUpRight size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">
                Add Credits
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-1 truncate px-2">
                {selectedUser?.fullName}
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 text-center">
                  Credit Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-3xl font-mono font-bold text-center text-[#BDFE00] focus:outline-none focus:border-[#BDFE00] transition-colors"
                  inputMode="numeric"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="py-3 text-sm font-semibold rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCredits}
                  className="py-3 text-sm font-semibold rounded-xl bg-[#BDFE00] text-black hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] transition-all cursor-pointer"
                >
                  Add Credits
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-[#0B0F17] border border-red-500/20 shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-400">
                <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">Delete User</h3>
              <p className="text-sm text-slate-400 mt-2">
                Are you sure you want to delete{" "}
                <span className="text-white font-semibold">{deleteConfirm.fullName}</span>?
              </p>
              <p className="text-xs text-red-400/80 mt-2 font-mono">
                This will permanently delete all their transactions, budgets, and account data.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="py-3 text-sm font-semibold rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                className="py-3 text-sm font-semibold rounded-xl bg-red-500 text-white hover:bg-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;