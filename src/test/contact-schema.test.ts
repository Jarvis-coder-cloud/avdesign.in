import { describe, expect, it } from "vitest";

import { budgets, enquirySchema } from "@/lib/contact-schema";

const validEnquiry = {
  name: "Aarav Mehta",
  business: "Northstar Goods",
  email: "aarav@example.com",
  service: "Brand Identity & Branding",
  budget: "₹10,000–₹25,000",
  details: "We are preparing a new launch and need a complete visual identity.",
};

describe("contact enquiry validation", () => {
  it("keeps the INR budget choices and accepts a valid enquiry", () => {
    expect(budgets).toEqual([
      "Under ₹10,000",
      "₹10,000–₹25,000",
      "₹25,000–₹50,000",
      "₹50,000+",
      "Not sure yet",
    ]);
    expect(enquirySchema.safeParse(validEnquiry).success).toBe(true);
  });

  it("rejects an invalid email address", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, email: "not-an-email" }).success).toBe(false);
  });

  it("requires project details of at least 20 characters", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, details: "Too short" }).success).toBe(false);
  });
});