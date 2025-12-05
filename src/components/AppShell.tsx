"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation"; 

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const pathname = usePathname(); 

  const isAuthPage = ["/login", "/signup"].includes(pathname);

  if (isAuthPage) {
    return (
      <main className="w-full min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <div className="flex pt-16">

      <div className={`${sidebarOpen ? "block" : "hidden md:hidden"} `}>
         <Sidebar />
      </div>
    
      <main className={`w-full min-h-screen transition-all duration-300 ${sidebarOpen ? "md:pl-64" : "pl-0"}`}>
        {children}
      </main>
    </div>
  );
}