'use client'
import { Button } from "../ui/button";
import { ProducImageAndMedia } from "./clientsUi";
import React, { useActionState, useEffect, useRef, useState } from "react";
import { addNewProductAction } from "@/actions/addNewProductAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SellerForm } from "./sellerForm";
import { useHomeContext } from "@/providers/homePageProvider";
import { BasicInfo } from "./addFormComponents/BasicInfo";
import { PricingInventory } from "./addFormComponents/PricingInventory";
import { ProductCategory } from "./addFormComponents/ProductCategory";

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
  customerCollects,
  freeLocalDelivery,
  vatType,
}: any) {
  const [images, setImages] = useState<{ id: string, url: string, file: File }[]>([]);
  const [video, setVideo] = useState<{ id: string, url: string, file: File } | null>(null);
  const submitTypeRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [state, action, pending] = useActionState(addNewProductAction, undefined);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { user } = useHomeContext();

  const role: "SELLER" | "BUYER" | undefined = user?.role;
  //console.log({ customerCollects, freeLocalDelivery, vatType }, 'dddddddddddddddllllllllllllllll');


  useEffect(() => {
    setImages(imagesUrl?.map((i: string, index: number) => ({ id: `id_${index}`, url: i, file: undefined })) || [])
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
      formData.append(img.file ? 'imagesFile' : 'imageUrls', img.file ? (img.file as any) : img.url);
    });
    if (video) {
      formData.append(video.file ? 'videoFile' : 'videoUrl', video.file ? (video.file as any) : video.url)
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
          customerCollects={customerCollects}
          freeLocalDelivery={freeLocalDelivery}
          vatType0={vatType}
        />
        {user && role == 'BUYER' && <div className="flex flex-col gap-4 border p-3 rounded-md">
          <h2 className="font-bold text-xl">Become a Seller:</h2>
          <SellerForm callback="/" redirect={false} onSuccess={() => {
          }} />

          {/* {!user && <SellerForm2 callback={"admin/addNewProduct"} />} */}

        </div>}


        <hr className="w-full h-1 my-5" />
        <div className="mb-10 flex gap-5 justify-end">

          <Button
            disabled={pending}
            type="submit"
            className="bg-blue-700 hover:bg-blue-600"
            onClick={() => {
              if (submitTypeRef.current) submitTypeRef.current.value = 'post';
            }}
          >
            {!isEditing ? pending ? "Posting..." : 'Post Product' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
}
