import React, { useCallback } from 'react';
import { Button } from "@/components/ui/button";

import { Image, Plus, X, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from 'sonner';



const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ImageUploader2 = ({
  images,
  onChange,
  maxImages = 5
}) => {


  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error("Maximum image limit reached", {
        description: `You can upload a maximum of ${maxImages} images`,
      });
      return;
    }

    const newImages = [];

    Array.from(files).forEach(file => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error("Image too large", {
          description: `Image "${file.name}" exceeds the 1MB limit.`,
        });
        return; // Skip this file
      }

      // In a real app, we'd upload to a server here
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

    // Reset the input
    e.target.value = '';
  }, [images, maxImages, onChange]);

  const removeImage = (id: string) => {
    onChange(images.filter(img => img.id !== id));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative bg-gray-50 border rounded-md p-1 aspect-square flex items-center justify-center overflow-hidden group"
          >
            <img
              src={image.url}
              alt={`Product image ${index + 1}`}
              className="max-h-full max-w-full object-contain"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex flex-col gap-1 absolute top-1 right-1">
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-7 w-7"
                  onClick={() => removeImage(image.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7"
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7"
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === images.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {index === 0 && (
              <div className="absolute bottom-1 left-1 bg-primary text-white text-xs px-1 py-0.5 rounded">
                Main
              </div>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <label
            className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer aspect-square hover:bg-gray-50 transition-colors"
          >
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center p-4 text-center">
              <Image className="h-10 w-10 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">
                Click to upload
              </span>
              <span className="text-xs text-gray-400 mt-1">
                {images.length} / {maxImages}
              </span>
            </div>
          </label>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Upload up to {maxImages} images (PNG, JPG). First image will be the main product image.
      </div>
    </div>
  );
};

export default ImageUploader2;