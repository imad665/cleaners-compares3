import React from 'react';
import VideoCard from './VideoCard';
import { Video } from '../types';

interface VideoGridProps {
  videos: Video[];
  categoryName: string;
  loading: boolean
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, loading, categoryName }) => {
  return (
    <div className="py-6 h-[75vh] overflow-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{categoryName}</h1>
      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          {!loading ? (
            <p className="text-lg">No videos available in this category.</p>
          ) : (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-500"></div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoGrid;