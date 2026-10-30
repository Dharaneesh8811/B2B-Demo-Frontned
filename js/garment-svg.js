/**
 * Vanguard Textile Co. — Garment SVG Vector Templates
 * Shared between Customization Studio and Enterprise Order Architecture (Bulk Builder)
 * High-precision vector mockups for 5 silhouettes x 2 views (Front & Back)
 */

function getGarmentSvgTemplate(garmentId, view, fillColor) {
  const isBack = view === 'back';
  const fill = fillColor || '#1E1E1E';
  
  const defs = `
    <defs>
      <linearGradient id="bodyGradient_${garmentId}_${view}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.18"/>
        <stop offset="12%" stop-color="#000000" stop-opacity="0.04"/>
        <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.08"/>
        <stop offset="88%" stop-color="#000000" stop-opacity="0.04"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.18"/>
      </linearGradient>
      <radialGradient id="armpitLeft_${garmentId}" cx="20%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="armpitRight_${garmentId}" cx="80%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>
  `;

  let paths = '';
  switch (garmentId) {
    case 'polo':
      paths = getPoloSvgPaths(isBack, fill, garmentId, view);
      break;
    case 'oversized':
      paths = getOversizedSvgPaths(isBack, fill, garmentId, view);
      break;
    case 'sports':
      paths = getSportsSvgPaths(isBack, fill, garmentId, view);
      break;
    case 'hoodie':
      paths = getHoodieSvgPaths(isBack, fill, garmentId, view);
      break;
    case 'round-neck':
    default:
      paths = getRoundNeckSvgPaths(isBack, fill, garmentId, view);
      break;
  }

  return `
    <svg viewBox="0 0 500 550" class="studio-garment-svg" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%;">
      ${defs}
      ${paths}
    </svg>
  `;
}

// 1. Round Neck SVG Paths
function getRoundNeckSvgPaths(isBack, fill, gId, view) {
  return `
    <g class="garment-vector-group">
      <path class="garment-base-fill" fill="${fill}" d="
        M190,48 Q250,56 310,48
        L395,85 L445,160 L395,195 L365,150
        L365,490 Q250,505 135,490
        L135,150 L105,195 L55,160 L105,85 Z
      " stroke="rgba(37, 40, 32, 0.25)" stroke-width="1.8"/>

      <path fill="url(#bodyGradient_${gId}_${view})" d="
        M190,48 Q250,56 310,48
        L395,85 L445,160 L395,195 L365,150
        L365,490 Q250,505 135,490
        L135,150 L105,195 L55,160 L105,85 Z
      "/>

      <path fill="url(#armpitLeft_${gId})" d="M135,150 L105,195 L145,220 Z"/>
      <path fill="url(#armpitRight_${gId})" d="M365,150 L395,195 L355,220 Z"/>

      <line x1="62" y1="164" x2="108" y2="198" stroke="rgba(0,0,0,0.22)" stroke-width="1.5" stroke-dasharray="3,2"/>
      <line x1="438" y1="164" x2="392" y2="198" stroke="rgba(0,0,0,0.22)" stroke-width="1.5" stroke-dasharray="3,2"/>
      <path d="M135,478 Q250,493 365,478" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="1.5" stroke-dasharray="4,2"/>

      ${!isBack ? `
        <path fill="${fill}" d="M190,48 Q250,110 310,48 Q250,88 190,48 Z" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>
        <path fill="none" d="M194,52 Q250,105 306,52" stroke="rgba(0,0,0,0.18)" stroke-width="1.2" stroke-dasharray="3,2"/>
      ` : `
        <path fill="${fill}" d="M190,48 Q250,68 310,48 Q250,58 190,48 Z" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>
        <line x1="192" y1="52" x2="308" y2="52" stroke="rgba(0,0,0,0.2)" stroke-width="1.2" stroke-dasharray="3,2"/>
        <path d="M205,53 Q250,85 295,53" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="2"/>
        <path d="M165,100 Q250,115 335,100" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="1" stroke-dasharray="3,2"/>
      `}
    </g>
  `;
}

