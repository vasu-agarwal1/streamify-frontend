"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/helpers/axiosInstance";
import VideoCard, { Video } from "@/components/VideoCard"; // <--- Import the Card
import { Loader2 } from "lucide-react";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // GET Request to your backend
        const response = await apiClient.get("/videos"); 
        
        console.log("Videos Fetched:", response.data); // Debug log
        
        // Based on your controller logic, the docs are inside data.docs
        setVideos(response.data.data.docs || []); 
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
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
    <main className="min-h-screen bg-black text-white px-4 lg:px-8 py-6">
      {/* Grid Layout for Cards */}
      {videos.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">No videos found. Be the first to upload!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </main>
  );
}