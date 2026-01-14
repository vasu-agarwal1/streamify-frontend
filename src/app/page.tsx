"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/helpers/axiosInstance";
import VideoCard, { Video } from "@/components/VideoCard";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  
  const { ref, inView } = useInView();

  
  const fetchVideos = async (pageNum: number) => {
    try {
      if (pageNum === 1) setLoading(true);

    
      const response = await apiClient.get(`/videos?page=${pageNum}&limit=12`);
      
      const newVideos = response.data.data.docs || [];
      const pagination = response.data.data; 


      setVideos((prev) => (pageNum === 1 ? newVideos : [...prev, ...newVideos]));
      
      
      setHasMore(pagination.hasNextPage);

    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Failed to load videos.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchVideos(1);
  }, []);

  
  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVideos(nextPage);
    }
  }, [inView, hasMore]); 

  if (loading && page === 1) {
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
      
      {videos.length === 0 && !loading ? (
        <div className="text-center mt-20 text-gray-500">No videos found. Be the first to upload!</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>

          
          {hasMore && (
            <div ref={ref} className="flex justify-center mt-8 p-4">
              <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
            </div>
          )}

          {!hasMore && videos.length > 0 && (
            <p className="text-center text-gray-500 mt-12 pb-8">
              You have reached the end! 🎬
            </p>
          )}
        </>
      )}
    </main>
  );
}
