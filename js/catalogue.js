/**
 * Vanguard Textile Co. - Collections & Catalogue Logic
 * Handles filtering by Category, Color, Fabric, Customization, Search, and Sorting.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('productCatalogGrid')) {
    initCatalogue();
  }
});

function initCatalogue() {
  const grid = document.getElementById('productCatalogGrid');
  const countEl = document.getElementById('productCountDisplay');
  const searchInput = document.getElementById('productSearchInput');
  const sortSelect = document.getElementById('productSortSelect');
  const resetBtn = document.getElementById('resetFiltersBtn');

  // Check URL params for initial category filter (e.g., ?category=Polo)
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category');

  let activeFilters = {
    category: initialCategory || 'all',
    fabric: 'all',
    color: 'all',
    customization: 'all',
    search: '',
    sort: 'newest'
  };

  // If initial category in URL, match radio or select
  if (initialCategory) {
    const matchingRadio = document.querySelector(`input[name="filterCategory"][value="${initialCategory}"]`);
    if (matchingRadio) matchingRadio.checked = true;
  }

  // Render products based on current activeFilters
  function render() {
    let filtered = PRODUCTS_DATA.slice();

    // 1. Category Filter
    if (activeFilters.category !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === activeFilters.category.toLowerCase());
    }

    // 2. Fabric Filter
    if (activeFilters.fabric !== 'all') {
      filtered = filtered.filter(p => p.fabric.toLowerCase().includes(activeFilters.fabric.toLowerCase()));
    }

    // 3. Color Filter
    if (activeFilters.color !== 'all') {
      filtered = filtered.filter(p => 
        p.colors.some(c => c.name.toLowerCase().includes(activeFilters.color.toLowerCase()))
      );
    }

    // 4. Customization Filter
    if (activeFilters.customization !== 'all') {
      if (activeFilters.customization === 'embroidery') {
        filtered = filtered.filter(p => p.embroideryAvailable);
      } else {
        filtered = filtered.filter(p => 
          p.customizationOptions.some(opt => opt.toLowerCase().includes(activeFilters.customization.toLowerCase()))
        );
      }
    }

    // 5. Search Filter
    if (activeFilters.search.trim()) {
      const q = activeFilters.search.trim().toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q)
      );
    }

    // 6. Sorting
    switch (activeFilters.sort) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'moq-asc':
        filtered.sort((a, b) => a.moq - b.moq);
        break;
      case 'moq-desc':
        filtered.sort((a, b) => b.moq - a.moq);
        break;
      case 'newest':
      default:
        // maintain catalog order
        break;
    }

    // Update count display
    if (countEl) {
      countEl.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${PRODUCTS_DATA.length}</strong> bulk apparel styles`;
    }

    // Render Grid
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 64px 20px; background-color: var(--bg-soft-white); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
          <h3 style="margin-bottom: 12px;">No Apparel Styles Found</h3>
          <p style="color: var(--text-muted-grey); margin-bottom: 24px;">No products match your chosen combination of filters. Try resetting the filters or broadening your search criteria.</p>
          <button type="button" class="btn btn-secondary btn-sm" id="emptyStateResetBtn">Reset All Filters</button>
        </div>
      `;
      document.getElementById('emptyStateResetBtn')?.addEventListener('click', resetAll);
      return;
    }

    grid.innerHTML = filtered.map(product => `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-card-image-wrap">
          <div class="product-card-badges">
            <span class="tag tag-moq">MOQ: ${product.moq} pcs</span>
            ${product.featured ? '<span class="tag tag-terracotta">Popular Choice</span>' : ''}
          </div>
          <img src="${product.images[0]}" alt="${product.name}" class="product-card-image" loading="lazy">
        </div>
        <div class="product-card-content">
          <div class="product-category-row">
            <span class="product-card-category">${product.category}</span>
            <span class="product-card-code">${product.code}</span>
          </div>
          <h3 class="product-card-title">${product.name}</h3>
          <p class="product-card-desc">${product.shortDesc}</p>
          
          <div class="product-specs-list">
            <div class="spec-item">
              <span class="spec-label">Fabric</span>
              <span class="spec-val" style="font-size: 0.78rem;">${product.fabric.split('/')[0]}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Weight / GSM</span>
              <span class="spec-val">${product.gsm} GSM</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Sizes Available</span>
              <span class="spec-val">${product.sizes.join(', ')}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Customization</span>
              <span class="spec-val">${product.embroideryAvailable ? 'Print + Embroidery' : 'Print Only'}</span>
            </div>
          </div>

          <div class="swatch-row">
            ${product.colors.slice(0, 5).map(c => `
              <span class="swatch-dot" style="background-color: ${c.hex};" title="${c.name}"></span>
            `).join('')}
            ${product.colors.length > 5 ? `<span class="swatch-count">+${product.colors.length - 5} more</span>` : ''}
          </div>

          <div class="product-card-actions">
            <a href="product-details.html?id=${product.id}" class="btn btn-secondary btn-sm">View Details</a>
            <button type="button" class="btn btn-primary btn-sm add-enquiry-btn" data-id="${product.id}">
              Add to Bulk
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach click events to "Add to Bulk"
    grid.querySelectorAll('.add-enquiry-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pId = e.currentTarget.getAttribute('data-id');
        addProductToBulkEnquiry(pId, false);
      });
    });
  }

  // Filter Listeners
  document.querySelectorAll('input[name="filterCategory"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      activeFilters.category = e.target.value;
      render();
    });
  });

  document.querySelectorAll('input[name="filterFabric"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      activeFilters.fabric = e.target.value;
      render();
    });
  });

  document.querySelectorAll('input[name="filterColor"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      activeFilters.color = e.target.value;
      render();
    });
  });

  document.querySelectorAll('input[name="filterCustomization"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      activeFilters.customization = e.target.value;
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeFilters.search = e.target.value;
      render();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeFilters.sort = e.target.value;
      render();
    });
  }

  function resetAll() {
    activeFilters = {
      category: 'all',
      fabric: 'all',
      color: 'all',
      customization: 'all',
      search: '',
      sort: 'newest'
    };

    document.querySelectorAll('input[type="radio"]').forEach(r => {
      if (r.value === 'all') r.checked = true;
    });

    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'newest';

    render();
  }

  if (resetBtn) resetBtn.addEventListener('click', resetAll);

  // Initial render
  render();
}
