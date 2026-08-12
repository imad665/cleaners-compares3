'use client'
import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function SubCategorySelector({
  id = '',
  categories,
  mainCategory,
  subCategory = '',
  onSubCategoryChange
}: {
  categories: { name: string, children: { name: string, id?: string }[] }[],
  mainCategory: string,
  subCategory?: string,
  id?: string,
  onSubCategoryChange?: (id: string) => void
}) {
  const [subcategories, setSubcategories] = useState<{ name: string, id?: string }[]>([]);
  const [subcategoryId, setSubCategoryId] = useState(id);

  useEffect(() => {
    const category = categories.find((c) => c.name.toLowerCase() === mainCategory.toLowerCase().replace('_', ' '));
    setSubcategories(category?.children || []);
  }, [mainCategory, categories]);

  const handleSubCategoryClick = (sub: { name: string, id?: string }) => {
    const newId = sub.id || '';
    setSubCategoryId(newId);
    if (onSubCategoryChange) onSubCategoryChange(newId);
  }

  if (subcategories.length === 0) return null;

  return (
    <div className="rounded-md bg-white shadow-sm m-2 p-6 space-y-4 px-5 border">
      <div>
        <h3 className="tracking-tight text-xl font-bold text-gray-800 ">Select Subcategory</h3>
        <p className="text-sm text-muted-foreground">Pick the most relevant subcategory for your {mainCategory}.</p>
      </div>
      
      <input type="hidden" name="subcategoryId" value={subcategoryId} />
      <input type="hidden" name="category" value={mainCategory.replace(' ', '_')} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {subcategories.map((s) => {
          const isSelected = subcategoryId === s.id;
          return (
            <button
              key={s.id || s.name}
              type="button"
              onClick={() => handleSubCategoryClick(s)}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left group",
                isSelected 
                  ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" 
                  : "border-gray-200 bg-white hover:border-blue-400 hover:bg-gray-50"
              )}
            >
              <span className={cn(
                "text-sm font-semibold transition-colors",
                isSelected ? "text-blue-700" : "text-gray-700"
              )}>
                {s.name}
              </span>
              {isSelected && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {/* Hidden check for required validation if needed could be added here or handled by the parent */}
    </div>
  )
}
