/**
 * Vanguard Textile Co. — Interactive T-Shirt Customization Studio
 * Pure Vanilla JavaScript implementation
 * Features:
 * - 5 Garment models x 2 views (Front & Back) high-detail SVG vectors
 * - Real-time color switcher (presets + custom color picker)
 * - Multi-logo drag, resize (corner handle & slider), and rotation (top handle & slider)
 * - Independent front & back artwork layers
 * - Placement presets (Left Chest, Center Front, Upper Back, Sleeves, etc.)
 * - Real file upload (PNG with transparency, JPG, SVG) with client-side validation
 * - Built-in sample starter graphics for instant one-click testing
 * - Live design summary & seamless transition to bulk-quote.html
 */

// Central Studio State
const StudioState = {
  garmentId: 'round-neck', // 'round-neck', 'polo', 'oversized', 'sports', 'hoodie'
  garmentName: 'Apex 220 GSM Combed Crewneck',
  productCode: 'VTC-RN-01',
  moq: 50,
  currentColor: '#1E1E1E',
  currentColorName: 'Pitch Black',
  activeView: 'front', // 'front' | 'back'
  zoom: 1.0,
  printMethod: 'Screen Printing',
  
  // Independent artwork arrays for front & back
  artworks: {
    front: [],
    back: []
  },
  
  selectedArtworkId: null,
  activePlacementPreset: 'Center Front',
  showPrintGuide: true,
  uploadedFilesHistory: []
};

// Garment Catalog definitions for the Studio
const STUDIO_GARMENTS = {
  'round-neck': {
    id: 'round-neck',
    productId: 'rn-apex-220',
    name: 'Apex 220 GSM Combed Crewneck',
    category: 'Round Neck T-Shirt',
    code: 'VTC-RN-01',
    moq: 50,
    fabric: '100% Combed Ring-Spun Cotton',
    icon: '👕'
  },
  'polo': {
    id: 'polo',
    productId: 'polo-honeycomb-240',
    name: 'Executive Honeycomb Pique Polo',
    category: 'Polo T-Shirt',
    code: 'VTC-PL-02',
    moq: 30,
    fabric: '60% Cotton / 40% Poly Honeycomb Pique',
    icon: '👔'
  },
  'oversized': {
    id: 'oversized',
    productId: 'ovr-street-260',
    name: 'Heavy-Drop Oversized Street Tee',
    category: 'Oversized Streetwear',
    code: 'VTC-OS-03',
    moq: 50,
    fabric: '100% Heavy Combed Cotton 260 GSM',
    icon: '🧥'
  },
  'sports': {
    id: 'sports',
    productId: 'spt-aerodry-160',
    name: 'AeroDry Athletic Team Jersey',
    category: 'Sports / Jerseys',
    code: 'VTC-SP-04',
    moq: 50,
    fabric: '100% AeroDry Micro-Interlock Poly',
    icon: '🎽'
  },
  'hoodie': {
    id: 'hoodie',
    productId: 'hdy-terry-340',
    name: 'Meridian 340 GSM Brushed Fleece Hoodie',
    category: 'Hoodie & Fleece',
    code: 'VTC-HD-05',
    moq: 30,
    fabric: '80% Combed Cotton / 20% Anti-Pill Fleece',
    icon: '🥼'
  }
};

// Preset Color definitions
const STUDIO_COLORS = [
  { name: 'Pitch Black', hex: '#1E1E1E' },
  { name: 'Pure Chalk White', hex: '#FBF9F5' },
  { name: 'Deep Charcoal', hex: '#2D302A' },
  { name: 'Naval Blue', hex: '#1B263B' },
  { name: 'Terracotta Earth', hex: '#A66B4F' },
  { name: 'Heather Grey', hex: '#9B9A94' },
  { name: 'Forest Olive', hex: '#3E4738' }
];

// Placement Presets Coordinates (% relative to stage 500x550)
const PLACEMENT_PRESETS = {
  front: {
    'Left Chest': { x: 67, y: 32, scale: 0.65 },
    'Right Chest': { x: 33, y: 32, scale: 0.65 },
    'Center Front': { x: 50, y: 40, scale: 1.0 },
    'Full Front': { x: 50, y: 46, scale: 1.5 },
    'Left Sleeve': { x: 86, y: 33, scale: 0.55 },
    'Right Sleeve': { x: 14, y: 33, scale: 0.55 }
  },
  back: {
    'Upper Back': { x: 50, y: 26, scale: 1.1 },
    'Full Back': { x: 50, y: 48, scale: 1.55 },
    'Back Neck': { x: 50, y: 18, scale: 0.5 },
    'Left Sleeve': { x: 14, y: 33, scale: 0.55 },
    'Right Sleeve': { x: 86, y: 33, scale: 0.55 }
  }
};

