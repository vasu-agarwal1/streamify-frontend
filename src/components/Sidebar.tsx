"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { 
  Home, 
  Twitter, 
  History, 
  ThumbsUp, 
  FolderHeart, 
  UserCheck, 
  Settings, 
  HelpCircle, 
  LayoutDashboard
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const username = useSelector((state: RootState) => state.auth.userData?.username);


  const sidebarItems = [
    {
      icon: Home,
      label: "Home",
      href: "/",
    },
    {
      icon: Twitter, 
      label: "Tweets",
      href: "/tweets",
    },
    {
      icon: History,
      label: "History",
      href: "/history",
    },
    {
      icon: ThumbsUp,
      label: "Liked Videos",
      href: "/liked",
    },
    {
      icon: FolderHeart,
      label: "Collections",
      href: "/playlists",
    },
    {
      icon: UserCheck,
      label: "Subscribers",
      href: "/subscriptions",
    },
    // We only add "My Channel" if the user is logged in
    ...(username ? [{
      icon: UserCheck, // Or a different icon
      label: "My Channel",
      href: `/c/${username}`,
    }] : []),
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: HelpCircle,
      label: "Support",
      href: "/support",
    },
  ];

  // 2. RENDER LOGIC
  // We use "hidden md:flex" to hide it on mobile and show on desktop
  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 hidden md:flex flex-col border-r border-border bg-black/95 text-white overflow-y-auto">
      <div className="flex flex-col gap-2 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-colors
                ${
                  isActive 
                    ? "bg-purple-600 text-white"  // Active Style
                    : "text-gray-400 hover:bg-gray-800 hover:text-white" // Inactive Style
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">
          © 2025 Streamify Inc.
          <br />
          All rights reserved.
        </p>
      </div>
    </aside>
  );
}