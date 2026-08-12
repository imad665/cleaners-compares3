'use client'
import React, { useState, useEffect } from "react";
import { Label } from "../../ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "../../ui/select";

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

  const handleSubCategoryChange = (v: string) => {
    const sub = subcategories.find((sbc) => sbc.name.replace(' ', '_') === v);
    if (sub) {
        const newId = sub.id || '';
        setSubCategoryId(newId);
        if (onSubCategoryChange) onSubCategoryChange(newId);
    }
  }

  if (subcategories.length === 0) return null;

  return (
    <div className="rounded-md bg-white shadow-sm m-2 p-6 space-y-3 px-5 border">
      <h3 className="tracking-tight text-xl font-medium text-gray-800 ">Subcategory</h3>
      <input type="hidden" name="subcategoryId" value={subcategoryId} />
      <input type="hidden" name="category" value={mainCategory.replace(' ', '_')} />
      <div className="space-y-1 grow">
        <Label>Select Subcategory <span className="text-red-500">*</span></Label>
        <Select
          defaultValue={subCategory?.replace(' ', '_')}
          name="subCategory"
          required
          onValueChange={handleSubCategoryChange}
        >
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select subcategory" />
          </SelectTrigger>
          <SelectContent className="z-5000000">
            {subcategories.map((s) => (
              <SelectItem key={s.name} value={s.name.replace(' ', '_')}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