// Starter Sample Graphics (SVG Data URIs)
const STARTER_GRAPHICS = [
  {
    name: 'Vanguard Atelier Crest',
    type: 'svg',
    svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <circle cx="100" cy="100" r="92" fill="none" stroke="#A66B4F" stroke-width="4"/>
      <circle cx="100" cy="100" r="82" fill="none" stroke="#A66B4F" stroke-width="1.5" stroke-dasharray="3,3"/>
      <path d="M70,65 L100,140 L130,65 L115,65 L100,115 L85,65 Z" fill="#A66B4F"/>
      <text x="100" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" letter-spacing="4" fill="#A66B4F" text-anchor="middle">VANGUARD</text>
      <text x="100" y="162" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="600" letter-spacing="3" fill="#A66B4F" text-anchor="middle">ATELIER 2026</text>
    </svg>`
  },
  {
    name: 'Minimal Bold Box Logo',
    type: 'svg',
    svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80" width="240" height="80">
      <rect x="4" y="4" width="232" height="72" fill="#252820" rx="3"/>
      <rect x="8" y="8" width="224" height="64" fill="none" stroke="#A66B4F" stroke-width="2"/>
      <text x="120" y="47" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="800" letter-spacing="6" fill="#FCFAF6" text-anchor="middle">NEW HORIZONS</text>
    </svg>`
  },
  {
    name: 'Athletic Varsity Crest',
    type: 'svg',
    svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
      <polygon points="90,10 170,55 170,125 90,170 10,125 10,55" fill="none" stroke="#FFFFFF" stroke-width="4"/>
      <polygon points="90,18 160,58 160,120 90,160 20,120 20,58" fill="#A66B4F"/>
      <text x="90" y="90" font-family="'Playfair Display', serif" font-size="44" font-weight="700" fill="#FFFFFF" text-anchor="middle">94</text>
      <text x="90" y="118" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" letter-spacing="2" fill="#FFFFFF" text-anchor="middle">DIVISION I</text>
    </svg>`
  }
];

// Helper to encode SVG string to Data URI
function svgToDataUrl(svgString) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('customizationStudioApp')) {
    initCustomizationStudio();
  }
});

function initCustomizationStudio() {
  // Check URL query for initial garment selection e.g. ?garment=polo
  const urlParams = new URLSearchParams(window.location.search);
  const qGarment = urlParams.get('garment');
  if (qGarment && STUDIO_GARMENTS[qGarment]) {
    selectGarment(qGarment);
  }

  // Render initial components
  renderGarmentSelector();
  renderColorSwatches();
  renderPlacementPresets();
  renderTechniqueOptions();
  renderMockup();
  initFileUpload();
  initStageZoomControls();
  initCanvasInteractions();
  initStarterGraphics();
  updateDesignSummary();

  // Load starter graphic by default so user sees immediate interactive demo
  loadStarterGraphic(0, false);
}

/**
 * 1. Render Mockup (SVG Vector Garments)
 */
function renderMockup() {
  const container = document.getElementById('garmentSvgContainer');
  if (!container) return;

  const gId = StudioState.garmentId;
  const view = StudioState.activeView;
  const color = StudioState.currentColor;

  // Generate the SVG template
  container.innerHTML = getGarmentSvgTemplate(gId, view, color);

  // Re-render placed artworks for current view
  renderArtworksOnCanvas();

  // Update stage header text
  const gNameEl = document.getElementById('stageGarmentName');
  if (gNameEl) gNameEl.textContent = StudioState.garmentName;

  const cDot = document.getElementById('stageColorDot');
  if (cDot) cDot.style.backgroundColor = color;

  const cName = document.getElementById('stageColorName');
  if (cName) cName.textContent = StudioState.currentColorName;

  const viewCountEl = document.getElementById(`countBadge-${view}`);
  if (viewCountEl) {
    viewCountEl.textContent = StudioState.artworks[view].length;
  }
}

/**
 * High-Precision Vector SVG Garment Templates (5 Garments x 2 Views)
 */
function getGarmentSvgTemplate(garmentId, view, fillColor) {
  const isBack = view === 'back';
  
  // Base Shading Filter & Gradients
  const defs = `
    <defs>
      <!-- Fabric Ambient Shading -->
      <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.18"/>
        <stop offset="12%" stop-color="#000000" stop-opacity="0.04"/>
        <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.08"/>
        <stop offset="88%" stop-color="#000000" stop-opacity="0.04"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.18"/>
      </linearGradient>

      <!-- Armpit Crease Shade -->
      <radialGradient id="armpitShadeLeft" cx="20%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="armpitShadeRight" cx="80%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>
  `;

  let paths = '';

  switch (garmentId) {
    case 'polo':
      paths = getPoloSvgPaths(isBack, fillColor);
      break;
    case 'oversized':
      paths = getOversizedSvgPaths(isBack, fillColor);
      break;
    case 'sports':
      paths = getSportsSvgPaths(isBack, fillColor);
      break;
    case 'hoodie':
      paths = getHoodieSvgPaths(isBack, fillColor);
      break;
    case 'round-neck':
    default:
      paths = getRoundNeckSvgPaths(isBack, fillColor);
      break;
  }

  return `
    <svg viewBox="0 0 500 550" class="studio-garment-svg" preserveAspectRatio="xMidYMid meet">
      ${defs}
      ${paths}
    </svg>
  `;
}

// 1. Round Neck SVG Paths
function getRoundNeckSvgPaths(isBack, fill) {
  return `
    <g class="garment-vector-group">
      <!-- Main Garment Silhouette -->
      <path class="garment-base-fill" fill="${fill}" d="
        M190,48 Q250,56 310,48
        L395,85 L445,160 L395,195 L365,150
        L365,490 Q250,505 135,490
        L135,150 L105,195 L55,160 L105,85 Z
      " stroke="rgba(37, 40, 32, 0.25)" stroke-width="1.8"/>

      <!-- Ambient Shading -->
      <path fill="url(#bodyGradient)" d="
        M190,48 Q250,56 310,48
        L395,85 L445,160 L395,195 L365,150
        L365,490 Q250,505 135,490
        L135,150 L105,195 L55,160 L105,85 Z
      "/>

      <!-- Armpit Shadow Overlays -->
      <path fill="url(#armpitShadeLeft)" d="M135,150 L105,195 L145,220 Z"/>
      <path fill="url(#armpitShadeRight)" d="M365,150 L395,195 L355,220 Z"/>

      <!-- Sleeve Hem Stitches -->
      <line x1="62" y1="164" x2="108" y2="198" stroke="rgba(0,0,0,0.22)" stroke-width="1.5" stroke-dasharray="3,2"/>
      <line x1="438" y1="164" x2="392" y2="198" stroke="rgba(0,0,0,0.22)" stroke-width="1.5" stroke-dasharray="3,2"/>

      <!-- Bottom Hem Stitch -->
      <path d="M135,478 Q250,493 365,478" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="1.5" stroke-dasharray="4,2"/>

      ${!isBack ? `
        <!-- Front Crew Collar Band -->
        <path fill="${fill}" d="M190,48 Q250,110 310,48 Q250,88 190,48 Z" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>
        <path fill="none" d="M194,52 Q250,105 306,52" stroke="rgba(0,0,0,0.18)" stroke-width="1.2" stroke-dasharray="3,2"/>
      ` : `
        <!-- Back Collar Band -->
        <path fill="${fill}" d="M190,48 Q250,68 310,48 Q250,58 190,48 Z" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>
        <line x1="192" y1="52" x2="308" y2="52" stroke="rgba(0,0,0,0.2)" stroke-width="1.2" stroke-dasharray="3,2"/>
        <!-- Inner neck tape line -->
        <path d="M205,53 Q250,85 295,53" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="2"/>
        <!-- Back Yoke Seam -->
        <path d="M165,100 Q250,115 335,100" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="1" stroke-dasharray="3,2"/>
      `}
    </g>
  `;
}

// 2. Polo Shirt SVG Paths
function getPoloSvgPaths(isBack, fill) {
  return `
    <g class="garment-vector-group">
      <!-- Body -->
      <path class="garment-base-fill" fill="${fill}" d="
        M195,52 L305,52
        L390,88 L440,165 L390,195 L365,152
        L365,490 Q250,498 135,490
        L135,152 L110,195 L60,165 L110,88 Z
      " stroke="rgba(37, 40, 32, 0.25)" stroke-width="1.8"/>

      <path fill="url(#bodyGradient)" d="
        M195,52 L305,52
        L390,88 L440,165 L390,195 L365,152
        L365,490 Q250,498 135,490
        L135,152 L110,195 L60,165 L110,88 Z
      "/>

      <!-- Ribbed Sleeve Cuffs -->
      <path d="M60,165 L110,195 L106,203 L56,173 Z" fill="rgba(0,0,0,0.15)"/>
      <path d="M440,165 L390,195 L394,203 L444,173 Z" fill="rgba(0,0,0,0.15)"/>

      <!-- Side-Vent Hem Slits -->
      <line x1="135" y1="465" x2="135" y2="490" stroke="rgba(0,0,0,0.3)" stroke-width="2"/>
      <line x1="365" y1="465" x2="365" y2="490" stroke="rgba(0,0,0,0.3)" stroke-width="2"/>

      ${!isBack ? `
        <!-- Polo Placket (Center 3-button) -->
        <rect x="238" y="70" width="24" height="110" fill="${fill}" stroke="rgba(0,0,0,0.25)" stroke-width="1.5"/>
        <line x1="250" y1="70" x2="250" y2="178" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
        
        <!-- Buttons -->
        <circle cx="250" cy="88" r="3.5" fill="#FAF8F5" stroke="#777" stroke-width="0.8"/>
        <circle cx="250" cy="120" r="3.5" fill="#FAF8F5" stroke="#777" stroke-width="0.8"/>
        <circle cx="250" cy="154" r="3.5" fill="#FAF8F5" stroke="#777" stroke-width="0.8"/>

        <!-- Left & Right Collar Leaves -->
        <path d="M195,52 L250,70 L220,118 L190,65 Z" fill="${fill}" stroke="rgba(0,0,0,0.35)" stroke-width="1.6"/>
        <path d="M305,52 L250,70 L280,118 L310,65 Z" fill="${fill}" stroke="rgba(0,0,0,0.35)" stroke-width="1.6"/>
        <!-- Collar Shadow -->
        <path d="M220,118 L250,70 L280,118 Z" fill="rgba(0,0,0,0.1)"/>
      ` : `
        <!-- Back Collar Stand -->
        <path d="M195,52 Q250,42 305,52 L295,74 Q250,68 205,74 Z" fill="${fill}" stroke="rgba(0,0,0,0.3)" stroke-width="1.6"/>
        <!-- Back Yoke Seam -->
        <line x1="145" y1="120" x2="355" y2="120" stroke="rgba(0,0,0,0.2)" stroke-width="1.2" stroke-dasharray="3,2"/>
      `}
    </g>
  `;
}

// 3. Oversized Drop-Shoulder Tee SVG Paths
function getOversizedSvgPaths(isBack, fill) {
  return `
    <g class="garment-vector-group">
      <!-- Wider boxy torso + Dropped shoulders -->
      <path class="garment-base-fill" fill="${fill}" d="
        M185,46 Q250,54 315,46
        L425,95 L465,200 L400,225 L380,175
        L380,505 Q250,515 120,505
        L120,175 L100,225 L35,200 L75,95 Z
      " stroke="rgba(37, 40, 32, 0.25)" stroke-width="1.8"/>

      <path fill="url(#bodyGradient)" d="
        M185,46 Q250,54 315,46
        L425,95 L465,200 L400,225 L380,175
        L380,505 Q250,515 120,505
        L120,175 L100,225 L35,200 L75,95 Z
      "/>

      <!-- Distinct Drop-Shoulder Seam Lines -->
      <line x1="120" y1="175" x2="165" y2="78" stroke="rgba(0,0,0,0.22)" stroke-width="1.5" stroke-dasharray="3,2"/>
      <line x1="380" y1="175" x2="335" y2="78" stroke="rgba(0,0,0,0.22)" stroke-width="1.5" stroke-dasharray="3,2"/>

      <!-- Wide Sleeve Hems -->
      <line x1="38" y1="202" x2="102" y2="227" stroke="rgba(0,0,0,0.2)" stroke-width="1.5" stroke-dasharray="4,2"/>
      <line x1="462" y1="202" x2="398" y2="227" stroke="rgba(0,0,0,0.2)" stroke-width="1.5" stroke-dasharray="4,2"/>

      ${!isBack ? `
        <!-- Chunky 1.25\" Ribbed Collar -->
        <path fill="${fill}" d="M185,46 Q250,118 315,46 Q250,94 185,46 Z" stroke="rgba(0,0,0,0.32)" stroke-width="1.8"/>
        <path d="M188,50 Q250,112 312,50" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1.4" stroke-dasharray="3,2"/>
      ` : `
        <!-- Back Crew Rib -->
        <path fill="${fill}" d="M185,46 Q250,66 315,46 Q250,56 185,46 Z" stroke="rgba(0,0,0,0.3)" stroke-width="1.6"/>
      `}
    </g>
  `;
}

// 4. Sports / Athletic Raglan Jersey SVG Paths
function getSportsSvgPaths(isBack, fill) {
  return `
    <g class="garment-vector-group">
      <!-- Body & Raglan Sleeves -->
      <path class="garment-base-fill" fill="${fill}" d="
        M192,50 Q250,56 308,50
        L390,84 L440,158 L390,192 L362,148
        L362,492 Q250,504 138,492
        L138,148 L110,192 L60,158 L110,84 Z
      " stroke="rgba(37, 40, 32, 0.25)" stroke-width="1.8"/>

      <path fill="url(#bodyGradient)" d="
        M192,50 Q250,56 308,50
        L390,84 L440,158 L390,192 L362,148
        L362,492 Q250,504 138,492
        L138,148 L110,192 L60,158 L110,84 Z
      "/>

      <!-- Raglan Diagonal Sleeve Seams (Front / Back) -->
      <line x1="205" y1="58" x2="138" y2="148" stroke="rgba(0,0,0,0.3)" stroke-width="1.8"/>
      <line x1="295" y1="58" x2="362" y2="148" stroke="rgba(0,0,0,0.3)" stroke-width="1.8"/>

      <!-- Athletic Ergonomic Side Panels -->
      <path d="M138,148 Q155,320 138,492 L150,492 Q168,320 150,152 Z" fill="rgba(0,0,0,0.12)"/>
      <path d="M362,148 Q345,320 362,492 L350,492 Q332,320 350,152 Z" fill="rgba(0,0,0,0.12)"/>

      ${!isBack ? `
        <!-- Athletic V-Insert Collar -->
        <path fill="${fill}" d="M192,50 Q250,105 308,50 L250,85 Z" stroke="rgba(0,0,0,0.25)" stroke-width="1.5"/>
      ` : `
        <!-- Athletic Back Neck Tape -->
        <path d="M192,50 Q250,68 308,50" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="2"/>
        <line x1="170" y1="95" x2="330" y2="95" stroke="rgba(0,0,0,0.18)" stroke-width="1.2" stroke-dasharray="3,2"/>
      `}
    </g>
  `;
}

// 5. Hoodie & Fleece Pullover SVG Paths
function getHoodieSvgPaths(isBack, fill) {
  return `
    <g class="garment-vector-group">
      <!-- Heavy Torso Body -->
      <path class="garment-base-fill" fill="${fill}" d="
        M180,58 L320,58
        L410,95 L455,190 L395,215 L370,165
        L370,500 Q250,510 130,500
        L130,165 L105,215 L45,190 L90,95 Z
      " stroke="rgba(37, 40, 32, 0.25)" stroke-width="1.8"/>

      <path fill="url(#bodyGradient)" d="
        M180,58 L320,58
        L410,95 L455,190 L395,215 L370,165
        L370,500 Q250,510 130,500
        L130,165 L105,215 L45,190 L90,95 Z
      "/>

      <!-- Heavy 2x2 Ribbed Hemband & Cuffs -->
      <path d="M130,465 Q250,475 370,465 L370,500 Q250,510 130,500 Z" fill="rgba(0,0,0,0.18)"/>
      <path d="M45,190 L105,215 L100,228 L40,203 Z" fill="rgba(0,0,0,0.18)"/>
      <path d="M455,190 L395,215 L400,228 L460,203 Z" fill="rgba(0,0,0,0.18)"/>

      ${!isBack ? `
        <!-- Kangaroo Pouch Pocket -->
        <path d="
          M180,360 L320,360
          L345,465 Q250,475 155,465 L180,360 Z
        " fill="${fill}" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>
        <path d="M180,360 L320,360 L345,465 Q250,475 155,465 Z" fill="rgba(0,0,0,0.06)"/>
        <!-- Pocket Entry Slits -->
        <path d="M180,360 L160,420" stroke="rgba(0,0,0,0.35)" stroke-width="2"/>
        <path d="M320,360 L340,420" stroke="rgba(0,0,0,0.35)" stroke-width="2"/>

        <!-- Double Layered Hood Silhouette -->
        <path d="
          M175,80 Q195,15 250,15 Q305,15 325,80
          L295,95 Q250,45 205,95 Z
        " fill="${fill}" stroke="rgba(0,0,0,0.35)" stroke-width="1.8"/>

        <!-- Drawcords -->
        <path d="M225,95 Q220,160 215,200" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
        <rect x="212" y="195" width="6" height="12" fill="#333" rx="1"/>

        <path d="M275,95 Q280,160 285,200" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
        <rect x="282" y="195" width="6" height="12" fill="#333" rx="1"/>
      ` : `
        <!-- Back Hood Drape Resting on Upper Shoulders -->
        <path d="
          M170,80 Q250,30 330,80
          Q250,145 170,80 Z
        " fill="${fill}" stroke="rgba(0,0,0,0.35)" stroke-width="1.8"/>
        <path d="M170,80 Q250,145 330,80" fill="rgba(0,0,0,0.15)"/>
        <!-- Center Hood Spine Seam -->
        <line x1="250" y1="50" x2="250" y2="125" stroke="rgba(0,0,0,0.25)" stroke-width="1.5" stroke-dasharray="3,2"/>
      `}
    </g>
  `;
}

/**
 * 2. Render Artworks on Mockup Stage Layer
 */
function renderArtworksOnCanvas() {
  const layer = document.getElementById('studioArtworkLayer');
  if (!layer) return;

  const currentView = StudioState.activeView;
  const list = StudioState.artworks[currentView];

  layer.innerHTML = list.map(item => {
    const isSelected = item.id === StudioState.selectedArtworkId;
    return `
      <div 
        class="canvas-logo-item ${isSelected ? 'is-selected' : ''}" 
        id="canvasItem-${item.id}"
        data-id="${item.id}"
        style="
          left: ${item.x}%;
          top: ${item.y}%;
          width: ${item.width * item.scale}px;
          transform: translate(-50%, -50%) rotate(${item.rotation}deg);
        "
      >
        <img src="${item.src}" alt="${item.name}" class="canvas-logo-img">
        
        <!-- Interactive Handles for Active Selection -->
        <div class="logo-handle handle-rotate" data-action="rotate" title="Drag to rotate">&circlearrowright;</div>
        <div class="logo-handle handle-resize" data-action="resize" title="Drag to resize">&searr;</div>
        <div class="logo-handle handle-delete" data-action="delete" title="Remove logo">&times;</div>
      </div>
    `;
  }).join('');

  // Re-attach interactive handle & selection listeners
  attachCanvasItemListeners();
  renderArtworkListInspector();
  updateDesignSummary();
}

/**
 * 3. Canvas Interactions: Dragging, Resizing, Rotating
 */
function initCanvasInteractions() {
  const stage = document.getElementById('studioStageContainer');
  if (!stage) return;

  let activeItem = null;
  let activeAction = null; // 'drag' | 'resize' | 'rotate'
  let startX = 0, startY = 0;
  let initialLeft = 0, initialTop = 0;
  let initialScale = 1.0;
  let initialRotation = 0;
  let initialDistance = 0;

  // Global Pointer Up
  window.addEventListener('pointerup', () => {
    if (activeItem) {
      activeItem.classList.remove('is-dragging');
      activeItem = null;
      activeAction = null;
      updateDesignSummary();
    }
  });

  // Global Pointer Move
  window.addEventListener('pointermove', (e) => {
    if (!activeItem || !activeAction) return;

    const currentList = StudioState.artworks[StudioState.activeView];
    const itemData = currentList.find(a => a.id === StudioState.selectedArtworkId);
    if (!itemData) return;

    const rect = stage.getBoundingClientRect();

    if (activeAction === 'drag') {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Convert dx, dy to percentage of stage
      const newX = initialLeft + (dx / rect.width) * 100;
      const newY = initialTop + (dy / rect.height) * 100;

      // Clamp within 10% to 90% bounds of stage
      itemData.x = Math.max(10, Math.min(90, newX));
      itemData.y = Math.max(10, Math.min(90, newY));

      activeItem.style.left = itemData.x + '%';
      activeItem.style.top = itemData.y + '%';
    } 
    else if (activeAction === 'resize') {
      const currentDist = Math.hypot(e.clientX - startX, e.clientY - startY);
      const ratio = currentDist / Math.max(initialDistance, 10);
      const newScale = Math.max(0.3, Math.min(2.5, initialScale * ratio));

      itemData.scale = parseFloat(newScale.toFixed(2));
      activeItem.style.width = (itemData.width * itemData.scale) + 'px';

      // Sync slider
      const slider = document.getElementById('inspectorScaleSlider');
      if (slider) slider.value = Math.round(itemData.scale * 100);
      const valEl = document.getElementById('inspectorScaleVal');
      if (valEl) valEl.textContent = Math.round(itemData.scale * 100) + '%';
    }
    else if (activeAction === 'rotate') {
      const centerBox = activeItem.getBoundingClientRect();
      const centerX = centerBox.left + centerBox.width / 2;
      const centerY = centerBox.top + centerBox.height / 2;
      const radians = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let degrees = Math.round(radians * (180 / Math.PI)) + 90; // offset so top is 0

      // Normalize between -180 and 180
      if (degrees > 180) degrees -= 360;
      if (degrees < -180) degrees += 360;

      itemData.rotation = degrees;
      activeItem.style.transform = `translate(-50%, -50%) rotate(${itemData.rotation}deg)`;

      // Sync slider
      const rotSlider = document.getElementById('inspectorRotateSlider');
      if (rotSlider) rotSlider.value = itemData.rotation;
      const rotVal = document.getElementById('inspectorRotateVal');
      if (rotVal) rotVal.textContent = itemData.rotation + '°';
    }
  });

  // Attach pointerdown to individual logos
  window.attachCanvasItemListeners = function() {
    const stageItems = document.querySelectorAll('.canvas-logo-item');
    stageItems.forEach(el => {
      el.addEventListener('pointerdown', (e) => {
        const id = el.getAttribute('data-id');
        selectArtwork(id);

        const actionTarget = e.target.closest('.logo-handle');
        if (actionTarget) {
          const action = actionTarget.getAttribute('data-action');
          if (action === 'delete') {
            e.stopPropagation();
            removeArtwork(id);
            return;
          }
          if (action === 'resize') {
            e.stopPropagation();
            activeItem = el;
            activeAction = 'resize';
            startX = el.getBoundingClientRect().left + el.getBoundingClientRect().width / 2;
            startY = el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2;
            initialDistance = Math.hypot(e.clientX - startX, e.clientY - startY);
            const item = StudioState.artworks[StudioState.activeView].find(a => a.id === id);
            initialScale = item ? item.scale : 1.0;
            return;
          }
          if (action === 'rotate') {
            e.stopPropagation();
            activeItem = el;
            activeAction = 'rotate';
            return;
          }
        }

        // Default drag
        activeItem = el;
        activeAction = 'drag';
        el.classList.add('is-dragging');
        startX = e.clientX;
        startY = e.clientY;
        const currentList = StudioState.artworks[StudioState.activeView];
        const item = currentList.find(a => a.id === id);
        initialLeft = item ? item.x : 50;
        initialTop = item ? item.y : 50;
      });
    });
  };
}

/**
 * 4. Garment Selector Controls
 */
function renderGarmentSelector() {
  const container = document.getElementById('garmentSelectionGrid');
  if (!container) return;

  const garments = Object.values(STUDIO_GARMENTS);

  container.innerHTML = garments.map(g => `
    <div class="garment-option-card ${g.id === StudioState.garmentId ? 'active' : ''}" data-garment="${g.id}">
      <span class="garment-option-icon">${g.icon}</span>
      <span class="garment-option-name">${g.category}</span>
      <span class="garment-option-moq">MOQ ${g.moq} pcs</span>
    </div>
  `).join('');

  container.querySelectorAll('.garment-option-card').forEach(card => {
    card.addEventListener('click', () => {
      selectGarment(card.getAttribute('data-garment'));
    });
  });
}

function selectGarment(id) {
  const g = STUDIO_GARMENTS[id];
  if (!g) return;

  StudioState.garmentId = id;
  StudioState.garmentName = g.name;
  StudioState.productCode = g.code;
  StudioState.moq = g.moq;

  renderGarmentSelector();
  renderMockup();
  updateDesignSummary();
  showToast(`Selected "${g.name}"`, 'info');
}

/**
 * 5. Colour Swatches & Custom Colour Picker
 */
function renderColorSwatches() {
  const container = document.getElementById('colorSwatchesContainer');
  if (!container) return;

  container.innerHTML = `
    ${STUDIO_COLORS.map(c => `
      <div 
        class="studio-color-swatch ${c.hex.toLowerCase() === StudioState.currentColor.toLowerCase() ? 'active' : ''}" 
        data-color="${c.hex}" 
        data-name="${c.name}"
        style="background-color: ${c.hex};"
        title="${c.name}"
      ></div>
    `).join('')}

    <!-- Custom Colour Input -->
    <div class="custom-color-picker-wrap">
      <input type="color" id="customColorPickerInput" value="${StudioState.currentColor}">
      <span class="custom-color-label" id="customColorHexLabel">${StudioState.currentColor.toUpperCase()}</span>
    </div>
  `;

  // Attach Preset Swatch Clicks
  container.querySelectorAll('.studio-color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      const hex = swatch.getAttribute('data-color');
      const name = swatch.getAttribute('data-name');
      setColor(hex, name);
    });
  });

  // Attach Custom Color Picker
  const customInput = document.getElementById('customColorPickerInput');
  const customLabel = document.getElementById('customColorHexLabel');
  if (customInput) {
    customInput.addEventListener('input', (e) => {
      const hex = e.target.value;
      if (customLabel) customLabel.textContent = hex.toUpperCase();
      setColor(hex, `Custom (${hex.toUpperCase()})`);
    });
  }
}

function setColor(hex, name) {
  StudioState.currentColor = hex;
  StudioState.currentColorName = name;

  // Immediately update SVG fill without reload
  const svgFills = document.querySelectorAll('.garment-base-fill');
  svgFills.forEach(p => p.setAttribute('fill', hex));

  // Update swatches active ring
  document.querySelectorAll('.studio-color-swatch').forEach(s => {
    if (s.getAttribute('data-color').toLowerCase() === hex.toLowerCase()) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });

  // Update Toolbar indicator
  const cDot = document.getElementById('stageColorDot');
  if (cDot) cDot.style.backgroundColor = hex;
  const cName = document.getElementById('stageColorName');
  if (cName) cName.textContent = name;

  updateDesignSummary();
}

/**
 * 6. View Switcher (Front / Back)
 */
function switchView(view) {
  if (view !== 'front' && view !== 'back') return;

  StudioState.activeView = view;
  StudioState.selectedArtworkId = null;

  // Update View Switcher Buttons
  document.querySelectorAll('.view-btn').forEach(btn => {
    if (btn.getAttribute('data-view') === view) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Re-render presets & mockup
  renderPlacementPresets();
  renderMockup();
}

/**
 * 7. Logo & Artwork File Upload
 */
function initFileUpload() {
  const dropzone = document.getElementById('studioUploadDropzone');
  const fileInput = document.getElementById('studioFileInput');
  const errorBanner = document.getElementById('studioUploadError');

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());

  ['dragenter', 'dragover'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer?.files?.length) {
      handleUploadedFiles(e.dataTransfer.files);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files?.length) {
      handleUploadedFiles(e.target.files);
    }
  });

  function handleUploadedFiles(files) {
    const allowed = ['png', 'jpg', 'jpeg', 'svg'];
    let addedCount = 0;
    if (errorBanner) errorBanner.style.display = 'none';

    Array.from(files).forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowed.includes(ext)) {
        showUploadError(`Invalid format: "${file.name}". Supported formats: PNG, JPG, JPEG, SVG.`);
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        showUploadError(`File too large: "${file.name}" exceeds the 15MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (re) => {
        const dataUrl = re.target.result;
        addNewArtwork({
          name: file.name,
          src: dataUrl,
          type: ext,
          sizeFormatted: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        });
      };
      reader.readAsDataURL(file);
      addedCount++;
    });

    if (addedCount > 0) {
      showToast(`Uploaded ${addedCount} artwork file(s)`, 'success');
    }
  }

  function showUploadError(msg) {
    if (errorBanner) {
      errorBanner.textContent = msg;
      errorBanner.style.display = 'block';
    }
    showToast(msg, 'error');
  }
}

