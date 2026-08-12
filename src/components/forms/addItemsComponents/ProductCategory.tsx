'use client'
import React, { useState, useEffect } from "react";
import { Label } from "../../ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "../../ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Layers, ChevronRight } from "lucide-react";

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
    const categoryName = v.replace('_', ' ');
    const category = categories.find((c) => c.name === categoryName);
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
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">Product Category</CardTitle>
            <CardDescription className="text-base">
              Proper categorization ensures your product appears in relevant searches.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm">
          <input type="hidden" name="subcategoryId" value={subcategoryId} />
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="space-y-2 flex-1 w-full">
              <Label htmlFor='category' className="text-sm font-semibold text-gray-700">
                Main Category <span className="text-red-500">*</span>
              </Label>
              <Select
                defaultValue={mainCategory?.replace(' ', '_')}
                name="category"
                required 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full h-12 bg-gray-50/50 border-gray-100 focus:ring-primary transition-all">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent className="z-[5000000]">
                  {categories.map((c) => (
                    <SelectItem key={c.name} value={c.name.replace(' ', '_')}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:flex mt-6">
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </div>

            <div className="space-y-2 flex-1 w-full">
              <Label htmlFor='subCategory' className="text-sm font-semibold text-gray-700">
                Subcategory <span className="text-red-500">*</span>
              </Label>
              <Select
                defaultValue={subCategory?.replace(' ', '_')}
                name="subCategory"
                required
                onValueChange={handleSubCategoryChange}
                disabled={subcategories.length === 0}
              >
                <SelectTrigger className="w-full h-12 bg-gray-50/50 border-gray-100 focus:ring-primary transition-all">
                  <SelectValue placeholder={subcategories.length > 0 ? "Choose a subcategory" : "Select main category first"} />
                </SelectTrigger>
                <SelectContent className="z-[5000000]">
                  {subcategories.map((s) => (
                    <SelectItem key={s.name} value={s.name.replace(' ', '_')}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {subcategories.length === 0 && !mainCategory && (
             <div className="mt-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex gap-2 items-center text-xs text-blue-700">
                <ChevronRight className="w-4 h-4" />
                Please select a main category to see available subcategories.
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
