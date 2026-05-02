import { Package, MapPin, Calendar } from "lucide-react";

export type WantedItem = {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    postedAt: string;
    budget?: string;
    contactName: string;
};

export const wantedItems: WantedItem[] = [
    {
        id: "wi-1",
        title: "Wanted: Used Electrolux Commercial Dryer",
        description:
            "Looking for a used Electrolux T5290 or similar 28kg commercial dryer in good working condition. Must be serviced recently.",
        category: "Machines",
        location: "Manchester, UK",
        postedAt: "2 days ago",
        budget: "£1,500 – £2,500",
        contactName: "James W.",
    },
    {
        id: "wi-2",
        title: "Wanted: Wire Hangers in Bulk (5,000+)",
        description:
            "Need a regular supplier for white wire hangers, 16\" size. Open to ongoing monthly orders.",
        category: "Sundries",
        location: "London, UK",
        postedAt: "5 days ago",
        budget: "Negotiable",
        contactName: "Aisha K.",
    },
    {
        id: "wi-3",
        title: "Wanted: Spare Parts for Miele PW6080",
        description:
            "Looking for door seals, drain pump, and control board for a Miele PW6080 washer. Genuine parts preferred.",
        category: "Parts",
        location: "Birmingham, UK",
        postedAt: "1 week ago",
        contactName: "Tom R.",
    },
];

export const wantedFactIcons = {
    category: Package,
    location: MapPin,
    postedAt: Calendar,
};
