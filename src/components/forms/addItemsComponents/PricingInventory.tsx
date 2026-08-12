'use client'
import React, { useState } from "react";
import { ReqInput } from "./ReqInput";
import { VatSelector } from "./VatSelector";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "../../ui/select";
import { dataFeatureProduct } from "@/lib/payement/data";
import { Badge } from "../../ui/badge";
import getDelveryChargeFromWight from "@/lib/delivery_charge_from_weight";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Banknote, Package, Weight, Calendar, Zap, Info, TrendingDown, Truck } from "lucide-react";

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
}) {
  const [isFeatured, setIsFeatured] = useState(featureDays != null)
  const [featuredDuration, setFeaturedDuration] = useState(
    featureDays?.toString()
  )
  const [percent, setPercent] = useState(discount || 0)
  const [price2, setPrice2] = useState(price || 0)
  const [w, setw] = useState(weight)

  // New: track VAT type
  const [vatType, setVatType] = useState<"inc" | "exc">(isIncVAT ? "inc" : 'exc')

  // Apply VAT logic
  const basePrice =
    vatType === "inc" ? Number(price2) / (1 + VAT_RATE) : Number(price2) // store exc VAT internally
  const finalPrice = basePrice * (1 + VAT_RATE)

  const discountAmount = finalPrice * (Number(percent) / 100)
  const discountedPrice = finalPrice - discountAmount

  // apply hidden input for vatType for form submission
  return (
    <Card className="border-none shadow-none bg-transparent">
      <input type="hidden" name="isIncVAT" value={vatType === 'inc' ? 'true' : 'false'} />
      <CardHeader className="px-0 pt-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Banknote className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">Pricing & Inventory</CardTitle>
              <CardDescription className="text-base">
                Set your price, manage stock, and add promotional offers.
              </CardDescription>
            </div>
          </div>
          {featured && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 px-3 py-1 flex gap-1 items-center">
              <Zap className="w-3 h-3 fill-amber-700" />
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <div className="grid gap-6 p-6 rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* Price and VAT Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-green-50 rounded-md">
                  <Banknote className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-semibold text-gray-700">Set Price</span>
              </div>

              <div className="space-y-3 p-4 bg-gray-50/50 rounded-lg border border-gray-100">
                <ReqInput
                  labelText={`Product Price (£) ${vatType === "inc" ? "(Inc VAT)" : "(Exc VAT)"}`}
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={price2}
                  onChange={setPrice2}
                  step={0.01}
                  numberMin={0.01}
                />
                <VatSelector value={vatType} onChange={setVatType} />
              </div>
            </div>

            {/* Discount Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-rose-50 rounded-md">
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                </div>
                <span className="font-semibold text-gray-700">Promotions</span>
              </div>

              <div className="space-y-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100">
                <ReqInput
                  labelText="Discount (%)"
                  type="number"
                  name="discount"
                  placeholder="0"
                  numberMin={0}
                  defaultValue={discount}
                  required={false}
                  onChange={setPercent}
                />

                {percent > 0 && (
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded border border-green-100 animate-in fade-in slide-in-from-top-1">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-green-600 uppercase font-bold tracking-wider">Sale Price</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-700">£{discountedPrice?.toFixed(2)}</span>
                        <span className="text-xs text-gray-400 line-through">£{finalPrice?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <ReqInput
                  labelText="Discount End Date"
                  type="date"
                  name="discountEndDate"
                  placeholder="YYYY-MM-DD"
                  defaultValue={discountEndDate}
                  required={false}
                  info="Optional. Leave empty for permanent discount."
                />
              </div>
            </div>
          </div>

          {/* Inventory & Shipping Section */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-700">Inventory & Logistics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <ReqInput
                labelText="Inventory Stock"
                type="number"
                name="stock"
                placeholder="0"
                numberMin={0}
                defaultValue={stock || 20}
                info="Total quantity available for sale"
              />

              {selectedCategory !== "Machines" ? (
                <>
                  <ReqInput
                    labelText="Units per Pack"
                    type="number"
                    name="units"
                    placeholder="1"
                    defaultValue={units}
                    numberMin={1}
                    info="Number of items in one package"
                  />
                  <div className="space-y-2">
                    <ReqInput
                      labelText="Package Weight (kg)"
                      type="number"
                      name="weight"
                      placeholder="0"
                      numberMin={0}
                      defaultValue={weight}
                      info="Weight per unit/package"
                      onChange={(v) => setw(Number(v))}
                    />
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/50 rounded-md border border-blue-100/50 text-blue-700 text-xs">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Delivery: <strong>£{getDelveryChargeFromWight(w)}</strong></span>
                    </div>
                  </div>
                </>
              ) : (
                <ReqInput
                  labelText="Machine Delivery Charge (£)"
                  type="number"
                  name="delivery_charge"
                  placeholder="0"
                  numberMin={0}
                  defaultValue={machineDeliveryCharge}
                  info="Fixed delivery fee per machine"
                />
              )}
            </div>
          </div>

          {/* Featured Upgrade Section */}
          {!featured && (
            <div className="border-t border-gray-100 pt-6 mt-2">
              <div
                className={`p-5 rounded-xl border-2 transition-all duration-300 ${isFeatured ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100 bg-gray-50/30 hover:border-gray-200'
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-500'}`}>
                      <Zap className={`w-5 h-5 ${isFeatured ? 'fill-amber-600' : ''}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        Boost Visibility
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-amber-100 text-amber-700 border-none">Upgrade</Badge>
                      </h4>
                      <p className="text-sm text-gray-600">Get up to 10x more views by featuring your product at the top.</p>
                    </div>
                  </div>
                  <Checkbox
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={(checked) => setIsFeatured(Boolean(checked))}
                    className="h-6 w-6 rounded-md border-gray-300 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                  />
                </div>

                {isFeatured && (
                  <div className="mt-5 pl-12 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-2 max-w-sm">
                      <Label htmlFor="featuredDuration" className="text-sm font-semibold text-gray-700">
                        Select Promotion Duration
                      </Label>
                      <Select
                        name="featuredDuration"
                        value={featuredDuration}
                        onValueChange={(v) => setFeaturedDuration(v)}
                      >
                        <SelectTrigger className="w-full bg-white border-amber-200 focus:ring-amber-500">
                          <SelectValue placeholder="Choose plan" />
                        </SelectTrigger>
                        <SelectContent className="z-[20000]">
                          {dataFeatureProduct.map((feature: any) => (
                            <SelectItem key={feature.key} value={feature.key}>
                              {feature.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-amber-700 flex items-start gap-1">
                        <Info className="w-3 h-3 mt-0.5 shrink-0" />
                        Featured fees are non-refundable and will be charged upon product approval.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
