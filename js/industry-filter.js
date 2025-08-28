/**
 * INDUSTRY-FILTER.JS - Filter & Sort Functionality for Industries and Portfolio
 * ARS TEK YAPI A.Ş. Website
 */

// Filter Configuration
const FILTER_CONFIG = {
  industries: [
    'healthcare', 'manufacturing', 'retail', 'finance', 'transportation',
    'real-estate', 'agriculture', 'education', 'hospitality', 'energy'
  ],
  services: ['ai-ml', 'iot', 'web-development', 'fintech', 'smart-home'],
  technologies: ['python', 'javascript', 'react', 'nodejs', 'esp32', 'raspberry-pi', 'django', 'flask'],
  sortOptions: ['newest', 'oldest', 'alphabetical', 'industry', 'technology']
};

// Main Filter System Class
class FilterSystem {
  constructor(containerSelector, itemSelector) {
    this.container = document.querySelector(containerSelector);
    this.items = document.querySelectorAll(itemSelector);
    this.activeFilters = new Set();
    this.currentSort = 'newest';
    this.searchQuery = '';

    this.init();
  }

  init() {
    if (!this.container) return;

    this.setupFilterControls();
    this.setupSearchBox();
    this.setupSortControls();
    this.setupResetButton();
    this.bindEvents();

    // Initial render
    this.applyFilters();
  }

  setupFilterControls() {
    const filterContainer = document.querySelector('.filter-controls');
    if (!filterContainer) return;

    // Industry filters
    const industrySection = this.createFilterSection('industry', 'Sektörler', FILTER_CONFIG.industries);
    filterContainer.appendChild(industrySection);

    // Service filters
    const serviceSection = this.createFilterSection('service', 'Hizmetler', FILTER_CONFIG.services);
    filterContainer.appendChild(serviceSection);

    // Technology filters
    const techSection = this.createFilterSection('technology', 'Teknolojiler', FILTER_CONFIG.technologies);
    filterContainer.appendChild(techSection);
  }