// 2. Polo Shirt SVG Paths
function getPoloSvgPaths(isBack, fill, gId, view) {
  return `
    <g class="garment-vector-group">
      <path class="garment-base-fill" fill="${fill}" d="
        M195,52 L305,52
        L390,88 L440,165 L390,195 L365,152
        L365,490 Q250,498 135,490
        L135,152 L110,195 L60,165 L110,88 Z
      " stroke="rgba(37, 40, 32, 0.25)" stroke-width="1.8"/>

      <path fill="url(#bodyGradient_${gId}_${view})" d="
        M195,52 L305,52
        L390,88 L440,165 L390,195 L365,152
        L365,490 Q250,498 135,490
        L135,152 L110,195 L60,165 L110,88 Z
      "/>

      <path d="M60,165 L110,195 L106,203 L56,173 Z" fill="rgba(0,0,0,0.15)"/>
      <path d="M440,165 L390,195 L394,203 L444,173 Z" fill="rgba(0,0,0,0.15)"/>

      <line x1="135" y1="465" x2="135" y2="490" stroke="rgba(0,0,0,0.3)" stroke-width="2"/>
      <line x1="365" y1="465" x2="365" y2="490" stroke="rgba(0,0,0,0.3)" stroke-width="2"/>

      ${!isBack ? `
        <rect x="238" y="70" width="24" height="110" fill="${fill}" stroke="rgba(0,0,0,0.25)" stroke-width="1.5"/>
        <line x1="250" y1="70" x2="250" y2="178" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
        <circle cx="250" cy="88" r="3.5" fill="#FAF8F5" stroke="#777" stroke-width="0.8"/>
        <circle cx="250" cy="120" r="3.5" fill="#FAF8F5" stroke="#777" stroke-width="0.8"/>
        <circle cx="250" cy="154" r="3.5" fill="#FAF8F5" stroke="#777" stroke-width="0.8"/>

        <path d="M195,52 L250,70 L220,118 L190,65 Z" fill="${fill}" stroke="rgba(0,0,0,0.35)" stroke-width="1.6"/>
        <path d="M305,52 L250,70 L280,118 L310,65 Z" fill="${fill}" stroke="rgba(0,0,0,0.35)" stroke-width="1.6"/>
        <path d="M220,118 L250,70 L280,118 Z" fill="rgba(0,0,0,0.1)"/>
      ` : `
        <path d="M195,52 Q250,42 305,52 L295,74 Q250,68 205,74 Z" fill="${fill}" stroke="rgba(0,0,0,0.3)" stroke-width="1.6"/>
        <line x1="145" y1="120" x2="355" y2="120" stroke="rgba(0,0,0,0.2)" stroke-width="1.2" stroke-dasharray="3,2"/>
      `}
    </g>
  `;
}

// 3. Oversized Drop-Shoulder Tee SVG Paths
function getOversizedSvgPaths(isBack, fill, gId, view) {
  return `
    <g class="garment-vector-group">
      <path class="garment-base-fill" fill="${fill}" d="
        M185,46 Q250,54 315,46
        L425,95 L465,200 L400,225 L380,175
        L380,505 Q250,515 120,505
        L120,175 L100,225 L35,200 L75,95 Z
      " stroke="rgba(37, 40, 32, 0.25)" stroke-width="1.8"/>

      <path fill="url(#bodyGradient_${gId}_${view})" d="
        M185,46 Q250,54 315,46
        L425,95 L465,200 L400,225 L380,175
        L380,505 Q250,515 120,505
        L120,175 L100,225 L35,200 L75,95 Z
      "/>

      <line x1="120" y1="175" x2="165" y2="78" stroke="rgba(0,0,0,0.22)" stroke-width="1.5" stroke-dasharray="3,2"/>
      <line x1="380" y1="175" x2="335" y2="78" stroke="rgba(0,0,0,0.22)" stroke-width="1.5" stroke-dasharray="3,2"/>

      <line x1="38" y1="202" x2="102" y2="227" stroke="rgba(0,0,0,0.2)" stroke-width="1.5" stroke-dasharray="4,2"/>
      <line x1="462" y1="202" x2="398" y2="227" stroke="rgba(0,0,0,0.2)" stroke-width="1.5" stroke-dasharray="4,2"/>

      ${!isBack ? `
        <path fill="${fill}" d="M185,46 Q250,118 315,46 Q250,94 185,46 Z" stroke="rgba(0,0,0,0.32)" stroke-width="1.8"/>
        <path d="M188,50 Q250,112 312,50" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1.4" stroke-dasharray="3,2"/>
      ` : `
        <path fill="${fill}" d="M185,46 Q250,66 315,46 Q250,56 185,46 Z" stroke="rgba(0,0,0,0.3)" stroke-width="1.6"/>
      `}
    </g>
  `;
}

