'use client'
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { useHomeContext } from "@/providers/homePageProvider";
import { SignInUpModal } from "@/components/header/header";
import Image from "next/image";

interface WantedItemProps {
  title: string;
  description: string;
  imageUrl: string;
  datePosted: string;
  location: string;
  contactInfo: string;
  className?: string
}

export function WantedItem({ title, description, imageUrl, datePosted, location, contactInfo, className }: any) {
  const [showContact, setShowContact] = useState(false);
  const { user } = useHomeContext();
  const [openSignIn, setOpenSignIn] = useState(false);

  const [email, phone] = contactInfo.split('|');

  return (
    <Card className={`w-[260px] flex-shrink-0 rounded-xl overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all ${className}`}>
      {/* Image with "Wanted" Badge */}
      <div className="relative h-36 bg-slate-100">
        <Image
          width={300} height={200}
          src={imageUrl || '/placeholder.png'}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = '/failed.png')}
        />
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">
          WANTED
        </div>
      </div>

      <div className="p-3">
        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-2" title={title}>
          {title}
        </h3>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 gap-1 mb-3">
          <div className="flex items-center text-[10px] text-slate-500 font-medium">
            <CalendarDays className="h-3 w-3 mr-1 text-slate-400" />
            {datePosted}
          </div>
          <div className="flex items-center text-[10px] text-slate-500 font-medium">
            <MapPin className="h-3 w-3 mr-1 text-slate-400" />
            {location}
          </div>
        </div>

        {/* Description - Shorter line clamp for compactness */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 h-8">
          {description}
        </p>

        {/* Action Button */}
        <div className="space-y-2">
          <Button
            onClick={() => user ? setShowContact(!showContact) : setOpenSignIn(true)}
            variant={showContact ? "secondary" : "default"}
            className={`w-full h-8 text-[11px] font-bold rounded-lg ${!showContact && 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {showContact ? "HIDE CONTACT" : "VIEW CONTACT"}
          </Button>

          {showContact && (
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 animate-in fade-in zoom-in-95">
              <div className="flex flex-col gap-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase font-bold">Email:</span>
                  <span className="text-slate-900 font-semibold truncate ml-2">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase font-bold">Phone:</span>
                  <span className="text-slate-900 font-semibold">{phone}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {openSignIn && <SignInUpModal openSignIn={openSignIn} setOpenSignIn={setOpenSignIn} />}
    </Card>
  );
}
