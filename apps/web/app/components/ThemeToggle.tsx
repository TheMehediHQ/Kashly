"use client";

import { useTheme } from "../context/ThemeContext";
import { FiMoon, FiSun, FiMonitor } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, setTheme, effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";

  return (
    <div className={`flex items-center p-1 rounded-xl border transition-colors ${
      isDark ? "border-slate-700 bg-slate-800" : "border-slate-300 bg-slate-100"
    }`}>
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 sm:p-2 rounded-lg transition-all ${
          theme === "light"
            ? "bg-white text-slate-700 shadow-sm"
            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        }`}
        aria-label="Light theme"
      >
        <FiSun size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 sm:p-2 rounded-lg transition-all ${
          theme === "system"
            ? "bg-white text-slate-700 shadow-sm"
            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        }`}
        aria-label="System theme"
      >
        <FiMonitor size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 sm:p-2 rounded-lg transition-all ${
          theme === "dark"
            ? "bg-white text-slate-700 shadow-sm"
            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        }`}
        aria-label="Dark theme"
      >
        <FiMoon size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>
    </div>
  );
}
