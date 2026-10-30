/**
 * Vanguard Textile Co. - Enterprise Order Architecture (Smart Bulk Order Builder)
 * Section 7 & 8 Requirements & Product Showcase Visuals:
 * - Multi-product selection with visual thumbnails & gallery strip
 * - Prominent Product Showcase Display Card with large customized or catalogue apparel view
 * - Seamless toggle between Front & Back preview thumbnails (or multi-angle catalogue photos)
 * - Complete garment specifications: Style Code, Product Type, Fabric & GSM, MOQ
 * - Uploaded logo / artwork preview chip with precise placement label
 * - High-resolution Lightbox Modal inspection with zoom hint
 * - Visual color swatches & multi-color selection
 * - Size-wise quantity matrix (S, M, L, XL, 2XL, 3XL)
 * - Live calculations (per-color, per-product, overall volume total, MOQ satisfaction)
 * - Customization options & print method selection
 * - Client-side multiple file drag-and-drop & preview
 * - Live summary breakdown with product thumbnails
 * - Professional confirmation screen with visual order summary
 */

// Global builder state
const BulkBuilderState = {
  // Array of configured products
  products: [],
  activeProductId: null,
  customizationOptions: ["Front Logo Printing"],
  printMethod: "Screen Printing",
  uploadedFiles: [],
  additionalNotes: ""
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('bulkOrderBuilderApp')) {
    initBulkOrderBuilder();
  }
});

function initBulkOrderBuilder() {
  // 1. Initialize state from URL params or localStorage or default first product
  const urlParams = new URLSearchParams(window.location.search);
  const paramProductId = urlParams.get('product');

  loadSavedState(paramProductId);

  // 2. Render all builder components
  renderProductSelector();
  renderActiveProductConfiguration();
  renderCustomizationOptions();
  renderPrintMethods();
  initFileUploadZone();
  initLightboxModal();
  updateLiveSummary();

  // 3. Attach Form listeners
  initEnquiryForm();
}

/**
 * Load state from localStorage or query params
 */
function loadSavedState(paramProductId) {
  let initialProduct = null;

  if (paramProductId) {
    initialProduct = getProductById(paramProductId);
  }

  try {
    const saved = localStorage.getItem('vtc_bulk_enquiry');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.items && Array.isArray(parsed.items) && parsed.items.length > 0) {
        BulkBuilderState.products = parsed.items.map(item => {
          const original = getProductById(item.id) || PRODUCTS_DATA[0];
          const colors = item.selectedColors || [original.colors[0].name];
          const quantities = item.quantities || {};

          // Ensure default matrix for all selected colors
          colors.forEach(col => {
            if (!quantities[col]) {
              quantities[col] = { S: 0, M: Math.ceil(original.moq / 2), L: Math.floor(original.moq / 2), XL: 0, "2XL": 0, "3XL": 0 };
            }
          });

          return {
            id: original.id,
            name: item.name || original.name,
            code: original.code,
            category: original.category,
            productType: original.productType || 'Custom Apparel',
            moq: original.moq,
            fabric: original.fabric,
            gsm: original.gsm,
            images: original.images || [],
            availableColors: original.colors,
            selectedColors: colors,
            quantities: quantities,
            customization: item.customization || null,
            activePreviewView: 'front',
            activePreviewImageIndex: 0
          };
        });

        // If paramProduct provided and not in builder list, add it
        if (initialProduct && !BulkBuilderState.products.some(p => p.id === initialProduct.id)) {
          addProductToState(initialProduct);
        }

        // Restore studio options if transferred
        if (parsed.customizationOptions && Array.isArray(parsed.customizationOptions) && parsed.customizationOptions.length > 0) {
          BulkBuilderState.customizationOptions = parsed.customizationOptions;
        }
        if (parsed.printMethod) {
          BulkBuilderState.printMethod = parsed.printMethod;
        }
        if (parsed.uploadedFiles && Array.isArray(parsed.uploadedFiles)) {
          BulkBuilderState.uploadedFiles = parsed.uploadedFiles;
        }
        if (parsed.additionalNotes) {
          BulkBuilderState.additionalNotes = parsed.additionalNotes;
          const notesEl = document.getElementById('builderAdditionalNotes');
          if (notesEl) notesEl.value = parsed.additionalNotes;
        }

        BulkBuilderState.activeProductId = initialProduct ? initialProduct.id : BulkBuilderState.products[0].id;
        checkStudioDesignContinuity();
        return;
      }
    }
  } catch (e) {
    console.error('Failed to parse saved bulk enquiry:', e);
  }

  // Fallback: Default to param or Apex 220 GSM
  const baseProd = initialProduct || PRODUCTS_DATA[0];
  addProductToState(baseProd);
  BulkBuilderState.activeProductId = baseProd.id;
  checkStudioDesignContinuity();
}

/**
 * Cross-check studio design localStorage for customization continuity
 */
