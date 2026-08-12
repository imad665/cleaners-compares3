'use client'
import React, { useState } from "react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";

export function ReqRadio({ defaultValue = undefined }: { defaultValue?: string }) {
  const normalizedDefault = defaultValue?.toLowerCase() as 'new' | 'used' | undefined;
  const [value, setValue] = useState<'new' | 'used' | undefined>(normalizedDefault);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="product_condition" className="text-base font-semibold text-gray-800">
          Product Condition <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">Specify if the item is brand new or previously owned.</p>
      </div>

      <RadioGroup
        name="product_condition"
        value={value}
        onValueChange={(v) => setValue(v as 'new' | 'used')}
        className="flex gap-4"
        required
      >
        <div 
          className={`flex items-center space-x-3 rounded-lg border-2 p-4 transition-all cursor-pointer hover:border-primary/50 ${
            value === 'new' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200'
          }`}
          onClick={() => setValue('new')}
        >
          <RadioGroupItem value="new" id="new" className="h-5 w-5" />
          <Label htmlFor="new" className="cursor-pointer font-medium text-gray-700">
            New
          </Label>
        </div>

        <div 
          className={`flex items-center space-x-3 rounded-lg border-2 p-4 transition-all cursor-pointer hover:border-primary/50 ${
            value === 'used' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200'
          }`}
          onClick={() => setValue('used')}
        >
          <RadioGroupItem value="used" id="used" className="h-5 w-5" />
          <Label htmlFor="used" className="cursor-pointer font-medium text-gray-700">
            Used
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
