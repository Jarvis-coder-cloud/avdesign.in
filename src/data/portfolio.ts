export type PortfolioCategory = "Product" | "Brand" | "Fashion" | "Social";

export type PortfolioItem = {
  id: string;
  category: PortfolioCategory;
  label: string;
  instagramUrl: string;
};

// Public posts identified from the AV DESIGNS Instagram profile.
export const portfolioItems: PortfolioItem[] = [
  {
    id: "01",
    category: "Fashion",
    label: "OFFGRID · Streetwear campaign",
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DetLJ1CFWdN/",
  },
  {
    id: "02",
    category: "Social",
    label: "Clothing brand campaign ad",
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DetHrGckQ1S/",
  },
  {
    id: "03",
    category: "Product",
    label: "LUMERA · Jewellery campaign",
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DezHFoWFKNN/",
  },
  {
    id: "04",
    category: "Fashion",
    label: "FORM / 09 · Streetwear concept",
    instagramUrl: "https://www.instagram.com/avdesign.in/p/Devh9TdDqMQ/",
  },
  {
    id: "05",
    category: "Product",
    label: "MORA · Serum product visual",
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DetLVpulfxV/",
  },
  {
    id: "06",
    category: "Product",
    label: "BREW & CO. · Coffee campaign",
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DetLPndFeL5/",
  },
  {
    id: "07",
    category: "Product",
    label: "SONORA · Headphone campaign",
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DetLHIvlack/",
  },
  {
    id: "08",
    category: "Social",
    label: "LOAM BAKERY · Social campaign",
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DetJFgllTcQ/",
  },
  {
    id: "09",
    category: "Brand",
    label: "STILL / OBJECTS · Lifestyle identity",
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DetJCd5FWrK/",
  },
  {
    id: "10",
    category: "Product",
    label: "MORA · Skincare concept",
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DetIhDkFUpc/",
  },
  {
    id: "11",
    category: "Social",
    label: "Small business creative ad",
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DetHoXujv4U/",
  },
  {
    id: "12",
    category: "Fashion",
    label: "Naruto-inspired apparel graphic",
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DetGHCYGV7c/",
  },
  {
    id: "13",
    category: "Product",
    label: "AURA X1 · Headphone poster",
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DetF_jPmWD_/",
  },
];