  createFilterSection(type, title, options) {
    const section = document.createElement('div');
    section.className = 'filter-section mb-6';

    const titleElement = document.createElement('h3');
    titleElement.className = 'font-semibold text-gray-800 mb-3 text-lg';
    titleElement.textContent = title;

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'flex flex-wrap gap-2';

    options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'filter-btn px-4 py-2 rounded-full border-2 border-gray-300 text-gray-600 hover:border-[#1B4F72] hover:text-[#1B4F72] transition-all duration-200 text-sm font-medium';
      button.dataset.filter = `${type}-${option}`;
      button.dataset.type = type;
      button.textContent = this.formatOptionText(option);

      button.addEventListener('click', () => this.toggleFilter(button));
      optionsContainer.appendChild(button);
    });

    section.appendChild(titleElement);
    section.appendChild(optionsContainer);

    return section;
  }

  formatOptionText(option) {
    const translations = {
      // Industries
      'healthcare': 'Sağlık',
      'manufacturing': 'İmalat',
      'retail': 'Perakende',
      'finance': 'Finans',
      'transportation': 'Taşımacılık',
      'real-estate': 'Gayrimenkul',
      'agriculture': 'Tarım',
      'education': 'Eğitim',
      'hospitality': 'Otelcilik',
      'energy': 'Enerji',

      // Services
      'ai-ml': 'AI & ML',
      'iot': 'IoT',
      'web-development': 'Web Geliştirme',
      'fintech': 'Fintech',
      'smart-home': 'Akıllı Ev',

      // Technologies
      'python': 'Python',
      'javascript': 'JavaScript',
      'react': 'React',
      'nodejs': 'Node.js',
      'esp32': 'ESP32',
      'raspberry-pi': 'Raspberry Pi',
      'django': 'Django',
      'flask': 'Flask'
    };

    return translations[option] || option.charAt(0).toUpperCase() + option.slice(1);
  }

  setupSearchBox() {
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    }
  }

  setupSortControls() {
    const sortSelect = document.querySelector('#sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.applyFilters();
      });
    }
  }

  setupResetButton() {
    const resetBtn = document.querySelector('#reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetAllFilters();
      });
    }
  }

  bindEvents() {
    // Update results count
    window.addEventListener('filtersApplied', () => {
      this.updateResultsCount();
    });
  }

  toggleFilter(button) {
    const filter = button.dataset.filter;

    if (this.activeFilters.has(filter)) {
      this.removeFilter(button, filter);
    } else {
      this.addFilter(button, filter);
    }

    this.applyFilters();
  }

  addFilter(button, filter) {
    this.activeFilters.add(filter);
    button.classList.remove('border-gray-300', 'text-gray-600');
    button.classList.add('border-[#1B4F72]', 'bg-[#1B4F72]', 'text-white');

    // Add active indicator
    if (!button.querySelector('.active-indicator')) {
      const indicator = document.createElement('span');
      indicator.className = 'active-indicator ml-2';
      indicator.innerHTML = '✓';
      button.appendChild(indicator);
    }
  }

  removeFilter(button, filter) {
    this.activeFilters.delete(filter);
    button.classList.add('border-gray-300', 'text-gray-600');
    button.classList.remove('border-[#1B4F72]', 'bg-[#1B4F72]', 'text-white');

    // Remove active indicator
    const indicator = button.querySelector('.active-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  resetAllFilters() {
    // Clear all filters
    this.activeFilters.clear();
    this.searchQuery = '';
    this.currentSort = 'newest';

    // Reset UI
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.add('border-gray-300', 'text-gray-600');
      btn.classList.remove('border-[#1B4F72]', 'bg-[#1B4F72]', 'text-white');

      const indicator = btn.querySelector('.active-indicator');
      if (indicator) indicator.remove();
    });

    const searchInput = document.querySelector('#search-input');
    if (searchInput) searchInput.value = '';

    const sortSelect = document.querySelector('#sort-select');
    if (sortSelect) sortSelect.value = 'newest';

    this.applyFilters();
  }

  applyFilters() {
    const filteredItems = Array.from(this.items).filter(item => {
      return this.matchesFilters(item) && this.matchesSearch(item);
    });

    const sortedItems = this.sortItems(filteredItems);
    this.renderResults(sortedItems);

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('filtersApplied', {
      detail: { count: sortedItems.length, total: this.items.length }
    }));
  }

  matchesFilters(item) {
    if (this.activeFilters.size === 0) return true;

    const itemFilters = this.getItemFilters(item);

    // Group filters by type
    const filtersByType = {};
    this.activeFilters.forEach(filter => {
      const [type, value] = filter.split('-');
      if (!filtersByType[type]) filtersByType[type] = [];
      filtersByType[type].push(value);
    });

    // Item must match at least one filter from each active type
    return Object.entries(filtersByType).every(([type, values]) => {
      const itemValuesForType = itemFilters[type] || [];
      return values.some(value => itemValuesForType.includes(value));
    });
  }

  getItemFilters(item) {
    return {
      industry: (item.dataset.industry || '').split(',').map(s => s.trim()),
      service: (item.dataset.service || '').split(',').map(s => s.trim()),
      technology: (item.dataset.technology || '').split(',').map(s => s.trim())
    };
  }

  matchesSearch(item) {
    if (!this.searchQuery) return true;

    const searchableText = [
      item.dataset.title || '',
      item.dataset.description || '',
      item.dataset.industry || '',
      item.dataset.service || '',
      item.dataset.technology || '',
      item.textContent || ''
    ].join(' ').toLowerCase();

    return searchableText.includes(this.searchQuery);
  }

  sortItems(items) {
    return items.sort((a, b) => {
      switch (this.currentSort) {
        case 'alphabetical':
          return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'tr');

        case 'industry':
          return (a.dataset.industry || '').localeCompare(b.dataset.industry || '', 'tr');

        case 'technology':
          return (a.dataset.technology || '').localeCompare(b.dataset.technology || '', 'tr');

        case 'oldest':
          return new Date(a.dataset.date || '2020-01-01') - new Date(b.dataset.date || '2020-01-01');

        case 'newest':
        default:
          return new Date(b.dataset.date || '2025-01-01') - new Date(a.dataset.date || '2025-01-01');
      }
    });
  }

  renderResults(items) {
    // Hide all items first
    this.items.forEach(item => {
      item.style.display = 'none';
      item.style.opacity = '0';
      item.style.transform = 'scale(0.8)';
    });

    // Show filtered items with staggered animation
    items.forEach((item, index) => {
      setTimeout(() => {
        item.style.display = 'block';

        // Trigger reflow
        item.offsetHeight;

        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      }, index * 50);
    });

    this.showEmptyState(items.length === 0);
  }

  showEmptyState(show) {
    let emptyState = document.querySelector('.empty-state');

    if (show && !emptyState) {
      emptyState = document.createElement('div');
      emptyState.className = 'empty-state col-span-full text-center py-12';
      emptyState.innerHTML = `
        <div class="text-gray-400 mb-4">
          <i class="fas fa-search text-6xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">Sonuç Bulunamadı</h3>
        <p class="text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin.</p>
        <button id="reset-from-empty" class="mt-4 px-6 py-2 bg-[#1B4F72] text-white rounded-lg hover:bg-[#143c5c] transition-colors">
          Filtreleri Temizle
        </button>
      `;

      this.container.appendChild(emptyState);

      // Bind reset button
      document.getElementById('reset-from-empty').addEventListener('click', () => {
        this.resetAllFilters();
      });
    }

    if (emptyState) {
      emptyState.style.display = show ? 'block' : 'none';
    }
  }

  updateResultsCount() {
    const countElement = document.querySelector('#results-count');
    if (countElement) {
      const visibleItems = Array.from(this.items).filter(item =>
        item.style.display !== 'none'
      );

      countElement.textContent = `${visibleItems.length} sonuç gösteriliyor`;
    }
  }
}

