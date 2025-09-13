/**
 * About Page Specific JavaScript
 * ARS TEK YAPI A.Ş. - About Page Functionality
 */

// About Page Main Controller
class AboutPage {
  constructor() {
    this.initialized = false;
    this.countersAnimated = false;
    this.timelineItems = [];
    this.teamCards = [];
    this.valueCards = [];

    this.init();
  }

  // Initialize all about page functionality
  init() {
    if (this.initialized) return;

    this.setupEventListeners();
    this.initializeComponents();
    this.setupIntersectionObservers();
    this.setupScrollEffects();

    this.initialized = true;
    console.log('About page initialized successfully');
  }

  // Setup all event listeners
  setupEventListeners() {
    // Mobile menu toggle
    this.setupMobileMenu();

    // Language dropdown
    this.setupLanguageDropdown();

    // Smooth scrolling for anchor links
    this.setupSmoothScrolling();

    // Scroll to top button
    this.setupScrollToTop();

    // Window resize handler
    window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
  }

  // Initialize page components
  initializeComponents() {
    this.timelineItems = document.querySelectorAll('.timeline-item');
    this.teamCards = document.querySelectorAll('.team-card');
    this.valueCards = document.querySelectorAll('.value-card');

    this.setupTimelineInteractions();
    this.setupTeamCardInteractions();
    this.setupValueCardInteractions();
  }

