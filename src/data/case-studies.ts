export const caseStudyFilters = [
  "All",
  "Campaigns",
  "Product ads",
  "Fashion",
  "Beauty & luxury",
] as const;

export type CaseStudyFilter = Exclude<(typeof caseStudyFilters)[number], "All">;

export type CaseStudyImage = {
  /** Base file name in /public/portfolio, without the "-720.jpg" / "-1280.jpg" suffix. */
  file: string;
  alt: string;
  /** Intrinsic size of the 1280 version, used to reserve layout space. */
  width: number;
  height: number;
};

export type CaseStudy = {
  id: string;
  title: string;
  /** Shorter name for tight spaces such as the project index. */
  shortTitle?: string;
  discipline: string;
  filters: CaseStudyFilter[];
  summary: string;
  brief: string;
  approach: string;
  deliverables: string[];
  layout: "feature" | "trio" | "quad" | "single";
  images: CaseStudyImage[];
  instagramUrl: string;
};

const portrait = { width: 1280, height: 1600 };

/**
 * Concept projects published on the AV DESIGNS Instagram. Every brand here is fictional
 * and created to demonstrate the studio's style; none of it is client work.
 */
export const caseStudies: CaseStudy[] = [
  {
    id: "01",
    title: "Your product photo → an ad that sells",
    shortTitle: "Before → After ads",
    discipline: "Before / after · Product ads",
    filters: ["Product ads"],
    summary: "Four plain product photos rebuilt as finished, scroll-stopping ads.",
    brief:
      "Show small businesses what a single plain phone photo can become, across four very different categories.",
    approach:
      "We restyled the scene, light and layout for a cafe cup, a vitamin C serum, a jar candle and a kurta, then added a headline and a clear call to action to each.",
    deliverables: ["4 before/after ad pairs", "Carousel cover", "Instagram 4:5 format"],
    layout: "feature",
    images: [
      {
        file: "before-after",
        alt: "Before and after grid: a cafe cup, serum bottle, candle and kurta turned into premium ads",
        width: 1122,
        height: 1402,
      },
    ],
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DgHaTbgGcCy/",
  },
  {
    id: "02",
    title: "Lumera Jewellery",
    discipline: "Campaign · Fine jewellery",
    filters: ["Campaigns", "Beauty & luxury"],
    summary: "A warm, editorial three-post campaign for a fine-jewellery label.",
    brief:
      "Launch a jewellery collection on Instagram with a look that feels quietly luxurious, not loud.",
    approach:
      "Soft gold light, natural stone and linen textures, and a refined serif system carried across a hero portrait, a product still life and a collection post.",
    deliverables: ["Hero campaign post", "Product still life", "Collection carousel slide"],
    layout: "trio",
    images: [
      { file: "lumera-1", alt: "Lumera campaign hero: Beauty in every detail", ...portrait },
      { file: "lumera-2", alt: "Lumera product still life: Made to be remembered", ...portrait },
      { file: "lumera-3", alt: "Lumera collection post: A little light, every day", ...portrait },
    ],
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DezHFoWFKNN/",
  },
  {
    id: "03",
    title: "Streetwear drops",
    discipline: "Campaign · Apparel",
    filters: ["Campaigns", "Fashion"],
    summary: "Launch visuals for four streetwear and outerwear drops.",
    brief:
      "Give each drop its own attitude while keeping a bold, premium streetwear feel across the set.",
    approach:
      "Heavy condensed type, moody concrete sets and a single clear “shop the drop” call to action, so each post reads in under a second on the feed.",
    deliverables: ["4 drop announcement posts", "Product hero styling", "Shop-the-drop CTAs"],
    layout: "quad",
    images: [
      { file: "offgrid", alt: "Offgrid streetwear drop: After hours", width: 1280, height: 1588 },
      { file: "form-09", alt: "Form/09 drop: Built for the everyday", ...portrait },
      { file: "atelier-north", alt: "Atelier North outerwear drop: Utility, refined", ...portrait },
      { file: "own-the-night", alt: "Streetwear drop: Own the night", ...portrait },
    ],
    instagramUrl: "https://www.instagram.com/avdesign.in/p/Devh9TdDqMQ/",
  },
  {
    id: "04",
    title: "Veil / Form Skincare",
    discipline: "Campaign · Clean beauty",
    filters: ["Campaigns", "Beauty & luxury"],
    summary: "A calm, minimal visual system for a clean-beauty brand.",
    brief: "Make a small skincare range feel premium and trustworthy with almost no copy.",
    approach:
      "Travertine stone, olive leaves and soft daylight with generous white space, so the bottle is always the hero and the brand feels quiet and confident.",
    deliverables: ["Hero product post", "Product detail post", "Range post"],
    layout: "trio",
    images: [
      { file: "veil-form-2", alt: "Veil/Form serum: Less, but better", ...portrait },
      { file: "veil-form-1", alt: "Veil/Form hero post: Skin, simplified", ...portrait },
      { file: "veil-form-3", alt: "Veil/Form range post: The daily edit", ...portrait },
    ],
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DgIAdpwlDeb/",
  },
  {
    id: "05",
    title: "Ember & Oak",
    discipline: "Product ad · Home fragrance",
    filters: ["Product ads", "Beauty & luxury"],
    summary: "A festive gift-set ad for a candle and diffuser brand.",
    brief: "Sell a candle and diffuser set as the perfect seasonal gift.",
    approach:
      "Warm candlelight, pine and a wrapped gift box, with one short line and a price, so the offer is clear at a glance.",
    deliverables: ["Gift-set ad", "Price & CTA layout"],
    layout: "single",
    images: [
      { file: "ember-and-oak", alt: "Ember & Oak gift set ad: The gift that glows", ...portrait },
    ],
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DgC8mG-IOuj/",
  },
  {
    id: "06",
    title: "Frost & Fresh",
    discipline: "Seasonal ad · Oral care",
    filters: ["Product ads"],
    summary: "A playful Christmas ad for a winter-mint toothpaste launch.",
    brief: "Turn an everyday product into a festive, shareable seasonal post.",
    approach:
      "Santa bursting through a red paper wall to reveal the product, with a short, witty line to make it memorable.",
    deliverables: ["Christmas campaign ad", "Product pack shot"],
    layout: "single",
    images: [
      {
        file: "frost-and-fresh",
        alt: "Frost & Fresh toothpaste Christmas ad: Santa's freshest secret",
        ...portrait,
      },
    ],
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DgIX0AEICJ5/",
  },
  {
    id: "07",
    title: "Make your drop unmissable",
    discipline: "Campaign poster · Fashion",
    filters: ["Product ads", "Fashion"],
    summary: "An editorial campaign poster for clothing brands.",
    brief:
      "Show clothing brands the kind of launch poster AV DESIGNS can create for their next drop.",
    approach:
      "Rich reds, dramatic studio light and high-contrast editorial typography, finished with a single clear call to action.",
    deliverables: ["Campaign poster", "Instagram 4:5 format"],
    layout: "single",
    images: [
      {
        file: "drop-unmissable",
        alt: "Fashion campaign poster: Make your drop unmissable",
        ...portrait,
      },
    ],
    instagramUrl: "https://www.instagram.com/avdesign.in/p/DetHrGckQ1S/",
  },
];

export const totalVisuals = caseStudies.reduce((sum, study) => sum + study.images.length, 0);
