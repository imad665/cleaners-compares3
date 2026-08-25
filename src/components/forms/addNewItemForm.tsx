'use client'
import { Button } from "../ui/button";
import { ProducImageAndMedia } from "./clientsUi";
import React, { useActionState, useEffect, useRef, useState } from "react";
import { addNewProductAction } from "@/actions/addNewProductAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SellerFormDialog, { SellerForm } from "./sellerForm";
import { useHomeContext } from "@/providers/homePageProvider";
import { BasicInfo } from "./addItemsComponents/BasicInfo";
import { PricingInventory } from "./addItemsComponents/PricingInventory";
import { StepCategory } from "./addItemsComponents/StepCategory";
import { SubCategorySelector } from "./addItemsComponents/SubCategorySelector";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { AddNewWantedItem } from "./wantedItem";
import { BusinessListingForm } from "./busnisessForm";
import ServiceForm, { ServiceEngineerForm, ServiceFormDialog } from "../adminDashboard/serviceEngineer";

export function AddNewItemForm({
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
  mainCategory: initialMainCategory,
  subCategory,
  subCategoryId: initialSubCategoryId,
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
  const [images, setImages] = useState<{ id: string, url: string, file: File }[]>([]);
  const [video, setVideo] = useState<{ id: string, url: string, file: File } | null>(null);
  const submitTypeRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [state, action, pending] = useActionState(addNewProductAction, undefined);
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);
  const skipBuyerCheckRef = useRef(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(initialMainCategory || '');
  const [subCategoryId, setSubCategoryId] = useState(initialSubCategoryId || '');
  const [creatingSellerAccount, setCreatingSellerAccount] = useState<'success' | boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { user } = useHomeContext();
  const role: "SELLER" | "BUYER" | undefined = user?.role;
  //console.log(showSellerForm, 'sssssssssssssssssssllllllld');

  useEffect(() => {
    if (currentStep > 0 || selectedCategory) {
      // Find the scrollable main container in admin layout
      const mainElement = document.querySelector('main.flex-1.overflow-y-auto');
      if (mainElement) {
        mainElement.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Fallback for non-admin layouts
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentStep]);

  useEffect(() => {
    setImages(imagesUrl?.map((i: string, index: number) => ({ id: `id_${index}`, url: i, file: undefined })) || [])
    setVideo(videoUrl ? { id: 'video', url: videoUrl || '', file: undefined } : null);
    if (initialMainCategory) {
      setCurrentStep(1);
    }
  }, []);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      setIsSuccessfullySubmitted(true);
      toast.success(state.message);
      const url = state.url;
      if (url) router.push(url)
      else if (onSuccessEditing) onSuccessEditing();

    } else {
      setIsSuccessfullySubmitted(false);
      toast.error(state.error);
      if (onFailedEditing) onFailedEditing();
    }
  }, [state]);

  const validateStep = (step: number) => {
    if (hasOwnSubmit) return true; // Handled by their respective forms

    if (step === 0) {
      if (!selectedCategory) {
        toast.error("Please select a category");
        return false;
      }
    }

    if (step === 1) {
      if (showSubCategory && !subCategoryId) {
        toast.error("Please select a subcategory");
        return false;
      }

      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const title = formData.get('title');
        const description = formData.get('description');
        const condition = formData.get('product_condition');

        if (!title || title.toString().trim() === "") {
          toast.error("Product title is required");
          return false;
        }
        if (!description || description.toString().trim() === "") {
          toast.error("Product description is required");
          return false;
        }
        if (!condition) {
          toast.error("Please select product condition");
          return false;
        }
      }
    }

    if (step === 2) {
      if (images.length === 0) {
        toast.error("Please upload at least one image");
        return false;
      }
    }

    if (step === 3) {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        //console.log(formData, 'dkkkkkkkkkkkkkkkkkkkkkklll');

        const price = formData.get('price');
        const stock = formData.get('stock');
        const freeLocalDelivery = formData.get('freeLocalDelivery')?.toString();
        const customerCollects = formData.get('customerCollects')?.toString();
        const delivery_charge = formData.get('delivery_charge')?.toString();
        const units = formData.get("units")?.toString().trim();
        const weight = formData.get('weight')?.toString().trim()
        const keys = formData.keys()
        if (freeLocalDelivery == 'false' && customerCollects == 'false') {
          if (!delivery_charge?.trim() && formData.has('delivery_charge')) {
            toast.error("Delivery Charge is Required")
            return false
          } else if (!weight && formData.has("weight")) {
            toast.error("Weight is Required")
            return false
          }
        }
        if (formData.has("units") && !units?.trim()) {
          toast.error("units is required")
          return false
        }
        if (!price || Number(price) <= 0) {
          toast.error("Price must be greater than 0");
          return false;
        }
        if (!stock || Number(stock) < 0) {
          toast.error("Stock cannot be negative");
          return false;
        }
      }
    }

    return true;
  };

  const handleAction = (formData: FormData) => {
    // Main form submit.
    if (!validateStep(3)) return;

    if (user && role === 'BUYER' && !skipBuyerCheckRef.current) {
      setShowSellerForm(true);
      return;
    }
    skipBuyerCheckRef.current = false;

    images.forEach((img) => {
      formData.append(img.file ? 'imagesFile' : 'imageUrls', img.file ? (img.file as any) : img.url);
    });
    if (video) {
      formData.append(video.file ? 'videoFile' : 'videoUrl', video.file ? (video.file as any) : video.url)
    }

    if (!formData.has('category') && selectedCategory) {
      formData.append('category', selectedCategory.replace(' ', '_'));
    }
    if (!formData.has('subcategoryId') && subCategoryId) {
      formData.append('subcategoryId', subCategoryId);
    }

    action(formData)
  }
  const handlePost = () => {
    if (user && role === 'BUYER' && !skipBuyerCheckRef.current) {
      setShowSellerForm(true);
      return;
    }
  }

  const steps = [
    { title: "Category", description: "Choose what you're selling" },
    { title: "Details", description: "Basic item information" },
    { title: "Media", description: "Photos and videos" },
    { title: "Pricing", description: "Set your price and stock" }
  ];

  const categoriesWithSubmit = ["Engineers & Services", "Wanted Items", "Businesses for Sale"];
  const hasOwnSubmit = categoriesWithSubmit.includes(selectedCategory);

  const displaySteps = hasOwnSubmit ? steps.slice(0, 2) : steps;

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < displaySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (user && role === 'BUYER' && !skipBuyerCheckRef.current) {
        setShowSellerForm(true);
        return;
      } else {
        if (formRef.current) {
          if (submitTypeRef.current) submitTypeRef.current.value = 'post';
          formRef.current.requestSubmit();
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (currentStep - 1 <= 1) {
        setSubCategoryId('')
      }
    }
  };

  const handleCategoryPick = (c: string) => {
    setSelectedCategory(c);
    // Move to next step directly as picking a category is the action for step 0
    setCurrentStep(1);
  };



  const showSubCategory = ["Machines", "Parts & Components", "Sundries & Supplies"].includes(selectedCategory);
  let secondStep
  const mapedCategory = selectedCategory === 'Sundries & Supplies'
    ? 'sundries'
    : selectedCategory === 'Parts & Components'
      ? "parts"
      : 'machines'
  const navigationParams = {
    handleBack: handleBack,
    currentStep: currentStep,
    pending: pending || isSuccessfullySubmitted,
    steps: displaySteps,
    handleNext: handleNext,
    selectedCategory: selectedCategory,
    submitTypeRef: submitTypeRef,
    isEditing: isEditing,
    hasOwnSubmit: hasOwnSubmit,
    user: user,
    role: role,
    handlePost: handlePost,
    creatingSellerAccount
  }

  if (selectedCategory === "Engineers & Services" && currentStep == 1) {
    secondStep = (
      <div className="rounded-md bg-white shadow-sm m-2 p-6 space-y-3 px-5 border">
        <h2 className="font-bold text-xl pb-1 flex items-center justify-center">Add New Engineer</h2>
        <p className="text-muted-foreground text-center pb-5">Register as a service engineer to offer your technical expertise and support to the community.</p>
        <div className={"hidden"}>
          <StepCategory
            onPick={handleCategoryPick}
            selectedCategory={selectedCategory}
          />
        </div>
        <ServiceEngineerForm key="service-form" onSubmitSuccess={() => {
          router.replace("/admin/myServices")
        }} />
      </div>
    )
  } else if (selectedCategory == "Wanted Items" && currentStep == 1) {
    secondStep = (
      <div className="rounded-md bg-white shadow-sm m-2 p-6 space-y-3 px-5 border">
        <h2 className="font-bold text-xl pb-1 flex items-center justify-center">Add New Wanted Item</h2>
        <p className="text-muted-foreground text-center pb-5">Looking for something specific? Post a request and let sellers or providers find you.</p>
        <div className={"hidden"}>
          <StepCategory
            onPick={handleCategoryPick}
            selectedCategory={selectedCategory}
          />
        </div>
        <AddNewWantedItem key="wanted-item-form" onSubmitSuccess={() => {
          router.replace("/admin/myWantedItems")
        }} />
      </div>
    )
  } else if (selectedCategory === "Businesses for Sale" && currentStep == 1) {
    secondStep = (
      <div className="rounded-md bg-white shadow-sm m-2 p-6 space-y-3 px-5 border">
        <h2 className="font-bold text-xl pb-1 flex items-center justify-center">Sell Your Business</h2>
        <p className="text-muted-foreground text-center pb-5">List your business for sale to reach potential buyers and investors in the industry.</p>
        <div className={"hidden"}>
          <StepCategory
            onPick={handleCategoryPick}
            selectedCategory={selectedCategory}
          />
        </div>
        <BusinessListingForm key="business-form" onSubmitSuccess={() => {
          router.replace("/admin/myBusinessesForSale")
        }} />
      </div>
    )
  }

  else {
    secondStep = (
      <form id="add-item-form" ref={formRef} action={handleAction} className="space-y-6 relative">
        <input type="hidden" name="submitType" ref={submitTypeRef} />
        {isEditing && <input type="hidden" name="productId" value={productId} />}

        {/* Step 0: Category Selection */}
        <div className={currentStep === 0 ? "block" : "hidden"}>
          <StepCategory
            onPick={handleCategoryPick}
            selectedCategory={selectedCategory}
          />
        </div>

        {/* Step 1: Details (Subcategory & Basic Info) */}
        <div className={currentStep === 1 ? "block" : "hidden"}>
          {showSubCategory && <div>
            <SubCategorySelector
              categories={categories}
              mainCategory={mapedCategory}
              subCategory={subCategory}
              id={subCategoryId}
              onSubCategoryChange={(id) => setSubCategoryId(id)}
            />
            <BasicInfo
              name={name}
              description={description}
              productionCondition={productionCondition}
            />
          </div>}

          {!showSubCategory && selectedCategory && (
            <input type="hidden" name="category" value={selectedCategory.replace(' ', '_')} />
          )}

        </div>

        {/* Step 2: Media */}
        <div className={currentStep === 2 ? "block" : "hidden"}>
          <ProducImageAndMedia
            images={images} video={video}
            setImages={setImages} setVideo={setVideo}
          />
        </div>

        {/* Step 3: Pricing & Finalize */}
        <div className={currentStep === 3 ? "block" : "hidden"}>
          <PricingInventory
            discount={discount}
            price={undefined}
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
        </div>
      </form>
    )
  }


  return (
    <div className="w-full h-full  ">
      <SellerFormDialog
        open={showSellerForm}
        onPending={() => {
          setCreatingSellerAccount(true)
        }}
        setOpen={setShowSellerForm}
        callback="/admin/allProducts"
        redirect={true}
        title="Complete Your Seller Profile"
        description="To post an item, you first need to provide your business details."
        onSuccess={() => {
          setShowSellerForm(false);
          skipBuyerCheckRef.current = true;
          //console.log(formRef.current, 'dddddddddddddddddccccccccccccmmmmmmmmmm');
          setCreatingSellerAccount('success')
          if (formRef.current) {
            if (submitTypeRef.current) submitTypeRef.current.value = 'post';
            formRef.current.requestSubmit();
          }
        }}
      />
      <div className="w-full max-w-[900px] mx-auto pb-40 ">
        {secondStep}
      </div>
      <Navigation
        {...navigationParams}
      />
    </div>
  );
}