// 4. Sports / Athletic Raglan Jersey SVG Paths
function getSportsSvgPaths(isBack, fill, gId, view) {
  return `
    <g class="garment-vector-group">
      <path class="garment-base-fill" fill="${fill}" d="
        M192,50 Q250,56 308,50
        L390,84 L440,158 L390,192 L362,148
        L362,492 Q250,504 138,492
        L138,148 L110,192 L60,158 L110,84 Z
      " stroke="rgba(37, 40, 32, 0.25)" stroke-width="1.8"/>

      <path fill="url(#bodyGradient_${gId}_${view})" d="
        M192,50 Q250,56 308,50
        L390,84 L440,158 L390,192 L362,148
        L362,492 Q250,504 138,492
        L138,148 L110,192 L60,158 L110,84 Z
      "/>

      <line x1="205" y1="58" x2="138" y2="148" stroke="rgba(0,0,0,0.3)" stroke-width="1.8"/>
      <line x1="295" y1="58" x2="362" y2="148" stroke="rgba(0,0,0,0.3)" stroke-width="1.8"/>

      <path d="M138,148 Q155,320 138,492 L150,492 Q168,320 150,152 Z" fill="rgba(0,0,0,0.12)"/>
      <path d="M362,148 Q345,320 362,492 L350,492 Q332,320 350,152 Z" fill="rgba(0,0,0,0.12)"/>

      ${!isBack ? `
        <path fill="${fill}" d="M192,50 Q250,105 308,50 L250,85 Z" stroke="rgba(0,0,0,0.25)" stroke-width="1.5"/>
      ` : `
        <path d="M192,50 Q250,68 308,50" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="2"/>
        <line x1="170" y1="95" x2="330" y2="95" stroke="rgba(0,0,0,0.18)" stroke-width="1.2" stroke-dasharray="3,2"/>
      `}
    </g>
  `;
}

// 5. Hoodie & Fleece Pullover SVG Paths
function getHoodieSvgPaths(isBack, fill, gId, view) {
  return `
    <g class="garment-vector-group">
      <path class="garment-base-fill" fill="${fill}" d="
        M180,58 L320,58
        L410,95 L455,190 L395,215 L370,165
        L370,500 Q250,510 130,500
        L130,165 L105,215 L45,190 L90,95 Z
      " stroke="rgba(37, 40, 32, 0.25)" stroke-width="1.8"/>

      <path fill="url(#bodyGradient_${gId}_${view})" d="
        M180,58 L320,58
        L410,95 L455,190 L395,215 L370,165
        L370,500 Q250,510 130,500
        L130,165 L105,215 L45,190 L90,95 Z
      "/>

      <path d="M130,465 Q250,475 370,465 L370,500 Q250,510 130,500 Z" fill="rgba(0,0,0,0.18)"/>
      <path d="M45,190 L105,215 L100,228 L40,203 Z" fill="rgba(0,0,0,0.18)"/>
      <path d="M455,190 L395,215 L400,228 L460,203 Z" fill="rgba(0,0,0,0.18)"/>

      ${!isBack ? `
        <path d="
          M180,360 L320,360
          L345,465 Q250,475 155,465 L180,360 Z
        " fill="${fill}" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>
        <path d="M180,360 L320,360 L345,465 Q250,475 155,465 Z" fill="rgba(0,0,0,0.06)"/>
        <path d="M180,360 L160,420" stroke="rgba(0,0,0,0.35)" stroke-width="2"/>
        <path d="M320,360 L340,420" stroke="rgba(0,0,0,0.35)" stroke-width="2"/>

        <path d="
          M175,80 Q195,15 250,15 Q305,15 325,80
          L295,95 Q250,45 205,95 Z
        " fill="${fill}" stroke="rgba(0,0,0,0.35)" stroke-width="1.8"/>

        <path d="M225,95 Q220,160 215,200" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
        <rect x="212" y="195" width="6" height="12" fill="#333" rx="1"/>

        <path d="M275,95 Q280,160 285,200" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
        <rect x="282" y="195" width="6" height="12" fill="#333" rx="1"/>
      ` : `
        <path d="
          M170,80 Q250,30 330,80
          Q250,145 170,80 Z
        " fill="${fill}" stroke="rgba(0,0,0,0.35)" stroke-width="1.8"/>
        <path d="M170,80 Q250,145 330,80" fill="rgba(0,0,0,0.15)"/>
        <line x1="250" y1="50" x2="250" y2="125" stroke="rgba(0,0,0,0.25)" stroke-width="1.5" stroke-dasharray="3,2"/>
      `}
    </g>
  `;
}

// Make globally accessible
window.getGarmentSvgTemplate = getGarmentSvgTemplate;
