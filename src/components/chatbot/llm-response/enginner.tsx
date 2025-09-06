// components/llm-response/engineer.tsx
import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Phone, Mail, MapPin, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EngineerProps {
  engineerId: string;
  title: string;
  areaOfService: string;
  experience: string;
  contactNumber: string;
  email: string;
  address: string;
  ratePerHour: string;
  companyType: string;
  pictureUrl: string;
  featured: string;
  className?: string;
}

export function Engineer({
  engineerId,
  title,
  areaOfService,
  experience,
  contactNumber,
  email,
  address,
  ratePerHour,
  companyType,
  pictureUrl,
  featured,
  className,
}: EngineerProps) {
  const isFeatured = featured === "Yes";
  const hasRate = ratePerHour && ratePerHour !== "N/A";
  const parsedRate = hasRate ? parseFloat(ratePerHour.replace('$', '').replace('/hr', '')) : 0;
  const formattedRate = hasRate ? `$${parsedRate.toFixed(2)}/hr` : "Rate available upon request";

  return (
    <Card className={cn(
      'w-64 flex-shrink-0 border border-gray-200/60 bg-white/95 backdrop-blur-sm',
      'transition-all duration-200 hover:shadow-md hover:border-gray-300',
      className
    )}>
      {/* Engineer Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {pictureUrl ? (
          <Image
            src={pictureUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-2xl font-bold">{title.charAt(0)}</span>
              </div>
              <span className="text-blue-600 text-xs font-medium">Professional Engineer</span>
            </div>
          </div>
        )}
        
        {/* Top badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {isFeatured && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] px-1.5 py-0.5">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          
          {hasRate && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 ml-auto bg-white/90">
              {formattedRate}
            </Badge>
          )}
        </div>

        {/* Experience badge at bottom */}
        <Badge variant="default" className="absolute bottom-2 left-2 text-[10px] px-1.5 py-0.5 bg-black/70 text-white">
          <Clock className="h-3 w-3 mr-1" />
          {experience}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        {/* Company Type */}
        <div className="mb-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {companyType}
          </span>
        </div>
        
        {/* Engineer Title */}
        <h3 className="font-semibold text-sm line-clamp-2 mb-3 leading-tight">
          {title}
        </h3>
        
        {/* Service Area */}
        <div className="flex items-center mb-3">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1.5 flex-shrink-0" />
          <span className="text-xs text-muted-foreground line-clamp-1">
            {areaOfService}
          </span>
        </div>
        
        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          {contactNumber !== 'Available upon request' && (
            <div className="flex items-center">
              <Phone className="h-3.5 w-3.5 text-muted-foreground mr-1.5 flex-shrink-0" />
              <span className="text-xs text-muted-foreground">
                {contactNumber}
              </span>
            </div>
          )}
          
          {email !== 'Not specified' && (
            <div className="flex items-center">
              <Mail className="h-3.5 w-3.5 text-muted-foreground mr-1.5 flex-shrink-0" />
              <span className="text-xs text-muted-foreground line-clamp-1">
                {email}
              </span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="flex-1 text-xs h-8"
            onClick={() => window.open(`tel:${contactNumber}`, '_self')}
          >
            <Phone className="h-3.5 w-3.5 mr-1" />
            Call
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs h-8"
            onClick={() => window.open(`mailto:${email}`, '_self')}
          >
            <Mail className="h-3.5 w-3.5 mr-1" />
            Email
          </Button>
        </div>
        
        {/* Address (collapsible) */}
        {address !== 'Headquarters location available' && (
          <details className="mt-3 group">
            <summary className="text-xs text-muted-foreground cursor-pointer list-none flex items-center">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">View address</span>
            </summary>
            <p className="text-xs text-muted-foreground mt-1 pl-4">
              {address}
            </p>
          </details>
        )}
      </CardContent>
    </Card>
  );
}

export default Engineer;