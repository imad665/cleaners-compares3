'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Briefcase,
  Clock,
  ArrowRight,
  Wrench
} from "lucide-react";
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
    <Card className="group max-w-md w-full border-none shadow-none  mb-3 mx-auto rounded-xl   bg-card overflow-hidden   hover:border-primary/50 transition-all flex flex-col cursor-pointer">

      {/* Image Section - Height increased to h-[350px] */}
      <div className="h-[350px] w-full overflow-hidden bg-secondary/40 relative">
        {service.pictureUrl ? (
          <img
            src={service.pictureUrl}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Wrench className="h-12 w-12 opacity-20" />
          </div>
        )}

        {/* TOP OVERLAYS */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {service.isFeatured ? (
            <Badge className="bg-primary text-primary-foreground border-none shadow-sm text-[10px] font-bold px-2 py-0.5">
              FEATURED
            </Badge>
          ) : (
            <div />
          )}

          {/* Floating Company Type Badge */}
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-white/90 backdrop-blur-md text-primary uppercase tracking-wider px-2 py-1 rounded-md shadow-sm border border-white/20">
            <Wrench className="h-3 w-3" />
            {service.companyType}
          </div>
        </div>

        {/* BOTTOM OVERLAYS (Gradient for readability) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 backdrop-blur-xs rounded-tl-2xl rounded-tr-2xl bg-gradient-to-t from-black/90 via-black/40 to-transparent">

          {/* Floating Location */}
          <h3 className="font-bold text-md leading-tight text-white mb-3  transition-colors">
            {service.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="mt-auto">
              {/* Interaction Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (user != undefined) setShowContact(!showContact);
                  else setOpenSignIn(true);
                }}
                className=" flex items-center gap-1 text-sm font-bold text-white hover:gap-2 transition-all w-fit"
              >
                {showContact ? "Hide contact info" : "View contact info"}
                {showContact ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>

              {/* Contact Details Expansion */}
              {showContact && (
                <div className=" p-3 rounded-lg bg-black/30 backdrop-blur  border border-border/50 space-y-2 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Email: </span>
                    <span className="font-semibold text-white">{service.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Phone</span>
                    <span className="font-semibold text-white">{service.contactNumber}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-white/90 text-xs   font-medium">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate">{service.areaOfService}</span>
            </div>
          </div>


          {/* Floating Stats Grid */}
          <div className="grid grid-cols-2 gap-2 border-t border-white/20 pt-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase font-bold text-white/60 tracking-tight">Rate</span>
              <div className="flex items-center gap-1 text-xs font-bold text-white">
                <Clock className="h-3 w-3 text-primary" />
                £{service.ratePerHour}/hr
              </div>
            </div>
            <div className="flex flex-col gap-0.5 border-l border-white/20 pl-2">
              <span className="text-[9px] uppercase font-bold text-white/60 tracking-tight">Experience</span>
              <div className="flex items-center gap-1 text-xs font-bold text-white">
                <Briefcase className="h-3 w-3 text-primary" />
                {service.experience}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SignInUpModal
        openSignIn={openSignIn}
        openSignUp={openSignUp}
        setOpenSignIn={setOpenSignIn}
        setOpenSignUp={setOpenSignUp}
      />

    </Card>
  );
}