"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; 
import { useSelector } from "react-redux"; 
import apiClient from "@/helpers/axiosInstance";
import { Loader2, ThumbsUp, BellRing, Check } from "lucide-react"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Video } from "@/components/VideoCard"; 
import { RootState } from "@/store/store"; 
import VideoComments from "@/components/VideoComments";
import Link from "next/link"; 

export default function VideoPlayerPage() {
  const { videoId } = useParams();
  const router = useRouter();
  
  // Redux: Check if user is logged in
  const { status: isLoggedIn } = useSelector((state: RootState) => state.auth);

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId) return;
      try {
        setLoading(true);
        const response = await apiClient.get(`/videos/${videoId}`);
        setVideo(response.data.data);
        
        setIsSubscribed(response.data.data.isSubscribed || false);
        setIsLiked(response.data.data.isLiked || false);
        setLikesCount(response.data.data.likesCount || 0);
        
      } catch (err: any) {
        console.error("Error fetching video:", err);
        setError("Failed to load video.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);


  const handleToggleLike = async () => {
    if(!isLoggedIn){
       router.push('/login');
       return;
    }

    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(prev => !prev);

    try {
        await apiClient.post(`/likes/toggle/v/${videoId}`);
    } catch (error) {
        console.error("Failed to toggle like");
        setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
        setIsLiked(prev => !prev);
    }
  };

  const handleSubscribe = async () => {
    if(!isLoggedIn){
       router.push('/login');
       return;
    }

    setIsSubscribed(prev => !prev);

    try {
      await apiClient.get(`/subscriptions/c/${video?.owner._id}`);
    } catch (error) {
      console.error("Failed to toggle subscription");
      setIsSubscribed(prev => !prev);
    }
  }

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
        

        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
          <video
            src={video.videoFile}
            poster={video.thumbnail}
            controls
            autoPlay
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>


        <div className="space-y-2">
           <h1 className="text-2xl font-bold">{video.title}</h1>
           <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">
                 {video.views} views • Uploaded on {new Date(video.createdAt).toLocaleDateString()}
              </span>
              
              <div className="flex gap-2">
   
                 <Button 
                     variant="secondary" 
                     className={`gap-2 transition-all duration-200 ${
                     isLiked 
                     ? "bg-purple-600 hover:bg-purple-700 text-white" 
                     : "hover:bg-gray-800" 
                    }`}
                    onClick={handleToggleLike} 
                 >
                    <ThumbsUp className={`h-4 w-4 ${isLiked ? "fill-white" : ""}`} /> 
                    {isLiked ? "Liked" : "Like"} 
                    <span className="ml-1 pl-2 border-l border-white/20 text-xs">
                      {likesCount}
                    </span>
                 </Button>
              </div>
           </div>
        </div>


        <div className="mt-4 flex flex-col sm:flex-row sm:items-start justify-between p-4 rounded-xl bg-gray-900/50 border border-gray-800 gap-4">
           
           <div className="flex gap-4">
               {/* 2. Clickable Avatar */}
               <Link href={`/c/${video.owner.username}`}>
                   <Avatar className="h-12 w-12 border border-gray-700 cursor-pointer hover:opacity-80 transition-opacity">
                      <AvatarImage src={video.owner.avatar} />
                      <AvatarFallback>{video.owner.username[0]}</AvatarFallback>
                   </Avatar>
               </Link>

               <div className="flex flex-col gap-1">
                  {/* 2. Clickable Name */}
                  <Link href={`/c/${video.owner.username}`}>
                      <h3 className="font-semibold text-white text-lg hover:text-purple-400 transition-colors cursor-pointer">
                         {video.owner.fullName}
                      </h3>
                  </Link>
                  <p className="text-gray-400 text-sm whitespace-pre-wrap leading-relaxed">
                     {video.description}
                  </p>
               </div>
           </div>

           <Button 
               variant={isSubscribed ? "secondary" : "default"} 
               className={`gap-2 min-w-[140px] ${!isSubscribed ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}`}
               onClick={handleSubscribe}
           >
               {isSubscribed ? <Check className="h-4 w-4"/> : <BellRing className="h-4 w-4"/>}
               {isSubscribed ? "Subscribed" : "Subscribe"}
           </Button>

        </div>

        <div className="mt-6 border-t border-gray-800 pt-6">
          <VideoComments videoId={videoId as string} />
        </div>  

      </div>
    </div>
  );
}