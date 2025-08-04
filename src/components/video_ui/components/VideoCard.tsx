'use client'
import React, { useState } from 'react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative pb-[56.25%] bg-slate-100">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-200 rounded-full mb-2"></div>
              <div className="h-2 w-24 bg-slate-200 rounded"></div>
            </div>
          </div>
        )}
        <iframe
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        ></iframe>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-slate-800 line-clamp-2">{video.title}</h3>
      </div>
    </div>
  );
};

export default VideoCard;