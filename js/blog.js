/**
 * ARS TEK YAPI - Blog Page JavaScript
 * Blog-specific functionality and interactions
 */

// Blog page app object
window.BlogApp = {
  // Configuration
  config: {
    postsPerPage: 6,
    currentPage: 1,
    totalPosts: 0,
    currentFilter: 'all',
    searchTerm: ''
  },

  // Blog posts data - normally this would come from a CMS or API
  posts: [
    {
      id: 1,
      title: 'Neden Her İşletme IoT Stratejisine İhtiyaç Duyar?',
      slug: 'why-every-business-needs-iot-strategy',
      excerpt: 'İş dünyasının dijital dönüşümünde IoT teknolojilerinin oynadığı kritik rol ve işletmelerin bu teknolojiye nasıl entegre olabileceği hakkında kapsamlı rehber.',
      content: '',
      category: 'IoT',
      tags: ['IoT', 'Dijital Dönüşüm', 'İş Stratejisi', 'Teknoloji'],
      author: 'ARS TEK YAPI Uzman Ekibi',
      publishedAt: '2025-01-15',
      readTime: 8,
      featured: true,
      image: '/images/blog/iot-strategy.jpg',
      icon: 'fas fa-network-wired'
    },
    {
      id: 2,
      title: '2025\'te Sektörlere Göre En İyi AI Kullanım Alanları',
      slug: 'top-ai-use-cases-2025-by-industry',
      excerpt: 'Yapay zeka teknolojilerinin farklı sektörlerdeki uygulama alanları ve 2025 yılında öne çıkan AI trend analizi.',
      content: '',
      category: 'AI',
      tags: ['AI', 'Makine Öğrenmesi', 'Sektör Analizi', '2025 Trendleri'],
      author: 'ARS TEK YAPI AI Uzmanları',
      publishedAt: '2025-01-10',
      readTime: 12,
      featured: true,
      image: '/images/blog/ai-use-cases.jpg',
      icon: 'fas fa-brain'
    },
    {
      id: 3,
      title: 'ARS TEK Bir Fintech Platformunu 60 Günde Nasıl İnşa Etti?',
      slug: 'how-artek-built-fintech-platform-60-days',
      excerpt: 'Django, React ve AI entegrasyonu kullanarak 60 günde tamamladığımız fintech projemizin teknik detayları ve süreç analizi.',
      content: '',
      category: 'Fintech',
      tags: ['Fintech', 'Django', 'React', 'Proje Yönetimi', 'Case Study'],
      author: 'ARS TEK YAPI Geliştirici Ekibi',
      publishedAt: '2025-01-05',
      readTime: 15,
      featured: true,
      image: '/images/blog/fintech-case-study.jpg',
      icon: 'fas fa-credit-card'
    },
    {
      id: 4,
      title: 'Akıllı Ev Otomasyonu: 2025 Teknoloji Rehberi',
      slug: 'smart-home-automation-2025-guide',
      excerpt: 'ESP32, Raspberry Pi ve modern sensör teknolojileri ile akıllı ev sistemleri kurma rehberi. Pratik uygulama örnekleri dahil.',
      content: '',
      category: 'Akıllı Ev',
      tags: ['Akıllı Ev', 'ESP32', 'Raspberry Pi', 'Otomasyon'],
      author: 'ARS TEK YAPI IoT Ekibi',
      publishedAt: '2024-12-28',
      readTime: 10,
      featured: false,
      image: '/images/blog/smart-home-guide.jpg',
      icon: 'fas fa-home'
    },
    {
      id: 5,
      title: 'Endüstri 4.0: Akıllı Fabrika Sistemleri Uygulama Kılavuzu',
      slug: 'industry-4-smart-factory-implementation-guide',
      excerpt: 'İmalat sektöründe dijital dönüşüm: IoT sensörleri, makine öğrenmesi ve predictive maintenance uygulamaları.',
      content: '',
      category: 'Endüstri 4.0',
      tags: ['Endüstri 4.0', 'İmalat', 'IoT', 'Predictive Maintenance'],
      author: 'ARS TEK YAPI Endüstri Uzmanları',
      publishedAt: '2024-12-20',
      readTime: 14,
      featured: false,
      image: '/images/blog/industry-4-guide.jpg',
      icon: 'fas fa-industry'
    },
    {
      id: 6,
      title: 'Cybersecurity for IoT: Güvenli Sistem Tasarım İlkeleri',
      slug: 'cybersecurity-iot-secure-system-design',
      excerpt: 'IoT sistemlerinde güvenlik açıklarını minimize eden tasarım yaklaşımları ve en iyi uygulama örnekleri.',
      content: '',
      category: 'Güvenlik',
      tags: ['Güvenlik', 'IoT', 'Cybersecurity', 'Sistem Tasarımı'],
      author: 'ARS TEK YAPI Güvenlik Ekibi',
      publishedAt: '2024-12-15',
      readTime: 11,
      featured: false,
      image: '/images/blog/iot-security.jpg',
      icon: 'fas fa-shield-alt'
    }
  ],

  // Categories for filtering
  categories: [
    { slug: 'all', name: 'Tümü', count: 0 },
    { slug: 'AI', name: 'Yapay Zeka', count: 0 },
    { slug: 'IoT', name: 'IoT Sistemleri', count: 0 },
    { slug: 'Fintech', name: 'Fintech', count: 0 },
    { slug: 'Akıllı Ev', name: 'Akıllı Ev', count: 0 },
    { slug: 'Endüstri 4.0', name: 'Endüstri 4.0', count: 0 },
    { slug: 'Güvenlik', name: 'Güvenlik', count: 0 }
  ],

  // Initialize blog page
  init: function() {
    this.calculateCategoryCounts();
    this.renderPosts();
    this.renderCategories();
    this.renderStats();
    this.setupEventListeners();
    this.initSearch();
    this.initNewsletterForm();
  },

  // Calculate post counts for each category
  calculateCategoryCounts: function() {
    this.categories.forEach(category => {
      if (category.slug === 'all') {
        category.count = this.posts.length;
      } else {
        category.count = this.posts.filter(post => post.category === category.slug).length;
      }
    });
  },

  // Render blog posts
  renderPosts: function() {
    const container = ArsTekYapi.utils.$('.blog-grid');
    if (!container) return;

    // Filter posts based on current filter and search term
    let filteredPosts = this.posts;

    if (this.config.currentFilter !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === this.config.currentFilter);
    }

    if (this.config.searchTerm) {
      const searchLower = this.config.searchTerm.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by date (newest first)
    filteredPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // Clear container
    container.innerHTML = '';

    if (filteredPosts.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-600 mb-2">Sonuç Bulunamadı</h3>
          <p class="text-gray-500">Arama kriterlerinize uygun blog yazısı bulunamadı.</p>
        </div>
      `;
      return;
    }

    // Render each post
    filteredPosts.forEach((post, index) => {
      const postHtml = this.createPostCard(post, index);
      container.insertAdjacentHTML('beforeend', postHtml);
    });

    // Add animation to new posts
    const cards = container.querySelectorAll('.blog-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('fade-in');
      }, index * 100);
    });
  },

  // Create individual post card HTML
  createPostCard: function(post, index) {
    const publishedDate = new Date(post.publishedAt).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const tagsHtml = post.tags.slice(0, 2).map(tag =>
      `<span class="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mr-1 mb-1">${tag}</span>`
    ).join('');

    return `
      <article class="blog-card" data-aos="fade-up" data-aos-delay="${index * 100}">
        <div class="blog-card-image" style="background: linear-gradient(135deg, #1B4F72, #2C3E50);">
          <i class="${post.icon} blog-card-icon"></i>
        </div>

        <div class="blog-card-content">
          <div class="mb-3">
            <span class="blog-tag">${post.category}</span>
            ${post.featured ? '<span class="blog-tag" style="background: rgba(34, 197, 94, 0.1); color: #059669;">Öne Çıkan</span>' : ''}
          </div>

          <h2 class="blog-card-title">
            <a href="/blog/${post.slug}.html" class="text-current no-underline">${post.title}</a>
          </h2>

          <p class="blog-card-excerpt">${post.excerpt}</p>

          <div class="mb-4">
            ${tagsHtml}
          </div>

          <div class="blog-card-meta">
            <div class="blog-card-date">
              <i class="fas fa-calendar-alt"></i>
              <span>${publishedDate}</span>
            </div>
            <div class="blog-card-read-time">
              <i class="fas fa-clock"></i>
              <span>${post.readTime} dk okuma</span>
            </div>
          </div>

          <a href="/blog/${post.slug}.html" class="blog-read-more">
            Devamını Oku
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </article>
    `;
  },

  // Render category filters
  renderCategories: function() {
    const container = ArsTekYapi.utils.$('.blog-filters');
    if (!container) return;

    container.innerHTML = '';

    this.categories.forEach(category => {
      const isActive = this.config.currentFilter === category.slug;
      const buttonHtml = `
        <button class="blog-filter-btn ${isActive ? 'active' : ''}"
                data-filter="${category.slug}">
          ${category.name} (${category.count})
        </button>
      `;
      container.insertAdjacentHTML('beforeend', buttonHtml);
    });
  },

  // Render blog statistics
  renderStats: function() {
    const container = ArsTekYapi.utils.$('.blog-stats');
    if (!container) return;

    const totalPosts = this.posts.length;
    const totalCategories = this.categories.filter(cat => cat.slug !== 'all' && cat.count > 0).length;
    const avgReadTime = Math.round(this.posts.reduce((sum, post) => sum + post.readTime, 0) / totalPosts);

    container.innerHTML = `
      <div class="blog-stat-card" data-aos="fade-up" data-aos-delay="100">
        <div class="blog-stat-number counter" data-target="${totalPosts}">${totalPosts}</div>
        <div class="blog-stat-label">Blog Yazısı</div>
      </div>
      <div class="blog-stat-card" data-aos="fade-up" data-aos-delay="200">
        <div class="blog-stat-number counter" data-target="${totalCategories}">${totalCategories}</div>
        <div class="blog-stat-label">Farklı Kategori</div>
      </div>
      <div class="blog-stat-card" data-aos="fade-up" data-aos-delay="300">
        <div class="blog-stat-number">${avgReadTime}</div>
        <div class="blog-stat-label">Ortalama Okuma Süresi</div>
      </div>
    `;

    // Trigger counter animations
    this.initCounters();
  },

  // Initialize counter animations
  initCounters: function() {
    const counters = ArsTekYapi.utils.$$('.counter');

    const animateCounter = (counter) => {
      const target = parseInt(counter.dataset.target);
      const suffix = counter.dataset.suffix || '';
      let current = 0;
      const increment = target / 50; // 50 steps for smooth animation

      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = Math.ceil(current) + suffix;
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + suffix;
        }
      };

      updateCounter();
    };

    // Animate counters when they come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    counters.forEach(counter => observer.observe(counter));
  },

  // Setup event listeners
  setupEventListeners: function() {
    // Category filter buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('.blog-filter-btn')) {
        e.preventDefault();
        const filter = e.target.dataset.filter;
        this.setFilter(filter);
      }
    });

    // Search input
    const searchInput = ArsTekYapi.utils.$('.blog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', ArsTekYapi.utils.debounce((e) => {
        this.setSearchTerm(e.target.value);
      }, 300));
    }
  },

  // Set category filter
  setFilter: function(filter) {
    this.config.currentFilter = filter;
    this.renderPosts();
    this.renderCategories();

    // Update URL without page reload
    const url = new URL(window.location);
    if (filter === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', filter);
    }
    window.history.pushState({}, '', url);
  },

  // Set search term
  setSearchTerm: function(term) {
    this.config.searchTerm = term.trim();
    this.renderPosts();

    // Update URL without page reload
    const url = new URL(window.location);
    if (this.config.searchTerm) {
      url.searchParams.set('search', this.config.searchTerm);
    } else {
      url.searchParams.delete('search');
    }
    window.history.pushState({}, '', url);
  },

  // Initialize search functionality
  initSearch: function() {
    // Read initial filter and search from URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');

    if (categoryParam && this.categories.find(cat => cat.slug === categoryParam)) {
      this.config.currentFilter = categoryParam;
    }

    if (searchParam) {
      this.config.searchTerm = searchParam;
      const searchInput = ArsTekYapi.utils.$('.blog-search-input');
      if (searchInput) {
        searchInput.value = searchParam;
      }
    }
  },

  // Initialize newsletter form
  initNewsletterForm: function() {
    const form = ArsTekYapi.utils.$('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = form.querySelector('.newsletter-input');
      const submitBtn = form.querySelector('.newsletter-btn');
      const email = emailInput.value.trim();

      if (!email) {
        alert('Lütfen email adresinizi giriniz.');
        return;
      }

      if (!ArsTekYapi.utils.isValidEmail(email)) {
        alert('Lütfen geçerli bir email adresi giriniz.');
        return;
      }

      // Show loading state
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Kaydediliyor...';

      try {
        // Simulate API call - replace with actual newsletter service
        await new Promise(resolve => setTimeout(resolve, 1500));

        alert('Newsletter kaydınız başarıyla tamamlandı! Teşekkür ederiz.');
        emailInput.value = '';
      } catch (error) {
        alert('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyiniz.');
      } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
};

// Initialize blog app when DOM is ready
ArsTekYapi.utils.ready(() => {
  BlogApp.init();
});

// Export for use in other files
window.ARS.Blog = BlogApp;