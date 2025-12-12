"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import apiClient from "@/helpers/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, Edit2, Check, X } from "lucide-react";
import { RootState } from "@/store/store";



export interface Tweet {
  _id: string;
  content: string;
  createdAt: string;
  ownerDetails: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  likesCount: number;
  isLiked: boolean;
}

interface TweetCardProps {
  tweet: Tweet;
  onDelete: (id: string) => void; 
}

export default function TweetCard({ tweet, onDelete }: TweetCardProps) {
  const { userData } = useSelector((state: RootState) => state.auth);
  const isOwner = userData?._id === tweet.ownerDetails._id;

  
  const [isLiked, setIsLiked] = useState(tweet.isLiked);
  const [likesCount, setLikesCount] = useState(tweet.likesCount);
  
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(tweet.content);

  
  const handleLike = async () => {
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      await apiClient.post(`/likes/toggle/t/${tweet._id}`);
    } catch (error) {
      
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };


  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this tweet?")) return;
    try {
      await apiClient.delete(`/tweets/${tweet._id}`);
      onDelete(tweet._id); 
    } catch (error) {
      console.error("Failed to delete tweet");
    }
  };

  // 3. Handle Update
  const handleUpdate = async () => {
    try {
        await apiClient.patch(`/tweets/${tweet._id}`, { content: editedContent });
        setIsEditing(false);
    } catch (error) {
        console.error("Failed to update");
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl mb-4 hover:bg-gray-900/80 transition-colors">
      <div className="flex gap-4">

        <Avatar>
          <AvatarImage src={tweet.ownerDetails.avatar} />
          <AvatarFallback>{tweet.ownerDetails.username[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          
          <div className="flex justify-between items-start">
            <div>
                <span className="font-bold text-white mr-2">{tweet.ownerDetails.fullName}</span>
                <span className="text-gray-500 text-sm">@{tweet.ownerDetails.username}</span>
                <span className="text-gray-600 text-sm mx-2">•</span>
                <span className="text-gray-600 text-sm">
                   {new Date(tweet.createdAt).toLocaleDateString()}
                </span>
            </div>
            
            {/* Edit/Delete Menu (Only for Owner) */}
            {isOwner && (
                <div className="flex gap-2">
                    <button onClick={() => setIsEditing(!isEditing)} className="text-gray-500 hover:text-blue-400">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={handleDelete} className="text-gray-500 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )}
          </div>

          {isEditing ? (
              <div className="flex gap-2">
                  <input 
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="flex-1 bg-black border border-gray-700 rounded px-2 py-1 text-white"
                  />
                  <Button size="sm" onClick={handleUpdate} className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0">
                      <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={() => setIsEditing(false)} variant="destructive" className="h-8 w-8 p-0">
                      <X className="w-4 h-4" />
                  </Button>
              </div>
          ) : (
             <p className="text-gray-200 whitespace-pre-wrap">{isEditing ? editedContent : tweet.content}</p> // Use local content if edited
          )}
          
          <div className="pt-2 flex items-center gap-6 text-gray-500">
             <button 
                onClick={handleLike}
                className={`flex items-center gap-2 text-sm transition-colors hover:text-pink-500 ${isLiked ? "text-pink-600" : ""}`}
             >
                 <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                 {likesCount}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}