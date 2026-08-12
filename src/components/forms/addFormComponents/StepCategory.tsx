'use client'
import React from "react";
import { Cog, Wrench, Package, Store, LucideIcon } from "lucide-react";

// Since SprayCan might not be in all lucide versions, I'll use a fallback if it's missing, 
// but for now I'll try to import it. If it fails, I'll use another one.
import { SprayCan } from "lucide-react";

interface Category {
  label: string;
  hint: string;
  icon: LucideIcon;
}

const CATEGORIES: Category[] = [
  { label: "Machines", hint: "Washers, dryers, presses", icon: Cog },
  { label: "Parts & Components", hint: "Spares and replacements", icon: Wrench },
  { label: "Sundries & Supplies", hint: "Chemicals, hangers, covers", icon: SprayCan },
  { label: "Engineers & Services", hint: "Servicing and repairs", icon: Package },
  { label: "Businesses for Sale", hint: "Shops and plants", icon: Store },
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
        {CATEGORIES.map(({ label, hint, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => onPick(label)}
            className={`flex min-h-20 w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors ${
              selectedCategory === label 
                ? "border-blue-600 bg-blue-50" 
                : "border-border bg-background hover:border-blue-400"
            }`}
          >
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              selectedCategory === label ? "bg-blue-100" : "bg-gray-100"
            }`}>
              <Icon className={`h-6 w-6 ${selectedCategory === label ? "text-blue-600" : "text-gray-600"}`} />
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
