'use client'
import React from "react";
import { ReqInput } from "./ReqInput";
import { ReqRadio } from "./ReqRadio";

export function BasicInfo({ name = '', description = '', productionCondition = '' }: {
  name?: string,
  description?: string,
  productionCondition?: string
}) {
  return (
    <div className="rounded-md bg-white shadow-sm m-2 p-6 space-y-3 px-5 border-1">
      <h3 className="tracking-tight  text-xl font-medium text-gray-800 ">Basic Information</h3>
      <div className="space-y-4">
        <ReqInput
          labelText="Product Title"
          name="title"
          defaultValue={name}
          placeholder="Enter a descriptive title for your product"
          type="text" />
        <ReqInput
          labelText="Product Description"
          placeholder="Provide a detailed description of your product"
          name="description"
          type=""
          defaultValue={description}
          isTextArea={true}
        />
        <ReqRadio defaultValue={productionCondition} />
      </div>
    </div>
  )
}
