"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";

  return (
    <div className={`min-h-screen transition-colors duration-300 flex items-center justify-center ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 w-full">
        <div className="max-w-5xl mx-auto text-center">
          {/* Header */}
          <div>
            <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight mb-2 ${isDark ? "text-white" : "text-black"}`}>
              Welcome back, {user?.fullName}! 👋
            </h1>
            <p className={`text-lg ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              Manage your finances from here
            </p>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
            <Link
              href="/dashboard/wallet"
              className={`block p-6 rounded-lg border transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800"
                  : "bg-white border-neutral-200 text-black hover:bg-neutral-50"
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="font-semibold">Wallet</h3>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  View your balance and transactions
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/budgets"
              className={`block p-6 rounded-lg border transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800"
                  : "bg-white border-neutral-200 text-black hover:bg-neutral-50"
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold">Budgets</h3>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  Manage your spending limits
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
