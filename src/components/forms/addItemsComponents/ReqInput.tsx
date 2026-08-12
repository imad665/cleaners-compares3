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
  value?: any
  required?: boolean
  onChange?: (v: any) => void
  step?: number;
  info?: string
}

export function ReqInput({ labelText, className, info, step = null, placeholder, type, name, onChange = null, isTextArea = false, numberMin = -1, defaultValue = '', value: controlledValue, required = true }: ReqInputType) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const displayValue = isControlled ? controlledValue : internalValue;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-col gap-1">
        <Label htmlFor={name} className="text-base font-semibold text-gray-800">
          {labelText}
          {required ? <span className="text-red-500 ml-1">*</span> :
            <span className="text-muted-foreground text-xs font-normal ml-1">(optional)</span>
          }
        </Label>
        {info && <p className="text-muted-foreground text-xs leading-relaxed">{info}</p>}
      </div>
      
      {!isTextArea ? (
        <Input
          id={name}
          type={type}
          min={type === 'number' ? numberMin : 0}
          name={name}
          value={displayValue}
          step={type === 'number' && step ? step : 1}
          required={required}
          className="focus-visible:ring-primary transition-all duration-200"
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value)
            if (onChange) onChange(e.target.value)
          }}
          placeholder={placeholder}
        />
      ) : (
        <Textarea 
          value={displayValue} 
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value)
            if (onChange) onChange(e.target.value)
          }} 
          rows={6} 
          name={name} 
          className="focus-visible:ring-primary transition-all duration-200 min-h-[120px] resize-none"
          placeholder={placeholder} 
        />
      )}
    </div>
  )
}
