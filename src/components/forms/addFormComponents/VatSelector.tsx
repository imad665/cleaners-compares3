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
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as "inc" | "exc")}
      className="flex items-center gap-6"
      name="vat"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="inc" id="inc" />
        <Label htmlFor="inc">Inc VAT</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="exc" id="exc" />
        <Label htmlFor="exc">Exc VAT</Label>
      </div>
    </RadioGroup>
  )
}
