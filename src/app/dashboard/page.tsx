"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import apiClient from "@/helpers/axiosInstance";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UploadVideoModal from "@/components/UploadVideoModal"; // Reuse this!

export default function Dashboard() {
  // 1. Get User Info from Redux (Instant Load)
  const { userData } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [videos, setVideos] = useState([]);

  // 2. Fetch Dashboard Data (Stats + Videos)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // We will fill this in Step 3
        // const statsRes = await apiClient.get("/dashboard/stats");
        // const videosRes = await apiClient.get(`/dashboard/videos/${userData?._id}`);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData?._id) {
        fetchDashboardData();
    }
  }, [userData]);

  if (!userData) {
      return <div className="text-white text-center mt-20">Please log in to view your studio.</div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* SECTION 1: HEADER & COVER IMAGE */}
      <div className="relative w-full h-48 md:h-64 bg-gray-900">
        {/* Cover Image */}
        {userData.coverImage ? (
            <img 
                src={userData.coverImage} 
                alt="Cover" 
                className="w-full h-full object-cover opacity-80"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
                No Cover Image
            </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />

        {/* Profile Info (Floating) */}
        <div className="absolute -bottom-10 left-8 flex items-end gap-4">
            <Avatar className="w-24 h-24 border-4 border-black">
                <AvatarImage src={userData.avatar} />
                <AvatarFallback>{userData.username[0]}</AvatarFallback>
            </Avatar>
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-white">{userData.fullName}</h1>
                <p className="text-gray-400">@{userData.username}</p>
            </div>
        </div>
      </div>

      {/* SECTION 2: CONTENT AREA */}
      <div className="px-8 mt-16 pb-10 space-y-8">
        
        {/* ACTION BAR */}
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Channel Dashboard</h2>
            <UploadVideoModal /> {/* Reuse our Upload Modal here too! */}
        </div>

        {/* STATS CARDS (Placeholder) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-400">Total Views</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">Loading...</div></CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-400">Total Subscribers</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">Loading...</div></CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-400">Total Likes</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">Loading...</div></CardContent>
            </Card>
        </div>

        {/* VIDEO TABLE (Placeholder) */}
        <div className="border border-gray-800 rounded-lg p-10 text-center text-gray-500">
            Video Table Coming Soon...
        </div>

      </div>
    </div>
  );
}