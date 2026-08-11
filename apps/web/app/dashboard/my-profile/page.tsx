/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";
import React, { useState } from "react";
import { 
  LuUser, 
  LuMail, 
  LuPencil, 
  LuX, 
  LuCamera,
  LuCircle,
  LuLoader,
  LuStar,
  LuLock,
  LuEye,
  LuEyeOff
} from "react-icons/lu";
import Image from "next/image";
import axios from "axios";

const MyProfile = () => {
  const { user, setUser, loading } = useAuth();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [fullName, setFullName] = React.useState(user?.fullName || "");
  const [photoURL, setPhotoURL] = React.useState(user?.photoURL || "");
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string>("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const [avatarError, setAvatarError] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Source of truth for what to display:
  // - Not editing → read straight from the user object so it is never stale
  //   (fixes the brief "ghost avatar" flash while auth is hydrating).
  // - Editing → use the local draft so upload preview and cancel still work.
  const displayPhotoURL = isEditing ? photoURL : (user?.photoURL || "");
  const displayFullName = isEditing ? fullName : (user?.fullName || "");

  React.useEffect(() => {
    setFullName(user?.fullName || "");
    setPhotoURL(user?.photoURL || "");
  }, [user]);

  // Reset the avatar error flag whenever the displayed photo URL changes
  // (new upload, profile save, or re-login).
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
      // Update profile
      const response = await axios.put(
        `/api/me`,
        {
          fullName: fullName.trim(),
          photoURL: photoURL || undefined,
        },
        { withCredentials: true }
      );

      setUser(response.data.user);

      // Update password if provided
      if (oldPassword && newPassword) {
        await axios.put(
          `/api/me/password`,
          {
            oldPassword,
            newPassword,
          },
          { withCredentials: true }
        );
      }

      setIsEditing(false);
      setOldPassword("");
      setNewPassword("");
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
    setOldPassword("");
    setNewPassword("");
    setShowOldPassword(false);
    setShowNewPassword(false);
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
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-black" : "bg-white"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="space-y-3">
              <div className={`h-10 w-56 rounded-lg animate-pulse ${isDark ? "bg-neutral-800" : "bg-neutral-200"}`} />
              <div className={`h-5 w-72 rounded-lg animate-pulse ${isDark ? "bg-neutral-900" : "bg-neutral-100"}`} />
            </div>

            <div className={`rounded-3xl border overflow-hidden ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"}`}>
              <div className={`h-32 ${isDark ? "bg-neutral-900/40" : "bg-neutral-100"}`} />
              <div className="px-6 sm:px-8 -mt-16 pb-8">
                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                  <div className={`h-32 w-32 rounded-2xl animate-pulse ${isDark ? "bg-neutral-700" : "bg-neutral-200"}`} />
                  <div className="flex-1 space-y-3 pt-16 sm:pt-4">
                    <div className={`h-8 w-48 rounded-lg animate-pulse ${isDark ? "bg-neutral-700" : "bg-neutral-200"}`} />
                    <div className={`h-4 w-64 rounded animate-pulse ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`} />
                    <div className="flex gap-2">
                      <div className={`h-7 w-24 rounded-full animate-pulse ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`} />
                      <div className={`h-7 w-20 rounded-full animate-pulse ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`} />
                    </div>
                  </div>
                </div>

                <div className={`h-px mb-8 ${isDark ? "bg-neutral-800" : "bg-neutral-200"}`} />

                <div className="space-y-6 pb-8">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className={`h-4 w-28 rounded animate-pulse ${isDark ? "bg-neutral-700" : "bg-neutral-200"}`} />
                      <div className={`h-12 w-full rounded-xl animate-pulse ${isDark ? "bg-neutral-800" : "bg-white border border-neutral-200"}`} />
                    </div>
                  ))}
                </div>

                <div className={`h-px mb-4 ${isDark ? "bg-neutral-800" : "bg-neutral-200"}`} />
                <div className={`h-12 w-full rounded-xl animate-pulse ${isDark ? "bg-neutral-700" : "bg-neutral-200"}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || "user"}`;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight mb-2 ${isDark ? "text-white" : "text-black"}`}>
              My Profile
            </h1>
            <p className={`text-lg ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              Manage and personalize your account
            </p>
          </div>

          {/* Alert Messages */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? isDark ? "bg-emerald-950 text-emerald-200 border border-emerald-800" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : isDark ? "bg-red-950 text-red-200 border border-red-800" : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {message.type === "success" ? <LuCircle size={20} /> : <LuCircle size={20} />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Main Profile Card */}
          <div className={`rounded-3xl border mb-8 overflow-hidden transition-all ${
            isDark
              ? "border-neutral-800 bg-neutral-900/50"
              : "border-neutral-200 bg-neutral-50"
          }`}>
            {/* Header Background */}
            <div className={`h-32 ${isDark ? "bg-gradient-to-r from-neutral-900/30 to-neutral-800/30" : "bg-gradient-to-r from-neutral-50 to-neutral-100"}`}></div>

            {/* Profile Content */}
            <div className="px-6 sm:px-8">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col sm:flex-row gap-6 -mt-16 mb-8">
                <div className="relative">
                  <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-4 shadow-lg" style={{borderColor: isDark ? "#1f2937" : "#fff"}}>
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
                        className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-all ${
                          isUploading
                            ? "bg-neutral-500 cursor-not-allowed"
                            : isDark ? "bg-neutral-700 hover:bg-neutral-800" : "bg-neutral-300 hover:bg-neutral-400"
                        } text-white`}
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
                  <h2 className={`text-3xl font-bold mb-1 ${isDark ? "text-white" : "text-black"}`}>
                    {fullName || user?.fullName}
                  </h2>
                  <p className={`text-sm mb-3 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 text-sm font-medium">
                      <LuCircle size={14} /> Verified
                    </span>
                    {user?.role === "admin" && (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 text-purple-600 text-sm font-medium">
                        <LuStar size={14} /> Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className={`h-px mb-8 ${isDark ? "bg-neutral-800" : "bg-neutral-200"}`}></div>

              {/* Editable Fields */}
              <div className="space-y-6 pb-8">
                {/* Full Name Field */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                    <LuUser size={18} />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:border-neutral-500 ${
                        isDark
                          ? "bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                          : "bg-white border-neutral-300 text-black placeholder:text-neutral-400"
                      }`}
                      autoFocus
                    />
                  ) : (
                    <div className={`px-4 py-3 rounded-xl font-medium ${isDark ? "bg-neutral-800 text-white" : "bg-neutral-100 text-black"}`}>
                      {displayFullName}
                    </div>
                  )}
                </div>

                {/* Photo URL Field */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                    <LuCamera size={18} />
                    Avatar
                  </label>
                  {isEditing ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                          isUploading
                            ? "opacity-50 cursor-not-allowed"
                            : isDark
                              ? "border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white"
                              : "border-neutral-300 bg-white hover:bg-neutral-100 text-black"
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <LuLoader size={16} className="animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <LuCamera size={16} />
                            Choose Image
                          </>
                        )}
                      </button>
                      {uploadError && (
                        <p className="text-red-500 text-sm">{uploadError}</p>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className={`px-4 py-3 rounded-xl text-sm ${isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-600"}`}>
                      {displayPhotoURL ? "Custom avatar set" : "Using default avatar"}
                    </div>
                  )}
                  {isEditing && (
                    <p className={`text-xs mt-2 ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                      Upload an image file to set your avatar.
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                    <LuMail size={18} />
                    Email Address
                  </label>
                  <div className={`px-4 py-3 rounded-xl cursor-not-allowed opacity-70 ${isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-600"}`}>
                    {user?.email}
                  </div>
                  <p className={`text-xs mt-2 ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                    Email cannot be changed. Contact support for assistance.
                  </p>
                </div>

                {/* Password Fields */}
                {isEditing && (
                  <>
                    <div>
                      <label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                        <LuLock size={18} />
                        Change Password
                      </label>
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type={showOldPassword ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Current password"
                            className={`w-full px-4 py-3 pr-10 rounded-xl border-2 transition-all focus:outline-none focus:border-neutral-500 ${
                              isDark
                                ? "bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                                : "bg-white border-neutral-300 text-black placeholder:text-neutral-400"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                          >
                            {showOldPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password (min 8 characters)"
                            className={`w-full px-4 py-3 pr-10 rounded-xl border-2 transition-all focus:outline-none focus:border-neutral-500 ${
                              isDark
                                ? "bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                                : "bg-white border-neutral-300 text-black placeholder:text-neutral-400"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                          >
                            {showNewPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                          </button>
                        </div>
                      </div>
                      <p className={`text-xs mt-2 ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                        Leave blank to keep current password. New password must be at least 8 characters.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pb-8 pt-4 border-t" style={{borderColor: isDark ? "#282828" : "#e5e7eb"}}>
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                        isSaving
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:shadow-lg active:scale-95"
                      } ${
                        isDark
                          ? "bg-white text-black hover:bg-neutral-100"
                          : "bg-black text-white hover:bg-neutral-900"
                      }`}
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
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                        isDark
                          ? "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                          : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                      } disabled:opacity-50`}
                    >
                      <LuX size={18} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all hover:shadow-lg active:scale-95 ${
                      isDark
                        ? "bg-white text-black hover:bg-neutral-100"
                        : "bg-black text-white hover:bg-neutral-900"
                    }`}
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
    </div>
  );
};

export default MyProfile;
