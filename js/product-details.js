/**
 * Vanguard Textile Co. - Product Details Page Logic
 * Handles dynamic product rendering, image thumbnail switcher, size guide modal, and builder transfers.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('productDetailContainer')) {
    initProductDetail();
  }
});

function initProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'rn-apex-220';
  const product = getProductById(productId);

  if (!product) {
    document.getElementById('productDetailContainer').innerHTML = `
      <div class="container section text-center">
        <h2>Product Not Found</h2>
        <p style="margin: 16px 0 24px 0;">The requested apparel item does not exist or has been archived.</p>
        <a href="collections.html" class="btn btn-primary">Return to Collections</a>
      </div>
    `;
    return;
  }

  // Update Page Title and Breadcrumb
  document.title = `${product.name} | B2B Bulk Apparel - Vanguard Textile Co.`;
  const crumbCat = document.getElementById('crumbCategory');
  const crumbName = document.getElementById('crumbProductName');
  if (crumbCat) crumbCat.textContent = product.category;
  if (crumbName) crumbName.textContent = product.name;

  // Render Product Layout
  const container = document.getElementById('productDetailContainer');
  container.innerHTML = `
    <div class="product-details-grid" style="display: grid; grid-template-columns: 1fr 1.1fr; gap: 56px; align-items: start;">
      
      <!-- Gallery Column -->
      <div class="product-gallery">
        <div class="main-image-wrap" style="border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; background-color: var(--bg-muted-beige); aspect-ratio: 4/4.5; margin-bottom: 16px; position: relative;">
          <img id="mainGalleryImage" src="${product.images[0]}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; top: 16px; left: 16px; display: flex; flex-direction: column; gap: 6px;">
            <span class="tag tag-moq">Bulk MOQ: ${product.moq} Units</span>
            ${product.featured ? '<span class="tag tag-terracotta">High-Volume Essential</span>' : ''}
          </div>
        </div>

        <!-- Thumbnails -->
        <div class="gallery-thumbnails" style="display: flex; gap: 12px; overflow-x: auto;">
          ${product.images.map((img, idx) => `
            <div class="thumb-item ${idx === 0 ? 'active' : ''}" data-src="${img}" style="width: 80px; height: 80px; border-radius: var(--radius-sm); border: 2px solid ${idx === 0 ? 'var(--accent-terracotta)' : 'var(--border-color)'}; overflow: hidden; cursor: pointer; flex-shrink: 0;">
              <img src="${img}" alt="${product.name} angle ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 24px; padding: 18px; background-color: var(--bg-muted-beige); border-radius: var(--radius-sm); font-size: 0.84rem; display: flex; align-items: center; justify-content: space-between;">
          <span>Need physical sample swatch cards?</span>
          <a href="contact.html?inquiry=swatches&product=${product.id}" class="btn btn-secondary btn-sm">Request Swatch Kit</a>
        </div>
      </div>

      <!-- Specs & Configuration Column -->
      <div class="product-info-panel">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent-terracotta);">
            ${product.category} &bull; ${product.productType}
          </span>
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted-grey);">Style Code: ${product.code}</span>
        </div>

        <h1 style="font-size: clamp(2rem, 3vw, 2.8rem); margin-bottom: 16px;">${product.name}</h1>
        <p style="font-size: 1.05rem; line-height: 1.6; color: var(--text-charcoal); opacity: 0.9; margin-bottom: 24px;">
          ${product.shortDesc}
        </p>

        <!-- B2B Pricing Transparency Notice -->
        <div class="notice-box" style="margin-bottom: 28px;">
          <p>
            <strong>Wholesale B2B Order:</strong> Tiered bulk rates apply based on total volume, decoration method, and size distribution. No single-piece retail purchases.
          </p>
        </div>

        <!-- Color Options -->
        <div style="margin-bottom: 24px;">
          <label style="display: block; font-size: 0.84rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">
            Available Production Colours (${product.colors.length})
          </label>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${product.colors.map(col => `
              <div style="display: flex; align-items: center; gap: 8px; padding: 6px 14px; background-color: var(--bg-soft-white); border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.84rem;">
                <span style="width: 16px; height: 16px; border-radius: 50%; background-color: ${col.hex}; border: 1px solid rgba(0,0,0,0.15); display: inline-block;"></span>
                <span>${col.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Sizes & Size Guide Link -->
        <div style="margin-bottom: 28px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <label style="font-size: 0.84rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
              Available Sizes
            </label>
            <button type="button" id="openSizeGuideBtn" style="background: none; border: none; font-size: 0.84rem; color: var(--accent-terracotta); text-decoration: underline; cursor: pointer; font-weight: 600;">
              View Size Measurement Chart &rarr;
            </button>
          </div>
          <div style="display: flex; gap: 8px;">
            ${product.sizes.map(sz => `
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 38px; background-color: var(--bg-soft-white); border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-weight: 600; font-size: 0.88rem;">
                ${sz}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Customization Suitability -->
        <div style="margin-bottom: 32px; padding: 20px; background-color: var(--bg-soft-white); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
          <h4 style="font-size: 0.95rem; font-family: var(--font-body); font-weight: 700; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.04em;">
            Decoration & Customization Capabilities
          </h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
            ${product.customizationOptions.map(opt => `
              <span class="tag tag-terracotta">${opt}</span>
            `).join('')}
          </div>
          <p style="font-size: 0.84rem; color: var(--text-muted-grey); margin: 0;">
            Embroidery: ${product.embroideryAvailable ? 'Available on left chest, sleeves, and back collar' : 'Not recommended due to fabric drape'}. Compatible with Screen, DTF, and DTG high-definition prints.
          </p>
        </div>

        <!-- Action CTAs -->
        <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 36px;">
          <a href="bulk-quote.html?product=${product.id}" class="btn btn-primary btn-lg" style="flex: 1; min-width: 220px;">
            Configure in Bulk Builder &rarr;
          </a>
          <button type="button" class="btn btn-secondary btn-lg" id="detailAddEnquiryBtn">
            Add to Bulk Enquiry
          </button>
        </div>

        <!-- Detailed Specifications Accordion/Table -->
        <div style="border-top: 1px solid var(--border-color); padding-top: 24px;">
          <h4 style="font-size: 1.15rem; margin-bottom: 16px;">Technical Specifications</h4>
          <table class="table-spec">
            <tbody>
              <tr>
                <td style="font-weight: 600; width: 35%;">Composition</td>
                <td>${product.fabric}</td>
              </tr>
              <tr>
                <td style="font-weight: 600;">Weight (GSM)</td>
                <td>${product.gsm} GSM (&plusmn;3%)</td>
              </tr>
              <tr>
                <td style="font-weight: 600;">Yarn Construction</td>
                <td>${product.specs?.yarnCount || 'Long staple combed ring-spun'}</td>
              </tr>
              <tr>
                <td style="font-weight: 600;">Collar Detail</td>
                <td>${product.specs?.collar || '1x1 Ribbed knit with elastane'}</td>
              </tr>
              <tr>
                <td style="font-weight: 600;">Seam Construction</td>
                <td>${product.specs?.stitching || 'Double-needle flatlock hems'}</td>
              </tr>
              <tr>
                <td style="font-weight: 600;">Shrinkage Stability</td>
                <td>${product.specs?.shrinkage || '< 3% dimensional shrinkage'}</td>
              </tr>
              <tr>
                <td style="font-weight: 600;">Dyeing & Chemistry</td>
                <td>${product.specs?.dyeing || 'Azo-free certified reactive dyeing'}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

    <!-- Long Narrative Section -->
    <div style="margin-top: 64px; padding-top: 48px; border-top: 1px solid var(--border-color);">
      <div style="max-width: 840px;">
        <h3 style="margin-bottom: 16px;">Production & Material Narrative</h3>
        <p style="font-size: 1.02rem; line-height: 1.8; color: var(--text-charcoal); opacity: 0.9; margin-bottom: 24px;">
          ${product.fullDesc}
        </p>
      </div>
    </div>

    <!-- Related Styles -->
    <div style="margin-top: 64px; padding-top: 48px; border-top: 1px solid var(--border-color);">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px;">
        <div>
          <span class="eyebrow">Complementary Garments</span>
          <h3>Alternative & Coordinated Styles</h3>
        </div>
        <a href="collections.html" class="btn btn-secondary btn-sm">Explore Full Catalogue &rarr;</a>
      </div>
      <div class="product-grid" id="relatedStylesGrid"></div>
    </div>
  `;

  // Gallery Thumbnail Click Logic
  const mainImg = document.getElementById('mainGalleryImage');
  const thumbs = container.querySelectorAll('.thumb-item');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => {
        t.classList.remove('active');
        t.style.borderColor = 'var(--border-color)';
      });
      thumb.classList.add('active');
      thumb.style.borderColor = 'var(--accent-terracotta)';
      mainImg.src = thumb.getAttribute('data-src');
    });
  });

  // Action Buttons
  document.getElementById('detailAddEnquiryBtn')?.addEventListener('click', () => {
    addProductToBulkEnquiry(product.id, false);
  });

  // Render Related Products
  const relatedGrid = document.getElementById('relatedStylesGrid');
  if (relatedGrid) {
    const related = PRODUCTS_DATA
      .filter(p => p.id !== product.id && (p.category === product.category || p.featured))
      .slice(0, 3);

    relatedGrid.innerHTML = related.map(rel => `
      <div class="product-card">
        <div class="product-card-image-wrap">
          <span class="tag tag-moq" style="position: absolute; top: 12px; left: 12px; z-index: 2;">MOQ: ${rel.moq} pcs</span>
          <img src="${rel.images[0]}" alt="${rel.name}" class="product-card-image" loading="lazy">
        </div>
        <div class="product-card-content">
          <div class="product-category-row">
            <span class="product-card-category">${rel.category}</span>
            <span class="product-card-code">${rel.code}</span>
          </div>
          <h4 class="product-card-title">${rel.name}</h4>
          <p class="product-card-desc">${rel.shortDesc}</p>
          <div class="product-card-actions" style="margin-top: auto;">
            <a href="product-details.html?id=${rel.id}" class="btn btn-secondary btn-sm">View Style</a>
            <a href="bulk-quote.html?product=${rel.id}" class="btn btn-primary btn-sm">Configure</a>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Size Guide Modal
  initSizeGuideModal(product);
}

function initSizeGuideModal(product) {
  const openBtn = document.getElementById('openSizeGuideBtn');
  const modalOverlay = document.getElementById('sizeGuideModal');
  const closeBtn = document.getElementById('closeSizeGuideBtn');

  if (!openBtn || !modalOverlay) return;

  openBtn.addEventListener('click', () => {
    modalOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  });

  const closeModal = () => {
    modalOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}
