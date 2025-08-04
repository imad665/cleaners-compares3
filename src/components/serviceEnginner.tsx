'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SignInUpModal } from "./header/header";
import { useHomeContext } from "@/providers/homePageProvider";

interface Service {
  title: string;
  description: string;
  ratePerHour: number;
  areaOfService: string;
  companyType: string;
  experience: string;
  email: string;
  contactNumber: string;
  pictureUrl?: string;
}

export default function ServiceCard({ service }: { service: Service }) {
  const [showContact, setShowContact] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const { user } = useHomeContext();
  return (
    <Card className="max-w-md grow w-[280px] mx-auto shadow-md rounded-2xl overflow-hidden">
      {service.pictureUrl && (
        <img
          src={service.pictureUrl}
          alt={service.title}
          className="w-full h-48 object-cover"
        />
      )}

      <CardContent className="p-5">
        {service.isFeatured && <Badge variant='default' className="bg-green-200 text-black">Featured</Badge>}
        <h3 className="text-xl font-bold mb-1">{service.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
        <div className="flex flex-col justify-between ">
          <div className="space-y-1 text-sm grow">
            <p>
              <strong>Rate:</strong> £{service.ratePerHour}/hr
            </p>
            <p>
              <strong>Area:</strong> {service.areaOfService}
            </p>
            <p>
              <strong>Experience:</strong> {service.experience}
            </p>
            <p>
              <strong>Company Type:</strong>{" "}
              <Badge variant="outline">{service.companyType}</Badge>
            </p>
          </div>

          <Button
            onClick={() => {
              if (user != undefined) setShowContact(!showContact);
              else {
                setOpenSignIn(true);
              }
            }}
            className="mt-4 w-full"
            variant="secondary"
          >
            {showContact ? (
              <>
                Hide Contact Info <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Show Contact Info <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        <SignInUpModal
          openSignIn={openSignIn}
          openSignUp={openSignUp}
          setOpenSignIn={setOpenSignIn}
          setOpenSignUp={setOpenSignUp}
        />



        {showContact && (
          <div className="mt-4 space-y-1 text-sm">
            <p>
              <strong>Email:</strong> {service.email}
            </p>
            <p>
              <strong>Phone:</strong> {service.contactNumber}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
