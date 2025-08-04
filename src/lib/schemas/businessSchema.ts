import { z } from "zod";
import { type BusinessType, type TurnoverRange, type SellingReason } from "@/lib/types/business";

// Business type options
const businessTypeEnum = z.enum([
  "Commercial Laundry",
  "Dry Cleaners",
  "Retail",
  "E-commerce",
  "Franchise",
  "Other"
] as const);

// Turnover range options
const turnoverRangeEnum = z.enum([
  "0 - 25k",
  "25k - 50k",
  "50k - 100k",
  "100k - 250k",
  "250k - 500k",
  "500k - 1m",
  "1m - 2m",
  "2m - 5m",
  "5m+",
  "Specific amount"
] as const);

// Reason for selling options
const sellingReasonEnum = z.enum([
  "Retirement",
  "Relocation",
  "Pursuing other opportunities",
  "Lack of time",
  "Financial reasons",
  "Other"
] as const);
 
// Schema for business listing
export const businessSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(100, { message: "Title must be less than 100 characters" }),
  businessType: businessTypeEnum,
  location: z.string().min(3, { message: "Location must be at least 3 characters" }).max(100, { message: "Location must be less than 100 characters" }),
  turnoverRange: turnoverRangeEnum,
  email:z.string().email(),
  phone:z.string(), 
  imageUrl:z.string().url(),
  datePosted:z.string(), 
  description:z.string(), 
  id:z.string(),
  specificAmount: z
    .number()
    .min(0, { message: "Amount must be positive" })
    .optional()
    .refine(
      (val) => val === undefined || val > 0, 
      { message: "Amount must be greater than 0" }
    ),
  reasonForSelling: sellingReasonEnum,
});

export type BusinessSchema = z.infer<typeof businessSchema>;