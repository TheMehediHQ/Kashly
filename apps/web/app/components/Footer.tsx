"use client";

import ThemeToggle from "./ThemeToggle";

export default function Footer() {
  return (
    <footer className="bg-(--background) text-(--muted-foreground) transition-colors duration-300 py-4 border-t border-(--border)">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <p>&copy; 2026 MoneyFlow. All rights reserved.</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
