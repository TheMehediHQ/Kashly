/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/app/context/AuthContext";
import React, { useState } from "react";
import {
  LuUser,
  LuMail,
  LuPencil,
  LuX,
  LuCamera,
  LuCircle,
  LuLoader,
  LuStar
} from "react-icons/lu";
import Image from "next/image";
import axios from "axios";

const MyProfile = () => {
  const { user, setUser, loading } = useAuth();

  const [isEditing, setIsEditing] = React.useState(false);
  const [fullName, setFullName] = React.useState(user?.fullName || "");
  const [photoURL, setPhotoURL] = React.useState(user?.photoURL || "");
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string>("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const [avatarError, setAvatarError] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const displayPhotoURL = isEditing ? photoURL : (user?.photoURL || "");
  const displayFullName = isEditing ? fullName : (user?.fullName || "");

  React.useEffect(() => {
    setFullName(user?.fullName || "");
    setPhotoURL(user?.photoURL || "");
  }, [user]);

  React.useEffect(() => {
    setAvatarError(false);
  }, [displayPhotoURL]);

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      setMessage({ type: "error", text: "Full name is required" });
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.put(
        `/api/me`,
        {
          fullName: fullName.trim(),
          photoURL: photoURL || undefined,
        },
        { withCredentials: true }
      );

      setUser(response.data.user);

      setIsEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.fullName || "");
    setPhotoURL(user?.photoURL || "");
    setIsEditing(false);
    setMessage(null);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!preset || !cloudName) {
      setUploadError("Upload service not configured");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData },
      );
      const data = await response.json();
      if (!response.ok) {
        setUploadError(data.error.message);
        return;
      }
      setPhotoURL(data.secure_url);
      setUploadError("");
    } catch (err) {
      setUploadError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen text-white">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="space-y-3">
            <div className="h-10 w-56 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
            <div className="h-5 w-72 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="h-32 bg-white/5" />
            <div className="px-6 sm:px-8 -mt-16 pb-8">
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div className="h-32 w-32 rounded-2xl bg-white/10 animate-pulse" />
                <div className="flex-1 space-y-3 pt-16 sm:pt-4">
                  <div className="h-8 w-48 rounded-lg bg-white/10 animate-pulse" />
                  <div className="h-4 w-64 rounded bg-white/5 animate-pulse" />
                </div>
              </div>

              <div className="h-px mb-8 bg-white/10" />

              <div className="space-y-6 pb-8">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="h-4 w-28 rounded bg-white/10 animate-pulse" />
                    <div className="h-12 w-full rounded-xl bg-white/5 border border-white/10 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || "user"}`;

  return (
    <div className="w-full min-h-screen text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#BDFE00] animate-pulse" />
            ACCOUNT SETTINGS
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            My Profile
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage and personalize your account details
          </p>
        </div>

        {/* Alert Messages */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 border ${
            message.type === "success"
              ? "bg-[#BDFE00]/10 text-[#BDFE00] border-[#BDFE00]/30"
              : "bg-red-500/10 text-red-400 border-red-500/30"
          }`}>
            <LuCircle size={18} />
            <span className="font-medium text-sm">{message.text}</span>
          </div>
        )}

        {/* Main Profile Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-[#BDFE00]/10 via-transparent to-[#1FBFD8]/10 border-b border-white/5" />

          {/* Profile Content */}
          <div className="px-6 sm:px-8">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6 -mt-16 mb-8">
              <div className="relative">
                <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-4 border-[#0B0F17] bg-slate-800 shadow-xl">
                  <Image
                    src={!avatarError && displayPhotoURL ? displayPhotoURL : defaultAvatar}
                    alt="User Profile"
                    fill
                    className="object-cover"
                    sizes="128px"
                    priority
                    unoptimized
                    onError={() => setAvatarError(true)}
                  />
                </div>
                {isEditing && (
                  <>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute bottom-2 right-2 p-2 rounded-full bg-[#BDFE00] text-black shadow-lg hover:bg-[#aef000] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isUploading ? (
                        <LuLoader size={16} className="animate-spin" />
                      ) : (
                        <LuCamera size={16} />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {fullName || user?.fullName}
                </h2>
                <p className="text-sm text-slate-400 mb-3 font-mono">
                  {user?.email}
                </p>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/30 text-[#BDFE00] text-xs font-semibold">
                    <LuCircle size={12} /> Verified
                  </span>
                  {user?.role === "admin" && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1FBFD8]/10 border border-[#1FBFD8]/30 text-[#1FBFD8] text-xs font-semibold">
                      <LuStar size={12} /> Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px mb-8 bg-white/10" />

            {/* Editable Fields */}
            <div className="space-y-6 pb-8">
              {/* Full Name Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2.5 text-slate-300">
                  <LuUser size={18} className="text-[#BDFE00]" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#BDFE00]/60 transition-colors"
                    autoFocus
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium">
                    {displayFullName}
                  </div>
                )}
              </div>

              {/* Photo URL Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2.5 text-slate-300">
                  <LuCamera size={18} className="text-[#BDFE00]" />
                  Avatar
                </label>
                {isEditing ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <LuLoader size={16} className="animate-spin text-[#BDFE00]" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <LuCamera size={16} className="text-[#BDFE00]" />
                          Choose Image
                        </>
                      )}
                    </button>
                    {uploadError && (
                      <p className="text-red-400 text-sm">{uploadError}</p>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm">
                    {displayPhotoURL ? "Custom avatar configured" : "Using default avatar"}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2.5 text-slate-300">
                  <LuMail size={18} className="text-[#BDFE00]" />
                  Email Address
                </label>
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 cursor-not-allowed opacity-70">
                  {user?.email}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Email addresses are managed securely and cannot be changed directly.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pb-8 pt-4 border-t border-white/10">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-[#BDFE00] text-black hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <LuLoader size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <LuCircle size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white font-semibold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <LuX size={18} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-[#BDFE00] text-black hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)] transition-all active:scale-95 cursor-pointer"
                >
                  <LuPencil size={18} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;