function checkStudioDesignContinuity() {
  try {
    const studioSaved = localStorage.getItem('vtc_studio_design');
    if (studioSaved) {
      const sDesign = JSON.parse(studioSaved);
      if (sDesign && sDesign.garmentId) {
        const garmentMapping = {
          'round-neck': 'rn-apex-220',
          'polo': 'polo-honeycomb-240',
          'oversized': 'rn-heavy-260',
          'sports': 'sport-dryfit-180',
          'hoodie': 'hoodie-fleece-360'
        };
        const matchingProdId = garmentMapping[sDesign.garmentId];
        const targetProd = BulkBuilderState.products.find(p => p.id === matchingProdId);
        if (targetProd && !targetProd.customization) {
          targetProd.customization = {
            garmentId: sDesign.garmentId,
            color: sDesign.currentColor,
            colorName: sDesign.currentColorName,
            artworks: sDesign.artworks,
            printMethod: sDesign.printMethod,
            hasCustomDesign: ((sDesign.artworks?.front?.length > 0) || (sDesign.artworks?.back?.length > 0))
          };
          if (!targetProd.selectedColors.includes(sDesign.currentColorName)) {
            targetProd.selectedColors.unshift(sDesign.currentColorName);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Studio continuity check:', err);
  }
}

function addProductToState(prod) {
  const defaultColor = prod.colors[0].name;
  BulkBuilderState.products.push({
    id: prod.id,
    name: prod.name,
    code: prod.code,
    category: prod.category,
    productType: prod.productType || 'Apparel',
    moq: prod.moq,
    fabric: prod.fabric,
    gsm: prod.gsm,
    images: prod.images || [],
    availableColors: prod.colors,
    selectedColors: [defaultColor],
    quantities: {
      [defaultColor]: { S: 10, M: 25, L: 25, XL: 15, "2XL": 5, "3XL": 0 }
    },
    customization: null,
    activePreviewView: 'front',
    activePreviewImageIndex: 0
  });
}

function persistState() {
  try {
    localStorage.setItem('vtc_bulk_enquiry', JSON.stringify({
      items: BulkBuilderState.products.map(p => ({
        id: p.id,
        name: p.name,
        code: p.code,
        category: p.category,
        productType: p.productType,
        moq: p.moq,
        fabric: p.fabric,
        gsm: p.gsm,
        images: p.images,
        selectedColors: p.selectedColors,
        quantities: p.quantities,
        customization: p.customization || null
      })),
      customizationOptions: BulkBuilderState.customizationOptions,
      printMethod: BulkBuilderState.printMethod,
      uploadedFiles: BulkBuilderState.uploadedFiles,
      additionalNotes: BulkBuilderState.additionalNotes
    }));
    if (typeof updateHeaderEnquiryBadge === 'function') {
      updateHeaderEnquiryBadge();
    }
  } catch (e) {
    console.warn('Could not persist to storage:', e);
  }
}

/**
 * Render Product Selector Tabs & Selected Products Strip & Add Dropdown
 */
function renderProductSelector() {
  const container = document.getElementById('builderProductPicker');
  if (!container) return;

  const activeId = BulkBuilderState.activeProductId;

  container.innerHTML = `
    <!-- Product Picker Pills & Add Dropdown -->
    <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 16px;">
      ${BulkBuilderState.products.map(p => {
        const orig = getProductById(p.id) || PRODUCTS_DATA[0];
        const thumb = (orig.images && orig.images[0]) || '';
        return `
          <button type="button" class="product-picker-pill ${p.id === activeId ? 'active' : ''}" data-id="${p.id}">
            <img src="${thumb}" alt="${p.name}" class="pill-thumb-mini">
            <span>${p.name}</span>
            ${BulkBuilderState.products.length > 1 ? `
              <span class="remove-product-btn" data-remove="${p.id}" style="margin-left: 6px; font-weight: 700; opacity: 0.7;" title="Remove this product">&times;</span>
            ` : ''}
          </button>
        `;
      }).join('')}

      <!-- Add Another Product Dropdown -->
      <div style="position: relative; display: inline-block;">
        <select id="quickAddProductSelect" class="form-control" style="padding: 9px 14px; font-size: 0.85rem; border-style: dashed; cursor: pointer; background-color: var(--bg-muted-beige);">
          <option value="">+ Add Another Apparel Style...</option>
          ${PRODUCTS_DATA.filter(p => !BulkBuilderState.products.some(item => item.id === p.id)).map(p => `
            <option value="${p.id}">${p.name} (${p.category} &bull; MOQ: ${p.moq})</option>
          `).join('')}
        </select>
      </div>
    </div>

    <!-- Selected Products Visual Gallery Strip -->
    <div class="selected-products-strip">
      ${BulkBuilderState.products.map(p => {
        const orig = getProductById(p.id) || PRODUCTS_DATA[0];
        const thumb = (orig.images && orig.images[0]) || '';
        const isCustom = !!(p.customization && (p.customization.hasCustomDesign || p.customization.color));
        const colorName = p.customization?.colorName || p.selectedColors[0] || orig.colors[0].name;
        const colorObj = orig.colors.find(c => c.name === colorName) || { hex: p.customization?.color || '#222' };

        // Sum quantities for this product
        let pTotal = 0;
        Object.values(p.quantities || {}).forEach(qRow => {
          pTotal += Object.values(qRow).reduce((s, n) => s + (parseInt(n, 10) || 0), 0);
        });
        const satisfiesMoq = pTotal >= p.moq;

        return `
          <div class="selected-strip-item ${p.id === activeId ? 'is-active' : ''}" data-id="${p.id}" title="Click to view and configure ${p.name}">
            <img src="${thumb}" alt="${p.name}" class="selected-strip-thumb">
            <div class="selected-strip-info">
              <div class="selected-strip-title">${p.name}</div>
              <div class="selected-strip-meta">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${colorObj.hex}; border: 1px solid rgba(0,0,0,0.15);"></span>
                <span>${colorName}</span>
                <span>&bull;</span>
                <span style="font-weight: 700; color: ${satisfiesMoq ? 'var(--color-success)' : 'var(--accent-terracotta)'};">${pTotal} pcs</span>
              </div>
            </div>
            ${isCustom ? `
              <span class="tag" style="position: absolute; top: 6px; right: 6px; font-size: 0.62rem; padding: 2px 6px; background: var(--accent-terracotta); color: #fff; font-weight: 700;">Custom</span>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Attach tab switch events (pills)
  container.querySelectorAll('.product-picker-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-product-btn')) return;
      BulkBuilderState.activeProductId = btn.getAttribute('data-id');
      renderProductSelector();
      renderActiveProductConfiguration();
      updateLiveSummary();
    });
  });

  // Attach strip item switch events
  container.querySelectorAll('.selected-strip-item').forEach(item => {
    item.addEventListener('click', () => {
      BulkBuilderState.activeProductId = item.getAttribute('data-id');
      renderProductSelector();
      renderActiveProductConfiguration();
      updateLiveSummary();
    });
  });

  // Attach remove product events
  container.querySelectorAll('.remove-product-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const removeId = btn.getAttribute('data-remove');
      if (BulkBuilderState.products.length <= 1) {
        showToast('Enquiry must contain at least one apparel style.', 'error');
        return;
      }

      BulkBuilderState.products = BulkBuilderState.products.filter(p => p.id !== removeId);
      if (BulkBuilderState.activeProductId === removeId) {
        BulkBuilderState.activeProductId = BulkBuilderState.products[0].id;
      }
      persistState();
      renderProductSelector();
      renderActiveProductConfiguration();
      updateLiveSummary();
      showToast('Product removed from enquiry', 'info');
    });
  });

  // Quick Add Select change
  const select = document.getElementById('quickAddProductSelect');
  if (select) {
    select.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      if (!selectedId) return;

      const pToAdd = getProductById(selectedId);
      if (pToAdd) {
        addProductToState(pToAdd);
        BulkBuilderState.activeProductId = pToAdd.id;
        persistState();
        renderProductSelector();
        renderActiveProductConfiguration();
        updateLiveSummary();
        showToast(`Added ${pToAdd.name} to builder`, 'success');
      }
    });
  }
}

/**
 * Render Product Showcase Card & Color & Size-Matrix Configuration for active product
 */
function renderActiveProductConfiguration() {
  const container = document.getElementById('activeProductConfigArea');
  if (!container) return;

  const current = BulkBuilderState.products.find(p => p.id === BulkBuilderState.activeProductId);
  if (!current) return;

  const original = getProductById(current.id) || PRODUCTS_DATA[0];

  // Calculate totals for active product
  let currentTotalPieces = 0;
  const sizeDistributionMap = { S: 0, M: 0, L: 0, XL: 0, "2XL": 0, "3XL": 0 };
  Object.values(current.quantities || {}).forEach(qRow => {
    Object.entries(qRow).forEach(([sz, val]) => {
      const count = parseInt(val, 10) || 0;
      sizeDistributionMap[sz] = (sizeDistributionMap[sz] || 0) + count;
      currentTotalPieces += count;
    });
  });

  const isMoqMet = currentTotalPieces >= current.moq;
  const diffMoq = current.moq - currentTotalPieces;

  // Active color determination
  const firstSelectedColorName = current.selectedColors[0] || (original.colors[0] && original.colors[0].name) || 'Standard';
  const matchingColorObj = original.colors.find(c => c.name === firstSelectedColorName) || original.colors[0] || { hex: '#222', name: 'Standard' };
  const displayColorHex = (current.customization && current.customization.color) ? current.customization.color : matchingColorObj.hex;
  const displayColorName = (current.customization && current.customization.colorName) ? current.customization.colorName : matchingColorObj.name;

  // Check if item has custom design from studio
  const isCustomized = !!(current.customization && (current.customization.hasCustomDesign || current.customization.color));

  // Determine logo details
  let logoChipHtml = '';
  let logoPlacementsSummary = BulkBuilderState.customizationOptions.join(', ');

  if (current.customization?.artworks) {
    const frontArts = current.customization.artworks.front || [];
    const backArts = current.customization.artworks.back || [];
    const allArts = [...frontArts, ...backArts];

    if (allArts.length > 0) {
      const primeArt = allArts[0];
      const placements = [];
      if (frontArts.length) placements.push('Front: ' + frontArts.map(a => a.placement || 'Center Front').join(', '));
      if (backArts.length) placements.push('Back: ' + backArts.map(a => a.placement || 'Upper Back').join(', '));
      logoPlacementsSummary = placements.join(' | ');

      logoChipHtml = `
        <div class="showcase-logo-chip">
          <img src="${primeArt.src}" alt="${primeArt.name || 'Artwork'}">
          <div>
            <div style="font-weight: 700; color: var(--text-charcoal);">${primeArt.name || 'Custom Studio Artwork'}</div>
            <div style="font-size: 0.74rem; color: var(--text-muted-grey);">${logoPlacementsSummary}</div>
          </div>
        </div>
      `;
    }
  }

  if (!logoChipHtml && BulkBuilderState.uploadedFiles.length > 0) {
    const f = BulkBuilderState.uploadedFiles[0];
    logoChipHtml = `
      <div class="showcase-logo-chip">
        ${f.previewUrl ? `<img src="${f.previewUrl}" alt="Logo">` : `<span style="font-size: 1.2rem;">📄</span>`}
        <div>
          <div style="font-weight: 700; color: var(--text-charcoal);">${f.name}</div>
          <div style="font-size: 0.74rem; color: var(--text-muted-grey);">Placement: ${logoPlacementsSummary}</div>
        </div>
      </div>
    `;
  }

  // Build Size Distribution text
  const sizeBreakdownText = Object.entries(sizeDistributionMap)
    .filter(([_, cnt]) => cnt > 0)
    .map(([sz, cnt]) => `${sz}:${cnt}`)
    .join('  &bull;  ') || '0 configured';

  // Garment silhouette ID for SVG
  let garmentId = 'round-neck';
  if (current.customization?.garmentId) {
    garmentId = current.customization.garmentId;
  } else if (current.id.includes('polo')) {
    garmentId = 'polo';
  } else if (current.id.includes('hoodie')) {
    garmentId = 'hoodie';
  } else if (current.id.includes('sport')) {
    garmentId = 'sports';
  } else if (current.id.includes('heavy')) {
    garmentId = 'oversized';
  }

  // Current preview parameters
  const activeView = current.activePreviewView || 'front';
  const activeImgIndex = current.activePreviewImageIndex || 0;
  const currentImgSrc = (original.images && original.images[activeImgIndex]) || (original.images && original.images[0]) || '';

  // Render Full Section: Showcase Card + Step 2.1 Colours + Step 2.2 Matrix Table
  container.innerHTML = `
    <!-- ============================================== -->
    <!-- ENTERPRISE ORDER ARCHITECTURE: PRODUCT SHOWCASE -->
    <!-- ============================================== -->
    <div class="product-showcase-card">
      <div class="product-showcase-grid">
        
        <!-- Left: Large Product Preview Stage -->
        <div class="showcase-stage-wrap" id="showcaseStageWrap">
          
          <!-- Main Interactive Image / SVG Stage -->
          <div class="showcase-preview-frame" id="showcasePreviewFrame" title="Click to inspect high-resolution preview">
            ${isCustomized ? `
              <span class="showcase-custom-badge">Custom Studio Design</span>
              <div class="showcase-svg-container">
                ${typeof getGarmentSvgTemplate === 'function' ? getGarmentSvgTemplate(garmentId, activeView, displayColorHex) : `<img src="${currentImgSrc}" class="showcase-main-img" alt="${current.name}">`}
                <div class="showcase-artwork-overlay">
                  ${(current.customization?.artworks && current.customization.artworks[activeView]) ? current.customization.artworks[activeView].map(art => `
                    <div class="showcase-placed-logo" style="left: ${art.x}%; top: ${art.y}%; width: ${Math.round((art.width || 100) * (art.scale || 1) * 0.65)}px; transform: translate(-50%, -50%) rotate(${art.rotation || 0}deg);">
                      <img src="${art.src}" alt="${art.name || 'Artwork'}">
                    </div>
                  `).join('') : ''}
                </div>
              </div>
            ` : `
              <img src="${currentImgSrc}" alt="${current.name}" class="showcase-main-img" id="showcaseMainImg">
            `}

            <div class="showcase-zoom-hint">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>Click to Enlarge</span>
            </div>
          </div>

          <!-- Thumbnails Switcher Row -->
          <div class="showcase-thumb-row" id="showcaseThumbRow">
            ${isCustomized ? `
              <button type="button" class="showcase-thumb-btn ${activeView === 'front' ? 'is-active' : ''}" data-view="front" title="Front View">
                <div style="font-size: 1.1rem; line-height: 1;">👕</div>
                <span class="showcase-thumb-label">Front</span>
              </button>
              <button type="button" class="showcase-thumb-btn ${activeView === 'back' ? 'is-active' : ''}" data-view="back" title="Back View">
                <div style="font-size: 1.1rem; line-height: 1;">🔄</div>
                <span class="showcase-thumb-label">Back</span>
              </button>
            ` : (original.images || []).map((imgUrl, idx) => `
              <button type="button" class="showcase-thumb-btn ${idx === activeImgIndex ? 'is-active' : ''}" data-img-index="${idx}" title="View Angle ${idx + 1}">
                <img src="${imgUrl}" alt="${current.name} Angle ${idx + 1}">
              </button>
            `).join('')}
          </div>

          <!-- Uploaded Logo / Artwork Badge (if present) -->
          ${logoChipHtml}

        </div>

        <!-- Right: Comprehensive Product Specifications Pane -->
        <div class="showcase-info-pane">
          
          <div class="showcase-header-row">
            <div>
              <span class="showcase-category-pill">${current.category} &bull; ${current.productType || 'Garment Model'}</span>
              <h3 class="showcase-product-title">${current.name}</h3>
              <div style="font-size: 0.82rem; color: var(--text-muted-grey); margin-top: 4px;">
                Manufacturing Style Code: <strong style="font-family: var(--font-mono); color: var(--text-charcoal);">${current.code}</strong>
              </div>
            </div>
            <div style="text-align: right;">
              <span class="tag tag-moq" style="font-size: 0.85rem; padding: 6px 14px;">Style MOQ: ${current.moq} pcs</span>
            </div>
          </div>

          <!-- Specifications Grid Table -->
          <div class="showcase-spec-table">
            <div class="showcase-spec-entry">
              <span class="showcase-spec-label">Fabric Composition</span>
              <span class="showcase-spec-val">${current.fabric}</span>
            </div>

            <div class="showcase-spec-entry">
              <span class="showcase-spec-label">Fabric Weight</span>
              <span class="showcase-spec-val">${current.gsm} GSM Standard</span>
            </div>

            <div class="showcase-spec-entry">
              <span class="showcase-spec-label">Active Garment Colour</span>
              <span class="showcase-spec-val">
                <span style="width: 12px; height: 12px; border-radius: 50%; background-color: ${displayColorHex}; border: 1px solid rgba(0,0,0,0.2);"></span>
                <span>${displayColorName}</span>
              </span>
            </div>

            <div class="showcase-spec-entry">
              <span class="showcase-spec-label">Decoration Technique</span>
              <span class="showcase-spec-val">${BulkBuilderState.printMethod}</span>
            </div>

            <div class="showcase-spec-entry" style="grid-column: span 2;">
              <span class="showcase-spec-label">Logo / Graphic Placements</span>
              <span class="showcase-spec-val">${logoPlacementsSummary}</span>
            </div>
          </div>

          <!-- Size-Wise Distribution Summary -->
          <div class="showcase-qty-summary-pill">
            <div>
              <span style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted-grey); display: block;">Active Size Distribution (S–3XL):</span>
              <span style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 600;">${sizeBreakdownText}</span>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted-grey); display: block;">MOQ Compliance:</span>
              <span style="font-weight: 700; font-size: 0.92rem; color: ${isMoqMet ? 'var(--color-success)' : 'var(--color-error)'};">
                ${currentTotalPieces} / ${current.moq} pcs (${isMoqMet ? '✓ Satisfied' : `⚠️ Needs ${diffMoq} pcs`})
              </span>
            </div>
          </div>

          <!-- Action Links Row -->
          <div class="showcase-action-row">
            <button type="button" class="btn btn-secondary btn-sm" id="showcaseLightboxTriggerBtn">
              <span>🔍 Enlarge Product Image</span>
            </button>
            <a href="customization.html?product=${current.id}" class="btn btn-ghost btn-sm" style="font-size: 0.82rem;">
              <span>✏️ Customize Artwork in Studio &rarr;</span>
            </a>
          </div>

        </div>

      </div>
    </div>

    <!-- Step 2.1: Colour Selection -->
    <div style="margin-bottom: 28px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
        <label style="font-size: 0.88rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
          Select Production Colours <span style="font-size: 0.78rem; text-transform: none; color: var(--text-muted-grey);">(Select one or multiple)</span>
        </label>
        <span style="font-size: 0.8rem; color: var(--text-muted-grey);">
          ${current.selectedColors.length} colour(s) active
        </span>
      </div>

      <div class="colour-selection-grid">
        ${original.colors.map(col => {
          const isSelected = current.selectedColors.includes(col.name);
          return `
            <div class="colour-select-card ${isSelected ? 'selected' : ''}" data-color="${col.name}">
              <span class="colour-preview-box" style="background-color: ${col.hex};"></span>
              <span class="colour-card-name">${col.name}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Step 2.2: Size-Wise Quantity Matrix -->
    <div style="margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <label style="font-size: 0.88rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
          Size-Wise Quantity Matrix
        </label>
        <button type="button" class="btn btn-ghost btn-sm" id="presetEvenSplitBtn" style="font-size: 0.78rem; text-decoration: underline;">
          Autofill Standard Size Curve (S-3XL)
        </button>
      </div>

      <div class="size-matrix-container">
        <table class="matrix-table" id="sizeMatrixTable">
          <thead>
            <tr>
              <th class="th-colour">Fabric Colour</th>
              <th>S</th>
              <th>M</th>
              <th>L</th>
              <th>XL</th>
              <th>2XL</th>
              <th>3XL</th>
              <th class="th-total">Colour Total</th>
            </tr>
          </thead>
          <tbody>
            ${current.selectedColors.map(colName => {
              const rowQtys = current.quantities[colName] || { S: 0, M: 0, L: 0, XL: 0, "2XL": 0, "3XL": 0 };
              const rowTotal = Object.values(rowQtys).reduce((sum, n) => sum + (parseInt(n, 10) || 0), 0);
              const colorObj = original.colors.find(c => c.name === colName) || { hex: '#333' };

              return `
                <tr data-row-color="${colName}">
                  <td style="text-align: left; font-weight: 600;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="width: 14px; height: 14px; border-radius: 50%; background-color: ${colorObj.hex}; border: 1px solid rgba(0,0,0,0.15);"></span>
                      <span>${colName}</span>
                    </div>
                  </td>
                  <td><input type="number" min="0" step="1" class="matrix-qty-input" data-color="${colName}" data-size="S" value="${rowQtys.S || 0}"></td>
                  <td><input type="number" min="0" step="1" class="matrix-qty-input" data-color="${colName}" data-size="M" value="${rowQtys.M || 0}"></td>
                  <td><input type="number" min="0" step="1" class="matrix-qty-input" data-color="${colName}" data-size="L" value="${rowQtys.L || 0}"></td>
                  <td><input type="number" min="0" step="1" class="matrix-qty-input" data-color="${colName}" data-size="XL" value="${rowQtys.XL || 0}"></td>
                  <td><input type="number" min="0" step="1" class="matrix-qty-input" data-color="${colName}" data-size="2XL" value="${rowQtys['2XL'] || 0}"></td>
                  <td><input type="number" min="0" step="1" class="matrix-qty-input" data-color="${colName}" data-size="3XL" value="${rowQtys['3XL'] || 0}"></td>
                  <td class="matrix-row-total" id="row-total-${encodeURIComponent(colName)}">${rowTotal} pcs</td>
                </tr>
              `;
            }).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td style="text-align: left;">Style Total:</td>
              <td id="col-total-S">0</td>
              <td id="col-total-M">0</td>
              <td id="col-total-L">0</td>
              <td id="col-total-XL">0</td>
              <td id="col-total-2XL">0</td>
              <td id="col-total-3XL">0</td>
              <td class="matrix-row-total" id="styleGrandTotal" style="color: var(--accent-terracotta);">0 pcs</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Live MOQ Validation indicator for active style -->
      <div id="activeStyleMoqNotice" style="margin-top: 14px;"></div>
    </div>
  `;

  // Attach Lightbox triggers
  document.getElementById('showcasePreviewFrame')?.addEventListener('click', () => {
    openProductLightboxModal(current, original);
  });
  document.getElementById('showcaseLightboxTriggerBtn')?.addEventListener('click', () => {
    openProductLightboxModal(current, original);
  });

  // Attach Thumbnail switcher listeners
  container.querySelectorAll('.showcase-thumb-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      const imgIdx = btn.getAttribute('data-img-index');

      if (view) {
        current.activePreviewView = view;
      }
      if (imgIdx !== null) {
        current.activePreviewImageIndex = parseInt(imgIdx, 10);
      }

      renderActiveProductConfiguration();
    });
  });

  // Attach Color Card Click Handlers
  container.querySelectorAll('.colour-select-card').forEach(card => {
    card.addEventListener('click', () => {
      const colName = card.getAttribute('data-color');
      const idx = current.selectedColors.indexOf(colName);

      if (idx > -1) {
        // Deselect
        if (current.selectedColors.length <= 1) {
          showToast('At least one fabric colour must remain selected.', 'error');
          return;
        }
        current.selectedColors.splice(idx, 1);
        delete current.quantities[colName];
      } else {
        // Select
        current.selectedColors.push(colName);
        current.quantities[colName] = { S: 0, M: 25, L: 25, XL: 0, "2XL": 0, "3XL": 0 };

        // Also update preview color to this newly selected swatch
        const selColorObj = original.colors.find(c => c.name === colName);
        if (selColorObj && current.customization) {
          current.customization.color = selColorObj.hex;
          current.customization.colorName = selColorObj.name;
        }
      }

      persistState();
      renderProductSelector();
      renderActiveProductConfiguration();
      updateLiveSummary();
    });
  });

  // Attach Matrix Input Listeners
  container.querySelectorAll('.matrix-qty-input').forEach(input => {
    input.addEventListener('input', (e) => {
      handleMatrixInputChange(e.target);
    });
    // Sanitize non-digits
    input.addEventListener('keydown', (e) => {
      if (['-', '+', '.', 'e', 'E'].includes(e.key)) {
        e.preventDefault();
      }
    });
  });

  // Attach Preset Size Curve
  document.getElementById('presetEvenSplitBtn')?.addEventListener('click', () => {
    applyStandardSizeCurve(current);
  });

  calculateMatrixTotals(current);
}

/**
 * Handle Lightbox Modal for Full Image Inspection
 */
function openProductLightboxModal(current, original) {
  const modal = document.getElementById('productImageLightboxModal');
  const body = document.getElementById('lightboxModalBody');
  const title = document.getElementById('lightboxModalTitle');
  const caption = document.getElementById('lightboxModalCaption');
  if (!modal || !body) return;

  const isCustomized = !!(current.customization && (current.customization.hasCustomDesign || current.customization.color));
  const activeView = current.activePreviewView || 'front';

  if (title) {
    title.textContent = `${current.name} — ${isCustomized ? 'Custom Studio Specification' : 'Catalogue Image'}`;
  }

  if (isCustomized) {
    let garmentId = current.customization.garmentId || 'round-neck';
    if (!current.customization.garmentId) {
      if (current.id.includes('polo')) garmentId = 'polo';
      else if (current.id.includes('hoodie')) garmentId = 'hoodie';
      else if (current.id.includes('sport')) garmentId = 'sports';
      else if (current.id.includes('heavy')) garmentId = 'oversized';
    }

    const firstSelectedColorName = current.selectedColors[0] || (original.colors[0] && original.colors[0].name) || 'Standard';
    const matchingColorObj = original.colors.find(c => c.name === firstSelectedColorName) || original.colors[0] || { hex: '#222' };
    const fillColor = current.customization.color || matchingColorObj.hex;
    const artworks = current.customization.artworks ? (current.customization.artworks[activeView] || []) : [];

    body.innerHTML = `
      <div class="lightbox-media-wrap">
        <div class="showcase-svg-container" style="width: 92%; height: 95%;">
          ${typeof getGarmentSvgTemplate === 'function' ? getGarmentSvgTemplate(garmentId, activeView, fillColor) : ''}
          <div class="showcase-artwork-overlay">
            ${artworks.map(art => `
              <div class="showcase-placed-logo" style="left: ${art.x}%; top: ${art.y}%; width: ${Math.round((art.width || 100) * (art.scale || 1) * 0.95)}px; transform: translate(-50%, -50%) rotate(${art.rotation || 0}deg);">
                <img src="${art.src}" alt="${art.name || 'Artwork'}">
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    if (caption) {
      caption.innerHTML = `Garment: <strong>${current.name}</strong> &bull; View: <strong>${activeView.toUpperCase()}</strong> &bull; Colour: <strong>${current.customization.colorName || fillColor}</strong> &bull; Fabric: <strong>${current.fabric} (${current.gsm} GSM)</strong>`;
    }
  } else {
    const imgIndex = current.activePreviewImageIndex || 0;
    const imgSrc = (original.images && original.images[imgIndex]) || (original.images && original.images[0]) || '';

    body.innerHTML = `
      <div class="lightbox-media-wrap">
        <img src="${imgSrc}" class="lightbox-img-full" alt="${current.name}">
      </div>
    `;

    if (caption) {
      caption.innerHTML = `Style: <strong>${current.name}</strong> (${current.code}) &bull; Fabric: <strong>${current.fabric} (${current.gsm} GSM)</strong> &bull; Style MOQ: <strong>${current.moq} pcs</strong>`;
    }
  }

  modal.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

function closeProductLightboxModal() {
  const modal = document.getElementById('productImageLightboxModal');
  if (modal) {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }
}

function initLightboxModal() {
  const modal = document.getElementById('productImageLightboxModal');
  const closeBtn = document.getElementById('lightboxModalCloseBtn');
  const actionCloseBtn = document.getElementById('lightboxCloseActionBtn');
  const backdrop = document.getElementById('productImageLightboxBackdrop');

  if (!modal) return;

  [closeBtn, actionCloseBtn, backdrop].forEach(el => {
    el?.addEventListener('click', closeProductLightboxModal);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeProductLightboxModal();
    }
  });
}

function handleMatrixInputChange(input) {
  const colName = input.getAttribute('data-color');
  const size = input.getAttribute('data-size');
  let val = parseInt(input.value, 10);

  if (isNaN(val) || val < 0) {
    val = 0;
    input.value = 0;
  }

  const current = BulkBuilderState.products.find(p => p.id === BulkBuilderState.activeProductId);
  if (!current) return;

  if (!current.quantities[colName]) {
    current.quantities[colName] = {};
  }
  current.quantities[colName][size] = val;

  // Update row total in DOM
  const rowQtys = current.quantities[colName];
  const rowSum = Object.values(rowQtys).reduce((acc, n) => acc + (parseInt(n, 10) || 0), 0);
  const rowTotalEl = document.getElementById(`row-total-${encodeURIComponent(colName)}`);
  if (rowTotalEl) {
    rowTotalEl.textContent = `${rowSum} pcs`;
  }

  calculateMatrixTotals(current);
  persistState();
  renderProductSelector(); // Updates strip quantity badges
  updateLiveSummary();
}

function applyStandardSizeCurve(current) {
  // Typical B2B corporate ratio: S:10, M:30, L:40, XL:15, 2XL:5
  current.selectedColors.forEach(col => {
    current.quantities[col] = { S: 10, M: 30, L: 40, XL: 15, "2XL": 5, "3XL": 0 };
  });

  renderActiveProductConfiguration();
  renderProductSelector();
  persistState();
  updateLiveSummary();
  showToast('Applied standard bulk size distribution (S:10, M:30, L:40, XL:15, 2XL:5)', 'info');
}

function calculateMatrixTotals(current) {
  const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
  const colSums = { S: 0, M: 0, L: 0, XL: 0, "2XL": 0, "3XL": 0 };
  let grandTotal = 0;

  current.selectedColors.forEach(col => {
    const q = current.quantities[col] || {};
    sizes.forEach(sz => {
      const count = parseInt(q[sz], 10) || 0;
      colSums[sz] += count;
      grandTotal += count;
    });
  });

  // Update footer col totals
  sizes.forEach(sz => {
    const el = document.getElementById(`col-total-${sz}`);
    if (el) el.textContent = colSums[sz];
  });

  const grandEl = document.getElementById('styleGrandTotal');
  if (grandEl) grandEl.textContent = `${grandTotal} pcs`;

  // Check MOQ notice
  const noticeEl = document.getElementById('activeStyleMoqNotice');
  if (noticeEl) {
    if (grandTotal >= current.moq) {
      noticeEl.innerHTML = `
        <div class="moq-alert-banner valid">
          <span>✓</span>
          <span><strong>MOQ Met:</strong> ${grandTotal} pcs configured (Minimum required: ${current.moq} pcs).</span>
        </div>
      `;
    } else {
      const diff = current.moq - grandTotal;
      noticeEl.innerHTML = `
        <div class="moq-alert-banner invalid">
          <span>⚠️</span>
          <span><strong>MOQ Requirement:</strong> Current total is ${grandTotal} pcs. Please add at least <strong>${diff} more pcs</strong> to meet this style's minimum (${current.moq} pcs).</span>
        </div>
      `;
    }
  }
}

/**
 * Render Customization Checkboxes (Section 7)
 */
function renderCustomizationOptions() {
  const container = document.getElementById('customizationOptionsGrid');
  if (!container) return;

  const options = [
    { id: "opt-front", name: "Front Logo Printing", desc: "Chest crest or full-width front artwork" },
    { id: "opt-back", name: "Back Printing", desc: "Large format back graphic, event slogan, or roster" },
    { id: "opt-sleeve", name: "Sleeve Printing", desc: "Left or right shoulder insignia / sponsor logos" },
    { id: "opt-embroidery", name: "High-Density Embroidery", desc: "Precision threaded chest monogram or sleeve crest" },
    { id: "opt-none", name: "No Customization (Blank Apparel)", desc: "Finished blank garments ready for private relabeling" }
  ];

  container.innerHTML = options.map(opt => {
    const isChecked = BulkBuilderState.customizationOptions.includes(opt.name);
    return `
      <label class="custom-checkbox-card ${isChecked ? 'checked' : ''}" data-name="${opt.name}">
        <input type="checkbox" ${isChecked ? 'checked' : ''} value="${opt.name}">
        <div class="custom-checkbox-info">
          <h5>${opt.name}</h5>
          <p>${opt.desc}</p>
        </div>
      </label>
    `;
  }).join('');

  container.querySelectorAll('.custom-checkbox-card').forEach(card => {
    const cb = card.querySelector('input[type="checkbox"]');
    card.addEventListener('click', (e) => {
      if (e.target !== cb) cb.checked = !cb.checked;

      const optName = card.getAttribute('data-name');

      if (optName === "No Customization (Blank Apparel)") {
        if (cb.checked) {
          BulkBuilderState.customizationOptions = ["No Customization (Blank Apparel)"];
        } else {
          BulkBuilderState.customizationOptions = ["Front Logo Printing"];
        }
      } else {
        if (cb.checked) {
          // Remove "No Customization" if adding decorated option
          BulkBuilderState.customizationOptions = BulkBuilderState.customizationOptions.filter(o => o !== "No Customization (Blank Apparel)");
          if (!BulkBuilderState.customizationOptions.includes(optName)) {
            BulkBuilderState.customizationOptions.push(optName);
          }
        } else {
          BulkBuilderState.customizationOptions = BulkBuilderState.customizationOptions.filter(o => o !== optName);
          if (BulkBuilderState.customizationOptions.length === 0) {
            BulkBuilderState.customizationOptions = ["No Customization (Blank Apparel)"];
          }
        }
      }

      renderCustomizationOptions();
      renderActiveProductConfiguration();
      updateLiveSummary();
    });
  });
}

/**
 * Render Printing Method Radio Options (Section 7)
 */
function renderPrintMethods() {
  const container = document.getElementById('printMethodsGrid');
  if (!container) return;

  const methods = [
    { name: "Screen Printing", desc: "Best for high volumes & solid spot colors" },
    { name: "DTG Printing", desc: "Best for photographic gradients & small runs" },
    { name: "DTF Printing", desc: "Vibrant transfers with high stretch durability" },
    { name: "Sublimation Printing", desc: "Edge-to-edge breathable dye for sports polyester" },
    { name: "Heat Transfer Printing", desc: "High-visibility foils, flocking & silicone seals" },
    { name: "Embroidery", desc: "Textured thread stitching for corporate polos & hoodies" }
  ];

  container.innerHTML = methods.map(m => {
    const isChecked = BulkBuilderState.printMethod === m.name;
    return `
      <label class="print-method-card ${isChecked ? 'checked' : ''}">
        <input type="radio" name="bulkPrintMethod" value="${m.name}" ${isChecked ? 'checked' : ''}>
        <div>
          <div style="font-size: 0.92rem; font-weight: 700;">${m.name}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted-grey);">${m.desc}</div>
        </div>
      </label>
    `;
  }).join('');

  container.querySelectorAll('input[name="bulkPrintMethod"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      BulkBuilderState.printMethod = e.target.value;
      container.querySelectorAll('.print-method-card').forEach(c => c.classList.remove('checked'));
      e.target.closest('.print-method-card')?.classList.add('checked');
      renderActiveProductConfiguration();
      updateLiveSummary();
    });
  });
}

/**
 * File Upload Zone (Drag-and-Drop, Client Validation, Preview)
 */
function initFileUploadZone() {
  const dropzone = document.getElementById('fileDropzone');
  const fileInput = document.getElementById('designFileInput');
  const previewList = document.getElementById('uploadedFilesList');

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());

  ['dragenter', 'dragover'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.add('is-dragover');
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.remove('is-dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer?.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
    }
  });

  function handleFiles(files) {
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'svg'];
    let addedCount = 0;

    Array.from(files).forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        showToast(`Invalid file: "${file.name}". Only PNG, JPG, PDF, and SVG accepted.`, 'error');
        return;
      }

      if (file.size > 25 * 1024 * 1024) {
        showToast(`File too large: "${file.name}" exceeds 25MB limit.`, 'error');
        return;
      }

      const fileObj = {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: ext,
        previewUrl: null
      };

      if (['png', 'jpg', 'jpeg', 'svg'].includes(ext)) {
        const reader = new FileReader();
        reader.onload = (re) => {
          fileObj.previewUrl = re.target.result;
          renderFileList();
          renderActiveProductConfiguration();
          updateLiveSummary();
        };
        reader.readAsDataURL(file);
      }

      BulkBuilderState.uploadedFiles.push(fileObj);
      addedCount++;
    });

    if (addedCount > 0) {
      renderFileList();
      renderActiveProductConfiguration();
      updateLiveSummary();
      showToast(`Uploaded ${addedCount} design file(s)`, 'success');
    }
  }

  function renderFileList() {
    if (!previewList) return;

    if (BulkBuilderState.uploadedFiles.length === 0) {
      previewList.innerHTML = '';
      return;
    }

    previewList.innerHTML = BulkBuilderState.uploadedFiles.map((f, idx) => `
      <div class="file-preview-item">
        <div class="file-preview-left">
          ${f.previewUrl ? `
            <img src="${f.previewUrl}" alt="Preview" class="file-thumbnail">
          ` : `
            <span style="font-size: 1.4rem; padding: 4px;">📄</span>
          `}
          <div>
            <div class="file-name">${f.name}</div>
            <div class="file-size">${f.size} &bull; ${f.type.toUpperCase()}</div>
          </div>
        </div>
        <button type="button" class="file-remove-btn" data-index="${idx}" title="Remove file">&times; Remove</button>
      </div>
    `).join('');

    previewList.querySelectorAll('.file-remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const i = parseInt(btn.getAttribute('data-index'), 10);
        BulkBuilderState.uploadedFiles.splice(i, 1);
        renderFileList();
        renderActiveProductConfiguration();
        updateLiveSummary();
      });
    });
  }

  // Initial render of pre-loaded or transferred files
  renderFileList();
}

