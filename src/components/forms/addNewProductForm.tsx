
'use client'
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { ProducImageAndMedia } from "./clientsUi";
import React, { useActionState, useEffect, useRef, useState } from "react";
import { addNewProductAction } from "@/actions/addNewProductAction";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import { dataFeatureProduct } from "@/lib/payement/data";
import { Badge } from "../ui/badge";
import getDelveryChargeFromWight from "@/lib/delivery_charge_from_weight";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
type ReqInputType = {
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
function ReqInput({ labelText, className, info, step = null, placeholder, type, name, onChange = null, isTextArea = false, numberMin = -1, defaultValue = '', required = true }: ReqInputType) {
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
function ReqRadio({ defaultValue = undefined }: { defaultValue?: string }) {
    defaultValue = defaultValue?.toLocaleLowerCase();
    const [value, setValue] = useState<'new' | 'used' | 'like_new' | undefined>(defaultValue);
    return (
        <div className="space-y-3">
            <Label htmlFor="product_condition" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-medium">
                Product Condition <span className="text-red-500">*</span>
            </Label>

            <div className="flex gap-6">
                <div className="flex">
                    <input checked={value === 'new'} onChange={() => setValue('new')} type="radio" id="new" name="product_condition" value="new" />
                    <Label htmlFor="new" className="pl-1">New</Label>
                </div >

                <div className="flex">
                    <input checked={value === 'used'} onChange={() => setValue('used')} type="radio" id="used" name="product_condition" value="used" />
                    <Label htmlFor="used" className="pl-1">Used</Label>
                </div>

                {/*  <div className="flex">
                    <input checked={value === 'like_new'} onChange={() => setValue('like_new')} type="radio" id="like_new" name="product_condition" value="like_new" />
                    <Label htmlFor="like_new" className="pl-1">Like New</Label>
                </div> */}
            </div>




        </div>
    )
}

function BasicInfo({ name = '', description = '', productionCondition = '' }: {
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
{/* <div className="grow space-y-2">
                    <ReqInput
                        labelText="Product Weight (kg)"
                        type="number"
                        name="weight"
                        placeholder="e.g. 10 kg"
                        numberMin={0}
                        defaultValue={weight}
                        className="w-full"
                    />
                    <div className="text-muted-foreground text-xs">
                        Delivery Charge Guide:
                        <ul className="list-disc list-inside mt-1 text-gray-500">
                            <li>Under 10kg: £5</li>
                            <li>10kg - 30kg: £10</li>
                            <li>Over 30kg (pallet): £20</li>
                            <li>Free delivery on orders over £250</li>
                        </ul>
                    </div>
                </div> */}






function VatSelector({
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

 

// your ReqInput, getDelveryChargeFromWight, dataFeatureProduct should be imported

const VAT_RATE = 0.2 // 20% VAT

function PricingInventory({
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
  isIncVAT?:boolean,
  machineDeliveryCharge?:number
}) {
  const [isFeatured, setIsFeatured] = useState(featureDays != null)
  const [featuredDuration, setFeaturedDuration] = useState(
    featureDays?.toString()
  )
  const [percent, setPercent] = useState(discount || 0)
  const [price2, setPrice2] = useState(price || 0)
  const [w, setw] = useState(weight)

  // New: track VAT type
  const [vatType, setVatType] = useState<"inc" | "exc">(isIncVAT? "inc":'exc')

  // Apply VAT logic
  const basePrice =
    vatType === "inc" ? price2 / (1 + VAT_RATE) : price2 // store exc VAT internally
  const finalPrice =
    vatType === "inc" ? basePrice * (1 + VAT_RATE) : basePrice

  const discountAmount = finalPrice * (percent / 100)
  const discountedPrice = finalPrice - discountAmount

  return (
    <div className="rounded-md bg-white shadow-sm m-2 p-6 space-y-3 px-5 border">
      <h3 className="tracking-tight text-xl font-medium text-gray-800">
        Pricing & Inventory
      </h3>
      <div className="flex gap-6 flex-wrap">
        <div className="flex flex-col gap-2">
          <ReqInput
            labelText={`Price (£) ${vatType === "inc" ? "(Inc VAT)" : "(Exc VAT)"}`}
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
              <span className="line-through mr-2">£{finalPrice.toFixed(2)}</span>
              ✅ New price £{discountedPrice.toFixed(2)}
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

        {selectedCategory !== "Machines" && (
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
              onChange={setw}
            />
            <div className="text-muted-foreground text-xs">
              Delivery charge: {getDelveryChargeFromWight(w)}£
            </div>
          </div>
        )}

        {selectedCategory == "Machines" && (
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
                  {dataFeatureProduct.map((feature) => (
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

 



function ProductCategory({ id = '', categories, mainCategory = '', subCategory = '', setSelectedCategory }: {
    categories: { name: string, children: { name: string }[] }[],
    mainCategory?: string,
    subCategory?: string,
    id?: string,
    setSelectedCategory?: (v: string) => void,
}) {
    const [subcategories, setSubcategories] = useState<{ name: string }[]>([]);
    const [subcategoryId, setSubCategoryId] = useState(id);
    const handleCategoryChange = (v: string) => {
        //console.log(v, ';;;;;;', categories, '???????????');
        const category = categories.find((c) => c.name === v.replace('_', ' '));
        if (setSelectedCategory) setSelectedCategory(v);
        setSubcategories(category?.children || []);
    }
    const handleSubCategoryChange = (v: string) => {
        const id = subcategories.find((sbc) => sbc.name === v.replace('_', ' ')).id;
        setSubCategoryId(id);
    }
    console.log(subcategoryId, mainCategory, subCategory, 'oooooo-------ooooo');

    useEffect(() => {
        if (mainCategory) { handleCategoryChange(mainCategory) }
    }, []);
    return (
        <div className="rounded-md bg-white shadow-sm m-2 p-6 space-y-3 px-5 border-1">
            <h3 className="tracking-tight text-xl font-medium text-gray-800 ">Product Category</h3>
            <Label htmlFor='categoy' className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-medium">
                Categories <span className="text-red-500">*</span>
            </Label>
            <input type="hidden" name="subcategoryId" value={subcategoryId} />
            <div className="flex gap-6 flex-wrap">
                <div className="space-y-1 grow z-10">
                    <Label>Main Category</Label>
                    <Select

                        defaultValue={mainCategory?.replace(' ', '_')}
                        name="category"
                        required onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-[200px] z-500000">
                            <SelectValue placeholder="Select Main Catgory" />
                        </SelectTrigger>
                        <SelectContent className="z-5000000">
                            {/* <SelectItem value="new">Used Machines</SelectItem>
                            <SelectItem value="used">New Machines</SelectItem>
                            <SelectItem value="like_new">Parts</SelectItem> */}
                            {categories.map((c) => (
                                <SelectItem key={c.name} value={c.name.replace(' ', '_')}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1 grow">
                    <Label>Subcategory</Label>
                    <Select
                        defaultValue={subCategory?.replace(' ', '_')}
                        name="subCategory"
                        required
                        onValueChange={handleSubCategoryChange}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent className="z-5000000">
                            {/* <SelectItem value="new">Laundry</SelectItem>
                            <SelectItem value="used">Dry Cleaning</SelectItem>
                            <SelectItem value="like_new">Finishing Equipement</SelectItem> */}
                            {subcategories.map((s) => (
                                <SelectItem key={s.name} value={s.name.replace(' ', '_')}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* <div className="space-y-1 grow">
                    <Label>Detailed Category <span className="text-sm text-muted-foreground">(Optional)</span></Label>
                    <Select >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="new">Laundry</SelectItem>
                            <SelectItem value="used">Dry Cleaning</SelectItem>
                            <SelectItem value="like-new">Finishing Equipement</SelectItem>
                        </SelectContent>
                    </Select>
                </div> */}
            </div>


        </div>
    )
}

type NewProductType = {

    name?: string,
    description?: string
    productionCondition?: 'New' | 'Used' | 'Like New'
    imagesUrl?: string[]
    videoUrl?: string
    price?: number,
    discount?: number,
    discountEnd?: string,
    stock?: number,
    productId?: string
    subCategoryId?: string
    stockQuantity?: number
    isEditing: boolean
    status?: 'active' | 'hidden'
    categories: { category: { name: string, children: { name: string }[] } },
    mainCategory?: string
    subCategory?: string
    featureDays?: string
    weight?: number
    isFeatured?: boolean
    dealeEnd?: string
    onSuccessEditing?: () => void
    onFailedEditing?: () => void
}
/*
onSuccessEditing={onSuccessEditing}
onFailedEditing = {onFailedEditing}
*/
export function AddNewProductForm({
    name,
    description,
    productionCondition,
    imagesUrl,
    videoUrl,
    price,
    isIncVAT,
    discount,
    discountEnd,
    stockQuantity,
    isEditing,
    categories,
    mainCategory,
    subCategory,
    subCategoryId,
    productId,
    weight,
    featureDays,
    isFeatured,
    stock,
    dealeEnd,
    onSuccessEditing,
    onFailedEditing,
    machineDeliveryCharge,
}: any) {
    //alert(subCategoryId)
    const [images, setImages] = useState<{ id: string, url: string, file: File }[]>([]);
    const [video, setVideo] = useState<{ id: string, url: string, file: File } | null>(null);
    const submitTypeRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [state, action, pending] = useActionState(addNewProductAction, undefined);
    const [selectedCategory, setSelectedCategory] = useState('');
    //console.log(video,videoUrl, 'yyyyyyyyyyyyyyyyyyyyggggggggggg');

    useEffect(() => {
        setImages(imagesUrl?.map((i, index) => ({ id: `id_${index}`, url: i, file: undefined })) || [])
        setVideo(videoUrl ? { id: 'video', url: videoUrl || '', file: undefined } : null);
    }, []);

    useEffect(() => {
        if (!state) return;
        if (state.success) {
            toast.success(state.message);
            const url = state.url;
            if (url) router.push(url)
            else if (onSuccessEditing) onSuccessEditing();

        } else {
            toast.error(state.error);
            if (onFailedEditing) onFailedEditing();
        }
    }, [state]);

    const handleAction = (formData: FormData) => {
        //console.log(images, video, isEditing, ';;;;;;;');

        images.forEach((img) => {
            formData.append(img.file ? 'imagesFile' : 'imageUrls', img.file ? img.file : img.url);
        });
        if (video) {
            formData.append(video.file ? 'videoFile' : 'videoUrl', video.file ? video.file : video.url)
        }
        action(formData)
    }
    // console.log(name, description, productionCondition, discountEnd, '+++++++++++++');

    return (
        <div className="w-full ">
            <form action={handleAction} className="container max-w-[900px] m-auto">
                <input type="hidden" name="submitType" ref={submitTypeRef} />
                {isEditing && <input type="hidden" name="productId" value={productId} />}
                <BasicInfo
                    name={name}
                    description={description}
                    productionCondition={productionCondition}
                />
                <ProducImageAndMedia
                    images={images} video={video}
                    setImages={setImages} setVideo={setVideo}
                />
                <ProductCategory
                    mainCategory={mainCategory}
                    subCategory={subCategory}
                    id={subCategoryId}
                    setSelectedCategory={setSelectedCategory}
                    categories={categories} />
                <PricingInventory
                    date={discountEnd && discountEnd.split("T")[0]}
                    discount={discount}
                    price={price}
                    isIncVAT={isIncVAT}
                    units={stockQuantity}
                    weight={weight}
                    featureDays={featureDays}
                    selectedCategory={selectedCategory}
                    stock={stock}
                    featured={isFeatured}
                    discountEndDate={dealeEnd}
                    machineDeliveryCharge={machineDeliveryCharge}
                />


                <hr className="w-full h-1 my-5" />
                <div className="mb-10 flex gap-5 justify-end">
                    {/* {!isEditing && <Button
                        disabled={pending}
                        variant="outline"
                        type="submit"
                        onClick={() => {
                            if (submitTypeRef.current) submitTypeRef.current.value = 'draft';
                        }}
                    >
                        Save as Draft
                    </Button>} */}
                    <Button
                        disabled={pending}
                        type="submit"
                        className="bg-blue-700 hover:bg-blue-600"
                        onClick={() => {
                            if (submitTypeRef.current) submitTypeRef.current.value = 'post';
                        }}
                    >
                        {!isEditing ? 'Post Product' : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
