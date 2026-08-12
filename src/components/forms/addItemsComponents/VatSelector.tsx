'use client'
import React from "react";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";

export function VatSelector({
  value,
  onChange,
}: {
  value: "inc" | "exc"
  onChange: (v: "inc" | "exc") => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">VAT Type</Label>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as "inc" | "exc")}
        className="flex items-center gap-1 p-1 bg-gray-100/80 rounded-lg w-fit"
        name="vat"
      >
        <div 
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            value === 'inc' ? 'bg-white shadow-sm' : 'hover:bg-gray-200/50'
          }`}
          onClick={() => onChange('inc')}
        >
          <RadioGroupItem value="inc" id="inc" className="sr-only" />
          <Label htmlFor="inc" className="cursor-pointer text-sm font-medium whitespace-nowrap px-1">
            Inc VAT
          </Label>
        </div>
        <div 
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            value === 'exc' ? 'bg-white shadow-sm' : 'hover:bg-gray-200/50'
          }`}
          onClick={() => onChange('exc')}
        >
          <RadioGroupItem value="exc" id="exc" className="sr-only" />
          <Label htmlFor="exc" className="cursor-pointer text-sm font-medium whitespace-nowrap px-1">
            Exc VAT
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
