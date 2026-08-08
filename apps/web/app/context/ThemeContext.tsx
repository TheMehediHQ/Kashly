/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useLayoutEffect, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: "light" | "dark"; // The actual theme being used
  isMounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "system";
  const saved = localStorage.getItem("theme");
  return saved === "light" || saved === "dark" || saved === "system"
    ? saved
    : "system";
};

const resolveEffectiveTheme = (themeToApply: Theme): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  if (themeToApply === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return themeToApply;
};

const freezeThemeTransitions = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.add("theme-switching");
  window.setTimeout(() => {
    root.classList.remove("theme-switching");
  }, 180);
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  // Keep initial client render aligned with server render to prevent hydration mismatches.
  const [theme, setThemeState] = useState<Theme>("system");
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("light");

  const applyTheme = (themeToApply: Theme) => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const effectiveThemeValue = resolveEffectiveTheme(themeToApply);

    // Apply to HTML
    document.documentElement.classList.toggle("dark", effectiveThemeValue === "dark");
    setEffectiveTheme(effectiveThemeValue);
  };

  // Load and apply saved theme before first paint on client
  useLayoutEffect(() => {
    const themeToSet = getInitialTheme();
    setThemeState(themeToSet);
    applyTheme(themeToSet);
    setIsMounted(true);
  }, []);

  // Apply theme on mount and when theme changes
  useLayoutEffect(() => {
    if (!isMounted) return;
    applyTheme(theme);
  }, [theme, isMounted]);

  const setTheme = (newTheme: Theme) => {
    if (newTheme === theme) return;
    freezeThemeTransitions();
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Listen for system theme changes
  useEffect(() => {
    if (!isMounted || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      applyTheme("system");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, isMounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme, isMounted }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return default theme if context not available
    return {
      theme: "system" as Theme,
      setTheme: () => {},
      effectiveTheme: "light" as const,
      isMounted: false,
    };
  }
  return context;
};
