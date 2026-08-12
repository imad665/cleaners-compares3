'use client'
import React from "react";
import { Cog, Wrench, Package, Store, LucideIcon, Search } from "lucide-react";

// Since SprayCan might not be in all lucide versions, I'll use a fallback if it's missing, 
// but for now I'll try to import it. If it fails, I'll use another one.
import { SprayCan } from "lucide-react";

interface Category {
  label: string;
  hint: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const CATEGORIES: Category[] = [
  {
    label: "Machines",
    hint: "Washers, dryers, presses",
    icon: Cog,
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    label: "Parts & Components",
    hint: "Spares and replacements",
    icon: Wrench,
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    label: "Sundries & Supplies",
    hint: "Chemicals, hangers, covers",
    icon: SprayCan,
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    label: "Engineers & Services",
    hint: "Servicing and repairs",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    label: "Businesses for Sale",
    hint: "Shops and plants",
    icon: Store,
    color: "text-amber-600",
    bgColor: "bg-amber-100"
  },
  {
    label: "Wanted Items",
    hint: "Add New Wanted Item",
    icon: Search,
    color: "text-rose-600",
    bgColor: "bg-rose-100"
  },
];

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <p className="text-muted-foreground">{sub}</p>
    </div>
  );
}

export function StepCategory({ onPick, selectedCategory }: { onPick: (c: string) => void, selectedCategory?: string }) {
  return (
    <div className="rounded-md bg-white shadow-sm m-2 p-6 space-y-3 px-5 border">
      <Heading title="What are you selling?" sub="Tap a category to get started." />
      <div className="grid gap-3 sm:grid-cols-2">
        {CATEGORIES.map(({ label, hint, icon: Icon, color, bgColor }) => (
          <button
            key={label}
            type="button"
            onClick={() => onPick(label)}
            className={`flex min-h-20 w-full cursor-pointer items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${selectedCategory === label
              ? "border-blue-600 bg-blue-50/50 shadow-sm"
              : "border-border bg-background hover:border-blue-400 hover:shadow-sm"
              }`}
          >
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${selectedCategory === label ? "bg-blue-600" : bgColor
              }`}>
              <Icon className={`h-6 w-6 transition-colors ${selectedCategory === label ? "text-white" : color}`} />
            </span>
            <span>
              <span className="block text-lg font-bold text-foreground">{label}</span>
              <span className="block text-sm text-muted-foreground">{hint}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
