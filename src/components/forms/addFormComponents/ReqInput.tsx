'use client'
import React, { useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";

export type ReqInputType = {
  labelText: string
  placeholder: string
  type: string
  name: string
  isTextArea?: boolean
  className?: string
  numberMin?: number
  defaultValue?: any
  required?: boolean
  onChange?: (v: any) => void
  step?: number;
  info?: string
}

export function ReqInput({ labelText, className, info, step = null, placeholder, type, name, onChange = null, isTextArea = false, numberMin = -1, defaultValue = '', required = true }: ReqInputType) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-medium">

        {labelText}
        {info && <div className="text-muted-foreground text-xs">{info}</div>}
        {required ? <span className="text-red-500">*</span> :
          <span className=" text-muted-foreground text-sm">(optional)</span>
        }

      </Label>
      {!isTextArea ? <Input
        id={name}
        type={type}
        min={type === 'number' ? numberMin : 0}
        name={name}
        value={value}
        step={type === 'number' && step ? step : 1}
        required={required}
        onChange={(e) => {
          setValue(e.target.value)
          if (onChange) onChange(e.target.value)
        }}
        placeholder={placeholder} /> :
        <Textarea value={value} onChange={(e) => setValue(e.target.value)} rows={8} name={name} placeholder={placeholder} />}
    </div>
  )
}
