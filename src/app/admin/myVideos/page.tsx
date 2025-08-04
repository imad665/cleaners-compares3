'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AddVideoForm from '@/components/adminDashboard/addVideoYoutube';
import { toast } from 'sonner';

type Video = {
  id: string;
  title: string;
  url: string;
  description?: string;
  thumbnail?: string;
  createdAt: string;
};

export default function VideoTable() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const fetchVideos = async () => {
    const res = await fetch('/api/admin/videos/fromYoutube');
    const data = await res.json();
    setVideos(data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const deleteVideo = async (id: string) => {
    const res = await fetch(`/api/admin/videos/fromYoutube`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setVideos(videos.filter((video) => video.id !== id));
      toast.success('Video deleted successfully!');
    } else {
      toast.error('Failed to delete video.');
    }

    setConfirmDialogOpen(false);
    setSelectedVideo(null);
  };

  const handleVideoAdded = () => {
    setOpen(false);
    fetchVideos();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Videos</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Video</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Video</DialogTitle>
            </DialogHeader>
            <AddVideoForm onSuccess={handleVideoAdded} />
          </DialogContent>
        </Dialog>
      </div>

      <table className="w-full border text-left text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Thumbnail</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id}>
              <td className="p-2 border">
                {video.thumbnail ? (
                  <img src={video.thumbnail} alt="thumb" className="w-24" />
                ) : (
                  'No thumbnail'
                )}
              </td>
              <td className="p-2 border">{video.title}</td>
              <td className="p-2 border">{video.description || '-'}</td>
              <td className="p-2 border">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSelectedVideo(video);
                    setConfirmDialogOpen(true);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this video?</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="secondary"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedVideo && deleteVideo(selectedVideo.id)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="w-[100vw] h-30"></div>
    </div>
  );
}
