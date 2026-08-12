"use client";

import { AuthProvider } from "./context/AuthContext";

import { LayoutContent } from "./layout-content";
import { Toaster } from "react-hot-toast";

export function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   
      <AuthProvider>
        <Toaster position="top-right" />
        <LayoutContent>{children}</LayoutContent>
      </AuthProvider>
    
  );
}
