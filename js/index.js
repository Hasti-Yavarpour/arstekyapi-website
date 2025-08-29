/**
 * ARS TEK YAPI - Homepage Specific JavaScript
 * Handles homepage interactions and animations
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  ArsTekYapi.utils.ready(() => {
    initHomepage();
  });

  function initHomepage() {
    initHeroAnimations();
    initServiceCards();
    initIndustryCards();
    initPortfolioCards();
    initScrollAnimations();
    initParallaxEffects();
    initContactCTA();
  }

  // Hero Section Animations
  function initHeroAnimations() {
    const heroElements = ArsTekYapi.utils.$$('.hero .animate-pulse');

    heroElements.forEach((element, index) => {
      // Add random movement
      const randomOffset = Math.random() * 50 + 20;
      const animationDuration = (Math.random() * 2 + 2) + 's';

      element.style.setProperty('--random-offset', randomOffset + 'px');
      element.style.animationDuration = animationDuration;

      // Add floating animation
      element.style.animation += ', float-random 8s infinite ease-in-out';
      element.style.animationDelay = (index * 0.5) + 's';
    });

    // Add CSS for floating animation
    if (!document.querySelector('#hero-animations')) {
      const style = document.createElement('style');
      style.id = 'hero-animations';
      style.textContent = `
        @keyframes float-random {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Service Cards Interactions
  function initServiceCards() {
    const serviceCards = ArsTekYapi.utils.$$('.service-card');

    serviceCards.forEach((card, index) => {
      // Add hover sound effect (optional)
      card.addEventListener('mouseenter', () => {
        card.style.setProperty('--hover-delay', (index * 50) + 'ms');
      });

      // Add click tracking
      card.addEventListener('click', () => {
        const serviceName = card.querySelector('h3')?.textContent || 'Unknown Service';
        trackServiceClick(serviceName);
      });

      // Add keyboard navigation
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  // Industry Cards Interactions
  function initIndustryCards() {
    const industryCards = ArsTekYapi.utils.$$('.industry-card');

    industryCards.forEach((card, index) => {
      // Add staggered hover animation
      card.addEventListener('mouseenter', () => {
        // Add ripple effect
        createRippleEffect(card, event);
      });

      // Add click handler
      card.addEventListener('click', (e) => {
        const industryName = card.querySelector('h3')?.textContent || 'Unknown Industry';

        // Navigate to industry-specific page or section
        const industrySlug = industryName.toLowerCase().replace(/[^a-z0-9]/g, '');
        window.location.href = `/industries.html#${industrySlug}`;
      });

      // Make cards keyboard accessible
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${card.querySelector('h3')?.textContent} sektörü hakkında daha fazla bilgi`);
    });
  }

  // Portfolio Cards Interactions
  function initPortfolioCards() {
    const portfolioCards = ArsTekYapi.utils.$$('.card');

    portfolioCards.forEach((card, index) => {
      // Add loading animation on hover
      card.addEventListener('mouseenter', () => {
        const badges = card.querySelectorAll('.badge-outline');
        badges.forEach((badge, i) => {
          setTimeout(() => {
            badge.style.transform = 'scale(1.05)';
          }, i * 100);
        });
      });

      card.addEventListener('mouseleave', () => {
        const badges = card.querySelectorAll('.badge-outline');
        badges.forEach(badge => {
          badge.style.transform = 'scale(1)';
        });
      });

      // Add click handler for portfolio items
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking on a link or button
        if (e.target.closest('a, button')) return;

        const projectTitle = card.querySelector('h3')?.textContent || 'Project';
        const projectSlug = projectTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
        window.location.href = `/portfolio.html#${projectSlug}`;
      });
    });
  }

  // Scroll-based Animations
  function initScrollAnimations() {
    const animatedElements = ArsTekYapi.utils.$$('[data-aos]');
    let lastScrollY = window.scrollY;

    // Custom scroll handler for additional effects
    const handleScroll = ArsTekYapi.utils.throttle(() => {
      const scrollY = window.scrollY;
      const isScrollingDown = scrollY > lastScrollY;

      // Add/remove classes based on scroll direction
      animatedElements.forEach(element => {
        if (ArsTekYapi.utils.isInViewport(element, 100)) {
          element.classList.add('in-view');

          // Add scroll direction class
          if (isScrollingDown) {
            element.classList.add('scroll-down');
            element.classList.remove('scroll-up');
          } else {
            element.classList.add('scroll-up');
            element.classList.remove('scroll-down');
          }
        }
      });

      lastScrollY = scrollY;
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Parallax Effects
  function initParallaxEffects() {
    const hero = ArsTekYapi.utils.$('.hero');
    const floatingElements = ArsTekYapi.utils.$$('.hero .animate-pulse');

    if (!hero) return;

    const handleParallax = ArsTekYapi.utils.throttle(() => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      // Parallax for hero background
      if (scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${rate}px)`;

        // Move floating elements at different speeds
        floatingElements.forEach((element, index) => {
          const speed = (index + 1) * 0.2;
          const yPos = scrolled * speed;
          element.style.transform = `translateY(${yPos}px)`;
        });
      }
    }, 16);

    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  // Contact CTA Interactions
  function initContactCTA() {
    const ctaButtons = ArsTekYapi.utils.$$('.section.bg-tech-gradient .btn');

    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const buttonText = button.textContent.trim();
        trackCTAClick(buttonText);

        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 150);
      });
    });
  }

  // Utility Functions
  function createRippleEffect(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const x = (event?.clientX || rect.left + rect.width / 2) - rect.left;
    const y = (event?.clientY || rect.top + rect.height / 2) - rect.top;

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(27, 79, 114, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      left: ${x - 10}px;
      top: ${y - 10}px;
      width: 20px;
      height: 20px;
      pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    // Add ripple animation if not exists
    if (!document.querySelector('#ripple-animation')) {
      const style = document.createElement('style');
      style.id = 'ripple-animation';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Analytics Tracking Functions
  function trackServiceClick(serviceName) {
    // Google Analytics or other tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'service_click', {
        'service_name': serviceName,
        'page': 'homepage'
      });
    }

    console.log(`Service clicked: ${serviceName}`);
  }

  function trackCTAClick(buttonText) {
    // Google Analytics or other tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'cta_click', {
        'button_text': buttonText,
        'page': 'homepage'
      });
    }

    console.log(`CTA clicked: ${buttonText}`);
  }

  // Performance Monitoring
  function initPerformanceMonitoring() {
    // Monitor page load times
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Homepage load time: ${loadTime}ms`);

        // Track slow page loads
        if (loadTime > 3000) {
          console.warn('Slow page load detected');
          // Send to analytics if needed
        }
      }
    });

    // Monitor scroll performance
    let scrollCount = 0;
    window.addEventListener('scroll', () => {
      scrollCount++;
    }, { passive: true });

    // Log scroll performance every 10 seconds
    setInterval(() => {
      if (scrollCount > 0) {
        console.log(`Scroll events in last 10s: ${scrollCount}`);
        scrollCount = 0;
      }
    }, 10000);
  }

  // Initialize performance monitoring in development
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
    initPerformanceMonitoring();
  }

  // Lazy loading for images (if needed)
  function initLazyLoading() {
    const images = ArsTekYapi.utils.$$('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  }

  // Initialize lazy loading
  initLazyLoading();

  // Service Worker Registration (for PWA functionality)
  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

})();