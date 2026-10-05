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
  Wrench,
  Phone,
  Mail,
  Copy,
  Check
} from "lucide-react";
import { SignInUpModal } from "./header/header";
import { useHomeContext } from "@/providers/homePageProvider";
import { toast } from "sonner";

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
  const [copiedType, setCopiedType] = useState<'email' | 'phone' | null>(null);
  const { user } = useHomeContext();

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    toast.success(`${type === 'email' ? 'Email' : 'Phone number'} copied to clipboard`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <Card className="group w-[300px] border-none shadow-none mb-3 mx-auto sm:mx-0 rounded-xl bg-card overflow-hidden hover:border-primary/50 transition-all flex flex-col">

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
        <div className="absolute bottom-0 w-full left-0 right-0 p-4 backdrop-blur-xs rounded-tl-2xl rounded-tr-2xl bg-gradient-to-t from-black/90 via-black/40 to-transparent">

          {/* Floating Title */}
          <h3 className="font-bold text-md leading-tight text-white mb-3 transition-colors truncate">
            {service.title}
          </h3>

          <div className="flex w-full items-start justify-between gap-2">
            <div className="min-w-0 flex-1 w-full">
              {/* Interaction Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (user != undefined) setShowContact(!showContact);
                  else setOpenSignIn(true);
                }}
                className="cursor-pointer flex items-center gap-1 text-sm font-bold text-white hover:text-cyan-300 hover:gap-2 transition-all w-fit"
              >
                <span className="whitespace-nowrap">
                  {showContact ? "Hide contact" : "View contact"}
                </span>
                {showContact ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>

              {/* Contact Details Expansion */}
              {showContact && (
                <div className="mt-2 p-3 w-full rounded-lg bg-black/40 backdrop-blur-md border border-white/10 space-y-3 text-xs animate-in fade-in slide-in-from-top-2">
                  {/* Email Section */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-[10px] uppercase font-bold tracking-wider">Email</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(service.email, 'email')}
                          className="hover:text-primary transition-colors text-white/80"
                          title="Copy email"
                        >
                          {copiedType === 'email' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <a
                          href={`mailto:${service.email}`}
                          className="hover:text-primary transition-colors text-white/80"
                          title="Send email"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                    <span className="font-semibold text-white truncate w-full pr-1" title={service.email}>
                      {service.email}
                    </span>
                  </div>

                  {/* Phone Section */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-[10px] uppercase font-bold tracking-wider">Phone</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(service.contactNumber, 'phone')}
                          className="hover:text-primary transition-colors text-white/80"
                          title="Copy phone"
                        >
                          {copiedType === 'phone' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <a
                          href={`tel:${service.contactNumber}`}
                          className="hover:text-primary transition-colors text-white/80"
                          title="Call now"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                    <span className="font-semibold text-white">
                      {service.contactNumber}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-white/90 text-xs font-medium shrink-0 max-w-[100px]">
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