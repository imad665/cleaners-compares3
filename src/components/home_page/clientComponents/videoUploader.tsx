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
  //console.log(videoPreview, videoUrl, ';;;;;;;;;bbbbbbbbbbb');
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
            <div className="relative rounded-xl overflow-hidden border shadow-sm group">
              <video
                src={videoPreview}
                controls
                className="w-full h-auto max-h-[300px] bg-black"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8 rounded-full shadow-lg"
                  onClick={clearVideo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer py-10 px-4 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group">
              <input
                type="file"
                className="sr-only"
                accept="video/*"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-gray-50 rounded-full group-hover:bg-primary/10 transition-colors mb-4">
                  <Video className="h-8 w-8 text-gray-400 group-hover:text-primary" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-primary">
                  Click to upload product video
                </span>
                <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">
                  MP4, WebM or OGG <br/>(Max 9MB & 10 seconds)
                </p>
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
