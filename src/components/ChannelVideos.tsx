"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/helpers/axiosInstance";
import VideoCard, { Video } from "@/components/VideoCard"; // Reuse your card!
import { Loader2 } from "lucide-react";

export default function ChannelVideos({ userId }: { userId: string }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // Fetch videos ONLY for this channel owner
        const response = await apiClient.get(`/videos?userId=${userId}&limit=20`);
        setVideos(response.data.data.docs || []);
      } catch (err) {
        console.error("Error fetching channel videos:", err);
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchVideos();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-purple-600" /></div>;
  }

  if (videos.length === 0) {
    return <div className="text-center py-10 text-gray-500">This channel has no videos yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}