import { z } from "zod";

export const services = [
  "AI Product Posters",
  "Social Media Ad Creatives",
  "Brand Identity & Branding",
  "Product Photography & Visuals",
  "Apparel & Fashion Campaigns",
  "Social Media Content Design",
] as const;

export const budgets = [
  "Under ₹10,000",
  "₹10,000–₹25,000",
  "₹25,000–₹50,000",
  "₹50,000+",
  "Not sure yet",
] as const;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Add your name.").max(80, "Keep your name under 80 characters."),
  business: z
    .string()
    .trim()
    .min(2, "Add your business name.")
    .max(100, "Keep your business name under 100 characters."),
  email: z.string().trim().email("Enter a valid email address.").max(254, "Email address is too long."),
  service: z.enum(services),
  budget: z.enum(budgets),
  details: z
    .string()
    .trim()
    .min(20, "Share a little more about your project (at least 20 characters).")
    .max(1400, "Keep project details under 1,400 characters."),
});

export type EnquiryData = z.infer<typeof enquirySchema>;