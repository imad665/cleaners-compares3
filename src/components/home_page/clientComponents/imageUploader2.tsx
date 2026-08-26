import React, { useCallback, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Image, Plus, X, ArrowUp, ArrowDown, CheckCircle2, Sparkles, Camera, Upload, RotateCcw } from "lucide-react";
import { toast } from 'sonner';
import Webcam from "react-webcam";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ImageUploader2 = ({
  images,
  onChange,
  maxImages = 5
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");

  const handleFileChange = useCallback((e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error("Maximum image limit reached", {
        description: `You can upload a maximum of ${maxImages} images`,
      });
      setIsModalOpen(false);
      return;
    }

    const newImages = [];

    Array.from(files).forEach(file => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error("Image too large", {
          description: `Image "${file.name}" exceeds the limit.`,
        });
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      newImages.push({
        id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        url: imageUrl,
        file
      });
    });

    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
    }

    e.target.value = '';
    setIsModalOpen(false);
  }, [images, maxImages, onChange]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to File object
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" });

          if (images.length + 1 > maxImages) {
            toast.error("Maximum image limit reached");
            setIsWebcamOpen(false);
            return;
          }

          const newImage = {
            id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            url: imageSrc,
            file
          };

          onChange([...images, newImage]);
          setIsWebcamOpen(false);
          setIsModalOpen(false);
        });
    }
  }, [webcamRef, images, maxImages, onChange]);

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === "user" ? "environment" : "user"));
  };

  const removeImage = (id) => {
    onChange(images.filter(img => img.id !== id));
  };

  const moveImage = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }

    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    onChange(newImages);
  };

  return (
    <div className="space-y-6">
      {/* --- IMPORTANT SELLER NOTES SECTION --- */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-primary">
          <Sparkles className="h-5 w-5" />
          <h4 className="font-bold text-sm tracking-tight">Tips for a faster sale:</h4>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <li className="flex items-start gap-2 text-xs text-gray-700">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Use a <strong>plain white background</strong> to make your product stand out.</span>
          </li>
          <li className="flex items-start gap-2 text-xs text-gray-700">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Ensure images are <strong>sharp and well-lit</strong> (avoid blur or dark rooms).</span>
          </li>
          <li className="flex items-start gap-2 text-xs text-gray-700">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Check orientation: Make sure your photos are <strong>upright</strong>.</span>
          </li>
          <li className="flex items-start gap-2 text-xs text-gray-700">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Show multiple angles to build buyer trust.</span>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`relative bg-white border rounded-xl p-1 aspect-square flex items-center justify-center overflow-hidden group shadow-sm transition-all duration-300 ${index === 0 ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
          >
            <img
              src={image.url}
              alt={`Product image ${index + 1}`}
              className="max-h-full max-w-full object-cover w-full h-full rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8 rounded-full shadow-lg"
                  onClick={() => removeImage(image.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                {images.length > 1 && (
                  <>
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full shadow-lg"
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full shadow-lg"
                      onClick={() => moveImage(index, 'down')}
                      disabled={index === images.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                Cover
              </div>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer aspect-square hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center p-4 text-center">
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-primary/10 transition-colors mb-2">
                <Plus className="h-6 w-6 text-gray-400 group-hover:text-primary" />
              </div>
              <span className="text-xs font-semibold text-gray-600 group-hover:text-primary">
                Add Photo
              </span>
            </div>
          </button>
        )}
      </div>

      {/* --- ADD PHOTO CHOOSER MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md z-50">
          <DialogHeader>
            <DialogTitle>Add Product Photo</DialogTitle>
            <DialogDescription>
              Choose how you would like to upload your photo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Option 1: Camera Capture */}
            <div
              onClick={() => setIsWebcamOpen(true)}
              className="border-2 border-gray-100 hover:border-primary hover:bg-primary/5 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center group"
            >
              <div className="p-3 bg-primary/10 rounded-full text-primary mb-3 group-hover:scale-110 transition-transform">
                <Camera className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold text-gray-900 mb-1">Take Photo</span>
              <span className="text-xs text-gray-500">Use camera now</span>
            </div>
            {/* Option 2: Upload from Device */}
            <label className="border-2 border-gray-100 hover:border-primary hover:bg-primary/5 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center group">
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
              <div className="p-3 bg-primary/10 rounded-full text-primary mb-3 group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold text-gray-900 mb-1">Upload File</span>
              <span className="text-xs text-gray-500">From gallery or files</span>
            </label>


          </div>
        </DialogContent>
      </Dialog>

      {/* --- WEBCAM MODAL --- */}
      <Dialog open={isWebcamOpen} onOpenChange={setIsWebcamOpen}>
        <DialogContent
          className="
      w-screen
      h-[100dvh]
      max-w-none
      p-0
      overflow-hidden
      bg-black
      border-none
      rounded-none
    "
        >
          <div className="relative w-full h-full overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode,
                width: { ideal: 1080 },
                height: { ideal: 1920 },
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Controls */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-black/40 via-transparent to-black/40">
              <div className="flex justify-between items-start">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={() => setIsWebcamOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={toggleFacingMode}
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex justify-center items-center pb-30">
                <button
                  onClick={capture}
                  className="h-16 w-16 bg-white rounded-full border-4 border-white/30 flex items-center justify-center active:scale-90 transition-transform shadow-xl"
                >
                  <div className="h-12 w-12 rounded-full border-2 border-black/10 bg-white" />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded border-l-4 border-gray-300">
        <strong>Format:</strong> PNG, JPG. <strong>Limit:</strong> {MAX_FILE_SIZE_MB}MB per file.
        The first image will be shown as the primary photo in search results.
      </div>
    </div>
  );
};

export default ImageUploader2;