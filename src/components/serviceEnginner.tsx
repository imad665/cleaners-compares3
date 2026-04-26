'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, MapPin, Briefcase, Clock } from "lucide-react";
import { SignInUpModal } from "./header/header";
import { useHomeContext } from "@/providers/homePageProvider";

interface Service {
  title: string;
  ratePerHour: number;
  areaOfService: string;
  companyType: string;
  experience: string;
  email: string;
  contactNumber: string;
  pictureUrl?: string;
  isFeatured?: boolean;
}

export default function ServiceCard({ service }: { service: Service }) {
  const [showContact, setShowContact] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const { user } = useHomeContext();

  return (
    <Card className="max-w-md w-[260px] mx-auto shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden border-muted">
      {service.pictureUrl && (
        <div className="relative">
          <img
            src={service.pictureUrl}
            alt={service.title}
            className="w-full h-32 object-cover"
          />
          {service.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600 text-white border-none shadow-sm text-[9px] h-4 px-1.5">
              FEATURED
            </Badge>
          )}
        </div>
      )}

      <CardContent className="p-3"> {/* Reduced padding further */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-bold leading-none truncate">{service.title}</h3>
          <Badge variant="outline" className="text-[9px] px-1 h-4 shrink-0 font-medium uppercase">
            {service.companyType}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-y-1.5 gap-x-1 text-[11px] mb-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3 text-primary shrink-0" />
            <span className="font-semibold text-foreground truncate">£{service.ratePerHour}/hr</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3 text-primary shrink-0" />
            <span className="truncate">{service.areaOfService}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground col-span-2">
            <Briefcase className="h-3 w-3 text-primary shrink-0" />
            <span className="truncate">{service.experience} Experience</span>
          </div>
        </div>

        <Button
          onClick={() => {
            if (user != undefined) setShowContact(!showContact);
            else setOpenSignIn(true);
          }}
          className="w-full h-7 text-[11px] font-medium"
          variant="secondary"
        >
          {showContact ? (
            <>Hide <ChevronUp className="ml-1 h-3 w-3" /></>
          ) : (
            <>View Contact <ChevronDown className="ml-1 h-3 w-3" /></>
          )}
        </Button>

        {showContact && (
          <div className="mt-2 pt-2 border-t border-dashed space-y-1 text-[10px] animate-in fade-in zoom-in-95">
            <p className="flex justify-between items-center">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium text-foreground">{service.email}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium text-foreground">{service.contactNumber}</span>
            </p>
          </div>
        )}

        <SignInUpModal
          openSignIn={openSignIn}
          openSignUp={openSignUp}
          setOpenSignIn={setOpenSignIn}
          setOpenSignUp={setOpenSignUp}
        />
      </CardContent>
    </Card>
  );
}