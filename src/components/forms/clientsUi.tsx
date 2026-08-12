'use client'

import { useEffect, useState } from "react";
import ImageUploader2 from "../home_page/clientComponents/imageUploader2";
import { Label } from "../ui/label";
import VideoUploader from "../home_page/clientComponents/videoUploader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { ImageIcon, VideoIcon, Sparkles } from "lucide-react";

export function ProducImageAndMedia({
    setImages,
    setVideo,
    images,
    video
}: any) {
    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0 pb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <ImageIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">Product Media</CardTitle>
                        <CardDescription className="text-base">
                            High-quality photos and videos increase your chances of a quick sale.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-0 space-y-6">
                <div className="grid gap-8 p-6 rounded-xl border border-gray-100 bg-white shadow-sm">
                    {/* Images Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                    Product Images <span className="text-red-500">*</span>
                                </Label>
                                <p className="text-sm text-muted-foreground">Upload up to 5 photos. Buyers love seeing all angles.</p>
                            </div>
                            {images.length > 0 && (
                                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    {images.length} / 5
                                </span>
                            )}
                        </div>
                        <ImageUploader2 images={images} onChange={setImages} />
                    </div>

                    {/* Video Section */}
                    <div className="space-y-4 pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                            <VideoIcon className="w-4 h-4 text-primary" />
                            <Label className="text-base font-semibold text-gray-800">
                                Product Video <span className="text-xs font-normal text-muted-foreground ml-1">(Highly Recommended)</span>
                            </Label>
                        </div>
                        <div className="bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-lg border border-primary/10 mb-2">
                            <div className="flex gap-3">
                                <Sparkles className="w-5 h-5 text-primary shrink-0" />
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    <strong>Boost visibility:</strong> Items with videos get up to 3x more views and sell faster.
                                </p>
                            </div>
                        </div>
                        <VideoUploader videoUrl={video} onChange={setVideo} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