  // Mobile Menu Functionality
  setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileMenu(mobileMenu);
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
          this.closeMobileMenu(mobileMenu);
        }
      });

      // Close mobile menu on window resize
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
          this.closeMobileMenu(mobileMenu);
        }
      });
    }
  }

  toggleMobileMenu(mobileMenu) {
    mobileMenu.classList.toggle('hidden');

    // Add/remove body scroll lock
    if (mobileMenu.classList.contains('hidden')) {
      document.body.classList.remove('overflow-hidden');
    } else {
      document.body.classList.add('overflow-hidden');
    }
  }

  closeMobileMenu(mobileMenu) {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  // Language Dropdown Functionality

//  setupLanguageDropdown() {
//      const languageBtn = document.getElementById('lang-btn');
/*      const languageMenu = document.getElementById('language-menu');
      const dropdownArrow = document.getElementById('dropdown-arrow');
      const currentLangText = document.getElementById('current-lang-text');
      const currentLangEmoji = document.getElementById('current-lang-emoji');

      // Set language display
      const path = window.location.pathname;
      if (path.startsWith('/en/')) {
        if (currentLangText) currentLangText.textContent = 'EN';
        if (currentLangEmoji) currentLangEmoji.textContent = '🇬🇧';
      } else {
        if (currentLangText) currentLangText.textContent = 'TR';
        if (currentLangEmoji) currentLangEmoji.textContent = '🇹🇷';
      }

      if (languageBtn && languageMenu) {
        const toggleDropdown = (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (languageMenu.classList.contains('hidden')) {
            languageMenu.classList.remove('hidden');
            if (dropdownArrow) dropdownArrow.style.transform = 'rotate(180deg)';
          } else {
            languageMenu.classList.add('hidden');
            if (dropdownArrow) dropdownArrow.style.transform = 'rotate(0deg)';
          }
        };

        languageBtn.addEventListener('click', toggleDropdown);
        languageBtn.addEventListener('touchstart', toggleDropdown, { passive: false });

        document.addEventListener('click', (e) => {
          if (!languageBtn.contains(e.target) && !languageMenu.contains(e.target)) {
            languageMenu.classList.add('hidden');
            if (dropdownArrow) dropdownArrow.style.transform = 'rotate(0deg)';
          }
        });
      }
    }*/

  toggleLanguageDropdown(languageMenu, dropdownArrow) {
    languageMenu.classList.toggle('hidden');

    if (dropdownArrow) {
      if (languageMenu.classList.contains('hidden')) {
        dropdownArrow.style.transform = 'rotate(0deg)';
      } else {
        dropdownArrow.style.transform = 'rotate(180deg)';
      }
    }
  }

  closeLanguageDropdown(languageMenu, dropdownArrow) {
    languageMenu.classList.add('hidden');
    if (dropdownArrow) {
      dropdownArrow.style.transform = 'rotate(0deg)';
    }
  }

  // Counter Animation
  setupCounterAnimations() {
    const counterElements = document.querySelectorAll('.counter');

    if (counterElements.length === 0 || this.countersAnimated) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.getAttribute('data-target'));
          const suffix = element.getAttribute('data-suffix') || '';

          if (!isNaN(target) && !element.hasAttribute('data-animated')) {
            element.setAttribute('data-animated', 'true');
            this.animateCounter(element, target, suffix);
          }

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '-50px'
    });

    counterElements.forEach(el => observer.observe(el));
  }

  animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const start = performance.now();
    const startValue = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (target * easeOutCubic));

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target + suffix;
        element.classList.add('animation-complete');
      }
    };

    requestAnimationFrame(animate);
  }

  // Timeline Interactions
  setupTimelineInteractions() {
    this.timelineItems.forEach((item, index) => {
      const content = item.querySelector('.timeline-content');
      const number = item.querySelector('.timeline-number');

      if (content) {
        // Add hover effects
        content.addEventListener('mouseenter', () => {
          this.highlightTimelineItem(item, number);
        });

        content.addEventListener('mouseleave', () => {
          this.unhighlightTimelineItem(item, number);
        });

        // Add click interaction for mobile
        content.addEventListener('click', () => {
          this.toggleTimelineItemDetails(item);
        });
      }
    });
  }

  highlightTimelineItem(item, number) {
    if (number) {
      number.style.transform = 'translateX(-50%) scale(1.1)';
      number.style.boxShadow = '0 8px 20px rgba(27, 79, 114, 0.4)';
    }
  }

  unhighlightTimelineItem(item, number) {
    if (number) {
      number.style.transform = 'translateX(-50%) scale(1)';
      number.style.boxShadow = '0 4px 10px rgba(27, 79, 114, 0.3)';
    }
  }

  toggleTimelineItemDetails(item) {
    const content = item.querySelector('.timeline-content');
    if (content) {
      content.classList.toggle('expanded');

      // Add animation feedback
      content.style.transform = 'scale(0.98)';
      setTimeout(() => {
        content.style.transform = 'scale(1)';
      }, 150);
    }
  }

  // Team Card Interactions
  setupTeamCardInteractions() {
    this.teamCards.forEach(card => {
      const avatar = card.querySelector('.team-avatar');
      const skills = card.querySelectorAll('.skill-tag');

      card.addEventListener('mouseenter', () => {
        this.animateTeamCard(card, avatar, skills, true);
      });

      card.addEventListener('mouseleave', () => {
        this.animateTeamCard(card, avatar, skills, false);
      });

      // Add click interaction for mobile
      card.addEventListener('click', () => {
        this.showTeamMemberDetails(card);
      });
    });
  }

  animateTeamCard(card, avatar, skills, isEnter) {
    if (isEnter) {
      // Stagger animation for skill tags
      skills.forEach((skill, index) => {
        setTimeout(() => {
          skill.style.transform = 'scale(1.05)';
        }, index * 50);
      });
    } else {
      skills.forEach(skill => {
        skill.style.transform = 'scale(1)';
      });
    }
  }

  showTeamMemberDetails(card) {
    const name = card.querySelector('h3')?.textContent;
    const role = card.querySelector('p[class*="font-semibold"]')?.textContent;

    // Add visual feedback
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = 'scale(1)';
    }, 150);

    // Could extend this to show a modal with more details
    console.log(`Showing details for ${name} - ${role}`);
  }

  // Value Card Interactions
  setupValueCardInteractions() {
    this.valueCards.forEach(card => {
      const icon = card.querySelector('.value-icon');

      card.addEventListener('mouseenter', () => {
        this.animateValueCard(card, icon, true);
      });

      card.addEventListener('mouseleave', () => {
        this.animateValueCard(card, icon, false);
      });
    });
  }

  animateValueCard(card, icon, isEnter) {
    if (icon) {
      const iconElement = icon.querySelector('i');
      if (iconElement && isEnter) {
        iconElement.style.animation = 'pulse 0.6s ease-in-out';
      } else if (iconElement) {
        iconElement.style.animation = '';
      }
    }
  }

  // Intersection Observers Setup
  setupIntersectionObservers() {
    // Counter animations
    this.setupCounterAnimations();

    // Section reveal animations
    this.setupSectionAnimations();
  }

  setupSectionAnimations() {
    const sections = document.querySelectorAll('section');

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');

          // Trigger any section-specific animations
          this.triggerSectionAnimations(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '-50px'
    });

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  triggerSectionAnimations(section) {
    const sectionId = section.id;

    switch (sectionId) {
      case 'story':
        this.animateTimeline();
        break;
      default:
        break;
    }
  }

  animateTimeline() {
    // Add staggered animation to timeline items
    this.timelineItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('timeline-item-visible');
      }, index * 200);
    });
  }

  // Smooth Scrolling
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const headerHeight = document.querySelector('header')?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without causing scroll
          if (history.pushState) {
            history.pushState(null, null, `#${targetId}`);
          }
        }
      });
    });
  }

  // Scroll to Top Functionality
  setupScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');

    if (scrollTopBtn) {
      // Show/hide based on scroll position
      window.addEventListener('scroll', this.throttle(() => {
        if (window.pageYOffset > 300) {
          scrollTopBtn.classList.remove('opacity-0', 'translate-y-2');
          scrollTopBtn.classList.add('opacity-100', 'translate-y-0');
        } else {
          scrollTopBtn.classList.remove('opacity-100', 'translate-y-0');
          scrollTopBtn.classList.add('opacity-0', 'translate-y-2');
        }
      }, 100));

      // Scroll to top on click
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // Scroll Effects
  setupScrollEffects() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateScrollEffects();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  updateScrollEffects() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      const floatingElements = heroSection.querySelectorAll('.floating-element');
      floatingElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.2);
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }
  }

  // Window Resize Handler
  handleResize() {
    // Recalculate any position-dependent elements
    this.updateTimelineLayout();
    this.updateCardLayouts();
  }

  updateTimelineLayout() {
    // Update timeline for responsive breakpoints
    const timeline = document.querySelector('.timeline-container');
    if (timeline) {
      const width = window.innerWidth;
      if (width <= 1024) {
        timeline.classList.add('timeline-mobile');
      } else {
        timeline.classList.remove('timeline-mobile');
      }
    }
  }

  updateCardLayouts() {
    // Ensure consistent card heights in grids
    const cardGroups = [
      '.team-grid .team-card',
      '.values-grid .value-card'
    ];

    cardGroups.forEach(selector => {
      const cards = document.querySelectorAll(selector);
      if (cards.length > 0) {
        // Reset heights
        cards.forEach(card => card.style.height = 'auto');

        // Find max height and apply to all
        let maxHeight = 0;
        cards.forEach(card => {
          maxHeight = Math.max(maxHeight, card.offsetHeight);
        });

        cards.forEach(card => {
          card.style.height = `${maxHeight}px`;
        });
      }
    });
  }

  // Utility Functions
  debounce(func, wait) {
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
    };
  }

  // Error Handling
  handleError(error, context) {
    console.error(`Error in ${context}:`, error);

    // Could implement error reporting here
    // this.reportError(error, context);
  }

  // Accessibility Enhancements
  enhanceAccessibility() {
    // Add ARIA labels and roles where needed
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      item.setAttribute('role', 'listitem');
      item.setAttribute('aria-label', `Timeline event ${index + 1}`);
    });

    // Enhanced keyboard navigation
    this.setupKeyboardNavigation();
  }

  setupKeyboardNavigation() {
    // Allow keyboard navigation through interactive elements
    const interactiveElements = document.querySelectorAll(
      '.team-card, .value-card, .timeline-content'
    );

    interactiveElements.forEach(element => {
      element.setAttribute('tabindex', '0');

      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });
  }

  // Public API
  refresh() {
    this.setupIntersectionObservers();
    this.updateCardLayouts();
  }

  destroy() {
    // Cleanup event listeners and observers
    this.initialized = false;
    console.log('About page destroyed');
  }
}

// Initialize About Page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }

  // Initialize About Page
  const aboutPage = new AboutPage();

  // Make it globally accessible for debugging
  window.aboutPage = aboutPage;

  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Page is hidden
    } else {
      // Page is visible, refresh if needed
      aboutPage.refresh();
    }
  });
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (window.aboutPage) {
    window.aboutPage.destroy();
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AboutPage;
}