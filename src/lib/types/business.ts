export type BusinessType = 
  | "Commercial Laundry"
  | "Dry Cleaners" 
  | "Retail" 
  | "E-commerce" 
  | "Franchise" 
  | "Other";

export type TurnoverRange = 
  | "0 - 25k"
  | "25k - 50k"
  | "50k - 100k"
  | "100k - 250k"
  | "250k - 500k"
  | "500k - 1m"
  | "1m - 2m"
  | "2m - 5m"
  | "5m+"
  | "Specific amount";

export type SellingReason = 
  | "Retirement"
  | "Relocation"
  | "Pursuing other opportunities"
  | "Lack of time"
  | "Financial reasons"
  | "Other";

export interface BusinessListing {
  title: string;
  businessType: BusinessType;
  location: string;
  turnoverRange: TurnoverRange;
  specificAmount?: number;
  reasonForSelling: SellingReason;
}