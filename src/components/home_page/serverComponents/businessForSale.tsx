'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MapPin, DollarSign, ClipboardList, HelpCircle, Mail, Phone } from "lucide-react";
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
  className?: string;
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

  // Parse contactInfo string to extract email and phone
  const parseContactInfo = (info: string) => {
    const emailMatch = info.match(/Email:\s*([^\s|]+)/i);
    const phoneMatch = info.match(/Phone:\s*([^|]+)/i);
    
    return {
      email: emailMatch ? emailMatch[1].trim() : null,
      phone: phoneMatch ? phoneMatch[1].trim().replace(/\s/g, '') : null // Remove spaces for tel: link
    };
  };

  const { email, phone } = parseContactInfo(contactInfo);

  const handleCall = () => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  const handleEmail = () => {
    if (email) {
      window.open(`mailto:${email}?subject=Regarding ${encodeURIComponent(title)}&body=Hello, I'm interested in your business listed on Cleaners Compare.`, '_blank');
    }
  };

  const handleContactClick = () => {
    if (user) {
      setShowContact(!showContact);
    } else {
      setOpenSignIn(true);
    }
  };

  return (
    <Card className={`md:!min-w-[300px] my-1 h-full mx-auto overflow-hidden rounded-2xl shadow-lg border border-gray-200 bg-white flex flex-col ${className}`}>
      {/* Image - Fixed Height */}
      <div className="relative w-full h-48 flex-shrink-0">
        <Image
          width={300}
          height={192}
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content - Flex grow to take remaining space */}
      <div className="p-4 flex flex-col gap-3 flex-grow">
        {/* Title */}
        <div className="flex justify-between items-start min-h-[3rem]">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {title}
          </CardTitle>
        </div>

        {/* Short Description - Fixed height */}
        <p title={description} className="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>

        {/* Business Details - Fixed height container */}
        <div className="flex flex-col gap-2 text-sm text-gray-700 min-h-[6rem]">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span className="font-medium flex-shrink-0">Location:</span>
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium flex-shrink-0">Annual Turnover:</span>
            <span className="font-semibold text-gray-900 truncate">£{value}</span>
          </div>

          <div className="flex items-start gap-2">
            <HelpCircle className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="min-h-[1.25rem]">
              <span className="font-medium">Reason: </span>
              <span className="line-clamp-1">{reason}</span>
            </div>
          </div>
        </div>

        {/* Contact Section - Pushed to bottom */}
        <div className="mt-auto space-y-3">
          {/* Main Contact Button */}
          <Button
            onClick={handleContactClick}
            variant={showContact ? "outline" : "default"}
            className="w-full cursor-pointer h-9 text-sm flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            {showContact ? "Hide Contact Info" : "Contact Seller"}
          </Button>

          {/* Contact Info Display with Action Buttons */}
          {showContact && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
              <p className="font-semibold text-sm text-gray-900 mb-2">Seller Contact:</p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                {phone && (
                  <Button
                    onClick={handleCall}
                    className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white text-sm h-9 flex items-center gap-2"
                    size="sm"
                  >
                    <Phone className="h-4 w-4" />
                    Call Seller
                  </Button>
                )}
                
                {email && (
                  <Button
                    onClick={handleEmail}
                    className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm h-9 flex items-center gap-2"
                    size="sm"
                  >
                    <Mail className="h-4 w-4" />
                    Email Seller
                  </Button>
                )}
              </div>

              {/* Contact Details Text */}
              <div className="text-xs text-gray-600 space-y-1">
                {email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="break-all">{email}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    <span>{phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}</span>
                  </div>
                )}
                {!email && !phone && (
                  <p className="text-gray-500 italic">No contact information available</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Login */}
      <SignInUpModal
        openSignIn={openSignIn}
        openSignUp={openSignUp}
        setOpenSignIn={setOpenSignIn}
        setOpenSignUp={setOpenSignUp}
      />
    </Card>
  );
}