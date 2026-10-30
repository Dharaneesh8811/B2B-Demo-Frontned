# Vanguard Textile Co. — B2B Bulk T-Shirt Ordering & Customization Platform

A premier, responsive customer-facing website built specifically for commercial bulk T-shirt and apparel manufacturing.

Built using **pure semantic HTML5, modern CSS3, and Vanilla JavaScript** (Zero external frameworks, no backend, no database, no individual retail shopping or checkout flows).

---

## 🎨 Design System: Earth & Terracotta

- **Warm Ivory:** `#F5F1E9` (Primary background)
- **Charcoal:** `#252820` (Typography and structural elements)
- **Terracotta:** `#A66B4F` (Primary accent, buttons, active states)
- **Muted Beige:** `#E7DED1` (Borders, cards, backgrounds)
- **Soft White:** `#FCFAF6` (Card surfaces, input backgrounds)
- **Muted Grey:** `#77766F` (Secondary text, metadata)
- **Border:** `#DED8CE` (Subtle hair lines)

---

## 🌐 Website Pages

1. **Home (`index.html`)**
   - Editorial Hero: *"Premium Custom T-Shirts. Designed for Bulk Orders."*
   - About the Business (Facilities, Quality standards, Production capabilities, Mission/Vision).
   - Featured Collections (Round Neck, Polo, Oversized, Sports/Jerseys, Hoodies, Corporate Uniforms, Promotional T-Shirts).
   - 6-Stage Bulk Ordering Process (Explore &rarr; Select &rarr; Configure &rarr; Upload &rarr; Submit &rarr; Receive Quotation).
   - Factory Embellishment Services (Front, Back, Sleeve, High-Density Embroidery, Brand relabeling, Fabric customization).
   - Industries We Serve (Corporates, Colleges, Schools, Events, Sports, Retail Blanks, Promotional).
   - Why Choose Us (Bulk focus, custom branding, fabric choices, size/colour flexibility, batch control, dedicated engineering).
   - Portfolio Showcase preview, sample customer testimonials, and bulk quote CTA.

2. **About Us (`about.html`)**
   - Integrated manufacturing capabilities (knitting, cutting, screen printing, embroidery floor).
   - Quality assurance benchmarks (shrinkage stability <3.5%, azo-free reactive dyeing, reinforced seam construction).
   - Mission, vision, and corporate partner commitments.

3. **Collections & Product Catalogue (`collections.html`)**
   - 10 diverse commercial garment styles across 7 distinct categories.
   - Comprehensive frontend filters: Garment Category, Fabric Type, Colorway, Customization suitability.
   - Real-time live search query filtering and multi-attribute sorting (Name A-Z/Z-A, MOQ Low-High/High-Low).
   - Strictly B2B: Shows MOQs, fabric weights (GSM), color swatches, sizes — **No Buy Now buttons or individual retail prices**.

4. **Product Details View (`product-details.html`)**
   - Dynamic view driven by style IDs (`?id=rn-apex-220`, etc.).
   - Interactive multi-angle image gallery with thumbnail switcher.
   - Comprehensive technical specifications table (Yarn count, Lycra collar, seam overlock, dye chemistry).
   - Interactive Size Measurement Chart modal popup (Chest, Length, Shoulder, Sleeve across S–3XL).
   - Direct integration: "Add to Bulk Enquiry" and "Configure in Bulk Builder".

5. **Interactive Customization Studio (`customization.html`)**
   - **Full two-column interactive product configurator** with high-precision vector SVG mockups for 5 silhouettes: Round Neck T-Shirt, Polo T-Shirt, Oversized Streetwear Tee, Athletic Sports Jersey, and Heavyweight Fleece Hoodie.
   - **Front & Back View Switcher:** Independent artwork coordinate layers for front and back orientations with live artwork count badges.
   - **Real-Time Color Swatches:** Instantly updates garment fills across 7 production dye formulas (Black, White, Charcoal, Navy, Terracotta, Grey, Olive) + custom HTML5 color picker without reloading.
   - **Multi-Logo Upload & Live Canvas Placement:** Drag-and-drop support for PNG (transparent), JPG, and SVG (up to 15MB) with client-side validation and starter sample graphics.
   - **Direct On-Canvas Manipulation:** Pointer/touch drag-and-drop repositioning, corner scale handle (30%–250%), top rotation handle (-180° to 180°), quick-delete handle, and fine-tuning sliders.
   - **Standard Placement Presets:** One-click snapping to Left Chest, Right Chest, Center Front, Full Front, Upper Back, Full Back, Left Sleeve, Right Sleeve.
   - **Decoration Technique Selector:** Screen Printing, DTF, DTG, Dye Sublimation, Heat Transfer, Embroidery, and Blank apparel with explanations.
   - **Live Design Summary & Seamless Bulk Transfer:** Summarizes all placements and transfers the configuration smoothly into `bulk-quote.html` with product, color, and technique pre-selected.
   - **Technical Reference Guides (below the studio):** Decision comparison table, placement coordinate diagrams, and pre-flight artwork checklist.

6. **Our Work / Portfolio (`portfolio.html`)**
   - Visual showcase of previous illustrative bulk production runs.
   - Category filtering: Corporate Apparel, College Events, Sports Jerseys, Custom Merchandise, Promotional T-Shirts.
   - Interactive case study detail modal with production volume, fabric selection, and decoration technique breakdown.

7. **Contact Us & Commercial Desk (`contact.html`)**
   - Direct wholesale inquiry form with client-side validation.
   - Commercial headquarters placeholders (address, wholesale hotline, direct email, WhatsApp).
   - Stylized geolocation map placeholder card.

8. **Smart Bulk Order Builder & Request Quote (`bulk-quote.html`) — Core Feature**
   - **Multi-product selection:** Combine multiple garment styles into a single quotation package.
   - **Visual color swatches:** Pick one or multiple fabric colors per product.
   - **Size-wise quantity matrix:** Granular inputs for S, M, L, XL, 2XL, and 3XL for each selected colorway.
   - **Autofill size curve:** Preset helper applying standard corporate demographic size distribution.
   - **Live calculation engine:** Automatic updates for color totals, product totals, and grand enquiry volume.
   - **MOQ validation:** Real-time visual banners checking whether each product meets its factory minimum.
   - **Customization & print method selectors:** Front, back, sleeve, embroidery, and decoration technique radio cards.
   - **Client-side artwork uploader:** Drag-and-drop & browse, supporting PNG, JPG, PDF, SVG with thumbnail preview and removal.
   - **Live Bulk Order Summary:** Real-time sticky breakdown with commercial price transparency notice.
   - **Bulk Enquiry Form:** Validates contact information and lodgments.
   - **Confirmation Screen:** Professional submission screen generating unique demo references (e.g. `BTQ-DEMO-00001`).

---

## 🚀 Running the Demonstration Locally

To launch the presentation locally on any machine:

```bash
# Using Python
python -m http.server 8080

# Or open index.html directly in any modern browser:
# Chrome, Safari, Edge, or Firefox.
```

Visit: `http://localhost:8080/index.html`
