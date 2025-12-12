"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/helpers/axiosInstance";
import { Loader2} from "lucide-react";
import { Button } from "@/components/ui/button";
import TweetCard, { Tweet } from "@/components/TweetCard";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TweetsPage() {
  const { userData } = useSelector((state: RootState) => state.auth);
  
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTweetContent, setNewTweetContent] = useState("");
  const [posting, setPosting] = useState(false);

  
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setLoading(true);
        
        const response = await apiClient.get("/tweets");
        setTweets(response.data.data); 
      } catch (error) {
        console.error("Error fetching tweets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTweets();
  }, []);

  // 2. Create Tweet Function
  const handlePostTweet = async () => {
    if (!newTweetContent.trim()) return;

    try {
      setPosting(true);
      const response = await apiClient.post("/tweets", { content: newTweetContent });
      
      // The backend returns the simple tweet object (without ownerDetails populated usually)
      // So we manually construct a "optimistic" tweet to add to the list immediately
      const newTweet = {
          ...response.data.data, // _id, content, createdAt
          ownerDetails: {
              _id: userData?._id,
              username: userData?.username,
              fullName: userData?.fullName,
              avatar: userData?.avatar
          },
          likesCount: 0,
          isLiked: false
      };

      setTweets([newTweet, ...tweets]); // Add to top
      setNewTweetContent(""); // Clear input
    } catch (error) {
      console.error("Failed to post tweet");
    } finally {
      setPosting(false);
    }
  };

  // 3. Remove deleted tweet from UI
  const removeTweetFromList = (tweetId: string) => {
      setTweets(prev => prev.filter(t => t._id !== tweetId));
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        
        <h1 className="text-2xl font-bold mb-6">Home</h1>

        
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-8">
            <div className="flex gap-4">
                <Avatar>
                    <AvatarImage src={userData?.avatar} />
                    <AvatarFallback>Me</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <textarea 
                        value={newTweetContent}
                        onChange={(e) => setNewTweetContent(e.target.value)}
                        placeholder="What is happening?!"
                        className="w-full bg-transparent text-white  focus:ring-0 resize-none text-lg min-h-[80px]"
                    />
                    <div className="flex justify-end pt-2 border-t border-gray-800">
                        <Button 
                            onClick={handlePostTweet} 
                            disabled={posting || !newTweetContent.trim()}
                            className="bg-purple-600 hover:bg-purple-700 rounded-full px-6"
                        >
                            {posting ? <Loader2 className="animate-spin w-4 h-4"/> : "Post"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        
        {loading ? (
             <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-purple-600 w-8 h-8"/></div>
        ) : (
            <div className="pb-20">
                {tweets.map(tweet => (
                    <TweetCard 
                        key={tweet._id} 
                        tweet={tweet} 
                        onDelete={removeTweetFromList} 
                    />
                ))}
            </div>
        )}

      </div>
    </div>
  );
}