/**
 * Add New Artwork Object to Active View
 */
function addNewArtwork(fileData) {
  const currentView = StudioState.activeView;
  const newId = 'art_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

  // Position at Center Front or Upper Back by default
  const defaultPreset = currentView === 'front' ? 'Center Front' : 'Upper Back';
  const coords = PLACEMENT_PRESETS[currentView][defaultPreset] || { x: 50, y: 40, scale: 1.0 };

  const newArt = {
    id: newId,
    name: fileData.name,
    src: fileData.src,
    type: fileData.type,
    sizeFormatted: fileData.sizeFormatted || '120 KB',
    view: currentView,
    x: coords.x,
    y: coords.y,
    width: 120,
    scale: coords.scale,
    rotation: 0,
    placementPreset: defaultPreset
  };

  StudioState.artworks[currentView].push(newArt);
  StudioState.selectedArtworkId = newId;

  if (!StudioState.uploadedFilesHistory.some(f => f.name === fileData.name)) {
    StudioState.uploadedFilesHistory.push(fileData);
  }

  renderMockup();
}

/**
 * Starter Graphics for immediate testing
 */
function initStarterGraphics() {
  const container = document.getElementById('starterGraphicsRow');
  if (!container) return;

  container.innerHTML = STARTER_GRAPHICS.map((g, idx) => `
    <button type="button" class="sample-graphic-btn" data-index="${idx}">
      + Add ${g.name}
    </button>
  `).join('');

  container.querySelectorAll('.sample-graphic-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      loadStarterGraphic(idx, true);
    });
  });
}

