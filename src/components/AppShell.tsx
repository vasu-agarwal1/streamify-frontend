"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  // Read the state from Redux
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);

  return (
    <div className="flex pt-16">
      {/* 1. The Sidebar Logic */}
      {/* We control visibility using the Redux state */}
      <div className={`${sidebarOpen ? "block" : "hidden md:hidden"} `}>
         <Sidebar />
      </div>
      
      {/* 2. The Main Content Logic */}
      {/* If sidebar is open, push content right (md:pl-64). If closed, full width (pl-0) */}
      <main className={`w-full min-h-screen transition-all duration-300 ${sidebarOpen ? "md:pl-64" : "pl-0"}`}>
        {children}
      </main>
    </div>
  );
}