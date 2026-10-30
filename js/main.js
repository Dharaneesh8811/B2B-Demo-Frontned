/**
 * Vanguard Textile Co. (VTC) - Main Application Script
 * Global UI behaviors: navigation, mobile drawer, toast system, header enquiry badge, policy modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initActiveNavLink();
  updateHeaderEnquiryBadge();
  initPolicyModals();
});

/* Sticky Header Scroll Effect */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Mobile Drawer Navigation */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const closeBtn = document.querySelector('.drawer-close');

  if (!drawer || !toggleBtn) return;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Close on pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/* Highlight Active Navigation Links */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* Toast Notification Utility */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✓';
  if (type === 'error') icon = '✕';

  toast.innerHTML = `
    <span style="font-weight: 700; color: var(--accent-terracotta);">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

/* Header Enquiry Badge Counter */
function updateHeaderEnquiryBadge() {
  const badges = document.querySelectorAll('.badge-count');
  if (!badges.length) return;

  try {
    const raw = localStorage.getItem('vtc_bulk_enquiry');
    if (raw) {
      const data = JSON.parse(raw);
      let count = 0;
      if (Array.isArray(data.items)) {
        count = data.items.length;
      } else if (data.selectedProducts && Array.isArray(data.selectedProducts)) {
        count = data.selectedProducts.length;
      }
      badges.forEach(b => {
        b.textContent = count;
        b.style.display = count > 0 ? 'inline-flex' : 'none';
      });
      return;
    }
  } catch (e) {
    console.warn('Storage read warning:', e);
  }

  badges.forEach(b => {
    b.textContent = '0';
    b.style.display = 'none';
  });
}

/* Add Product Directly to Bulk Enquiry */
function addProductToBulkEnquiry(productId, redirect = false) {
  const product = getProductById(productId);
  if (!product) {
    showToast('Product not found', 'error');
    return;
  }

  let enquiry = { items: [] };
  try {
    const saved = localStorage.getItem('vtc_bulk_enquiry');
    if (saved) enquiry = JSON.parse(saved);
  } catch (e) {}

  if (!enquiry.items) enquiry.items = [];

  const exists = enquiry.items.some(item => item.id === productId);
  if (!exists) {
    enquiry.items.push({
      id: product.id,
      name: product.name,
      code: product.code,
      category: product.category,
      moq: product.moq,
      fabric: product.fabric,
      gsm: product.gsm,
      selectedColors: [product.colors[0].name],
      quantities: {
        [product.colors[0].name]: { S: 0, M: 25, L: 25, XL: 0, "2XL": 0 }
      }
    });
    localStorage.setItem('vtc_bulk_enquiry', JSON.stringify(enquiry));
    updateHeaderEnquiryBadge();
    showToast(`Added "${product.name}" to Bulk Enquiry`, 'success');
  } else {
    showToast(`"${product.name}" is already in your Bulk Enquiry`, 'info');
  }

  if (redirect) {
    window.location.href = `bulk-quote.html?product=${productId}`;
  }
}

/* Policy Modals in Footer */
function initPolicyModals() {
  const policyData = {
    privacy: {
      title: "Privacy Policy",
      content: `
        <p><strong>1. Introduction</strong><br>Vanguard Textile Co. ("VTC") respects your corporate privacy. This document outlines how commercial enquiry data is handled for bulk manufacturing evaluations.</p>
        <p><strong>2. Information We Collect</strong><br>We collect commercial contact information, including corporate entity names, representative emails, phone numbers, delivery destination cities, and client-uploaded artwork files for quote generation.</p>
        <p><strong>3. Use of Information</strong><br>Client files and design mockups are strictly used for technical feasibility analysis, print plate preparation, and bulk pricing estimations. We never sell, transfer, or license client vector assets.</p>
        <p><strong>4. Confidentiality</strong><br>All proprietary corporate logos, employee uniform specs, and event branding assets are treated with strict confidentiality under standard B2B supplier non-disclosure practices.</p>
      `
    },
    terms: {
      title: "Terms and Conditions of Bulk Production",
      content: `
        <p><strong>1. Minimum Order Quantities (MOQ)</strong><br>All wholesale orders are governed by product-specific MOQs (typically 30 to 100 units). Orders falling below published MOQs cannot be scheduled for manufacturing runs.</p>
        <p><strong>2. Quotation Validity</strong><br>All issued bulk quotations are firm for 15 calendar days from the date of issuance, subject to yarn raw material and dye cost fluctuations.</p>
        <p><strong>3. Artwork Approval & Pre-Production Sampling</strong><br>Bulk fabrication commences only after digital mockups and pantone color matches are signed off by the customer's authorized representative.</p>
        <p><strong>4. Commercial Production Tolerances</strong><br>In accordance with global textile manufacturing standards, an industry standard tolerance of +/- 3% on final delivered piece counts and dimensional tolerances of +/- 0.5 inches applies.</p>
      `
    },
    refund: {
      title: "Refund & Cancellation Policy",
      content: `
        <p><strong>1. Customized Goods</strong><br>Because custom apparel is manufactured to client-specific embroidery, sizing, and screen print specifications, customized goods cannot be returned or cancelled once fabric knitting, cutting, or printing has commenced.</p>
        <p><strong>2. Quality Discrepancies & Defect Claims</strong><br>In the rare event of manufacturing defects, print misregistration, or wrong fabric GSM, claims must be formally lodged within 7 business days of shipment receipt along with batch photos.</p>
        <p><strong>3. Rectification</strong><br>VTC will promptly inspect defect claims and issue expedited remake runs or credit adjustments for verified non-conforming garments.</p>
      `
    },
    shipping: {
      title: "Shipping & Delivery Policy",
      content: `
        <p><strong>1. Domestic & International Freight</strong><br>We ship bulk pallets, cartons, and consolidated freight via insured logistics partners (road express, air cargo, and ocean container).</p>
        <p><strong>2. Standard Production Lead Times</strong><br>Standard bulk production runs average 10–14 business days following sample approval. Rush production runs (5–7 days) are available on select apparel styles.</p>
        <p><strong>3. Split-Shipments & Multi-Location Delivery</strong><br>We offer multi-hub branch distribution and drop-shipping for nationwide retail chains and enterprise office campuses upon request.</p>
      `
    }
  };

  const modalOverlay = document.getElementById('policyModalOverlay');
  const modalTitle = document.getElementById('policyModalTitle');
  const modalBody = document.getElementById('policyModalBody');
  const modalClose = document.getElementById('policyModalClose');

  if (!modalOverlay || !modalTitle || !modalBody) return;

  const openPolicy = (key) => {
    const policy = policyData[key];
    if (!policy) return;
    modalTitle.textContent = policy.title;
    modalBody.innerHTML = policy.content;
    modalOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closePolicy = () => {
    modalOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-policy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPolicy(btn.getAttribute('data-policy'));
    });
  });

  if (modalClose) modalClose.addEventListener('click', closePolicy);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closePolicy();
  });
}