function loadStarterGraphic(index, notify = true) {
  const g = STARTER_GRAPHICS[index];
  if (!g) return;

  const dataUrl = svgToDataUrl(g.svgData);
  addNewArtwork({
    name: g.name + '.svg',
    src: dataUrl,
    type: 'svg',
    sizeFormatted: '12 KB'
  });

  if (notify) {
    showToast(`Added sample logo: "${g.name}"`, 'success');
  }
}

/**
 * 8. Placement Presets
 */
function renderPlacementPresets() {
  const container = document.getElementById('placementPresetsContainer');
  if (!container) return;

  const currentView = StudioState.activeView;
  const presets = Object.keys(PLACEMENT_PRESETS[currentView]);

  container.innerHTML = presets.map(p => `
    <button type="button" class="placement-preset-btn ${p === StudioState.activePlacementPreset ? 'active' : ''}" data-preset="${p}">
      ${p}
    </button>
  `).join('');

  container.querySelectorAll('.placement-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetName = btn.getAttribute('data-preset');
      applyPlacementPreset(presetName);
    });
  });
}

function applyPlacementPreset(presetName) {
  const currentView = StudioState.activeView;
  const presetConfig = PLACEMENT_PRESETS[currentView][presetName];
  if (!presetConfig) return;

  StudioState.activePlacementPreset = presetName;

  // Apply to currently selected artwork
  const currentList = StudioState.artworks[currentView];
  const activeArt = currentList.find(a => a.id === StudioState.selectedArtworkId);

  if (activeArt) {
    activeArt.x = presetConfig.x;
    activeArt.y = presetConfig.y;
    activeArt.scale = presetConfig.scale;
    activeArt.placementPreset = presetName;

    renderMockup();
    showToast(`Moved "${activeArt.name}" to ${presetName}`, 'info');
  } else {
    showToast(`Preset "${presetName}" active. Click artwork on T-shirt to apply.`, 'info');
  }

  // Update preset buttons active state
  document.querySelectorAll('.placement-preset-btn').forEach(b => {
    if (b.getAttribute('data-preset') === presetName) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  updateDesignSummary();
}

/**
 * 9. Active Artwork Selection & Inspector Controls
 */
function selectArtwork(id) {
  StudioState.selectedArtworkId = id;
  const currentList = StudioState.artworks[StudioState.activeView];
  const activeArt = currentList.find(a => a.id === id);

  if (activeArt && activeArt.placementPreset) {
    StudioState.activePlacementPreset = activeArt.placementPreset;
  }

  renderMockup();
}

function removeArtwork(id) {
  const currentView = StudioState.activeView;
  StudioState.artworks[currentView] = StudioState.artworks[currentView].filter(a => a.id !== id);

  if (StudioState.selectedArtworkId === id) {
    StudioState.selectedArtworkId = StudioState.artworks[currentView][0]?.id || null;
  }

  renderMockup();
  showToast('Removed artwork logo', 'info');
}

function clearAllArtworks() {
  const count = StudioState.artworks.front.length + StudioState.artworks.back.length;
  if (count === 0) {
    showToast('No placed artworks to clear', 'info');
    return;
  }

  StudioState.artworks.front = [];
  StudioState.artworks.back = [];
  StudioState.selectedArtworkId = null;

  renderMockup();
  showToast('Cleared all artworks from T-shirt', 'info');
}

/**
 * Render Artwork Layer List & Inspector Sliders
 */
function renderArtworkListInspector() {
  const listContainer = document.getElementById('artworkLayersList');
  const inspectorContainer = document.getElementById('activeArtworkInspector');
  if (!listContainer || !inspectorContainer) return;

  const currentView = StudioState.activeView;
  const currentArtworks = StudioState.artworks[currentView];

  // 1. Render Artwork Layers
  if (currentArtworks.length === 0) {
    listContainer.innerHTML = `
      <div style="font-size: 0.8rem; color: var(--text-muted-grey); text-align: center; padding: 12px; background: var(--bg-warm-ivory); border-radius: var(--radius-sm);">
        No logos placed on ${currentView} view yet. Upload your logo above or click a sample graphic.
      </div>
    `;
    inspectorContainer.style.display = 'none';
    return;
  }

  listContainer.innerHTML = currentArtworks.map(a => {
    const isSel = a.id === StudioState.selectedArtworkId;
    return `
      <div class="artwork-row-item ${isSel ? 'active' : ''}" data-id="${a.id}">
        <div class="artwork-row-left">
          <img src="${a.src}" alt="${a.name}" class="artwork-thumb">
          <div>
            <div class="artwork-row-title">${a.name}</div>
            <div class="artwork-row-meta">${a.placementPreset || 'Custom'} &bull; Scale ${Math.round(a.scale * 100)}%</div>
          </div>
        </div>
        <div class="artwork-row-actions">
          <button type="button" class="artwork-delete-btn" data-delete="${a.id}" title="Remove this logo">&times;</button>
        </div>
      </div>
    `;
  }).join('');

  listContainer.querySelectorAll('.artwork-row-item').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('.artwork-delete-btn')) return;
      selectArtwork(row.getAttribute('data-id'));
    });
  });

  listContainer.querySelectorAll('.artwork-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeArtwork(btn.getAttribute('data-delete'));
    });
  });

  // 2. Render Inspector if active logo selected
  const activeArt = currentArtworks.find(a => a.id === StudioState.selectedArtworkId);
  if (!activeArt) {
    inspectorContainer.style.display = 'none';
    return;
  }

  inspectorContainer.style.display = 'block';
  inspectorContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <span style="font-size: 0.82rem; font-weight: 700;">Fine-Tune: ${activeArt.name}</span>
      <span class="tag tag-moq" style="font-size: 0.7rem;">${activeArt.placementPreset || 'Custom'}</span>
    </div>

    <!-- Scale Slider -->
    <div class="inspector-slider-row">
      <span class="inspector-label">Scale:</span>
      <input type="range" class="inspector-slider" id="inspectorScaleSlider" min="30" max="250" value="${Math.round(activeArt.scale * 100)}">
      <span class="inspector-val" id="inspectorScaleVal">${Math.round(activeArt.scale * 100)}%</span>
    </div>

    <!-- Rotation Slider -->
    <div class="inspector-slider-row">
      <span class="inspector-label">Rotate:</span>
      <input type="range" class="inspector-slider" id="inspectorRotateSlider" min="-180" max="180" value="${activeArt.rotation}">
      <span class="inspector-val" id="inspectorRotateVal">${activeArt.rotation}&deg;</span>
    </div>

    <!-- Quick Align Actions -->
    <div class="inspector-quick-actions">
      <button type="button" class="btn btn-ghost btn-sm" id="centerHorizontalBtn" style="font-size: 0.74rem;">Center &harr;</button>
      <button type="button" class="btn btn-ghost btn-sm" id="resetRotationBtn" style="font-size: 0.74rem;">Reset 0&deg;</button>
      <button type="button" class="btn btn-ghost btn-sm" id="deleteActiveArtBtn" style="font-size: 0.74rem; color: var(--color-error); margin-left: auto;">Delete</button>
    </div>
  `;

  // Attach Inspector Sliders
  const scaleSlider = document.getElementById('inspectorScaleSlider');
  const scaleVal = document.getElementById('inspectorScaleVal');
  if (scaleSlider) {
    scaleSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      activeArt.scale = val / 100;
      if (scaleVal) scaleVal.textContent = val + '%';
      
      const itemEl = document.getElementById(`canvasItem-${activeArt.id}`);
      if (itemEl) itemEl.style.width = (activeArt.width * activeArt.scale) + 'px';
      updateDesignSummary();
    });
  }

  const rotSlider = document.getElementById('inspectorRotateSlider');
  const rotVal = document.getElementById('inspectorRotateVal');
  if (rotSlider) {
    rotSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      activeArt.rotation = val;
      if (rotVal) rotVal.textContent = val + '°';

      const itemEl = document.getElementById(`canvasItem-${activeArt.id}`);
      if (itemEl) itemEl.style.transform = `translate(-50%, -50%) rotate(${val}deg)`;
      updateDesignSummary();
    });
  }

  // Quick Action Buttons
  document.getElementById('centerHorizontalBtn')?.addEventListener('click', () => {
    activeArt.x = 50;
    const itemEl = document.getElementById(`canvasItem-${activeArt.id}`);
    if (itemEl) itemEl.style.left = '50%';
    showToast('Centered horizontally on T-shirt', 'info');
  });

  document.getElementById('resetRotationBtn')?.addEventListener('click', () => {
    activeArt.rotation = 0;
    if (rotSlider) rotSlider.value = 0;
    if (rotVal) rotVal.textContent = '0°';
    const itemEl = document.getElementById(`canvasItem-${activeArt.id}`);
    if (itemEl) itemEl.style.transform = 'translate(-50%, -50%) rotate(0deg)';
  });

  document.getElementById('deleteActiveArtBtn')?.addEventListener('click', () => {
    removeArtwork(activeArt.id);
  });
}

/**
 * 10. Printing Techniques Selection
 */
function renderTechniqueOptions() {
  const container = document.getElementById('printingTechniqueSelector');
  if (!container) return;

  const techniques = [
    { name: 'Screen Printing', desc: 'Industry standard for bulk orders (50+ units). High color opacity & durability.' },
    { name: 'DTF Printing', desc: 'Direct-to-Film transfer with high-stretch elastic finish and vibrant details.' },
    { name: 'DTG Printing', desc: 'Digital inkjet precision for photorealistic gradients on 100% combed cotton.' },
    { name: 'Dye Sublimation', desc: 'Zero hand-feel gas infusion for 100% moisture-wicking athletic polyester.' },
    { name: 'Heat Transfer', desc: 'High-visibility reflective films, silicone crests, and metallic vinyls.' },
    { name: 'Embroidery', desc: 'Premium multi-thread stitched relief ideal for corporate polos & fleece.' },
    { name: 'No Customization', desc: 'Finished high-grade blank apparel ready for private corporate relabeling.' }
  ];

  container.innerHTML = techniques.map(t => {
    const isAct = t.name === StudioState.printMethod;
    return `
      <label class="technique-item-card ${isAct ? 'active' : ''}">
        <input type="radio" name="studioPrintTechnique" value="${t.name}" ${isAct ? 'checked' : ''}>
        <div class="technique-text-wrap">
          <h5>${t.name}</h5>
          <p>${t.desc}</p>
        </div>
      </label>
    `;
  }).join('');

  container.querySelectorAll('input[name="studioPrintTechnique"]').forEach(r => {
    r.addEventListener('change', (e) => {
      StudioState.printMethod = e.target.value;
      container.querySelectorAll('.technique-item-card').forEach(c => c.classList.remove('active'));
      e.target.closest('.technique-item-card')?.classList.add('active');
      updateDesignSummary();
    });
  });
}

/**
 * 11. Zoom & Stage Controls
 */
function initStageZoomControls() {
  const zoomIn = document.getElementById('stageZoomInBtn');
  const zoomOut = document.getElementById('stageZoomOutBtn');
  const zoomReset = document.getElementById('stageZoomResetBtn');
  const guideToggle = document.getElementById('togglePrintGuideBtn');
  const clearBtn = document.getElementById('clearStudioArtworksBtn');
  const zoomTarget = document.getElementById('studioZoomContainer');

  if (zoomIn) {
    zoomIn.addEventListener('click', () => {
      StudioState.zoom = Math.min(1.4, StudioState.zoom + 0.1);
      if (zoomTarget) zoomTarget.style.transform = `scale(${StudioState.zoom})`;
    });
  }

  if (zoomOut) {
    zoomOut.addEventListener('click', () => {
      StudioState.zoom = Math.max(0.7, StudioState.zoom - 0.1);
      if (zoomTarget) zoomTarget.style.transform = `scale(${StudioState.zoom})`;
    });
  }

  if (zoomReset) {
    zoomReset.addEventListener('click', () => {
      StudioState.zoom = 1.0;
      if (zoomTarget) zoomTarget.style.transform = 'scale(1)';
    });
  }

  if (guideToggle) {
    guideToggle.addEventListener('click', () => {
      StudioState.showPrintGuide = !StudioState.showPrintGuide;
      const boundary = document.getElementById('printGuideBoundary');
      if (boundary) {
        boundary.classList.toggle('hide', !StudioState.showPrintGuide);
      }
      guideToggle.classList.toggle('active', StudioState.showPrintGuide);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', clearAllArtworks);
  }
}

/**
 * 12. Update Live Design Summary & Transfer to Bulk Enquiry
 */
function updateDesignSummary() {
  const container = document.getElementById('studioLiveSummaryCard');
  if (!container) return;

  const frontCount = StudioState.artworks.front.length;
  const backCount = StudioState.artworks.back.length;
  const totalArtworks = frontCount + backCount;

  // Extract unique placements
  const placements = new Set();
  StudioState.artworks.front.forEach(a => placements.add('Front: ' + (a.placementPreset || 'Custom Placement')));
  StudioState.artworks.back.forEach(a => placements.add('Back: ' + (a.placementPreset || 'Custom Placement')));
  
  const placementsList = placements.size > 0 ? Array.from(placements).join(', ') : 'Blank (No artwork placed)';

  // Extract uploaded file names
  const fileNames = StudioState.uploadedFilesHistory.map(f => f.name).join(', ') || 'No custom vector uploaded';

  container.innerHTML = `
    <h3 style="font-size: 1.15rem; font-family: var(--font-heading); margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color);">
      Customization Summary
    </h3>

    <div style="display: flex; flex-direction: column; gap: 8px;">
      <div class="summary-spec-item">
        <span class="summary-spec-k">Garment Model:</span>
        <span class="summary-spec-v">${StudioState.garmentName}</span>
      </div>

      <div class="summary-spec-item">
        <span class="summary-spec-k">Production Color:</span>
        <span class="summary-spec-v" style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 12px; height: 12px; border-radius: 50%; background: ${StudioState.currentColor}; border: 1px solid rgba(0,0,0,0.2);"></span>
          ${StudioState.currentColorName}
        </span>
      </div>

      <div class="summary-spec-item">
        <span class="summary-spec-k">Placed Artworks:</span>
        <span class="summary-spec-v">
          ${totalArtworks > 0 ? `${totalArtworks} placed (${frontCount} front, ${backCount} back)` : 'None placed'}
        </span>
      </div>

      <div class="summary-spec-item">
        <span class="summary-spec-k">Decoration Zones:</span>
        <span class="summary-spec-v" style="font-size: 0.8rem; max-width: 180px;">${placementsList}</span>
      </div>

      <div class="summary-spec-item">
        <span class="summary-spec-k">Printing Method:</span>
        <span class="summary-spec-v">${StudioState.printMethod}</span>
      </div>

      <div class="summary-spec-item">
        <span class="summary-spec-k">Batch MOQ:</span>
        <span class="summary-spec-v" style="color: var(--accent-terracotta);">${StudioState.moq} pcs</span>
      </div>
    </div>

    <div class="notice-box" style="margin: 16px 0 0 0; padding: 12px;">
      <p style="font-size: 0.78rem; margin: 0; line-height: 1.4;">
        <strong>B2B Transfer Guarantee:</strong> Clicking below saves your 3D customization specs and takes you directly to the Bulk Order Builder to specify size distributions (S–3XL).
      </p>
    </div>

    <button type="button" class="btn btn-primary continue-enquiry-btn" id="continueToEnquiryBtn">
      Continue to Bulk Enquiry &rarr;
    </button>
  `;

  // Attach Continue to Bulk Enquiry Button Listener
  document.getElementById('continueToEnquiryBtn')?.addEventListener('click', handleContinueToBulkEnquiry);
}

/**
 * Handle "Continue to Bulk Enquiry" Click
 */
function handleContinueToBulkEnquiry() {
  const g = STUDIO_GARMENTS[StudioState.garmentId];
  if (!g) return;

  // Build customization options array
  const customizationOptions = [];
  if (StudioState.artworks.front.length > 0) {
    customizationOptions.push('Front Logo Printing');
  }
  if (StudioState.artworks.back.length > 0) {
    customizationOptions.push('Back Printing');
  }
  if (StudioState.printMethod === 'Embroidery') {
    customizationOptions.push('Embroidery');
  }
  if (customizationOptions.length === 0) {
    customizationOptions.push('No Customization (Blank Apparel)');
  }

  // Build uploaded file metadata
  const uploadedFiles = StudioState.uploadedFilesHistory.map(f => ({
    name: f.name,
    size: f.sizeFormatted || '150 KB',
    type: f.type || 'png',
    previewUrl: f.src
  }));

  // Build bulk enquiry package
  const enquiryPackage = {
    items: [
      {
        id: g.productId,
        name: g.name,
        code: g.code,
        category: g.category,
        moq: g.moq,
        fabric: g.fabric,
        selectedColors: [StudioState.currentColorName],
        quantities: {
          [StudioState.currentColorName]: {
            S: 10,
            M: Math.ceil(g.moq * 0.35),
            L: Math.ceil(g.moq * 0.35),
            XL: Math.ceil(g.moq * 0.2),
            '2XL': 5,
            '3XL': 0
          }
        },
        customization: {
          garmentId: StudioState.garmentId,
          color: StudioState.currentColor,
          colorName: StudioState.currentColorName,
          artworks: JSON.parse(JSON.stringify(StudioState.artworks)),
          printMethod: StudioState.printMethod,
          hasCustomDesign: (StudioState.artworks.front.length > 0 || StudioState.artworks.back.length > 0)
        }
      }
    ],
    customizationOptions: customizationOptions,
    printMethod: StudioState.printMethod,
    uploadedFiles: uploadedFiles,
    additionalNotes: `Configured via Studio Design Lab: Color: ${StudioState.currentColorName} (${StudioState.currentColor}). Artworks: ${StudioState.artworks.front.length} on front, ${StudioState.artworks.back.length} on back. Technique: ${StudioState.printMethod}.`
  };

  try {
    localStorage.setItem('vtc_bulk_enquiry', JSON.stringify(enquiryPackage));
    localStorage.setItem('vtc_studio_design', JSON.stringify(StudioState));
    if (typeof updateHeaderEnquiryBadge === 'function') {
      updateHeaderEnquiryBadge();
    }
  } catch (e) {
    console.warn('Storage save failed:', e);
  }

  showToast('Design saved! Transferring to Bulk Order Builder...', 'success');

  setTimeout(() => {
    window.location.href = `bulk-quote.html?product=${g.productId}`;
  }, 400);
}
