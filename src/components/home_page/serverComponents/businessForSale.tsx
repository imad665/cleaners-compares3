'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MapPin, DollarSign, ClipboardList, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SignInUpModal } from "@/components/header/header";
import { useHomeContext } from "@/providers/homePageProvider";
import Image from "next/image";

interface BusinessForSaleProps {
  title: string;
  category: string;
  location: string;
  value: string;
  reason: string;
  description: string;
  imageUrl: string;
  contactInfo: string;
  className?:string;
}
export default function BusinessForSale({
  title,
  category,
  location,
  value,
  reason,
  description,
  imageUrl,
  contactInfo,
  className,
}: BusinessForSaleProps) {
  const [showContact, setShowContact] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const { user } = useHomeContext();

  return (
    <Card className={` md:!min-w-[300px] mx-auto mt-6 overflow-hidden rounded-2xl shadow-lg border border-gray-200 bg-white ${className}`}>
      {/* Image */}
      <div className="relative w-full">
        <Image
          width={300}
          height={300}
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
        </div>

        {/* Short Description */}
        <p title={description} className="text-gray-600 text-sm line-clamp-2">
          {description}
        </p>

        {/* Business Details */}
        <div className="mt-2 flex flex-col gap-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Location:</span>
            <span className="truncate">{location}</span>
          </div>



          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <ClipboardList className="h-4 w-4" />
            <span className="font-medium">Annual Turnover:</span>
            <span className="font-semibold text-gray-900">£{value}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <HelpCircle className="h-4 w-4" />
            <span className="font-medium">Reason for Selling:</span>
            <span>{reason}</span>
          </div>
        </div>

        {/* Contact Button */}
        <div className="mt-4">
          <Button
            onClick={() => {
              if (user) setShowContact(!showContact);
              else setOpenSignIn(true);
            }}
            variant={showContact ? "outline" : "default"}
            className="w-full h-9 text-sm"
          >
            {showContact ? "Hide Contact Info" : "Contact Seller"}
          </Button>

          {/* Contact Info Display */}
          {showContact && (
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
              <p className="font-semibold">Seller Contact:</p>
              <p className="font-mono break-words">{contactInfo}</p>
            </div>
          )}
        </div>

        {/* Modal for Login */}
        <SignInUpModal
          openSignIn={openSignIn}
          openSignUp={openSignUp}
          setOpenSignIn={setOpenSignIn}
          setOpenSignUp={setOpenSignUp}
        />
      </div>
    </Card>
  );
}

