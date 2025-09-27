// UPDATED GLOBAL.JS - Handles Header Loading + All Existing Functionality
// Replace your existing global.js with this version

// Global App Object
const App = {
  // Application state
  state: {
    currentLanguage: 'tr',
    mobileMenuOpen: false,
    headerLoaded: false
  },

  // Utility functions
  utils: {
    $: (selector) => document.querySelector(selector),
    $$: (selector) => document.querySelectorAll(selector),

    // Throttle function for performance
    throttle: (func, delay) => {
      let timeoutId;
      let lastExecTime = 0;
      return function (...args) {
        const currentTime = Date.now();
        if (currentTime - lastExecTime > delay) {
          func.apply(this, args);
          lastExecTime = currentTime;
        } else {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func.apply(this, args), delay);
        }
      };
    },

    // Debounce function
    debounce: (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
      };
    },

    // Check if element is in viewport
    isInViewport: (element) => {
      const rect = element.getBoundingClientRect();
      return (rect.top >= 0 && rect.left >= 0 &&
              rect.bottom <= window.innerHeight &&
              rect.right <= window.innerWidth);
    },

    // Email validation
    isValidEmail: (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    // Generate unique ID
    generateId: () => Math.random().toString(36).substr(2, 9),

    // Cookie utilities
    setCookie: (name, value, days = 30) => {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },

    getCookie: (name) => {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
  },

  // HEADER LOADING FUNCTIONALITY
  loadHeader: function() {
    const isEnglishPage = window.location.pathname.includes('/en/');
    const headerFile = isEnglishPage ? '/partials/header-en.html' : '/partials/header.html';

    // Find the header placeholder
    const headerPlaceholder = this.utils.$('#header-placeholder');
    if (!headerPlaceholder) {
      console.error('Header placeholder not found. Add <div id="header-placeholder"></div> to your HTML.');
      return;
    }

    // Fetch and insert header
    fetch(headerFile)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Header file not found: ${headerFile}`);
        }
        return response.text();
      })
      .then(html => {
        headerPlaceholder.innerHTML = html;
        this.state.headerLoaded = true;
        // Initialize navigation after header is loaded
        this.initNavigation();
        this.initLanguageToggle();
        this.initScrollEffects();
        this.highlightActiveNavLink();
      })
      .catch(error => {
        console.error('Error loading header:', error);
        // Fallback: show error message
        headerPlaceholder.innerHTML = `
          <div style="background: #f87171; color: white; padding: 1rem; text-align: center;">
            Header could not be loaded. Please check that ${headerFile} exists.
          </div>
        `;
      });
      setTimeout(() => {
      this.highlightActiveNavLink();
    }, 100);
  },

  // Enhanced navigation functionality with mobile language dropdown
  initNavigation: function() {
    // Get all navigation elements
    const languageBtn = this.utils.$('#language-btn');
    const languageMenu = this.utils.$('#language-menu');
    const dropdownArrow = this.utils.$('#dropdown-arrow');

    // NEW: Mobile language dropdown elements
    const mobileLanguageBtn = this.utils.$('#mobile-language-btn');
    const mobileLanguageMenu = this.utils.$('#mobile-language-menu');
    const mobileDropdownArrow = this.utils.$('#mobile-dropdown-arrow');

    // Mobile menu elements
    const mobileMenuBtn = this.utils.$('#mobile-menu-btn') || this.utils.$('.nav-toggle');
    const mobileMenu = this.utils.$('#mobile-menu') || this.utils.$('.nav-menu');

    // Desktop Language Dropdown
    if (languageBtn && languageMenu) {
      languageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Close mobile language menu if open
        if (mobileLanguageMenu && !mobileLanguageMenu.classList.contains('hidden')) {
          mobileLanguageMenu.classList.add('hidden');
          if (mobileDropdownArrow) {
            mobileDropdownArrow.style.transform = 'rotate(0deg)';
          }
        }

        // Toggle desktop dropdown
        const isHidden = languageMenu.classList.contains('hidden');
        if (isHidden) {
          languageMenu.classList.remove('hidden');
          if (dropdownArrow) {
            dropdownArrow.style.transform = 'rotate(180deg)';
          }
        } else {
          languageMenu.classList.add('hidden');
          if (dropdownArrow) {
            dropdownArrow.style.transform = 'rotate(0deg)';
          }
        }
      });
    }

    // NEW: Mobile Language Dropdown (separate from hamburger)
    if (mobileLanguageBtn && mobileLanguageMenu) {
      mobileLanguageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Close desktop language menu if open
        if (languageMenu && !languageMenu.classList.contains('hidden')) {
          languageMenu.classList.add('hidden');
          if (dropdownArrow) {
            dropdownArrow.style.transform = 'rotate(0deg)';
          }
        }

        // Close mobile hamburger menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          this.state.mobileMenuOpen = false;
          if (mobileMenu.classList.contains('hidden') || mobileMenu.id === 'mobile-menu') {
            mobileMenu.classList.add('hidden');
          } else {
            mobileMenu.classList.remove('active');
          }
        }

        // Toggle mobile language dropdown
        const isHidden = mobileLanguageMenu.classList.contains('hidden');
        if (isHidden) {
          mobileLanguageMenu.classList.remove('hidden');
          if (mobileDropdownArrow) {
            mobileDropdownArrow.style.transform = 'rotate(180deg)';
          }
        } else {
          mobileLanguageMenu.classList.add('hidden');
          if (mobileDropdownArrow) {
            mobileDropdownArrow.style.transform = 'rotate(0deg)';
          }
        }
      });
    }

    // Mobile Menu Toggle (existing functionality enhanced)
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        // Close mobile language menu if open
        if (mobileLanguageMenu && !mobileLanguageMenu.classList.contains('hidden')) {
          mobileLanguageMenu.classList.add('hidden');
          if (mobileDropdownArrow) {
            mobileDropdownArrow.style.transform = 'rotate(0deg)';
          }
        }

        this.state.mobileMenuOpen = !this.state.mobileMenuOpen;

        // Handle both hidden/active class systems
        if (mobileMenu.classList.contains('hidden') || mobileMenu.id === 'mobile-menu') {
          mobileMenu.classList.toggle('hidden', !this.state.mobileMenuOpen);
        } else {
          mobileMenu.classList.toggle('active', this.state.mobileMenuOpen);
        }

        mobileMenuBtn.setAttribute('aria-expanded', this.state.mobileMenuOpen);
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.state.mobileMenuOpen && !mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
          this.state.mobileMenuOpen = false;

          if (mobileMenu.classList.contains('hidden') || mobileMenu.id === 'mobile-menu') {
            mobileMenu.classList.add('hidden');
          } else {
            mobileMenu.classList.remove('active');
          }

          mobileMenuBtn.setAttribute('aria-expanded', false);
        }

        // Close desktop language dropdown
        if (languageBtn && languageMenu &&
            !languageBtn.contains(e.target) && !languageMenu.contains(e.target)) {
          languageMenu.classList.add('hidden');
          if (dropdownArrow) {
            dropdownArrow.style.transform = 'rotate(0deg)';
          }
        }

        // Close mobile language dropdown
        if (mobileLanguageBtn && mobileLanguageMenu &&
            !mobileLanguageBtn.contains(e.target) && !mobileLanguageMenu.contains(e.target)) {
          mobileLanguageMenu.classList.add('hidden');
          if (mobileDropdownArrow) {
            mobileDropdownArrow.style.transform = 'rotate(0deg)';
          }
        }
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.state.mobileMenuOpen) {
            this.state.mobileMenuOpen = false;
            if (mobileMenu.classList.contains('hidden') || mobileMenu.id === 'mobile-menu') {
              mobileMenu.classList.add('hidden');
            } else {
              mobileMenu.classList.remove('active');
            }
            mobileMenuBtn.setAttribute('aria-expanded', false);
          }

          // Close all dropdowns
          if (languageMenu) {
            languageMenu.classList.add('hidden');
            if (dropdownArrow) {
              dropdownArrow.style.transform = 'rotate(0deg)';
            }
          }
          if (mobileLanguageMenu) {
            mobileLanguageMenu.classList.add('hidden');
            if (mobileDropdownArrow) {
              mobileDropdownArrow.style.transform = 'rotate(0deg)';
            }
          }
        }
      });
    }

    // Close mobile menu when clicking on navigation links
    const mobileLinks = mobileMenu?.querySelectorAll('a');
    if (mobileLinks) {
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.state.mobileMenuOpen = false;
          if (mobileMenu.classList.contains('hidden') || mobileMenu.id === 'mobile-menu') {
            mobileMenu.classList.add('hidden');
          } else {
            mobileMenu.classList.remove('active');
          }
        });
      });
    }

    // Close language dropdowns when selecting a language
    const languageLinks = languageMenu?.querySelectorAll('a');
    if (languageLinks) {
      languageLinks.forEach(link => {
        link.addEventListener('click', () => {
          languageMenu.classList.add('hidden');
          if (dropdownArrow) {
            dropdownArrow.style.transform = 'rotate(0deg)';
          }
        });
      });
    }

    const mobileLanguageLinks = mobileLanguageMenu?.querySelectorAll('a');
    if (mobileLanguageLinks) {
      mobileLanguageLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileLanguageMenu.classList.add('hidden');
          if (mobileDropdownArrow) {
            mobileDropdownArrow.style.transform = 'rotate(0deg)';
          }
        });
      });
    }
  },

  // Highlight active navigation link
    highlightActiveNavLink: function() {
      const currentPath = window.location.pathname;
      const navLinks = this.utils.$$('.nav-link');
      const mobileNavLinks = this.utils.$$('.mobile-nav-link');

      // Function to determine if a link should be active
      const isLinkActive = (linkHref, currentPath) => {
        // Handle exact matches
        if (linkHref === currentPath) return true;

        // Handle root paths
        if (currentPath === '/' && linkHref === '/index.html') return true;
        if (currentPath === '/en/' && linkHref === '/en/index.html') return true;

        // Handle index pages without trailing slash
        if (currentPath === '/index.html' && linkHref === '/index.html') return true;
        if (currentPath === '/en/index.html' && linkHref === '/en/index.html') return true;

        // Handle page name matching (for both Turkish and English)
        const currentPageName = currentPath.split('/').pop().replace('.html', '');
        const linkPageName = linkHref.split('/').pop().replace('.html', '');

        // Special cases for index pages
        if (currentPageName === '' || currentPageName === 'index') {
          return linkPageName === 'index';
        }

        return currentPageName === linkPageName;
      };

      // Clear all active states first
      navLinks.forEach(link => {
        link.classList.remove('active', 'text-[#1B4F72]', 'font-semibold');
        link.classList.add('text-gray-700');
      });

      mobileNavLinks.forEach(link => {
        link.classList.remove('active');
      });

      // Set active states for desktop navigation
      navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');

        if (isLinkActive(linkHref, currentPath)) {
          link.classList.add('active', 'text-[#1B4F72]', 'font-semibold');
          link.classList.remove('text-gray-700');
        }
      });

      // Set active states for mobile navigation
      mobileNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href');

        if (isLinkActive(linkHref, currentPath)) {
          link.classList.add('active');
        }
      });
    },

  // Scroll effects
  initScrollEffects: function() {
    let lastScrollY = window.scrollY;
    const header = this.utils.$('header');

    const handleScroll = this.utils.throttle(() => {
      const scrollY = window.scrollY;

      // Keep navbar always visible
      if (header) {
        header.style.transform = 'translateY(0)';
      }

      // Add background to header when scrolled
      if (scrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }

      lastScrollY = scrollY;
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });
  },

  // Language detection and switching
  detectLanguage: function() {
    const path = window.location.pathname;
    if (path.startsWith('/en/')) {
      this.state.currentLanguage = 'en';
    }
  },

  initLanguageToggle: function() {
    this.detectLanguage();
    // Language switching is now handled in initNavigation
  },

  // Form handling
  handleFormSubmissions: function() {
    const forms = this.utils.$$('form[data-contact-form]');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');

        // Show loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Gönderiliyor...';
        }

        // Simple form validation
        const email = formData.get('email');
        const message = formData.get('message');

        if (!email || !this.utils.isValidEmail(email)) {
          alert('Geçerli bir e-posta adresi giriniz.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Gönder';
          }
          return;
        }

        if (!message || message.trim().length < 10) {
          alert('Lütfen en az 10 karakter uzunluğunda bir mesaj yazınız.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Gönder';
          }
          return;
        }

        // Here you would normally send to your backend
        // For now, we'll simulate success
        setTimeout(() => {
          alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
          form.reset();

          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Gönder';
          }
        }, 1500);
      });
    });
  },

  // Initialize scroll to top button
  initScrollToTop: function() {
    const scrollTopBtn = this.utils.$('#scroll-top');

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

      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  },

  // Initialize everything
  init: function() {
    // Load header first, then initialize everything else
    this.loadHeader();

    // Initialize other functionality
    this.handleFormSubmissions();
    this.initScrollToTop();

    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
      });
    }
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  App.init();
});

// Export for use in other scripts if needed
window.App = App;