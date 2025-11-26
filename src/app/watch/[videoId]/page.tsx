"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Hook to get the ID from URL
import apiClient from "@/helpers/axiosInstance";
import { Loader2, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Video } from "@/components/VideoCard"; // Re-using the interface

export default function VideoPlayerPage() {
  const { videoId } = useParams(); // Get ID from URL
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId) return;
      try {
        setLoading(true);
        const response = await apiClient.get(`/videos/${videoId}`);
        console.log("Single Video Data:", response.data);
        setVideo(response.data.data);
      } catch (err: any) {
        console.error("Error fetching video:", err);
        setError("Failed to load video.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-black text-white">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !video) {
    return <div className="text-center text-red-500 mt-20">{error || "Video not found"}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 lg:px-8 py-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        
        {/* VIDEO PLAYER */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
          <video
            src={video.videoFile} // The URL from Cloudinary
            poster={video.thumbnail}
            controls
            autoPlay
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* TITLE & INFO */}
        <div className="space-y-2">
           <h1 className="text-2xl font-bold">{video.title}</h1>
           <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">
                 {video.views} views • Uploaded on {new Date(video.createdAt).toLocaleDateString()}
              </span>
              
              <div className="flex gap-2">
                 <Button variant="secondary" className="gap-2">
                    <ThumbsUp className="h-4 w-4" /> Like
                 </Button>
              </div>
           </div>
        </div>

        {/* CHANNEL INFO & DESCRIPTION */}
        <div className="mt-4 flex gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
           {/* Avatar */}
           <Avatar className="h-12 w-12 border border-gray-700">
              <AvatarImage src={video.owner.avatar} />
              <AvatarFallback>{video.owner.username[0]}</AvatarFallback>
           </Avatar>

           <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-white text-lg">
                 {video.owner.fullName}
              </h3>
              <p className="text-gray-400 text-sm whitespace-pre-wrap leading-relaxed">
                 {video.description}
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}