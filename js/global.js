/**
 * ARS TEK YAPI - Global JavaScript Utilities
 * Core functions and utilities used across all pages
 */

// Global App Object
window.ArsTekYapi = {
  // Configuration
  config: {
    apiEndpoint: '/api',
    emailService: 'formspree', // or 'emailjs'
    animationDuration: 300,
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    }
  },

  // State management
  state: {
    currentLanguage: 'tr',
    mobileMenuOpen: false,
    activeModal: null
  },

  // Initialize app
  init: function() {
    this.setupEventListeners();
    this.initNavigation();
    this.initScrollEffects();
    this.detectLanguage();
    this.langDropdown.init();
  },

  // Utility Functions
  utils: {
    // DOM Selector utilities
    $: (selector) => document.querySelector(selector),
    $$: (selector) => document.querySelectorAll(selector),

    // Wait for DOM
    ready: (callback) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        callback();
      }
    },

    // Debounce function
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Throttle function
    throttle: (func, limit) => {
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

    // Get viewport dimensions
    getViewport: () => ({
      width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    }),

    // Check if element is in viewport
    isInViewport: (element, threshold = 0) => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;

      return (
        rect.top <= windowHeight - threshold &&
        rect.bottom >= threshold &&
        rect.left <= windowWidth - threshold &&
        rect.right >= threshold
      );
    },

    // Smooth scroll to element
    scrollTo: (element, duration = 800, offset = 0) => {
      const target = typeof element === 'string' ? document.querySelector(element) : element;
      if (!target) return;

      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ArsTekYapi.utils.easeInOutCubic(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      };

      requestAnimationFrame(animation);
    },

    // Easing function for smooth scroll
    easeInOutCubic: (t, b, c, d) => {
      t /= d/2;
      if (t < 1) return c/2*t*t*t + b;
      t -= 2;
      return c/2*(t*t*t + 2) + b;
    },

    // Format phone number for display
    formatPhone: (phone) => {
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
      }
      return phone;
    },

    // Validate email
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

  // Navigation functionality
    initNavigation: function() {
        // Try both ID and class selectors to work with all pages
        const toggle = this.utils.$('#mobile-menu-btn') || this.utils.$('.nav-toggle');
        const menu = this.utils.$('#mobile-menu') || this.utils.$('.nav-menu');

        if (toggle && menu) {
          toggle.addEventListener('click', () => {
            this.state.mobileMenuOpen = !this.state.mobileMenuOpen;

            // Handle both hidden/active class systems
            if (menu.classList.contains('hidden') || menu.id === 'mobile-menu') {
              // For pages using hidden class (like services)
              menu.classList.toggle('hidden', !this.state.mobileMenuOpen);
            } else {
              // For pages using active class (like index)
              menu.classList.toggle('active', this.state.mobileMenuOpen);
            }

            toggle.setAttribute('aria-expanded', this.state.mobileMenuOpen);
          });

          // Close menu when clicking outside
          document.addEventListener('click', (e) => {
            if (this.state.mobileMenuOpen && !toggle.contains(e.target) && !menu.contains(e.target)) {
              this.state.mobileMenuOpen = false;

              // Handle both class systems
              if (menu.classList.contains('hidden') || menu.id === 'mobile-menu') {
                menu.classList.add('hidden');
              } else {
                menu.classList.remove('active');
              }

              toggle.setAttribute('aria-expanded', false);
            }
          });

          // Close menu on escape key
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.mobileMenuOpen) {
              this.state.mobileMenuOpen = false;

              // Handle both class systems
              if (menu.classList.contains('hidden') || menu.id === 'mobile-menu') {
                menu.classList.add('hidden');
              } else {
                menu.classList.remove('active');
              }

              toggle.setAttribute('aria-expanded', false);
            }
          });
        }

        // Active nav link highlighting
        this.highlightActiveNavLink();
      },
  // Highlight active navigation link
  highlightActiveNavLink: function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = this.utils.$$('.nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  // Scroll effects
  initScrollEffects: function() {
    let lastScrollY = window.scrollY;
    const header = this.utils.$('header');

    const handleScroll = this.utils.throttle(() => {
      const scrollY = window.scrollY;

      // Header hide/show on scroll - DISABLED FOR ALWAYS VISIBLE NAVBAR
        if (header) {
          // Keep navbar always visible
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

  /* ---------- Language: unified dropdown controller (flags) ---------- */
    detectLanguage: function () {
      // set state once; we still use this elsewhere if needed
      this.state.currentLanguage = window.location.pathname.startsWith('/en/') ? 'en' : 'tr';
    },

    /**
     * Language dropdown controller
     * Markup contract (works for desktop & mobile, outside hamburger):
     * <div data-lang>
     *   <button data-lang-btn aria-expanded="false">
     *     <img data-lang-current-img class="h-5 w-5" alt="Current language">
     *     <svg data-lang-arrow ...>...</svg>
     *   </button>
     *   <div data-lang-menu class="hidden">
     *     <a data-lang-opt="tr"><img src="/assets/flags/tr.svg"> Türkçe</a>
     *     <a data-lang-opt="en"><img src="/assets/flags/gb.svg"> English</a>
     *   </div>
     * </div>
     */
    langDropdown: {
      openInstance: null,
      flags: {
        tr: '/assets/flags/tr.png', // <- adjust paths if different
        en: '/assets/flags/gb.png'
      },

      init() {
        const instances = document.querySelectorAll('[data-lang]');
        if (!instances.length) return;

        const isEN = window.location.pathname.startsWith('/en/');
        instances.forEach((inst) => this.bind(inst, isEN));

        // Close on outside click / ESC (global, one time)
        document.addEventListener('click', (e) => {
          if (this.openInstance && !this.openInstance.contains(e.target)) {
            this.close(this.openInstance);
          }
        });
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.openInstance) this.close(this.openInstance, true);
        });
      },

      bind(instance, isEN) {
        const btn   = instance.querySelector('[data-lang-btn]');
        const menu  = instance.querySelector('[data-lang-menu]');
        const arrow = instance.querySelector('[data-lang-arrow]');
        const img   = instance.querySelector('[data-lang-current-img]');

        if (!btn || !menu) return;

        // Set current flag image
        if (img) img.src = isEN ? this.flags.en : this.flags.tr;

        // Wire option links to the SAME path in each language
        const toTR = menu.querySelector('[data-lang-opt="tr"]');
        const toEN = menu.querySelector('[data-lang-opt="en"]');
        const path = window.location.pathname;

        // /en/... -> /...
        if (toTR) toTR.setAttribute('href', path.replace(/^\/en(\/|$)/, '/'));
        // /... -> /en/... (idempotent for already /en/)
        if (toEN) toEN.setAttribute('href', path.startsWith('/en/') ? path : '/en' + path);

        // Toggle
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const willOpen = menu.classList.contains('hidden');
          if (this.openInstance && this.openInstance !== instance) this.close(this.openInstance);
          willOpen ? this.open(instance, btn, menu, arrow) : this.close(instance);
        });
      },

      open(instance, btn, menu, arrow) {
        menu.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        this.openInstance = instance;
        // focus first item for accessibility
        const first = menu.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
        if (first) first.focus({ preventScroll: true });
      },

      close(instance, focusBtn = false) {
        const btn   = instance.querySelector('[data-lang-btn]');
        const menu  = instance.querySelector('[data-lang-menu]');
        const arrow = instance.querySelector('[data-lang-arrow]');
        if (menu)  menu.classList.add('hidden');
        if (btn)   btn.setAttribute('aria-expanded', 'false');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
        if (focusBtn && btn) btn.focus({ preventScroll: true });
        if (this.openInstance === instance) this.openInstance = null;
      }
    },
    /* ---------- /Language ---------- */





  // Form handling utilities
  form: {
    // Submit form via Formspree or EmailJS
    submit: async function(formElement, options = {}) {
      const formData = new FormData(formElement);
      const data = Object.fromEntries(formData.entries());

      // Add metadata
      data._subject = options.subject || 'New Contact from ARS TEK YAPI';
      data._replyto = data.email;
      data._next = options.redirectUrl || '/thanks.html';

      try {
        const response = await fetch(formElement.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          return { success: true };
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Validate form
    validate: function(formElement) {
      const errors = [];
      const inputs = formElement.querySelectorAll('input[required], textarea[required], select[required]');

      inputs.forEach(input => {
        if (!input.value.trim()) {
          errors.push({ field: input.name, message: 'Bu alan zorunludur' });
        }

        if (input.type === 'email' && input.value && !ArsTekYapi.utils.isValidEmail(input.value)) {
          errors.push({ field: input.name, message: 'Geçerli bir email adresi giriniz' });
        }
      });

      return errors;
    }
  },

  // Animation utilities
  animate: {
    // Fade in animation
    fadeIn: function(element, duration = 300) {
      element.style.opacity = '0';
      element.style.display = 'block';

      let start = performance.now();

      const fade = (timestamp) => {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);

        element.style.opacity = progress;

        if (progress < 1) {
          requestAnimationFrame(fade);
        }
      };

      requestAnimationFrame(fade);
    },

    // Slide up animation
    slideUp: function(element, duration = 300) {
      element.style.transform = 'translateY(20px)';
      element.style.opacity = '0';

      let start = performance.now();

      const slide = (timestamp) => {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);

        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

        element.style.transform = `translateY(${20 * (1 - eased)}px)`;
        element.style.opacity = eased;

        if (progress < 1) {
          requestAnimationFrame(slide);
        }
      };

      requestAnimationFrame(slide);
    }
  },

  // Setup global event listeners
  setupEventListeners: function() {
    // Smooth scroll for anchor links
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        this.utils.scrollTo(targetId, 800, 80);
      }
    });

    // Handle all form submissions
    document.addEventListener('submit', async (e) => {
      if (e.target.matches('form[data-form]')) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');

        // Validate form
        const errors = this.form.validate(form);
        if (errors.length > 0) {
          this.showFormErrors(form, errors);
          return;
        }

        // Show loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner"></span> Gönderiliyor...';
        }

        // Submit form
        const result = await this.form.submit(form);

        if (result.success) {
          window.location.href = '/thanks.html';
        } else {
          alert('Form gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
        }

        // Reset button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Gönder';
        }
      }
    });
  },

  // Show form validation errors
  showFormErrors: function(form, errors) {
    // Clear previous errors
    form.querySelectorAll('.form-error').forEach(error => error.remove());

    errors.forEach(error => {
      const field = form.querySelector(`[name="${error.field}"]`);
      if (field) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = error.message;
        field.parentNode.appendChild(errorDiv);
      }
    });
  }


};

// Scroll to top button functionality
document.addEventListener('DOMContentLoaded', function() {
  const scrollTopBtn = document.getElementById('scroll-top');

  if (scrollTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('opacity-100', 'translate-y-0');
        scrollTopBtn.classList.remove('opacity-0', 'translate-y-2');
      } else {
        scrollTopBtn.classList.remove('opacity-100', 'translate-y-0');
        scrollTopBtn.classList.add('opacity-0', 'translate-y-2');
      }
    });

    // Scroll to top when clicked
    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});



// Initialize when DOM is ready
ArsTekYapi.utils.ready(() => {
  ArsTekYapi.init();
});

// Export for other scripts
window.ARS = ArsTekYapi;