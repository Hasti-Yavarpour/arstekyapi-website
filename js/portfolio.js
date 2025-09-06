// Portfolio Page JavaScript

class PortfolioManager {
  constructor() {
    this.projects = [];
    this.currentFilter = 'all';
    this.visibleProjects = 6;
    this.totalProjects = 0;
    this.isLoading = false;

    this.init();
  }

  async init() {
    await this.loadProjects();
    this.setupEventListeners();
    this.renderProjects();
    this.initAnimations();
    this.animateCounters();
  }

  // Load project data (in real implementation, this would fetch from API or JSON file)
  async loadProjects() {
    // Sample project data matching the CSS sectors
    this.projects = [
      {
        id: 1,
        title: "Akıllı Fintech Platformu",
        description: "60 günde Django ve React kullanarak geliştirilen, AI destekli fraud detection sistemli fintech platformu. Gerçek zamanlı işlem izleme ve risk analizi.",
        sector: "finance",
        sectorName: "Fintech",
        technologies: ["Django", "React", "PostgreSQL", "Redis", "Docker"],
        duration: "2 Ay",
        year: "2025",
        image: "fintech-platform.jpg",
        tags: ["AI", "Fintech", "Real-time"],
        results: "İşlem güvenliği %95 artış",
        problem: "Manuel fraud detection ve yavaş işlem onayları",
        solution: "AI destekli otomatik fraud detection ve real-time monitoring",
        link: "/portfolio/fintech-platform"
      },
      {
        id: 2,
        title: "Akıllı Fabrika Yönetim Sistemi",
        description: "ESP32 ve Raspberry Pi ile geliştirilen, predictive maintenance özellikli IoT fabrika yönetim sistemi. Makine arıza tahmini ve otomatik bakım planlaması.",
        sector: "manufacturing",
        sectorName: "İmalat",
        technologies: ["ESP32", "Raspberry Pi", "Python", "InfluxDB", "Grafana"],
        duration: "4 Ay",
        year: "2024",
        image: "smart-factory.jpg",
        tags: ["IoT", "Predictive Analytics", "Industry 4.0"],
        results: "Arıza oranında %40 azalma",
        problem: "Beklenmedik makine arızaları ve yüksek bakım maliyetleri",
        solution: "IoT sensörleri ile predictive maintenance ve real-time monitoring",
        link: "/portfolio/smart-factory"
      },
      {
        id: 3,
        title: "Entegre Akıllı Ev Sistemi",
        description: "Akıllı kilitler, iklim kontrolü, güneş paneli yönetimi ve unified dashboard ile tam otomasyon. Sesli kontrol ve mobil uygulama desteği.",
        sector: "real-estate",
        sectorName: "Akıllı Ev",
        technologies: ["Arduino", "Node.js", "React Native", "MQTT", "Solar API"],
        duration: "3 Ay",
        year: "2024",
        image: "smart-home.jpg",
        tags: ["Home Automation", "IoT", "Energy Management"],
        results: "Enerji tasarrufu %35",
        problem: "Enerji verimsizliği ve manuel ev kontrolü",
        solution: "Entegre otomasyon sistemi ve akıllı enerji yönetimi",
        link: "/portfolio/smart-home"
      },
      {
        id: 4,
        title: "AI Destekli E-ticaret Platformu",
        description: "Makine öğrenmesi algoritmaları ile kişiselleştirilmiş ürün önerileri ve dinamik fiyatlandırma sistemi. Real-time stok yönetimi.",
        sector: "retail",
        sectorName: "E-ticaret",
        technologies: ["Python", "TensorFlow", "Django", "PostgreSQL", "Redis"],
        duration: "5 Ay",
        year: "2024",
        image: "ecommerce-ai.jpg",
        tags: ["AI", "Machine Learning", "E-commerce"],
        results: "Satış %60 artış",
        problem: "Düşük dönüşüm oranları ve manuel fiyat yönetimi",
        solution: "AI öneriler ve dinamik fiyatlandırma algoritması",
        link: "/portfolio/ai-ecommerce"
      },
      {
        id: 5,
        title: "Akıllı Hastane Yönetim Sistemi",
        description: "HIPAA uyumlu telemedicine platformu ve AI destekli tanı yardımcı sistemi. Hasta takibi ve online konsültasyon modülleri.",
        sector: "healthcare",
        sectorName: "Sağlık",
        technologies: ["Node.js", "React", "MongoDB", "WebRTC", "TensorFlow"],
        duration: "6 Ay",
        year: "2023",
        image: "healthcare-system.jpg",
        tags: ["Telemedicine", "AI Diagnostics", "HIPAA"],
        results: "Hasta memnuniyeti %85",
        problem: "Uzaktan hasta takibi ve tanı süreçlerinin yavaşlığı",
        solution: "Telemedicine platformu ve AI destekli ön tanı sistemi",
        link: "/portfolio/healthcare-system"
      },
      {
        id: 6,
        title: "Akıllı Lojistik Optimizasyon",
        description: "Filo takibi, akıllı rota planlama ve yük optimizasyonu sistemi. GPS tracking ve fuel consumption monitoring.",
        sector: "transportation",
        sectorName: "Lojistik",
        technologies: ["Python", "Google Maps API", "PostgreSQL", "Docker", "GPS"],
        duration: "4 Ay",
        year: "2023",
        image: "logistics-system.jpg",
        tags: ["Fleet Management", "Route Optimization", "GPS"],
        results: "Yakıt tasarrufu %25",
        problem: "Verimsiz rota planlaması ve yüksek yakıt maliyetleri",
        solution: "AI destekli rota optimizasyonu ve gerçek zamanlı takip",
        link: "/portfolio/logistics-system"
      },
      {
        id: 7,
        title: "Akıllı Tarım IoT Çözümü",
        description: "Toprak nem sensörleri, hava durumu entegrasyonu ve otomatik sulama sistemi. Crop monitoring ve yield prediction.",
        sector: "agriculture",
        sectorName: "Tarım",
        technologies: ["Arduino", "LoRaWAN", "Python", "Weather API", "Machine Learning"],
        duration: "3 Ay",
        year: "2023",
        image: "smart-agriculture.jpg",
        tags: ["Agriculture IoT", "Weather Integration", "Automation"],
        results: "Su tasarrufu %30",
        problem: "Su israfı ve manuel tarım takibi",
        solution: "IoT sensörleri ile otomatik sulama ve crop monitoring",
        link: "/portfolio/smart-agriculture"
      },
      {
        id: 8,
        title: "Eğitim AI Platformu",
        description: "Kişiselleştirilmiş öğrenme, AI öğretmen asistanı ve akıllı kampüs sistemi. Adaptive learning algorithms.",
        sector: "education",
        sectorName: "Eğitim",
        technologies: ["Python", "TensorFlow", "React", "Node.js", "MongoDB"],
        duration: "5 Ay",
        year: "2023",
        image: "education-ai.jpg",
        tags: ["AI Tutor", "Adaptive Learning", "EdTech"],
        results: "Öğrenci başarısı %45 artış",
        problem: "Standartlaştırılmış eğitim ve düşük öğrenci etkileşimi",
        solution: "AI destekli kişiselleştirilmiş öğrenme platformu",
        link: "/portfolio/education-ai"
      }
    ];

    this.totalProjects = this.projects.length;
  }

  setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = e.target.dataset.filter;
        this.setActiveFilter(filter);
        this.filterProjects(filter);
      });
    });

    // Load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.loadMoreProjects();
      });
    }

    // Project card hover effects
    document.addEventListener('click', (e) => {
      if (e.target.closest('.project-cta')) {
        e.preventDefault();
        // Handle project detail navigation
        const projectId = e.target.closest('.project-card').dataset.projectId;
        this.openProjectDetails(projectId);
      }
    });
  }

  setActiveFilter(filter) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

    this.currentFilter = filter;
    this.visibleProjects = 6; // Reset visible count when filtering
  }

  filterProjects(filter) {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
      card.classList.add('hidden');
    });

    // Small delay for smooth transition
    setTimeout(() => {
      let visibleCount = 0;

      projectCards.forEach(card => {
        const projectSector = card.dataset.sector;

        if (filter === 'all' || projectSector === filter) {
          if (visibleCount < this.visibleProjects) {
            card.classList.remove('hidden');
            // Add animation
            card.style.animationDelay = `${visibleCount * 0.1}s`;
            card.classList.add('fade-in');
            visibleCount++;
          }
        }
      });

      // Update load more button
      this.updateLoadMoreButton();

      // Update project count
      this.updateProjectCount(visibleCount);

    }, 200);
  }

  renderProjects() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid) return;

    portfolioGrid.innerHTML = '';

    this.projects.forEach((project, index) => {
      const projectCard = this.createProjectCard(project, index);
      portfolioGrid.appendChild(projectCard);
    });

    // Initial filter application
    this.filterProjects(this.currentFilter);
  }

  createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.projectId = project.id;
    card.dataset.sector = project.sector;
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
      <div class="project-image ${project.sector}">
        <div class="icon">
          ${this.getSectorIcon(project.sector)}
        </div>
        <div class="project-overlay">
          <div class="overlay-content">
            <i class="fas fa-eye text-3xl mb-2"></i>
            <p class="font-semibold">Detayları Görüntüle</p>
          </div>
        </div>
      </div>

      <div class="project-content">
        <div class="project-tags">
          <span class="project-tag ${project.sector}">${project.sectorName}</span>
          ${project.tags.map(tag => `<span class="project-tag tech">${tag}</span>`).join('')}
        </div>

        <h3 class="project-title">${project.title}</h3>

        <p class="project-description">${project.description}</p>

        <div class="project-tech">
          ${project.technologies.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
        </div>

        <div class="project-meta">
          <div class="project-info">
            <div class="project-year">
              <i class="fas fa-calendar"></i>
              <span>${project.year}</span>
            </div>
            <div class="project-duration">
              <i class="fas fa-clock"></i>
              <span>${project.duration}</span>
            </div>
          </div>

          <a href="#" class="project-cta">
            Detayları İncele
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;

    return card;
  }

  getSectorIcon(sector) {
    const icons = {
      healthcare: '<i class="fas fa-heartbeat"></i>',
      manufacturing: '<i class="fas fa-industry"></i>',
      retail: '<i class="fas fa-shopping-cart"></i>',
      finance: '<i class="fas fa-university"></i>',
      transportation: '<i class="fas fa-truck"></i>',
      'real-estate': '<i class="fas fa-home"></i>',
      agriculture: '<i class="fas fa-leaf"></i>',
      education: '<i class="fas fa-graduation-cap"></i>',
      hospitality: '<i class="fas fa-hotel"></i>',
      energy: '<i class="fas fa-bolt"></i>'
    };

    return icons[sector] || '<i class="fas fa-cog"></i>';
  }

  loadMoreProjects() {
    if (this.isLoading) return;

    this.isLoading = true;
    const loadMoreBtn = document.getElementById('load-more-btn');

    // Show loading state
    loadMoreBtn.textContent = 'Yükleniyor...';
    loadMoreBtn.disabled = true;

    // Simulate loading delay
    setTimeout(() => {
      this.visibleProjects += 3;
      this.filterProjects(this.currentFilter);

      // Reset button state
      loadMoreBtn.textContent = 'Daha Fazla Proje Yükle';
      loadMoreBtn.disabled = false;
      this.isLoading = false;

    }, 800);
  }

  updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;

    const filteredProjects = this.getFilteredProjects();
    const hasMoreProjects = this.visibleProjects < filteredProjects.length;

    if (hasMoreProjects) {
      loadMoreBtn.style.display = 'inline-flex';
    } else {
      loadMoreBtn.style.display = 'none';
    }
  }

  getFilteredProjects() {
    if (this.currentFilter === 'all') {
      return this.projects;
    }
    return this.projects.filter(project => project.sector === this.currentFilter);
  }

  updateProjectCount(visibleCount) {
    const countElement = document.getElementById('project-count');
    if (countElement) {
      const filteredTotal = this.getFilteredProjects().length;
      countElement.textContent = `${visibleCount} / ${filteredTotal} proje gösteriliyor`;
    }
  }

  openProjectDetails(projectId) {
    // In real implementation, this would navigate to project detail page
    const project = this.projects.find(p => p.id == projectId);
    if (project) {
      // For now, show alert (replace with actual navigation)
      alert(`${project.title} detay sayfasına yönlendiriliyor...`);
      // window.location.href = project.link;
    }
  }

  // Animate counter numbers
  animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observerOptions = {
      threshold: 0.7
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.target);
          const suffix = counter.dataset.suffix || '';

          this.animateCounter(counter, target, suffix);
          observer.unobserve(counter);
        }
      });
    }, observerOptions);

    counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  animateCounter(element, target, suffix) {
    let current = 0;
    const increment = target / 60; // 60 frames for smooth animation
    const duration = 2000; // 2 seconds
    const stepTime = duration / 60;

    const timer = setInterval(() => {
      current += increment;

      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      element.textContent = Math.floor(current) + suffix;
    }, stepTime);
  }

  // Initialize animations
  initAnimations() {
    // Intersection Observer for scroll animations
    const animateElements = document.querySelectorAll('.project-card, .filter-container, .portfolio-stats');

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    animateElements.forEach(element => {
      observer.observe(element);
    });
  }
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Search functionality
function initProjectSearch() {
  const searchInput = document.getElementById('project-search');
  if (!searchInput) return;

  const searchProjects = debounce((searchTerm) => {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
      const title = card.querySelector('.project-title').textContent.toLowerCase();
      const description = card.querySelector('.project-description').textContent.toLowerCase();
      const technologies = Array.from(card.querySelectorAll('.tech-item')).map(tech => tech.textContent.toLowerCase());

      const searchableText = [title, description, ...technologies].join(' ');

      if (searchableText.includes(searchTerm.toLowerCase())) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }, 300);

  searchInput.addEventListener('input', (e) => {
    searchProjects(e.target.value);
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize portfolio manager
  const portfolioManager = new PortfolioManager();

  // Initialize search
  initProjectSearch();

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add scroll-to-top functionality
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('opacity-100', 'translate-y-0');
        scrollTopBtn.classList.remove('opacity-0', 'translate-y-2');
      } else {
        scrollTopBtn.classList.remove('opacity-100', 'translate-y-0');
        scrollTopBtn.classList.add('opacity-0', 'translate-y-2');
      }
    });
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioManager };
}