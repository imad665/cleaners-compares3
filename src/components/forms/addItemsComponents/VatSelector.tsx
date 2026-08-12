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
        className="flex items-center gap-6"
        name="vat-selector"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="inc" id="inc" />
          <Label htmlFor="inc" className="cursor-pointer text-sm font-medium">Inc VAT</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="exc" id="exc" />
          <Label htmlFor="exc" className="cursor-pointer text-sm font-medium">Exc VAT</Label>
        </div>
      </RadioGroup>
    </div>
  )
}
