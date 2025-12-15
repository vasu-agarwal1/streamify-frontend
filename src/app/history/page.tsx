"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/helpers/axiosInstance";
import VideoCard, { Video } from "@/components/VideoCard"; 
import { Loader2, History } from "lucide-react";

export default function HistoryPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/users/history`);
        console.log("FRONTEND RECEIVED:", response.data);
        
        // FIX: Backend returns the array directly, no ".docs"
        // If the array is empty or undefined, default to []
        setVideos(response.data.data || []);
        
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Loader2 className="animate-spin text-purple-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
            <History className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold">Watch History</h1>
        </div>

        {/* Empty State */}
        {videos.length === 0 ? (
           <div className="text-center py-20 text-gray-500">
              <p className="text-xl">You haven&apos;t watched any videos yet.</p>
           </div>
        ) : (
           /* Video Grid */
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
           </div>
        )}
      </div>
    </div>
  );
}