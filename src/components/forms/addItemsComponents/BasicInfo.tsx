'use client'
import React from "react";
import { ReqInput } from "./ReqInput";
import { ReqRadio } from "./ReqRadio";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Info, FileText, Tag } from "lucide-react";

export function BasicInfo({ name = '', description = '', productionCondition = '' }: {
  name?: string,
  description?: string,
  productionCondition?: string
}) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">Basic Information</CardTitle>
            <CardDescription className="text-base">
              Start with the essential details of your product to help users find it easily.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-0 space-y-8">
        <div className="grid gap-6 p-6 rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex items-start gap-3">
             <div className="mt-1">
                <Tag className="w-4 h-4 text-muted-foreground" />
             </div>
             <div className="flex-1">
                <ReqInput
                  labelText="Product Title"
                  name="title"
                  defaultValue={name}
                  placeholder="e.g., Premium Wireless Headphones"
                  info="Make it catchy and descriptive (max 100 characters)"
                  type="text"
                />
             </div>
          </div>

          <div className="flex items-start gap-3 border-t border-gray-50 pt-6">
             <div className="mt-1">
                <FileText className="w-4 h-4 text-muted-foreground" />
             </div>
             <div className="flex-1">
                <ReqInput
                  labelText="Product Description"
                  placeholder="Tell buyers about the features, specs, and why they should buy it..."
                  name="description"
                  type=""
                  defaultValue={description}
                  isTextArea={true}
                  info="Describe your product's key selling points and condition details."
                />
             </div>
          </div>

          <div className="border-t border-gray-50 pt-6 pl-7">
            <ReqRadio defaultValue={productionCondition} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
