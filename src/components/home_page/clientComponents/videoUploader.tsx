import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Link, X } from "lucide-react";
import { toast } from 'sonner';

interface VideoUploaderProps {
  videoUrl: string;
  onChange: (url: string) => void;
}

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  // In a real app, we'd upload to a server here
  const url = URL.createObjectURL(files[0]);


  // Reset the input
  e.target.value = '';
};
const VideoUploader: React.FC<VideoUploaderProps> = ({ videoUrl, onChange }) => {
  const [activeTab, setActiveTab] = useState<string>("upload");

  const [videoPreview, setVideoPreview] = useState<string | null>('');
  useEffect(() => {
    if (videoUrl && videoUrl.url) {
      setVideoPreview(videoUrl.url)
    }
  }, [videoUrl])
  console.log(videoPreview, videoUrl, ';;;;;;;;;bbbbbbbbbbb');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const url = URL.createObjectURL(file);

    // Create a hidden video element to check duration
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;

    const maxSizeInBytes = 9 * 1024 * 1024; // 9MB
    if (file.size > maxSizeInBytes) {
      setVideoPreview(null);
      setError("Video must be under 9MB And must be 10 seconds or shorter");
      toast.error(`Video size is too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    video.onloadedmetadata = () => {
      //window.URL.revokeObjectURL(url); // cleanup blob URL

      if (video.duration <= 10) {
        setVideoPreview(url);
        setError(null);
        onChange({ url, file });
      } else {
        setVideoPreview(null);
        setError("Video must be 10 seconds or shorter.");
        toast.error(`Video must be 10 seconds or shorter. ${video.duration}`)
      }
    };

    // Reset the input
    e.target.value = '';
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const clearVideo = () => {
    onChange("");
    setVideoPreview(null);
  };

  return (
    <div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="upload">Upload Video</TabsTrigger>
          {/* <TabsTrigger value="link">Video URL</TabsTrigger> */}
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          {videoPreview ? (
            <div className="relative rounded-md overflow-hidden">
              <video
                src={videoPreview}
                controls
                className="w-full h-auto max-h-[300px]"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={clearVideo}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer py-8 px-4 hover:bg-gray-50 transition-colors">
              <input
                type="file"
                className="sr-only"
                accept="video/*"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center text-center">
                <Video className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Click to upload product video
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  MP4, WebM or OGG (Max 50MB)
                </span>
              </div>
            </label>
          )}
        </TabsContent>

        {/* <TabsContent value="link">
          <div className="space-y-3">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="video-url">Video URL</Label>
              <div className="relative">
                <Input
                  id="video-url"
                  placeholder="https://example.com/video.mp4 or YouTube, Vimeo URL"
                  value={videoUrl || ""}
                  onChange={handleUrlChange}
                  className="pl-10"
                />
                <Link className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {videoUrl && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1 h-7"
                    onClick={clearVideo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Enter a direct video URL or from YouTube/Vimeo
            </div>
          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default VideoUploader;
