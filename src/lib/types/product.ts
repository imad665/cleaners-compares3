export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  colorHex: string;
  inventory: number;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  rating: number;
  reviews: number;
  isNew: boolean;
  isSale: boolean;
  isFeatured: boolean;
  videoUrl?: string;
  variants: ProductVariant[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpfulCount: number;
  verifiedPurchase: boolean;
  images?: string[];
}

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviews: number;
  isNew: boolean;
  isSale: boolean;
  images: string[];
}