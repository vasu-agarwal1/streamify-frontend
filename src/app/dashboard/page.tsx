"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/helpers/axiosInstance";
import { Loader2, Eye, Heart, Users, Video as VideoIcon, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Switch } from "@/components/ui/switch"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UploadVideoModal from "@/components/UploadVideoModal";

interface DashboardStats {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  totalSubscribers: number;
}

interface Video {
  _id: string;
  title: string;
  isPublished: boolean;
  createdAt: string;
  views: number;
  likesCount?: number; 
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalSubscribers: 0,
  });
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
      
        const statsRes = await apiClient.get("/dashboard/stats");
        setStats(statsRes.data.data);

        
        const videosRes = await apiClient.get("/dashboard/videos");
        
        const videoList = Array.isArray(videosRes.data.data) ? videosRes.data.data : videosRes.data.data.docs || [];
        setVideos(videoList);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  
  const handleDelete = async (videoId: string) => {
      if(!confirm("Are you sure you want to delete this video?")) return;
      
      setVideos(prev => prev.filter(v => v._id !== videoId)); 
      try {
          await apiClient.delete(`/videos/${videoId}`);
      } catch (error) {
          console.error("Failed to delete",error);
      
      }
  }


  const handleTogglePublish = async (videoId: string, currentStatus: boolean) => {
      
      setVideos(prev => prev.map(v => 
          v._id === videoId ? { ...v, isPublished: !currentStatus } : v
      ));

      try {
          await apiClient.patch(`/videos/toggle/${videoId}`);
      } catch (error) {
          console.error("Failed to toggle publish status",error);
          
          setVideos(prev => prev.map(v => 
            v._id === videoId ? { ...v, isPublished: currentStatus } : v
        ));
      }
  }

  if (loading) {
    return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-purple-600 w-10 h-10" /></div>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold">Channel Dashboard</h1>
                <p className="text-gray-400">Welcome back to your studio</p>
            </div>
            <UploadVideoModal />
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon={<Eye className="text-blue-400" />} label="Total Views" value={stats.totalViews} />
            <StatsCard icon={<Users className="text-green-400" />} label="Subscribers" value={stats.totalSubscribers} />
            <StatsCard icon={<Heart className="text-pink-400" />} label="Total Likes" value={stats.totalLikes} />
            <StatsCard icon={<VideoIcon className="text-purple-400" />} label="Total Videos" value={stats.totalVideos} />
        </div>

        {/* VIDEOS TABLE */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800">
                <h2 className="font-semibold text-lg">Video Management</h2>
            </div>
            
            <Table>
                <TableHeader className="bg-gray-950">
                    <TableRow className="hover:bg-gray-950 border-gray-800">
                        <TableHead className="text-gray-400 w-[100px]">Status</TableHead>
                        <TableHead className="text-gray-400">Video</TableHead>
                        <TableHead className="text-gray-400">Date Uploaded</TableHead>
                        <TableHead className="text-gray-400 text-right">Views</TableHead>
                        <TableHead className="text-gray-400 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {videos.map((video) => (
                        <TableRow key={video._id} className="border-gray-800 hover:bg-gray-800/50">
                            {/* Status Toggle */}
                            <TableCell>
                                <Switch 
                                    checked={video.isPublished}
                                    onCheckedChange={() => handleTogglePublish(video._id, video.isPublished)}
                                    className="data-[state=checked]:bg-green-500"
                                />
                            </TableCell>
                            
                            {/* Title */}
                            <TableCell className="font-medium text-white">
                                {video.title}
                            </TableCell>
                            
                            {/* Date */}
                            <TableCell className="text-gray-400">
                                {new Date(video.createdAt).toLocaleDateString()}
                            </TableCell>
                            
                            {/* Views */}
                            <TableCell className="text-right text-white">
                                {video.views}
                            </TableCell>
                            
                            {/* Actions */}
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" className="hover:text-blue-400">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="hover:text-red-500"
                                        onClick={() => handleDelete(video._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            {videos.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No videos found. Upload your first video!
                </div>
            )}
        </div>

      </div>
    </div>
  );
}

function StatsCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
    return (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-gray-950 rounded-full border border-gray-800">
                {icon}
            </div>
            <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
        </div>
    )
}