// Specialized Industry Filter
class IndustryFilter extends FilterSystem {
  constructor() {
    super('.industries-grid', '.industry-card');
    this.setupIndustrySpecificFeatures();
  }

  setupIndustrySpecificFeatures() {
    this.setupQuickFilters();
    this.setupViewToggle();
  }

  setupQuickFilters() {
    const quickFilters = [
      { label: 'Tümü', filter: 'all' },
      { label: 'AI Çözümleri', filter: 'ai-solutions' },
      { label: 'IoT Sistemleri', filter: 'iot-systems' },
      { label: 'Fintech', filter: 'fintech' }
    ];

    const quickFilterContainer = document.createElement('div');
    quickFilterContainer.className = 'quick-filters flex flex-wrap gap-2 mb-6';

    quickFilters.forEach(({ label, filter }) => {
      const button = document.createElement('button');
      button.className = 'quick-filter-btn px-6 py-2 rounded-full bg-gray-100 hover:bg-[#1B4F72] hover:text-white transition-colors';
      button.textContent = label;
      button.dataset.quickFilter = filter;

      button.addEventListener('click', () => {
        this.applyQuickFilter(filter);
        this.updateQuickFilterUI(button);
      });

      quickFilterContainer.appendChild(button);
    });

    const filterControls = document.querySelector('.filter-controls');
    if (filterControls) {
      filterControls.insertBefore(quickFilterContainer, filterControls.firstChild);
    }
  }

  applyQuickFilter(filter) {
    if (filter === 'all') {
      this.resetAllFilters();
      return;
    }

    this.resetAllFilters();

    // Apply specific quick filter logic
    const relevantButtons = document.querySelectorAll(`[data-filter*="${filter}"]`);
    relevantButtons.forEach(btn => {
      this.addFilter(btn, btn.dataset.filter);
    });

    this.applyFilters();
  }