/**
 * Update Live Bulk Order Summary & MOQ Status
 */
function updateLiveSummary() {
  const summaryEl = document.getElementById('liveBulkSummaryContent');
  if (!summaryEl) return;

  let grandTotalPieces = 0;
  let allMoqsSatisfied = true;
  const breakdownRows = [];

  BulkBuilderState.products.forEach(p => {
    let pSum = 0;
    const colorDetails = [];

    p.selectedColors.forEach(col => {
      const q = p.quantities[col] || {};
      const colSum = Object.values(q).reduce((sum, n) => sum + (parseInt(n, 10) || 0), 0);
      pSum += colSum;

      // Extract non-zero sizes
      const sizeItems = Object.entries(q)
        .filter(([sz, cnt]) => (parseInt(cnt, 10) || 0) > 0)
        .map(([sz, cnt]) => `${sz}:${cnt}`)
        .join(', ');

      if (colSum > 0) {
        colorDetails.push(`${col} (${colSum} pcs${sizeItems ? ' &rarr; ' + sizeItems : ''})`);
      }
    });

    grandTotalPieces += pSum;
    const satisfies = pSum >= p.moq;
    if (!satisfies) allMoqsSatisfied = false;

    breakdownRows.push({
      product: p,
      sum: pSum,
      satisfies: satisfies,
      colorDetails: colorDetails
    });
  });

  summaryEl.innerHTML = `
    <!-- Total Highlight -->
    <div class="summary-total-highlight">
      <div>
        <div class="summary-total-label">Enquiry Total Volume</div>
        <div style="font-size: 0.78rem; color: var(--text-muted-grey);">Across ${BulkBuilderState.products.length} style(s)</div>
      </div>
      <div class="summary-total-qty">${grandTotalPieces} <span style="font-size: 0.95rem; font-family: var(--font-body); font-weight: 500;">pcs</span></div>
    </div>

    <!-- MOQ Status Badge -->
    <div class="moq-alert-banner ${allMoqsSatisfied && grandTotalPieces > 0 ? 'valid' : 'invalid'}">
      <span>${allMoqsSatisfied && grandTotalPieces > 0 ? '✓' : '⚠️'}</span>
      <span>
        ${grandTotalPieces === 0 
          ? 'Enter size quantities to begin bulk quotation.' 
          : allMoqsSatisfied 
            ? 'All production styles meet minimum order requirements!' 
            : 'One or more styles are below minimum order quantity (MOQ).'
        }
      </span>
    </div>

    <!-- Breakdown List -->
    <div class="summary-spec-list">
      <div class="summary-spec-row">
        <span class="summary-spec-label">Selected Apparel:</span>
        <span class="summary-spec-value">${BulkBuilderState.products.map(p => p.name).join('; ')}</span>
      </div>

      <div class="summary-spec-row">
        <span class="summary-spec-label">Decoration Method:</span>
        <span class="summary-spec-value">${BulkBuilderState.printMethod}</span>
      </div>

      <div class="summary-spec-row">
        <span class="summary-spec-label">Print Placements:</span>
        <span class="summary-spec-value">${BulkBuilderState.customizationOptions.join(', ')}</span>
      </div>

      <div class="summary-spec-row">
        <span class="summary-spec-label">Artwork Files:</span>
        <span class="summary-spec-value">
          ${BulkBuilderState.uploadedFiles.length > 0 
            ? `${BulkBuilderState.uploadedFiles.length} file(s) attached` 
            : 'None (vector can be sent later)'}
        </span>
      </div>
    </div>

    <!-- Style by Style Breakdown with Thumbnails -->
    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-color);">
      <h5 style="font-family: var(--font-body); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">
        Volume Breakdown by Garment
      </h5>
      <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.82rem;">
        ${breakdownRows.map(row => {
          const orig = getProductById(row.product.id) || PRODUCTS_DATA[0];
          const thumb = (orig.images && orig.images[0]) || '';
          return `
            <div style="background-color: var(--bg-warm-ivory); padding: 10px 12px; border-radius: var(--radius-sm); border-left: 3px solid ${row.satisfies ? 'var(--color-success)' : 'var(--color-error)'}; display: flex; gap: 10px; align-items: flex-start;">
              <img src="${thumb}" alt="${row.product.name}" style="width: 40px; height: 40px; border-radius: 3px; object-fit: cover; border: 1px solid var(--border-color); flex-shrink: 0;">
              <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 4px;">
                  <span>${row.product.name}</span>
                  <span>${row.sum} / ${row.product.moq} MOQ</span>
                </div>
                ${row.colorDetails.length > 0 ? `
                  <div style="color: var(--text-muted-grey); font-size: 0.78rem; line-height: 1.4;">
                    ${row.colorDetails.join('<br>')}
                  </div>
                ` : '<div style="color: var(--color-error); font-size: 0.75rem;">No quantities entered yet</div>'}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- B2B Commercial Price Transparency Banner -->
    <div class="notice-box" style="margin-top: 24px; padding: 14px;">
      <p style="font-size: 0.82rem; margin: 0;">
        <strong>B2B Pricing Notice:</strong> Final unit pricing, volume discount tier, and estimated production calendar will be issued within 2–4 business hours after reviewing your size-breakdown and artwork complexity.
      </p>
    </div>

    <button type="button" class="btn btn-primary btn-lg" id="jumpToEnquiryFormBtn" style="width: 100%; margin-top: 16px;">
      Proceed to Bulk Enquiry &darr;
    </button>
  `;

  // Attach jump button
  document.getElementById('jumpToEnquiryFormBtn')?.addEventListener('click', () => {
    const formSection = document.getElementById('enquiryFormSection');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('enquiryFullName')?.focus();
    }
  });

  // Automatically sync total quantity to the Enquiry Form field
  const formQtyInput = document.getElementById('enquiryTotalQty');
  if (formQtyInput) {
    formQtyInput.value = `${grandTotalPieces} units`;
  }

  // Automatically sync product summary in Enquiry Form
  const formProdSummary = document.getElementById('enquiryProductSummary');
  if (formProdSummary) {
    formProdSummary.value = BulkBuilderState.products.map(p => {
      const sum = Object.values(p.quantities).reduce((acc, obj) => {
        return acc + Object.values(obj).reduce((s, n) => s + (parseInt(n, 10) || 0), 0);
      }, 0);
      return `${p.name} (${sum} pcs)`;
    }).join('; ');
  }
}

/**
 * Bulk Enquiry Form Handling (Section 8)
 */
function initEnquiryForm() {
  const form = document.getElementById('bulkEnquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Validate Form Fields
    let isValid = true;

    const nameInput = document.getElementById('enquiryFullName');
    const emailInput = document.getElementById('enquiryEmail');
    const phoneInput = document.getElementById('enquiryPhone');
    const cityInput = document.getElementById('enquiryCity');
    const stateInput = document.getElementById('enquiryState');
    const addressInput = document.getElementById('enquiryAddress');
    const privacyCheckbox = document.getElementById('enquiryPrivacyCheckbox');

    function checkField(input, condition, errorMsg) {
      if (!condition) {
        input.classList.add('is-invalid');
        const errEl = input.nextElementSibling;
        if (errEl && errEl.classList.contains('form-error-msg')) {
          errEl.textContent = errorMsg;
          errEl.style.display = 'block';
        }
        isValid = false;
      } else {
        input.classList.remove('is-invalid');
        const errEl = input.nextElementSibling;
        if (errEl && errEl.classList.contains('form-error-msg')) {
          errEl.style.display = 'none';
        }
      }
    }

    checkField(nameInput, nameInput.value.trim().length >= 2, 'Please enter your full name.');
    checkField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()), 'Please enter a valid business email address.');
    checkField(phoneInput, /^[\d\s\+\-\(\)]{7,15}$/.test(phoneInput.value.trim()), 'Please enter a valid contact phone / mobile number.');
    checkField(cityInput, cityInput.value.trim().length >= 2, 'Please enter your city.');
    checkField(stateInput, stateInput.value.trim().length >= 2, 'Please enter your state / province.');
    checkField(addressInput, addressInput.value.trim().length >= 5, 'Please provide delivery location address.');

    if (!privacyCheckbox.checked) {
      document.getElementById('privacyErrorMsg').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('privacyErrorMsg').style.display = 'none';
    }

    // 2. Validate Builder Totals & MOQ
    let grandTotal = 0;
    let anyMoqFailed = false;

    BulkBuilderState.products.forEach(p => {
      let pSum = 0;
      p.selectedColors.forEach(c => {
        const q = p.quantities[c] || {};
        pSum += Object.values(q).reduce((s, n) => s + (parseInt(n, 10) || 0), 0);
      });
      grandTotal += pSum;
      if (pSum < p.moq) anyMoqFailed = true;
    });

    if (grandTotal === 0) {
      showToast('Please enter at least one size quantity greater than zero.', 'error');
      document.getElementById('activeProductConfigArea')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (anyMoqFailed) {
      showToast('Some products do not meet their required MOQ. Please check size matrix before submitting.', 'error');
      document.getElementById('activeProductConfigArea')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!isValid) {
      showToast('Please fill out all required enquiry fields properly.', 'error');
      return;
    }

    // 3. Successful Frontend Demo Submission
    const demoRefNumber = 'BTQ-DEMO-' + Math.floor(10000 + Math.random() * 90000);
    const companyName = document.getElementById('enquiryCompany')?.value || 'Direct Client';

    showSubmissionSuccessScreen({
      refNumber: demoRefNumber,
      clientName: nameInput.value.trim(),
      company: companyName,
      email: emailInput.value.trim(),
      totalPieces: grandTotal,
      stylesCount: BulkBuilderState.products.length,
      printMethod: BulkBuilderState.printMethod,
      deliveryLocation: `${cityInput.value.trim()}, ${stateInput.value.trim()}`
    });

    // Clear enquiry cache
    localStorage.removeItem('vtc_bulk_enquiry');
    if (typeof updateHeaderEnquiryBadge === 'function') {
      updateHeaderEnquiryBadge();
    }
  });
}

/**
 * Display Professional Confirmation Screen (Section 8) with Ordered Product Images
 */
function showSubmissionSuccessScreen(data) {
  const container = document.getElementById('bulkOrderBuilderApp');
  if (!container) return;

  container.innerHTML = `
    <div class="success-screen-card">
      <div class="success-icon-bubble">✓</div>
      <span class="eyebrow" style="color: var(--color-success);">Enquiry Received (Frontend Demonstration)</span>
      <h2 style="margin: 8px 0 16px 0;">Bulk Quotation Request Lodged</h2>
      <p style="color: var(--text-muted-grey); max-width: 540px; margin: 0 auto 24px auto;">
        Thank you, <strong>${data.clientName}</strong> (${data.company}). Your bulk apparel specification has been compiled successfully.
      </p>

      <div class="demo-ref-pill">
        ${data.refNumber}
      </div>
      <p style="font-size: 0.78rem; color: var(--text-muted-grey); margin-bottom: 32px;">
        Notice: This is a frontend demo reference generated for prototype presentation. No live backend transmission occurred.
      </p>

      <div style="background-color: var(--bg-warm-ivory); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 24px; text-align: left; max-width: 580px; margin: 0 auto 36px auto;">
        <h4 style="font-size: 0.95rem; font-family: var(--font-body); font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em;">
          Enquiry Specification Summary
        </h4>

        <!-- Ordered Products Mini Visual List -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
          ${BulkBuilderState.products.map(p => {
            const orig = getProductById(p.id) || PRODUCTS_DATA[0];
            const thumb = (orig.images && orig.images[0]) || '';
            const pTotal = Object.values(p.quantities || {}).reduce((sum, row) => {
              return sum + Object.values(row).reduce((s, n) => s + (parseInt(n, 10) || 0), 0);
            }, 0);
            const isCustom = !!(p.customization && (p.customization.hasCustomDesign || p.customization.color));
            return `
              <div style="display: flex; align-items: center; gap: 12px; background: #fff; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <img src="${thumb}" alt="${p.name}" style="width: 48px; height: 48px; border-radius: 4px; object-fit: cover; border: 1px solid var(--border-color); flex-shrink: 0;">
                <div style="flex: 1;">
                  <div style="font-weight: 700; font-size: 0.9rem;">${p.name} ${isCustom ? '<span style="font-size: 0.7rem; color: var(--accent-terracotta); font-weight: 700;">(Custom Design)</span>' : ''}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted-grey);">${p.fabric} &bull; ${p.gsm} GSM &bull; ${p.selectedColors.join(', ')}</div>
                </div>
                <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-charcoal);">${pTotal} pcs</div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.88rem;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted-grey);">Enquiry Reference:</span>
            <span style="font-family: var(--font-mono); font-weight: 700;">${data.refNumber}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted-grey);">Total Garment Volume:</span>
            <span style="font-weight: 700;">${data.totalPieces} Pieces</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted-grey);">Styles Included:</span>
            <span style="font-weight: 600;">${data.stylesCount} Garment Model(s)</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted-grey);">Print Technique:</span>
            <span style="font-weight: 600;">${data.printMethod}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted-grey);">Destination:</span>
            <span style="font-weight: 600;">${data.deliveryLocation}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted-grey);">Notification Sent To:</span>
            <span style="font-weight: 600;">${data.email}</span>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
        <a href="collections.html" class="btn btn-secondary">Explore More Collections</a>
        <a href="index.html" class="btn btn-primary">Return to Homepage</a>
      </div>
    </div>
  `;

  window.scrollTo({ top: 120, behavior: 'smooth' });
}
