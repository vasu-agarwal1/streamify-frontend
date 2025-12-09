"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import apiClient from "@/helpers/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, UserPlus, UserCheck } from "lucide-react";
import { RootState } from "@/store/store";
import ChannelVideos from "@/components/ChannelVideos";

// Define the shape of the Channel Profile based on your Backend
interface ChannelProfile {
  _id: string;
  username: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  subscribersCount: number;
  channelsSubscribedToCount: number;
  isSubscribed: boolean;
}

export default function ChannelPage() {
  const { username } = useParams(); // Get username from URL
  const currentUser = useSelector((state: RootState) => state.auth.userData);
  
  const [channel, setChannel] = useState<ChannelProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Channel Profile
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setLoading(true);
        // Ensure your backend route matches this!
        const response = await apiClient.get(`/users/c/${username}`);
        setChannel(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Channel not found");
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchChannel();
  }, [username]);

  // Handle Subscribe (Optimistic UI)
  const handleToggleSubscribe = async () => {
      if (!channel) return;
      
      // 1. Optimistic Update
      const oldIsSubscribed = channel.isSubscribed;
      const oldCount = channel.subscribersCount;

      setChannel(prev => prev ? ({
          ...prev,
          isSubscribed: !prev.isSubscribed,
          subscribersCount: prev.isSubscribed ? prev.subscribersCount - 1 : prev.subscribersCount + 1
      }) : null);

      try {
          await apiClient.get(`/subscriptions/c/${channel._id}`);
      } catch (error) {
          console.error("Failed to subscribe");
          setChannel(prev => prev ? ({
            ...prev,
            isSubscribed: oldIsSubscribed,
            subscribersCount: oldCount
        }) : null);
      }
  };

  if (loading) {
    return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-purple-600 w-10 h-10" /></div>;
  }

  if (error || !channel) {
    return <div className="text-center mt-20 text-red-500">{error || "Channel does not exist"}</div>;
  }

  // Check if this is MY OWN profile
  const isMyChannel = currentUser?.username === channel.username;

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* ZONE 1: HEADER */}
      <div className="relative w-full h-48 md:h-64 bg-gray-900">
          {/* Cover Image */}
          {channel.coverImage && (
              <img src={channel.coverImage} className="w-full h-full object-cover opacity-80" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="px-6 md:px-12 -mt-12 md:-mt-16 relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-end">
          {/* Avatar */}
          <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-black">
              <AvatarImage src={channel.avatar} />
              <AvatarFallback>{channel.username[0]}</AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">{channel.fullName}</h1>
              <p className="text-gray-400">@{channel.username}</p>
              <p className="text-gray-400 text-sm mt-1">
                  <span className="text-white font-semibold">{channel.subscribersCount}</span> subscribers
                  <span className="mx-2">•</span>
                  <span className="text-white font-semibold">{channel.channelsSubscribedToCount}</span> subscribed
              </p>
          </div>

          {/* Action Button */}
          <div className="mb-4">
              {isMyChannel ? (
                  <Button variant="outline" className="gap-2">Edit Profile</Button>
              ) : (
                  <Button 
                    variant={channel.isSubscribed ? "secondary" : "default"} // Purple if NOT subscribed
                    className={`gap-2 ${!channel.isSubscribed ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}`}
                    onClick={handleToggleSubscribe}
                  >
                      {channel.isSubscribed ? <UserCheck className="w-4 h-4"/> : <UserPlus className="w-4 h-4"/>}
                      {channel.isSubscribed ? "Subscribed" : "Subscribe"}
                  </Button>
              )}
          </div>
      </div>

      {/* ZONE 2: TABS (Placeholder for now) */}
      <div className="px-6 md:px-12 mt-10">
          <Tabs defaultValue="videos" className="w-full">
              <TabsList className="bg-gray-900 text-gray-400">
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                  <TabsTrigger value="tweets">Tweets</TabsTrigger>
              </TabsList>
              <TabsContent value="videos" className="mt-6 text-gray-500">
                  <ChannelVideos userId={channel._id} />
              </TabsContent>
              <TabsContent value="tweets" className="mt-6 text-gray-500">
                  Tweet Feed will go here...
              </TabsContent>
          </Tabs>
      </div>

    </div>
  );
}