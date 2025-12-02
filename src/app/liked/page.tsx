"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/helpers/axiosInstance";
import VideoCard, { Video } from "@/components/VideoCard";
import { Loader2 } from "lucide-react";

export default function LikedVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        setLoading(true);
        // 1. Call the specific "Liked Videos" endpoint
        const response = await apiClient.get("/likes/videos");
        
        console.log("Liked Videos:", response.data); // Debugging
        
        // 2. Extract the videos. 
        // Based on your controller, it returns the array directly in response.data.data
        // (It is NOT paginated like the home feed, so no ".docs")
        setVideos(response.data.data || []);
        
      } catch (err) {
        console.error("Error fetching liked videos:", err);
        setError("Failed to load liked videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-black text-white">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-20">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>
      
      {videos.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p>You haven't liked any videos yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}