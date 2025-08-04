'use client'

import { useEffect, useState } from "react";
import ImageUploader2 from "../home_page/clientComponents/imageUploader2";
import { Label } from "../ui/label";
import VideoUploader from "../home_page/clientComponents/videoUploader";

export function ProducImageAndMedia({
    setImages,
    setVideo,
    images,
    video 
}){
    console.log(images,'ooooooooooooooooooo');
    
    return (
        <div className="rounded-md bg-white shadow-sm m-2 p-6 space-y-3 px-5 border-1">
            <h3 className="tracking-tight text-xl font-medium text-gray-800">Product Images & Media</h3>
            <div className="space-y-2">
                <Label className="text-base font-medium">
                    Product Images <span className="text-red-500">*</span>
                </Label>
                <ImageUploader2 images={images} onChange={setImages} />
                <VideoUploader videoUrl={video} onChange={setVideo} />
            </div>
        </div>
    );
}
