/**
 * B2B Bulk Apparel Platform - Products Mock Database
 * Central catalog store containing realistic specifications for B2B ordering.
 */

const PRODUCTS_DATA = [
  {
    id: "rn-apex-220",
    code: "VTC-RN-01",
    name: "Apex 220 GSM Combed Crewneck",
    category: "Round Neck",
    productType: "Heavyweight Crewneck",
    shortDesc: "Premium 220 GSM combed cotton with dense knit surface, engineered for crisp screen printing and corporate merch.",
    fullDesc: "The Apex 220 is our flagship bulk round neck T-shirt. Spun from 100% long-staple combed cotton with 24-gauge high-density loop knits, it offers unmatched dimensional stability, minimal shrinkage (<3%), and an ultra-smooth printing canvas for screen printing, DTG, and DTF transfers. Ribbed 1x1 lycra collar maintains shape across repetitive industrial laundry cycles.",
    fabric: "100% Combed Ring-Spun Cotton",
    gsm: 220,
    moq: 50,
    fit: "Classic Structured Fit",
    embroideryAvailable: true,
    customizationOptions: ["Screen Printing", "DTG Printing", "DTF Printing", "Embroidery"],
    printingMethods: ["Screen Printing", "DTG Printing", "DTF Printing", "Embroidery"],
    colors: [
      { name: "Charcoal Black", hex: "#222222" },
      { name: "Warm Off-White", hex: "#F3EDE2" },
      { name: "Terracotta Rust", hex: "#A66B4F" },
      { name: "Navy Heather", hex: "#1E2B37" },
      { name: "Forest Moss", hex: "#2F3E34" },
      { name: "Heather Grey", hex: "#9E9E9C" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: true,
    specs: {
      yarnCount: "28s Combed Ring-Spun",
      collar: "1x1 Rib with Lycra for shape retention",
      stitching: "Double-needle sleeve and bottom hem",
      shrinkage: "Under 3.5% post-wash",
      dyeing: "Reactive azo-free certified dyeing"
    }
  },
  {
    id: "polo-honeycomb-240",
    code: "VTC-PL-02",
    name: "Executive Honeycomb Pique Polo",
    category: "Polo",
    productType: "Corporate Polo",
    shortDesc: "High-grade 240 GSM honeycomb pique with mercerized finish, tailored collar, and reinforced 3-button placket.",
    fullDesc: "Designed specifically for professional corporate staff uniforms, executive tech summits, and client-facing teams. The Executive Pique Polo blends 60% combed cotton with 40% performance poly for breathable luxury combined with zero-crease durability. Features micro-ribbed anti-curl collar, mother-of-pearl style melamine buttons, and side-slit taped seams.",
    fabric: "60% Combed Cotton / 40% Performance Poly Pique",
    gsm: 240,
    moq: 30,
    fit: "Tailored Executive Fit",
    embroideryAvailable: true,
    customizationOptions: ["Embroidery", "Front Logo Screen Print", "Sleeve Monogram"],
    printingMethods: ["High-Density Embroidery", "Screen Printing", "Silicone Heat Seal"],
    colors: [
      { name: "Deep Navy", hex: "#16202C" },
      { name: "Pure Chalk", hex: "#F9F8F5" },
      { name: "Pitch Charcoal", hex: "#282928" },
      { name: "Burgundy Wine", hex: "#4A1E26" },
      { name: "Terracotta Earth", hex: "#9F6348" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    images: [
      "https://images.unsplash.com/photo-1625910513413-56221c57199c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: true,
    specs: {
      yarnCount: "26s Pique Knit",
      collar: "Flat knit anti-curl ribbed collar",
      stitching: "Reinforced shoulder tape & twin needle hems",
      shrinkage: "Pre-shrunk <2%",
      dyeing: "Colorfast reactive industrial dye"
    }
  },
  {
    id: "ovr-street-260",
    code: "VTC-OS-03",
    name: "Heavy-Drop Oversized Street Tee",
    category: "Oversized",
    productType: "Drop-Shoulder Tee",
    shortDesc: "Substantial 260 GSM combed cotton with dropped shoulders, relaxed boxy drape, and thick 1.25\" ribbed collar.",
    fullDesc: "The undisputed choice for college festival merchandise, urban streetwear brands, and creative agency swag. Crafted from ultra-heavy 260 GSM carded combed cotton that holds an architectural silhouette without clinging. Finished with twin-needle drop shoulders and reinforced neck tape for high-impact back puff prints and oversized graphics.",
    fabric: "100% Ultra-Heavy Combed Cotton",
    gsm: 260,
    moq: 50,
    fit: "Boxy Drop-Shoulder Oversized",
    embroideryAvailable: true,
    customizationOptions: ["Screen Printing", "Puff Screen Print", "DTG Printing", "DTF Printing", "Embroidery"],
    printingMethods: ["Screen Printing", "Puff Screen Print", "DTG Printing", "DTF Printing"],
    colors: [
      { name: "Raw Terracotta", hex: "#9E5F43" },
      { name: "Vintage Washed Black", hex: "#2A2928" },
      { name: "Earthy Taupe", hex: "#C2B29F" },
      { name: "Natural Ecru", hex: "#ECE6D8" },
      { name: "Olive Drab", hex: "#464C3B" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: true,
    specs: {
      yarnCount: "20s Single Jersey Heavyweight",
      collar: "1.25\" Chunky ribbed collar",
      stitching: "Dropped shoulder lock-stitch",
      shrinkage: "Garment washed (<2% shrinkage)",
      dyeing: "Pigment garment wash available on bulk request"
    }
  },
  {
    id: "spt-aerodry-160",
    code: "VTC-SP-04",
    name: "AeroDry Micro-Waffle Athletic Jersey",
    category: "Sports / Jerseys",
    productType: "Performance Athletic Jersey",
    shortDesc: "Featherlight 160 GSM moisture-wicking interlock mesh with anti-odor treatment, engineered for full-bleed sublimation.",
    fullDesc: "Engineered for marathon events, sports teams, corporate athletic leagues, and fitness franchises. AeroDry technology rapidly wicks sweat away from the skin surface through capillary micro-channels. Compatible with vibrant, edge-to-edge sublimation printing that will never crack, peel, or fade even in extreme sports conditions.",
    fabric: "100% Moisture-Wicking AeroDry Polyester",
    gsm: 160,
    moq: 50,
    fit: "Ergonomic Athletic Fit",
    embroideryAvailable: false,
    customizationOptions: ["All-Over Sublimation", "Heat Transfer Vinyl", "Silicon Chest Crest"],
    printingMethods: ["Sublimation Printing", "Heat Transfer Printing"],
    colors: [
      { name: "Cobalt Blue", hex: "#1C4E80" },
      { name: "Fiery Crimson", hex: "#9E2A2B" },
      { name: "Carbon Black", hex: "#1E1E1E" },
      { name: "Optic White", hex: "#FAFAFA" },
      { name: "Fluoro Amber", hex: "#D67A29" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    images: [
      "https://images.unsplash.com/photo-1578768079052-aa76e520028b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: true,
    specs: {
      yarnCount: "75D Micro Filament Interlock",
      collar: "Raglan shoulder with self-fabric neckband",
      stitching: "Flatlock anti-chafing seams",
      breathability: "High CFM air permeability rating",
      treatment: "Silver-ion antibacterial anti-odor finish"
    }
  },
  {
    id: "hdy-terry-340",
    code: "VTC-HD-05",
    name: "Meridian 340 GSM Brushed Pullover Hoodie",
    category: "Hoodies",
    productType: "Heavyweight Pullover Hoodie",
    shortDesc: "Luxurious 340 GSM 3-thread brushed fleece with double-layer lined hood, kangaroo pocket, and heavy 2x2 ribbing.",
    fullDesc: "Our best-selling bulk outerwear staple for tech companies, university varsity collections, and winter corporate gifts. Built with 340 GSM ultra-dense 3-thread combed fleece that feels soft against the skin while holding heat. Includes heavy dyed-to-match braided drawcords with burnished metal aglets and reinforced bar-tacked kangaroo pocket stress points.",
    fabric: "80% Combed Cotton / 20% Anti-Pill Polyester Fleece",
    gsm: 340,
    moq: 30,
    fit: "Comfort Relaxed Fit",
    embroideryAvailable: true,
    customizationOptions: ["Screen Printing", "High-Density 3D Embroidery", "DTF Printing", "Chenille Patching"],
    printingMethods: ["Embroidery", "Screen Printing", "DTF Printing"],
    colors: [
      { name: "Terracotta Clay", hex: "#9B5D41" },
      { name: "Dark Heather Charcoal", hex: "#2C2D2B" },
      { name: "Oatmeal Heather", hex: "#DDD4C5" },
      { name: "Midnight Navy", hex: "#182230" },
      { name: "Sage Spruce", hex: "#3B4A40" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: true,
    specs: {
      yarnCount: "3-Thread Combed Fleece 340 GSM",
      hood: "Double-layered self-fabric hood with cord eyelets",
      hardware: "Gunmetal brass aglets and eyelets",
      ribbing: "2x2 Lycra ribbed cuffs and hemband",
      pocket: "Bar-tacked pouch pocket"
    }
  },
  {
    id: "uni-worktech-210",
    code: "VTC-UN-06",
    name: "WorkTech Dual-Blend Corporate Crew",
    category: "Corporate Uniforms",
    productType: "Uniform Workwear Tee",
    shortDesc: "Durable 210 GSM poly-cotton blend built for 100+ commercial wash cycles, featuring color retention and wrinkle defense.",
    fullDesc: "Engineered specifically for operational workforces, hospitality crew, retail chains, and logistics fleets requiring uniform consistency across thousands of staff members. The 65/35 poly-cotton balance combines cotton breathability with polyester durability and zero fading under harsh sunlight or industrial heat drying.",
    fabric: "65% Combed Cotton / 35% Industrial Grade Poly",
    gsm: 210,
    moq: 100,
    fit: "Standard Ergonomic Work Fit",
    embroideryAvailable: true,
    customizationOptions: ["Screen Printing", "Embroidery", "DTF Printing", "Reflective Safety Print"],
    printingMethods: ["Screen Printing", "Embroidery", "Heat Transfer Printing"],
    colors: [
      { name: "Industrial Charcoal", hex: "#2D2F2D" },
      { name: "Workforce Navy", hex: "#1B2A38" },
      { name: "Safety Hi-Vis Gold", hex: "#D48B28" },
      { name: "Steel Grey", hex: "#6F7275" },
      { name: "White Crisp", hex: "#F7F6F3" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    images: [
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: false,
    specs: {
      yarnCount: "24s Ring Spun CVC",
      seam: "Reinforced 5-thread safety overlock stitch",
      collar: "Lycra blended non-sag ribbed crew",
      longevity: "Rated for 100+ industrial wash cycles",
      shrinkage: "<1.5% stabilized"
    }
  },
  {
    id: "prm-camp-160",
    code: "VTC-PR-07",
    name: "EventPro Cost-Optimized Promotional Tee",
    category: "Promotional T-Shirts",
    productType: "Campaign Promotional Tee",
    shortDesc: "Value-engineered 160 GSM semi-combed cotton optimized for massive quantity event giveaways and promotional blitzes.",
    fullDesc: "The premier solution for large-scale marketing activations, political campaigns, charity runs, trade expo giveaways, and concert crowd merchandise. Optimized for tight cost structures without sacrificing clean print definition or wearer satisfaction. Pre-shrunk tubular knit construction provides seamless printing across side panels.",
    fabric: "100% Semi-Combed Cotton Single Jersey",
    gsm: 160,
    moq: 100,
    fit: "Standard Straight Fit (Tubular)",
    embroideryAvailable: false,
    customizationOptions: ["Screen Printing", "Water-based Ink Print", "DTF Printing"],
    printingMethods: ["High-Volume Screen Printing", "DTF Printing"],
    colors: [
      { name: "True Black", hex: "#1C1C1C" },
      { name: "Optic Bright White", hex: "#FFFFFF" },
      { name: "Royal Blue", hex: "#1D4E89" },
      { name: "Sun Yellow", hex: "#E9A825" },
      { name: "Terracotta Brick", hex: "#9E583C" },
      { name: "Kelly Green", hex: "#2E7245" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: false,
    specs: {
      yarnCount: "30s Semi-Combed",
      body: "Seamless tubular torso knit (no side seams)",
      neck: "Self-fabric binding or 1x1 rib",
      delivery: "Express bulk production turnarounds available",
      dyeing: "Standard eco-reactive"
    }
  },
  {
    id: "rn-supima-200",
    code: "VTC-RN-08",
    name: "Artisan 200 GSM Supima Luxury Tee",
    category: "Round Neck",
    productType: "Luxury Heavy Tee",
    shortDesc: "Ultra-fine American Supima extra-long staple cotton with a silky peach skin finish for tier-one corporate gifts.",
    fullDesc: "Crafted exclusively from 100% certified American Supima extra-long staple cotton fibers. The Artisan 200 represents the pinnacle of luxury merchandise. Its silky luster, softness, and exceptional dye absorption yield unmatched depth for water-based discharging, direct-to-garment digital printing, and delicate tone-on-tone embroidery.",
    fabric: "100% American Supima Extra-Long Staple Cotton",
    gsm: 200,
    moq: 50,
    fit: "Modern Tailored Fit",
    embroideryAvailable: true,
    customizationOptions: ["Screen Printing", "DTG Printing", "Tone-on-Tone Embroidery", "DTF Printing"],
    printingMethods: ["DTG Printing", "Screen Printing", "Fine Monogram Embroidery"],
    colors: [
      { name: "Ivory Cream", hex: "#F3EDE1" },
      { name: "Terracotta Clay", hex: "#A66B4F" },
      { name: "Charcoal Slate", hex: "#232622" },
      { name: "Deep Olive", hex: "#3A453A" },
      { name: "Smoky Blue", hex: "#415264" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: true,
    specs: {
      yarnCount: "34s Extra Long Staple Supima",
      finish: "Enzyme bio-polish peach touch",
      collar: "Narrow seamless rib band",
      shrinkage: "<2% pre-shrunk",
      dyeing: "Low-impact OEKO-TEX Standard 100"
    }
  },
  {
    id: "polo-mercerized-220",
    code: "VTC-PL-09",
    name: "Signature Mercerized Cotton Polo",
    category: "Polo",
    productType: "Executive Polo",
    shortDesc: "Double-mercerized 100% Egyptian Giza cotton with subtle natural sheen and zero pill guarantee for boardrooms.",
    fullDesc: "Designed for premium hospitality chains, luxury automotive dealership staff, and senior leadership summits. The double-mercerization process alters cotton cellular structure to impart permanent silky luster, dimensional crispness, and vibrant color retention that never fades over years of wear.",
    fabric: "100% Double-Mercerized Giza Cotton",
    gsm: 220,
    moq: 30,
    fit: "Sleek Contemporary Fit",
    embroideryAvailable: true,
    customizationOptions: ["High-Precision Embroidery", "Heat Transfer Foil", "Engraved Button Customization"],
    printingMethods: ["Embroidery", "Silicone Heat Transfer"],
    colors: [
      { name: "Obsidian Black", hex: "#1A1A1A" },
      { name: "Warm Pearl", hex: "#FBF9F4" },
      { name: "Terracotta Earth", hex: "#A3654B" },
      { name: "Rich Navy", hex: "#182635" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    images: [
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1625910513413-56221c57199c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: false,
    specs: {
      yarnCount: "60/2 Double Mercerized Combed",
      buttons: "Genuine horn effect cross-stitched",
      cuffs: "Knit ribbed cuffs with elastic core",
      shrinkage: "Virtually zero shrinkage (<1%)",
      dyeing: "Double-vat reactive"
    }
  },
  {
    id: "hdy-zip-320",
    code: "VTC-HD-10",
    name: "Apex French Terry Zip Jacket",
    category: "Hoodies",
    productType: "Full-Zip Jacket",
    shortDesc: "Structured 320 GSM unbrushed loopback French Terry with heavy antique brass YKK zipper and split kangaroo pockets.",
    fullDesc: "An all-season layering heavyweight crafted from 100% unbrushed French terry loops. Perfect for indoor air-conditioned tech workplaces, spring varsity gear, and modern brand apparel lines. Complete with antique brass hardware, cover-stitched seams, and double-needle armholes.",
    fabric: "100% Combed Cotton French Terry",
    gsm: 320,
    moq: 30,
    fit: "Modern Structured Layering Fit",
    embroideryAvailable: true,
    customizationOptions: ["Left Chest Embroidery", "Back Large Print", "Sleeve Badge"],
    printingMethods: ["Embroidery", "Screen Printing", "DTF Printing"],
    colors: [
      { name: "Deep Charcoal", hex: "#262823" },
      { name: "Muted Terracotta", hex: "#995F45" },
      { name: "Washed Oatmeal", hex: "#E2D9CB" },
      { name: "Naval Blue", hex: "#1C2735" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    images: [
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: false,
    specs: {
      yarnCount: "320 GSM Unbrushed 3-Thread Loopback",
      zipper: "Heavy antique metallic YKK zipper",
      pocket: "Split kangaroo pockets with reinforced rivets",
      ribbing: "1x1 heavyweight cotton spandex rib",
      shrinkage: "<2.5%"
    }
  }
];

// Helper functions for catalog queries
function getAllProducts() {
  return PRODUCTS_DATA;
}

function getProductById(id) {
  return PRODUCTS_DATA.find(p => p.id === id) || PRODUCTS_DATA[0];
}

function getFeaturedProducts() {
  return PRODUCTS_DATA.filter(p => p.featured);
}

function getCategories() {
  return [
    "All Categories",
    "Round Neck",
    "Polo",
    "Oversized",
    "Sports / Jerseys",
    "Hoodies",
    "Corporate Uniforms",
    "Promotional T-Shirts"
  ];
}

// Portfolio mock items
const PORTFOLIO_DATA = [
  {
    id: "pf-tech-corp",
    title: "Strata Global Tech Summit 2026",
    client: "Strata Technologies Inc.",
    category: "Corporate Apparel",
    qty: "2,500 Units",
    fabric: "Executive Honeycomb Pique (240 GSM)",
    customization: "Left-chest micro-embroidery + sleeve monogram",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
    description: "Equipped 2,500 delegates and engineers across 4 international tech conferences with bespoke tailored pique polos."
  },
  {
    id: "pf-college-fest",
    title: "Nexus National University Fest",
    client: "Nexus Student Council",
    category: "College Events",
    qty: "4,200 Units",
    fabric: "Heavy-Drop Oversized Street Tee (260 GSM)",
    customization: "5-color back puff screen print & front silicone emblem",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80",
    description: "Designed and produced vibrant oversized festival merchandise in 3 distinct batch colorways within an 8-day turnaround."
  },
  {
    id: "pf-half-marathon",
    title: "Metro City 21K Half Marathon",
    client: "Metro Athletic Foundation",
    category: "Sports Jerseys",
    qty: "8,000 Units",
    fabric: "AeroDry Micro-Waffle Interlock (160 GSM)",
    customization: "Full-body dye sublimation with bib number panels",
    image: "https://images.unsplash.com/photo-1578768079052-aa76e520028b?auto=format&fit=crop&w=1000&q=80",
    description: "Supplied 8,000 breathable moisture-wicking technical jerseys for runner kits with 100% color accuracy to race sponsor guidelines."
  },
  {
    id: "pf-startup-merch",
    title: "Krypton Labs Developer Winter Swag",
    client: "Krypton Labs (AI Platform)",
    category: "Custom Merchandise",
    qty: "1,200 Units",
    fabric: "Meridian 340 GSM Brushed Fleece Hoodie",
    customization: "High-density 3D tonal embroidery + custom satin neck tag",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
    description: "Premium heavy-weight winter hoodies distributed globally to remote distributed engineering teams and VIP investors."
  },
  {
    id: "pf-retail-campaign",
    title: "Solstice Summer Brand Launch",
    client: "Solstice Beverage Group",
    category: "Promotional T-Shirts",
    qty: "15,000 Units",
    fabric: "EventPro Cost-Optimized Promotional Tee (160 GSM)",
    customization: "Large format front water-based discharge screen printing",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80",
    description: "Massive nation-wide beverage sampling promotional tour across 22 cities with reliable batch color consistency."
  },
  {
    id: "pf-logistics-fleet",
    title: "OmniFreight Nationwide Driver Uniforms",
    client: "OmniFreight Logistics",
    category: "Corporate Apparel",
    qty: "6,500 Units",
    fabric: "WorkTech Dual-Blend Corporate Crew (210 GSM)",
    customization: "Industrial reflective heat transfer logo & embroidered chest patch",
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1000&q=80",
    description: "High-durability uniform roll-out engineered to endure commercial heat laundering and high UV exposure."
  }
];
