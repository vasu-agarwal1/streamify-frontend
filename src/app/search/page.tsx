"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; 
import apiClient from "@/helpers/axiosInstance";
import VideoCard, { Video } from "@/components/VideoCard";
import { Loader2, SearchX } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query"); // 1. Grab the search text from URL

  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSearchResult = async () => {
        if(!query) return

        try {
            setLoading(true)

            const response = await apiClient.get(`/videos?query=${encodeURIComponent(query)}`)

            const res = response.data.data.docs || []
            setVideos(res)

        } catch (error) {
            console.error("search failed :", error)
        }finally{
            setLoading(false)
        }
    }

    fetchSearchResult()
  }, [query])

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-black text-white">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-black text-white px-4 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for <span className="text-purple-300">"{query}"</span>
      </h1>

      {videos.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
          <SearchX className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-lg">No videos found matching your search.</p>
          <p className="text-sm">Try different keywords.</p>
        </div>
      ) : (
        // Results Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}