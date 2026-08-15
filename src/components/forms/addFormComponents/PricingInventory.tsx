'use client'
import React, { useState } from "react";
import { ReqInput } from "./ReqInput";
import { VatSelector } from "./VatSelector";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "../../ui/select";
import { dataFeatureProduct } from "@/lib/payement/data";
import { Badge } from "../../ui/badge";
import getDelveryChargeFromWight from "@/lib/delivery_charge_from_weight";
import { Truck } from "lucide-react";

const VAT_RATE = 0.2 // 20% VAT

export function PricingInventory({
  price = 1,
  discount = 0,
  discountEndDate = undefined,
  units = 1,
  weight = null,
  featured = false,
  featureDays = null,
  isIncVAT,
  selectedCategory,
  stock,
  machineDeliveryCharge,
  freeLocalDelivery = false,
  customerCollects = false,
  vatType0 = 'exc'
}: {
  price?: number
  discount?: number
  discountEndDate?: string
  units?: number
  weight?: number
  featureDays?: string
  selectedCategory?: string
  stock: number
  featured?: boolean,
  isIncVAT?: boolean,
  machineDeliveryCharge?: number
  freeLocalDelivery?: boolean
  customerCollects?: boolean
  vatType0?: 'exc' | 'inc' | 'no-vat'
}) {
  const [isFeatured, setIsFeatured] = useState(featureDays != null)
  const [featuredDuration, setFeaturedDuration] = useState(
    featureDays?.toString()
  )
  const [percent, setPercent] = useState(discount || 0)
  const [price2, setPrice2] = useState(price || 0)
  const [w, setw] = useState(weight)
  console.log(freeLocalDelivery, customerCollects, vatType0, "ooooooooooookkkk")

  const [deliveryType, setDeliveryType] = useState<"standard" | "free" | "collection">(
    freeLocalDelivery ? "free" : customerCollects ? "collection" : "standard"
  )

  // New: track VAT type
  const [vatType, setVatType] = useState<"inc" | "exc" | "no-vat">(vatType0)

  // Apply VAT logic
  const basePrice =
    vatType === "inc" ? Number(price2) / (1 + VAT_RATE) : Number(price2) // store exc VAT internally
  const finalPrice = vatType === "no-vat" ? basePrice : basePrice * (1 + VAT_RATE)

  const discountAmount = finalPrice * (Number(percent) / 100)
  const discountedPrice = finalPrice - discountAmount

  return (
    <div className="rounded-md bg-white shadow-sm m-2 p-6 space-y-3 px-5 border">
      <input type="hidden" name="isIncVAT" value={vatType === 'inc' ? 'true' : 'false'} />
      <input type="hidden" name="freeLocalDelivery" value={String(deliveryType === 'free')} />
      <input type="hidden" name="customerCollects" value={String(deliveryType === 'collection')} />
      <h3 className="tracking-tight text-xl font-medium text-gray-800">
        Pricing & Inventory
      </h3>
      <div className="flex gap-6 flex-wrap">
        <div className="flex flex-col gap-2">
          <ReqInput
            labelText={`Price (£) ${vatType === "inc" ? "(Inc VAT)" : vatType === "no-vat" ? "(No VAT)" : "(Exc VAT)"}`}
            type="number"
            name="price"
            placeholder="0.00"
            className="grow"
            defaultValue={price}
            onChange={setPrice2}
            step="0.01"
            numberMin={0.01}
          />
          <VatSelector value={vatType} onChange={setVatType} />
        </div>

        <div>
          <ReqInput
            labelText="Discount (%)"
            type="number"
            name="discount"
            placeholder="0"
            numberMin={0}
            className="grow"
            defaultValue={discount}
            required={false}
            onChange={setPercent}
          />
          {percent > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              <span className="line-through mr-2">£{finalPrice?.toFixed(2)}</span>
              ✅ New price £{discountedPrice?.toFixed(2)}
            </p>
          )}
        </div>

        <div className="grow space-y-2">
          <ReqInput
            labelText="Discount End Date"
            type="date"
            name="discountEndDate"
            placeholder="YYYY-MM-DD"
            defaultValue={discountEndDate}
            required={false}
          />
          <div className="text-muted-foreground text-xs">
            Optional. Leave empty for no end date.
          </div>
        </div>

        {selectedCategory !== "Machines" && (
          <ReqInput
            labelText="Units"
            type="number"
            name="units"
            placeholder="1"
            defaultValue={units}
            numberMin={1}
            info="(No of pieces in box/pack)"
          />
        )}

        <ReqInput
          labelText="Inventory Stock"
          type="number"
          name="stock"
          placeholder="0"
          numberMin={0}
          defaultValue={stock || 20}
          className="grow"
          info="(Available Stock)"
        />

        <div className="w-full pt-4 border-t mt-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Truck className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Delivery Method</span>
          </div>
          <RadioGroup
            value={deliveryType}
            onValueChange={(v: any) => setDeliveryType(v)}
            className="flex flex-wrap gap-x-8 gap-y-2"
          >
            <div className="flex items-center space-x-2 cursor-pointer">
              <RadioGroupItem value="standard" id="standard-delivery" />
              <Label htmlFor="standard-delivery" className="cursor-pointer">Standard Delivery</Label>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer">
              <RadioGroupItem value="free" id="free-delivery" />
              <Label htmlFor="free-delivery" className="cursor-pointer">Free Local Delivery</Label>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer">
              <RadioGroupItem value="collection" id="collection-delivery" />
              <Label htmlFor="collection-delivery" className="cursor-pointer">Customer Collects</Label>
            </div>
          </RadioGroup>
        </div>

        {deliveryType === 'standard' ? (
          <>
            {selectedCategory !== "Machines" ? (
              <div className="grow space-y-2">
                <ReqInput
                  labelText="Weight"
                  type="number"
                  name="weight"
                  placeholder="0"
                  numberMin={0}
                  defaultValue={weight}
                  className="grow"
                  info="(kg per box/package)"
                  onChange={(v) => setw(Number(v))}
                />
                <div className="text-muted-foreground text-xs">
                  Delivery charge: {getDelveryChargeFromWight(w)}£
                </div>
              </div>
            ) : (
              <ReqInput
                labelText="Delivery charge £"
                type="number"
                name="delivery_charge"
                placeholder="0"
                numberMin={0}
                defaultValue={machineDeliveryCharge}
                className="grow"
                info="(per machine)"
              />
            )}
          </>
        ) : (
          <div className="w-full flex items-center gap-2 p-3 bg-green-50 rounded border border-green-100 text-green-700 text-sm font-medium">
            <Truck className="w-4 h-4" />
            {deliveryType === 'free' ? 'Free Local Delivery' : 'Customer Collects'} (No delivery charge)
            <input type="hidden" name="delivery_charge" value="0" />
            <input type="hidden" name="weight" value="0" />
          </div>
        )}
      </div>

      {/* Featured product section */}
      {!featured && (
        <div className="pt-4 space-y-2 border-t mt-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="featured"
              checked={isFeatured}
              onCheckedChange={(checked) => setIsFeatured(Boolean(checked))}
            />
            <Label htmlFor="featured" className="text-base font-medium">
              Mark as Featured Product
            </Label>
          </div>
          {isFeatured && (
            <div className="space-y-2">
              <Label
                htmlFor="featuredDuration"
                className="text-base font-medium"
              >
                Select Duration & Fee
              </Label>
              <Select
                name="featuredDuration"
                value={featuredDuration}
                onValueChange={(v) => setFeaturedDuration(v)}
              >
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select a duration" />
                </SelectTrigger>
                <SelectContent className="z-20000">
                  {dataFeatureProduct.map((feature: any) => (
                    <SelectItem key={feature.key} value={feature.key}>
                      {feature.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-muted-foreground text-xs">
                This will charge you according to the selected duration.
              </div>
            </div>
          )}
        </div>
      )}
      {featured && (
        <Badge variant="outline" className="bg-green-100 border-1 border-green-500">
          Featured
        </Badge>
      )}
    </div>
  )
}
