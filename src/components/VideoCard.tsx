
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export interface Video {
  _id: string;
  videoFile: string; 
  thumbnail: string;
  title: string;
  description: string; 
  duration: number;
  views: number;
  createdAt: string;
  owner: {
    username: string;
    fullName: string;
    avatar: string;
  };
}

// Helper to format time (e.g., 65 seconds -> "1:05")
const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

// Helper for "2 days ago"
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export default function VideoCard({ video }: { video: Video }) {
  return (
    <div className="group flex flex-col gap-2 cursor-pointer">
      {/* THUMBNAIL */}
      <Link href={`/watch/${video._id}`} className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {formatDuration(video.duration)}
        </div>
      </Link>

      {/* INFO SECTION */}
      <div className="flex gap-3 items-start mt-2">
        {/* Avatar */}
        <Link href={`/c/${video.owner?.username}`}>
          <Avatar className="h-9 w-9 border border-transparent group-hover:border-white/50 transition-colors">
            <AvatarImage src={video.owner?.avatar} />
            <AvatarFallback>{video.owner?.username?.[0]}</AvatarFallback>
          </Avatar>
        </Link>

        {/* Text Info */}
        <div className="flex flex-col">
          <Link href={`/watch/${video._id}`}>
            <h3 className="text-base font-semibold text-white line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors">
              {video.title}
            </h3>
          </Link>
          
          <Link href={`/c/${video.owner?.username}`} className="mt-1 text-sm text-gray-400 hover:text-white transition-colors">
            {video.owner?.fullName || video.owner?.username}
          </Link>
          
          <div className="text-sm text-gray-500">
            {video.views} views • {formatTimeAgo(video.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}