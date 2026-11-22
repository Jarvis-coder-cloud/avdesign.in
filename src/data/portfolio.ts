export type PortfolioCategory = "Product" | "Brand" | "Fashion" | "Social";

export type PortfolioItem = {
  id: string;
  category: PortfolioCategory;
  label: string;
  instagramUrl: string;
};

// Replace an empty instagramUrl with a public Instagram post or reel permalink.
export const portfolioItems: PortfolioItem[] = [
  { id: "01", category: "Product", label: "Product visuals", instagramUrl: "" },
  { id: "02", category: "Brand", label: "Brand identity", instagramUrl: "" },
  { id: "03", category: "Fashion", label: "Fashion campaign", instagramUrl: "" },
  { id: "04", category: "Social", label: "Social creative", instagramUrl: "" },
  { id: "05", category: "Product", label: "Product visuals", instagramUrl: "" },
  { id: "06", category: "Brand", label: "Brand identity", instagramUrl: "" },
];