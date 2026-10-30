/**
 * Vanguard Textile Co. - Portfolio & Our Work Script
 * Category filtering, detailed case study modal, and project preview.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('portfolioGrid')) {
    initPortfolio();
  }
});

function initPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  let activeCategory = 'all';

  function render() {
    let items = PORTFOLIO_DATA;
    if (activeCategory !== 'all') {
      items = items.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());
    }

    grid.innerHTML = items.map(item => `
      <div class="service-card portfolio-item" data-id="${item.id}" style="cursor: pointer;">
        <div style="position: relative; overflow: hidden; aspect-ratio: 16/11; background-color: var(--bg-muted-beige);">
          <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow);" class="portfolio-card-img">
          <span class="tag tag-terracotta" style="position: absolute; top: 14px; left: 14px; z-index: 2;">${item.category}</span>
          <span class="tag tag-moq" style="position: absolute; bottom: 14px; right: 14px; z-index: 2;">${item.qty}</span>
        </div>
        <div class="service-card-body">
          <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted-grey); margin-bottom: 4px;">
            ${item.client}
          </div>
          <h3 class="service-card-title" style="font-size: 1.25rem;">${item.title}</h3>
          <p class="service-card-desc" style="font-size: 0.88rem; line-height: 1.5; margin-bottom: 16px;">${item.description}</p>
          <div class="service-card-meta">
            <span>Tech: ${item.customization.split('+')[0]}</span>
            <span style="font-weight: 700; color: var(--accent-terracotta);">View Case Brief &rarr;</span>
          </div>
        </div>
      </div>
    `).join('');

    // Zoom hover effect
    grid.querySelectorAll('.portfolio-item').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.querySelector('.portfolio-card-img').style.transform = 'scale(1.05)';
      });
      card.addEventListener('mouseleave', () => {
        card.querySelector('.portfolio-card-img').style.transform = 'scale(1)';
      });
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        openPortfolioModal(id);
      });
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-secondary'));
      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-secondary');
      activeCategory = btn.getAttribute('data-category');
      render();
    });
  });

  render();
}

function openPortfolioModal(id) {
  const item = PORTFOLIO_DATA.find(p => p.id === id);
  if (!item) return;

  const modalOverlay = document.getElementById('portfolioDetailModal');
  const modalContent = document.getElementById('portfolioModalBody');
  if (!modalOverlay || !modalContent) return;

  modalContent.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start;">
      <div>
        <img src="${item.image}" alt="${item.title}" style="width: 100%; border-radius: var(--radius-sm); border: 1px solid var(--border-color); aspect-ratio: 4/3.5; object-fit: cover;">
        <div style="margin-top: 14px; font-size: 0.75rem; color: var(--text-muted-grey); text-align: center;">
          Illustrative portfolio example for demonstration purposes.
        </div>
      </div>
      <div>
        <span class="eyebrow">${item.category}</span>
        <h2 style="font-size: 1.6rem; margin-bottom: 8px;">${item.title}</h2>
        <div style="font-size: 0.88rem; color: var(--text-muted-grey); margin-bottom: 20px;">Client Partner: <strong>${item.client}</strong></div>
        
        <p style="font-size: 0.95rem; line-height: 1.7; margin-bottom: 24px; color: var(--text-charcoal);">
          ${item.description}
        </p>

        <div style="background-color: var(--bg-warm-ivory); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 18px; margin-bottom: 24px;">
          <h5 style="font-family: var(--font-body); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Production Specs</h5>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.84rem;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted-grey);">Volume Delivered:</span>
              <span style="font-weight: 700;">${item.qty}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted-grey);">Fabric Selection:</span>
              <span style="font-weight: 600;">${item.fabric}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted-grey);">Customization:</span>
              <span style="font-weight: 600; text-align: right; max-width: 200px;">${item.customization}</span>
            </div>
          </div>
        </div>

        <a href="bulk-quote.html" class="btn btn-primary btn-sm" style="width: 100%;">
          Request Quote for Similar Order &rarr;
        </a>
      </div>
    </div>
  `;

  modalOverlay.classList.add('is-active');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('closePortfolioModalBtn');
  const closeModal = () => {
    modalOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.onclick = closeModal;
  modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) closeModal();
  };
}
