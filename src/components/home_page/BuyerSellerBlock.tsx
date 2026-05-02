import { Check, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
/* import { SupplierCtaButton } from "@/components/SupplierCtaButton"; */

import { useState } from "react";
import { ButtonNeedSignIn } from "../header/productSearchBar";

export function BuyerSellerBlock() {
  return (
    <section className="container mx-auto px-4 py-10 grid lg:grid-cols-2 gap-6">
      {/* For Buyers */}
      <article className="rounded-2xl bg-buyer-soft p-6 lg:p-8 flex gap-6 items-center border">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-9 w-9 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center">
              <Search className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-primary">For Buyers</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Find What Your Business Needs</h2>
          <ul className="mt-4 space-y-2 text-sm text-foreground/80">
            <li className="flex gap-2"><Check className="h-4 w-4 text-supplier mt-0.5" /> Search and compare thousands of products</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-supplier mt-0.5" /> New &amp; used machines, parts, sundries &amp; more</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-supplier mt-0.5" /> Connect directly with trusted suppliers</li>
          </ul>
          {/* Buyer CTA — link to existing search route */}
          {/* <Button asChild className="mt-5">
            <a href="/products">Start Searching</a>
          </Button> */}
        </div>
        <img src='/assets/buyer-washer.jpg' alt="White commercial washing machine" className="hidden md:block w-40 lg:w-48 h-auto" width={768} height={768} loading="lazy" />
      </article>

      {/* For Suppliers */}
      <article className="rounded-2xl bg-supplier-soft p-6 lg:p-8 flex gap-6 items-center border">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-9 w-9 rounded-full bg-supplier text-supplier-foreground inline-flex items-center justify-center">
              <Tag className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-supplier">For Suppliers</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Sell to Real Industry Buyers</h2>
          <ul className="mt-4 space-y-2 text-sm text-foreground/80">
            <li className="flex gap-2"><Check className="h-4 w-4 text-supplier mt-0.5" /> List your machines, parts, supplies &amp; services</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-supplier mt-0.5" /> We upload and optimise for you</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-supplier mt-0.5" /> Get more visibility and quality enquiries</li>
          </ul>
          <ButtonNeedSignIn
            text="Sell Your Products"
            className="mt-4"
            buttonClassName="bg-supplier hover:bg-supplier/90"
          />
          {/* <SupplierCtaButton className="mt-5 bg-supplier hover:bg-supplier/90 text-supplier-foreground">
            
          </SupplierCtaButton> */}
          <p className="mt-2 text-xs text-muted-foreground">No technical setup needed.</p>
        </div>
        <img src="/assets/supplier-laundry.jpg" alt="Trolley of clean laundry" className="hidden md:block w-40 lg:w-48 h-auto rounded-xl" width={768} height={768} loading="lazy" />
      </article>
    </section>
  );
}
