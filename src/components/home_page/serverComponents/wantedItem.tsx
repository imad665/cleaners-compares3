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
  className?:string
}

export default function WantedItem({
  title,
  description,
  imageUrl,
  datePosted,
  location,
  contactInfo,
  className,
}: WantedItemProps) {
  const [showContact, setShowContact] = useState(false);
  const contacts = contactInfo.split('|');
  const email = contacts[0]
  const phone = contacts[1]
  const {user} = useHomeContext();
  const [openSignIn,setOpenSignIn] = useState(false);
  const [openSignUp,setOpenSignUp] = useState(false);
  //console.log(imageUrl,';;;;;;;;;;;;;;;;;;');
  
  return (
    <Card className={`max-w-sm mx-auto mt-6 overflow-hidden rounded-2xl shadow-lg border border-gray-200 bg-white ${className}`}>

      {/* Image Full Width */}
      <div className="relative w-full overflow-hidden">
        <Image
          width={300}
          height={300}
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/failed.png';
          }}
        />
      </div>

      {/* Content Below Image */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <CardTitle
            className="text-lg font-semibold text-gray-900 truncate"
            title={title}
          >
            {title}
          </CardTitle>

          <div className="flex flex-col justify-between w-[250px] gap-2 text-gray-500 text-xs">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {datePosted}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {location}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-snug line-clamp-3">
          {description}
        </p>

        {/* Button and Contact Info */}
        <div className="flex flex-col gap-2 mt-2">
          <Button
            onClick={() =>{
               if(user!=undefined)setShowContact(!showContact)
               else{setOpenSignIn(true)}
            }}
            variant={showContact ? "outline" : "default"}
            className="w-full h-9 text-sm"
          >
            {showContact ? "Hide Contact" : "Show Contact"}
          </Button>

          {showContact && (
            <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-700">
              <p className="font-semibold mb-1">Contact:</p>
              <p className="font-mono break-words">{email}<br />{phone}</p>
            </div>
          )}
          <SignInUpModal 
            openSignIn={openSignIn}
            openSignUp={openSignUp}
            setOpenSignIn={setOpenSignIn}
            setOpenSignUp={setOpenSignUp}/>
        </div>

      </div>
    </Card>
  );
}
