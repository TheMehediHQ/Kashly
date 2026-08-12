"use client";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";

export function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide navbar and footer on dashboard pages
  const isDashboardPage = pathname?.startsWith("/dashboard");

  return (
    <div className="flex flex-col min-h-screen bg-(--background) text-(--foreground) transition-colors duration-300">
      {!isDashboardPage && <Navbar />}
      <div >
        {children}
      </div>
      {!isDashboardPage && <Footer />}
    </div>
  );
}
