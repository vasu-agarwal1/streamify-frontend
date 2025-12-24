"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, Loader2 } from "lucide-react";
import apiClient from "@/helpers/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function UploadVideoModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  

  const publishVideo = async (data: any) => {
    try {
      setLoading(true);


      const formData = new FormData();

      formData.append("title", data.title)
      formData.append("description", data.description)

      formData.append("videoFile", data.videoFile[0]);
      formData.append("thumbnail", data.thumbnail[0]);

      await apiClient.post("/videos", formData);

      setOpen(false); // Close popup 
      reset(); // Clear form
      window.location.reload(); // Refresh to see new video

    } catch (error: any) {
      console.error("Upload failed", error);
      alert("Failed to upload video: " + (error.response?.data?.message || "Unknown Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hidden md:flex" title="Upload Video">
           <Upload className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
          <DialogDescription>
            Share your content with the world.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading... Do not close this window.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(publishVideo)} className="space-y-4">
   
            <div className="space-y-2">
              <Label htmlFor="video">Video File</Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                className="cursor-pointer"
                {...register("videoFile", { required: "Video is required" })}
              />
              {errors.videoFile && <p className="text-red-500 text-xs">Video is required</p>}
            </div>
 
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                className="cursor-pointer"
                {...register("thumbnail", { required: "Thumbnail is required" })}
              />
              {errors.thumbnail && <p className="text-red-500 text-xs">Thumbnail is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Video title"
                {...register("title", { required: "Title is required" })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your video..."
                {...register("description", { required: "Description is required" })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Publish
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}