/**
 * MAIN.JS - Core JavaScript Functions
 * ARS TEK YAPI A.Ş. Website
 */

// Global Variables
const CONFIG = {
  colors: {
    primary: '#1B4F72',
    primaryHover: '#143c5c',
    secondary: '#2C3E50',
    accent: '#3498DB'
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
  }
};

// Utility Functions
const utils = {
  // Get viewport width
  getViewportWidth() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  },

  // Check if mobile device
  isMobile() {
    return this.getViewportWidth() < CONFIG.breakpoints.lg;
  },

  // Throttle function for performance
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  },

  // Debounce function
  debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  // Format phone number
  formatPhone(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+90 $1 $2 $3 $4');
  },

  // Validate email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};

// Navigation Class
class Navigation {
  constructor() {
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.languageBtn = document.getElementById('language-btn');
    this.languageMenu = document.getElementById('language-menu');
    this.dropdownArrow = document.getElementById('dropdown-arrow');
    this.header = document.querySelector('header');
    this.isMenuOpen = false;

    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupLanguageDropdown();
    this.setupStickyHeader();
    this.setupActiveLinks();
    this.setupSmoothScrolling();
  }

  // Mobile Menu Toggle
  setupMobileMenu() {
    if (!this.mobileMenuBtn || !this.mobileMenu) return;

    this.mobileMenuBtn.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.mobileMenu.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      this.openMobileMenu();
    } else {
      this.closeMobileMenu();
    }
  }

  openMobileMenu() {
    this.mobileMenu.classList.remove('hidden');
    this.mobileMenuBtn.querySelector('svg').style.transform = 'rotate(90deg)';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  closeMobileMenu() {
    this.mobileMenu.classList.add('hidden');
    this.mobileMenuBtn.querySelector('svg').style.transform = 'rotate(0deg)';
    document.body.style.overflow = ''; // Restore scrolling
    this.isMenuOpen = false;
  }

  // Language Dropdown
  setupLanguageDropdown() {
    if (!this.languageBtn || !this.languageMenu) return;

    this.languageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleLanguageMenu();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.languageBtn.contains(e.target)) {
        this.closeLanguageMenu();
      }
    });
  }

  toggleLanguageMenu() {
    const isHidden = this.languageMenu.classList.contains('hidden');

    if (isHidden) {
      this.openLanguageMenu();
    } else {
      this.closeLanguageMenu();
    }
  }

  openLanguageMenu() {
    this.languageMenu.classList.remove('hidden');
    this.dropdownArrow.style.transform = 'rotate(180deg)';
  }

  closeLanguageMenu() {
    this.languageMenu.classList.add('hidden');
    this.dropdownArrow.style.transform = 'rotate(0deg)';
  }

  // Sticky Header with Scroll Effects
  setupStickyHeader() {
    if (!this.header) return;

    let lastScrollY = window.scrollY;

    const handleScroll = utils.throttle(() => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        this.header.classList.add('bg-white/95', 'backdrop-blur-sm', 'border-b-2');
      } else {
        this.header.classList.remove('bg-white/95', 'backdrop-blur-sm', 'border-b-2');
      }

      lastScrollY = currentScrollY;
    }, 10);

    window.addEventListener('scroll', handleScroll);
  }

  // Active Navigation Links
  setupActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');

      if (linkPath === currentPath ||
          (currentPath === '/' && linkPath === '/index.html') ||
          (currentPath.includes(linkPath.replace('.html', '')) && linkPath !== '/index.html')) {

        link.classList.add('text-[#1B4F72]', 'font-semibold', 'border-b-2', 'border-[#1B4F72]');
        link.classList.remove('text-gray-700');
      }
    });
  }

  // Smooth Scrolling for Anchor Links
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = anchor.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const headerHeight = this.header.offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          if (this.isMenuOpen) {
            this.closeMobileMenu();
          }
        }
      });
    });
  }
}

// Language Switcher Class
class LanguageSwitcher {
  constructor() {
    this.currentLang = this.detectCurrentLanguage();
    this.init();
  }

  detectCurrentLanguage() {
    const path = window.location.pathname;
    return path.startsWith('/en/') ? 'en' : 'tr';
  }

  init() {
    this.updateLanguageButton();
  }

  updateLanguageButton() {
    const currentLangElement = document.getElementById('current-lang');
    if (currentLangElement) {
      currentLangElement.textContent = this.currentLang === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN';
    }
  }

  switchLanguage(newLang) {
    const currentPath = window.location.pathname;
    let newPath;

    if (newLang === 'en') {
      // Switch to English
      if (currentPath.startsWith('/en/')) {
        return; // Already in English
      }
      newPath = '/en' + (currentPath === '/' ? '/index.html' : currentPath);
    } else {
      // Switch to Turkish
      if (!currentPath.startsWith('/en/')) {
        return; // Already in Turkish
      }
      newPath = currentPath.replace('/en', '');
      if (newPath === '') newPath = '/';
    }

    window.location.href = newPath;
  }
}

// Loading Manager
class LoadingManager {
  constructor() {
    this.loadingOverlay = null;
    this.init();
  }

  init() {
    this.createLoadingOverlay();
    this.setupPageTransitions();
  }

  createLoadingOverlay() {
    this.loadingOverlay = document.createElement('div');
    this.loadingOverlay.id = 'loading-overlay';
    this.loadingOverlay.className = 'fixed inset-0 bg-white z-50 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300';

    this.loadingOverlay.innerHTML = `
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1B4F72] mx-auto mb-4"></div>
        <p class="text-[#1B4F72] font-semibold">Yükleniyor...</p>
      </div>
    `;

    document.body.appendChild(this.loadingOverlay);
  }

  show() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.remove('opacity-0', 'pointer-events-none');
      this.loadingOverlay.classList.add('opacity-100');
    }
  }

  hide() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.add('opacity-0', 'pointer-events-none');
      this.loadingOverlay.classList.remove('opacity-100');
    }
  }

  setupPageTransitions() {
    // Show loading on external navigation
    document.querySelectorAll('a[href^="/"], a[href^="http"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Don't show loading for same page anchors or external links
        if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
          return;
        }

        this.show();

        // Hide loading if page doesn't change within 5 seconds
        setTimeout(() => {
          this.hide();
        }, 5000);
      });
    });

    // Hide loading when page loads
    window.addEventListener('load', () => {
      this.hide();
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main classes
  const navigation = new Navigation();
  const languageSwitcher = new LanguageSwitcher();
  const loadingManager = new LoadingManager();

  // Global error handling
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    loadingManager.hide();
  });

  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    });
  }

  console.log('🚀 ARS TEK YAPI website initialized successfully');
});