  updateQuickFilterUI(activeButton) {
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
      btn.classList.remove('bg-[#1B4F72]', 'text-white');
      btn.classList.add('bg-gray-100');
    });

    activeButton.classList.add('bg-[#1B4F72]', 'text-white');
    activeButton.classList.remove('bg-gray-100');
  }

  setupViewToggle() {
    const viewToggle = document.createElement('div');
    viewToggle.className = 'view-toggle flex items-center gap-2 ml-auto';
    viewToggle.innerHTML = `
      <span class="text-sm text-gray-600">Görünüm:</span>
      <button id="grid-view" class="view-btn p-2 rounded bg-[#1B4F72] text-white">
        <i class="fas fa-th-large"></i>
      </button>
      <button id="list-view" class="view-btn p-2 rounded bg-gray-200 text-gray-600">
        <i class="fas fa-list"></i>
      </button>
    `;

    const filterHeader = document.querySelector('.filter-header');
    if (filterHeader) {
      filterHeader.appendChild(viewToggle);
    }

    document.getElementById('grid-view').addEventListener('click', () => {
      this.switchView('grid');
    });

    document.getElementById('list-view').addEventListener('click', () => {
      this.switchView('list');
    });
  }

  switchView(viewType) {
    const container = this.container;

    if (viewType === 'grid') {
      container.className = container.className.replace(/list-view/, 'grid-view');
      container.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
      container.classList.remove('space-y-4');
    } else {
      container.className = container.className.replace(/grid-view/, 'list-view');
      container.classList.remove('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
      container.classList.add('space-y-4');
    }

    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.remove('bg-[#1B4F72]', 'text-white');
      btn.classList.add('bg-gray-200', 'text-gray-600');
    });

    document.getElementById(`${viewType}-view`).classList.add('bg-[#1B4F72]', 'text-white');
    document.getElementById(`${viewType}-view`).classList.remove('bg-gray-200', 'text-gray-600');
  }
}

// Portfolio Filter
class PortfolioFilter extends FilterSystem {
  constructor() {
    super('.portfolio-grid', '.portfolio-card');
    this.setupPortfolioSpecificFeatures();
  }

  setupPortfolioSpecificFeatures() {
    this.setupLightbox();
    this.setupLoadMore();
  }

  setupLightbox() {
    this.items.forEach(card => {
      const image = card.querySelector('.portfolio-image');
      if (image) {
        image.addEventListener('click', () => {
          this.openLightbox(card);
        });
      }
    });
  }

  openLightbox(card) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="max-w-4xl mx-auto">
        <button class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300">
          <i class="fas fa-times"></i>
        </button>
        <img src="${card.dataset.fullImage || card.querySelector('img').src}"
             alt="${card.dataset.title}"
             class="max-w-full max-h-full object-contain">
        <div class="text-white text-center mt-4">
          <h3 class="text-xl font-bold">${card.dataset.title}</h3>
          <p class="text-gray-300">${card.dataset.description}</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.tagName === 'BUTTON' || e.target.tagName === 'I') {
        document.body.removeChild(modal);
      }
    });
  }

  setupLoadMore() {
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.loadMoreItems();
      });
    }
  }

  loadMoreItems() {
    // Simulate loading more portfolio items
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
      loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Yükleniyor...';

      setTimeout(() => {
        // Add new items here
        loadMoreBtn.innerHTML = 'Daha Fazla Yükle';
      }, 1000);
    }
  }
}

// Initialize filters based on page
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname;

  if (currentPage.includes('industries')) {
    window.industryFilter = new IndustryFilter();
  } else if (currentPage.includes('portfolio')) {
    window.portfolioFilter = new PortfolioFilter();
  }

  console.log('🔍 Filter system initialized');
});