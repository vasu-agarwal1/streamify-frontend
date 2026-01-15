"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Menu,  LogOut, User, Settings, LayoutDashboard, Clapperboard } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { RootState } from "@/store/store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import apiClient from "@/helpers/axiosInstance";
import UploadVideoModal from "./UploadVideoModal";
import { toggleSidebar } from "@/store/uiSlice";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname()
  const { status, userData } = useSelector((state: RootState) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    if(!searchQuery.trim()) return

    router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } 
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
        await apiClient.post("/users/logout");
        dispatch(logout());
        router.push("/login");
    } catch (error) {
        console.error("Logout failed", error);
        dispatch(logout());
        router.push("/login");
    }
  };

  const hiddenRoutes = ["/login", "/signup"];

  
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        
        {/* LEFT: Logo & Menu */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => dispatch(toggleSidebar())}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-1">
              <div className="h-3 w-3 rounded-full bg-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">Streamify</span>
          </Link>
        </div>

        {/* CENTER: Search Bar */}
        <div className="hidden w-1/3 items-center gap-2 md:flex">
            <div className="relative w-full">
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown} 
                    type="text" 
                    placeholder="Search videos..." 
                    className="w-full rounded-full bg-muted pl-4 pr-10 focus-visible:ring-1"
                />
                <Button 
                    onClick={handleSearch}
                    size="icon" 
                    variant="ghost" 
                    className="absolute right-0 top-0 h-full rounded-r-full hover:bg-transparent"
                >
                    <Search className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>
        </div>

        {/* RIGHT: Auth Section */}
        <div className="flex items-center gap-2">
          {!isMounted ? (
             <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : (
             status && userData ? (
            <>
              {/* Upload Button (Desktop) */}
                <UploadVideoModal />
              
              {/* USER DROPDOWN MENU */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border border-border">
                      {/* Shows Image if valid, otherwise shows Initial */}
                      <AvatarImage src={userData.avatar} alt={userData.username} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 font-bold text-primary">
                        {userData.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userData.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">@{userData.username}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(`/c/${userData.username}`)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Channel</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Clapperboard className="mr-2 h-4 w-4" />
                    <span>My Content</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}