function Navigation({ handleBack, currentStep, pending, steps, handleNext, selectedCategory, submitTypeRef, isEditing, hasOwnSubmit, user, role, handlePost, creatingSellerAccount }: any) {
  //console.log(submitTypeRef.current, 'ssssssk++++++++===============');

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-[100] bg-white/80 backdrop-blur-md border-t shadow-[0_-4px_10px_rgba(0,0,0,0.05)] py-4">
      <div className="w-full max-w-[900px] mx-auto flex justify-between items-center px-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0 || pending}
          className="flex items-center gap-2 h-11 px-6 font-semibold"
        >
          <ArrowLeft size={18} /> Back
        </Button>

        <div className="flex items-center gap-2">
          {steps.map((_: any, idx: number) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentStep
                ? "bg-blue-700 w-6"
                : idx < currentStep
                  ? "bg-blue-400"
                  : "bg-gray-200"
                }`}
            />
          ))}
        </div>

        {currentStep < steps.length - 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={currentStep === 0 && !selectedCategory}
            className="bg-blue-700 hover:bg-blue-600 flex items-center gap-2 text-white h-11 px-8 font-semibold shadow-md"
          >
            Continue <ArrowRight size={18} />
          </Button>
        ) : hasOwnSubmit ? (
          <div className="text-muted-foreground text-xs italic sm:text-sm">
            Submit using the form above
          </div>
        ) : (
          <Button
            disabled={pending || creatingSellerAccount === true}
            type="button"
            form="add-item-form"
            className="bg-blue-700 hover:bg-blue-600 text-white min-w-[150px] h-11 px-8 font-bold shadow-md shadow-blue-200"
            onClick={handleNext}
          /* onClick={() => {
            //if (submitTypeRef.current) submitTypeRef.current.value = 'post';
          }} */
          >
            {(pending || creatingSellerAccount === 'success') ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </div>
            ) : isEditing ? 'Save Changes' : 'Post Item'}
          </Button>
        )}
      </div>
    </div>
  )
}