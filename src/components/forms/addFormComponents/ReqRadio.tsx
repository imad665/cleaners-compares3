'use client'
import React, { useState } from "react";
import { Label } from "../../ui/label";

export function ReqRadio({ defaultValue = undefined }: { defaultValue?: string }) {
  defaultValue = defaultValue?.toLocaleLowerCase();
  const [value, setValue] = useState<'new' | 'used' | 'like_new' | undefined>(defaultValue);
  return (
    <div className="space-y-3">
      <Label htmlFor="product_condition" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-medium">
        Product Condition <span className="text-red-500">*</span>
      </Label>

      <div className="flex gap-6">
        <div className="flex">
          <input checked={value === 'new'} onChange={() => setValue('new')} type="radio" id="new" name="product_condition" value="new" />
          <Label htmlFor="new" className="pl-1">New</Label>
        </div >

        <div className="flex">
          <input checked={value === 'used'} onChange={() => setValue('used')} type="radio" id="used" name="product_condition" value="used" />
          <Label htmlFor="used" className="pl-1">Used</Label>
        </div>


      </div>
    </div>
  )
}
