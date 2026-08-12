'use client'
import React, { useState, useEffect } from "react";
import { Label } from "../../ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "../../ui/select";

export function ProductCategory({ id = '', categories, mainCategory = '', subCategory = '', setSelectedCategory }: {
  categories: { name: string, children: { name: string, id?: string }[] }[],
  mainCategory?: string,
  subCategory?: string,
  id?: string,
  setSelectedCategory?: (v: string) => void,
}) {
  const [subcategories, setSubcategories] = useState<{ name: string, id?: string }[]>([]);
  const [subcategoryId, setSubCategoryId] = useState(id);
  const handleCategoryChange = (v: string) => {
    const category = categories.find((c) => c.name === v.replace('_', ' '));
    if (setSelectedCategory) setSelectedCategory(v);
    setSubcategories(category?.children || []);
  }
  const handleSubCategoryChange = (v: string) => {
    const sub = subcategories.find((sbc) => sbc.name === v.replace('_', ' '));
    if (sub) {
        setSubCategoryId(sub.id || '');
    }
  }

  useEffect(() => {
    if (mainCategory) { handleCategoryChange(mainCategory) }
  }, []);

  return (
    <div className="rounded-md bg-white shadow-sm m-2 p-6 space-y-3 px-5 border-1">
      <h3 className="tracking-tight text-xl font-medium text-gray-800 ">Product Category</h3>
      <Label htmlFor='category' className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-medium">
        Categories <span className="text-red-500">*</span>
      </Label>
      <input type="hidden" name="subcategoryId" value={subcategoryId} />
      <div className="flex gap-6 flex-wrap">
        <div className="space-y-1 grow z-10">
          <Label>Main Category</Label>
          <Select
            defaultValue={mainCategory?.replace(' ', '_')}
            name="category"
            required onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[200px] z-500000">
              <SelectValue placeholder="Select Main Catgory" />
            </SelectTrigger>
            <SelectContent className="z-5000000">
              {categories.map((c) => (
                <SelectItem key={c.name} value={c.name.replace(' ', '_')}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1 grow">
          <Label>Subcategory</Label>
          <Select
            defaultValue={subCategory?.replace(' ', '_')}
            name="subCategory"
            required
            onValueChange={handleSubCategoryChange}
          >
            <SelectTrigger className="w-[200px]">
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
    </div>
  )
}
