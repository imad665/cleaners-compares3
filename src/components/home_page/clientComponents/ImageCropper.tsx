import React, { useState, useRef } from 'react'
import ReactCrop, { 
  Crop, 
  PixelCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Maximize2 } from 'lucide-react'

// --- Helper Functions ---
async function getCroppedImg(
  image: HTMLImageElement,
  pixelCrop: PixelCrop
): Promise<Blob | null> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  // Use the natural dimensions for the best quality
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  canvas.width = Math.floor(pixelCrop.width * scaleX)
  canvas.height = Math.floor(pixelCrop.height * scaleY)

  ctx.imageSmoothingQuality = 'high'

  ctx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob)
      },
      'image/jpeg',
      0.95
    )
  })
}

interface ImageCropperProps {
  image: string
  open: boolean
  onClose: () => void
  onCropComplete: (croppedImage: Blob) => void
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  open,
  onClose,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    setCrop({
        unit: '%',
        width: 90,
        height: 90,
        x: 5,
        y: 5
    })
  }

  const handleCropComplete = async () => {
    if (imgRef.current && completedCrop) {
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop)
      if (croppedBlob) {
        onCropComplete(croppedBlob)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white shadow-2xl">
        <DialogHeader className="p-4 border-b bg-gray-50/50">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Maximize2 className="h-5 w-5 text-primary" />
            Edit Product Photo
          </DialogTitle>
        </DialogHeader>

        {/* --- Cropper Area --- */}
        <div className="relative flex-1 bg-neutral-900 overflow-hidden flex items-center justify-center p-4 sm:p-8 min-h-[400px]">
          <div className="w-full max-h-full flex items-center justify-center">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              className="max-h-full"
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={image}
                onLoad={onImageLoad}
                className="max-w-full max-h-[60vh] object-contain shadow-2xl"
              />
            </ReactCrop>
          </div>
          
          <div className="absolute top-4 left-4 z-10 text-white/70 text-[10px] font-medium bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-xl pointer-events-none whitespace-nowrap">
            Drag handles to resize selection
          </div>
        </div>

        {/* --- Footer Controls --- */}
        <div className="p-6 border-t bg-white">
          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground italic">
              * Drag the corners to select the area you want to keep.
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="ghost" onClick={onClose} className="flex-1 sm:flex-none">
                Cancel
              </Button>
              <Button onClick={handleCropComplete} className="flex-1 sm:flex-none px-10 font-bold shadow-lg shadow-primary/20">
                Save Selection
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageCropper
