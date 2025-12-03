"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import apiClient from "@/helpers/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  owner: {
    username: string;
    fullName: string;
    avatar: string;
    _id: string;
  };
}

export default function VideoComments({ videoId }: { videoId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  
  // Get current user to check ownership (for Delete button)
  const currentUser = useSelector((state: RootState) => state.auth.userData);

  const fetchComments = async () => {
    try {
      const response = await apiClient.get(`/comments/${videoId}`);
      console.log("Comments:", response.data);
      // Your backend returns paginated data, so it's inside ".docs"
      setComments(response.data.data.docs || []);
    } catch (error) {
      console.error("Failed to load comments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const addComment = async (data: any) => {
    if (!data.content.trim()) return;
    try {
      await apiClient.post(`/comments/${videoId}`, { content: data.content });
      reset(); 
      fetchComments(); 
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
        await apiClient.delete(`/comments/c/${commentId}`);
        setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
        console.error("Failed to delete comment", error);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <h3 className="text-xl font-bold text-white">
        Comments <span className="text-gray-400 text-sm">({comments.length})</span>
      </h3>

      <form onSubmit={handleSubmit(addComment)} className="flex gap-4 items-start">
        <Avatar className="h-10 w-10">
          <AvatarImage src={currentUser?.avatar} />
          <AvatarFallback>{currentUser?.username?.[0] || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Input 
            {...register("content", { required: true })}
            placeholder="Add a comment..." 
            className="bg-transparent border-b border-gray-700 rounded-none focus:border-white transition-colors px-0 ring-0 focus-visible:ring-0"
            autoComplete="off"
          />
          <Button type="submit" variant="ghost" size="icon" disabled={!currentUser}>
            <Send className="h-5 w-5 text-purple-500" />
          </Button>
        </div>
      </form>

      <div className="space-y-6 mt-6">
        {loading ? (
           <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto" />
        ) : comments.length === 0 ? (
           <p className="text-gray-500 text-center py-4">No comments yet. Be the first!</p>
        ) : (
           comments.map((comment) => (
             <div key={comment._id} className="flex gap-4 group">
               <Avatar className="h-10 w-10 border border-gray-800">
                 <AvatarImage src={comment.owner?.avatar} />
                 <AvatarFallback>{comment.owner?.username?.[0]}</AvatarFallback>
               </Avatar>
               
               <div className="flex-1 space-y-1">
                 <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">@{comment.owner?.username}</span>
                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                 </div>
                 <p className="text-gray-300 text-sm">{comment.content}</p>
               </div>

               
               {currentUser?._id === comment.owner?._id && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => deleteComment(comment._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
               )}
             </div>
           ))
        )}
      </div>
    </div>
  );
}