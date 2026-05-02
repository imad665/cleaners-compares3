import { ArrowRight } from "lucide-react";
import { ButtonNeedSignIn } from "../header/productSearchBar";
export type Category = { name: string; image: string; href: string };

export const categories: Category[] = [
  { name: "New Machines", image: '/assets/cat-new-machines.jpg', href: "/products/machines#new" },
  { name: "Used Machines", image: '/assets/cat-used-machines.jpg', href: "/products/machines#used" },
  { name: "New Parts", image: '/assets/cat-new-parts.jpg', href: "/products/parts#new" },
  { name: "Used Parts", image: '/assets/cat-used-parts.jpg', href: "/products/parts#used" },
  { name: "Sundries & Supplies", image: '/assets/cat-sundries.jpg', href: "/products/sundries" },
  { name: "Engineers & Services", image: '/assets/cat-engineers.jpg', href: "/products/services" },
  { name: "Businesses for Sale", image: '/assets/cat-businesses.jpg', href: "/products/businesses-for-sale" },
];

export function CategoryGrid() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Browse Products & Services</h2>
        <p className="text-muted-foreground mt-2">Explore key categories used by laundry and dry-cleaning businesses.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((c) => (
          <a
            key={c.name}
            href={c.href}
            className="group rounded-xl border bg-card p-3 text-center hover:border-primary hover:shadow-md transition-all"
          >
            <div className="aspect-square rounded-lg bg-secondary/50 overflow-hidden mb-2">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" width={512} height={512} loading="lazy" />
            </div>
            <p className="text-xs font-semibold leading-tight">{c.name}</p>
          </a>
        ))}
      </div>
      <div className="mt-6 text-center text-sm text-muted-foreground flex items-center justify-center">
        Supply these products? We'll list them for you —{" "}
        <ButtonNeedSignIn
          variant="link"
          buttonClassName="font-bold"
          text="Sell Your Products" />
        <ArrowRight color="blue" className="h-3.5 w-3.5" />
        {/* <SupplierCtaButton variant="link" className="px-1 h-auto text-primary font-semibold">
          Sell Your Products <ArrowRight className="h-3.5 w-3.5" />
        </SupplierCtaButton> */}
      </div>
    </section>
  );
}
