/**
 * ARS TEK YAPI - Homepage Specific JavaScript
 * Handles homepage interactions and animations
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    initHomepage();
  });

  function initHomepage() {
    initCounterAnimations();
    initTypingAnimation();
    initHeroAnimations();
    initServiceCards();
    initIndustryCards();
    initPortfolioCards();
    initScrollAnimations();
    initParallaxEffects();
    initContactCTA();
    initLanguageDropdown();
    initMobileMenu();
    initScrollToTop();
  }

  // Counter Animation
  function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    const options = {
      threshold: 0.7
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'));
          const suffix = counter.getAttribute('data-suffix') || '';

          animateCounter(counter, target, suffix);
          observer.unobserve(counter);
        }
      });
    }, options);

    counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  function animateCounter(element, target, suffix) {
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

  // Typing Animation for Hero Text
  function initTypingAnimation() {
    const typingElements = document.querySelectorAll('.typing-text');

    typingElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.style.borderRight = '3px solid #fff';

      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        } else {
          // Start blinking cursor animation
          element.classList.add('typing-complete');
        }
      };

      // Start typing after a short delay
      setTimeout(typeWriter, 1000);
    });
  }

  // Hero Section Animations
  function initHeroAnimations() {
    const heroElements = document.querySelectorAll('.floating-element');

    heroElements.forEach((element, index) => {
      // Add random movement variation
      const randomOffset = Math.random() * 50 + 20;
      const animationDuration = (Math.random() * 2 + 4) + 's';

      element.style.setProperty('--random-offset', randomOffset + 'px');
      element.style.animationDuration = animationDuration;
      element.style.animationDelay = (index * 0.5) + 's';
    });
  }

  // Service Cards Interactions
  function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach((card, index) => {
      // Add hover effects
      card.addEventListener('mouseenter', () => {
        card.style.setProperty('--hover-delay', (index * 50) + 'ms');
      });

      // Add click tracking
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; // Don't interfere with links

        const serviceName = card.querySelector('.service-title')?.textContent || 'Unknown Service';
        console.log(`Service clicked: ${serviceName}`);

        // Optional: Navigate to services page
        const link = card.querySelector('a');
        if (link) {
          window.location.href = link.href;
        }
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
    const industryCards = document.querySelectorAll('.industry-card');

    industryCards.forEach((card, index) => {
      // Add click handler
      card.addEventListener('click', (e) => {
        const industryName = card.querySelector('h3')?.textContent || 'Unknown Industry';

        // Navigate to industry-specific page or section
        const industrySlug = industryName.toLowerCase()
          .replace(/[^a-z0-9\s]/gi, '')
          .replace(/\s+/g, '-');
        window.location.href = `/industries.html#${industrySlug}`;
      });

      // Make cards keyboard accessible
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${card.querySelector('h3')?.textContent} sektörü hakkında daha fazla bilgi`);

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  // Portfolio Cards Interactions
  function initPortfolioCards() {
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    portfolioCards.forEach((card, index) => {
      // Add hover effects for badges
      card.addEventListener('mouseenter', () => {
        const badges = card.querySelectorAll('.badge, [class*="bg-"][class*="text-"]');
        badges.forEach((badge, i) => {
          setTimeout(() => {
            badge.style.transform = 'scale(1.05)';
          }, i * 100);
        });
      });

      card.addEventListener('mouseleave', () => {
        const badges = card.querySelectorAll('.badge, [class*="bg-"][class*="text-"]');
        badges.forEach(badge => {
          badge.style.transform = 'scale(1)';
        });
      });

      // Add click handler for portfolio items
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking on a link or button
        if (e.target.closest('a, button')) return;

        const projectTitle = card.querySelector('h3')?.textContent || 'Project';
        const projectSlug = projectTitle.toLowerCase()
          .replace(/[^a-z0-9\s]/gi, '')
          .replace(/\s+/g, '-');
        window.location.href = `/portfolio.html#${projectSlug}`;
      });
    });
  }

  // Scroll-based Animations
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    let lastScrollY = window.scrollY;

    // Custom scroll handler for additional effects
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      const isScrollingDown = scrollY > lastScrollY;

      // Add/remove classes based on scroll direction
      animatedElements.forEach(element => {
        if (isInViewport(element, 100)) {
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
    const hero = document.querySelector('.hero-section');
    const floatingElements = document.querySelectorAll('.floating-element');

    if (!hero) return;

    const handleParallax = throttle(() => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3;

      // Parallax for hero background
      if (scrolled < window.innerHeight) {
        // Move floating elements at different speeds
        floatingElements.forEach((element, index) => {
          const speed = (index + 1) * 0.15;
          const yPos = scrolled * speed;
          element.style.transform = `translateY(${yPos}px)`;
        });
      }
    }, 16);

    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  // Contact CTA Interactions
  function initContactCTA() {
    const ctaButtons = document.querySelectorAll('.gradient-bg .btn');

    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const buttonText = button.textContent.trim();
        console.log(`CTA clicked: ${buttonText}`);

        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = '';
        }, 150);
      });
    });
  }

  // Language Dropdown
  function initLanguageDropdown() {
    const languageBtn = document.getElementById('language-btn');
    const languageMenu = document.getElementById('language-menu');
    const dropdownArrow = document.getElementById('dropdown-arrow');

    if (languageBtn && languageMenu) {
      languageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = languageMenu.classList.contains('hidden');

        if (isHidden) {
          languageMenu.classList.remove('hidden');
          dropdownArrow?.classList.add('rotate-180');
        } else {
          languageMenu.classList.add('hidden');
          dropdownArrow?.classList.remove('rotate-180');
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!languageBtn.contains(e.target) && !languageMenu.contains(e.target)) {
          languageMenu.classList.add('hidden');
          dropdownArrow?.classList.remove('rotate-180');
        }
      });
    }
  }

  // Mobile Menu
  function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');

        if (isHidden) {
          mobileMenu.classList.remove('hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'true');
        } else {
          mobileMenu.classList.add('hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
          mobileMenu.classList.add('hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  // Scroll to Top Button
  function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');

    if (scrollTopBtn) {
      // Show/hide button based on scroll position
      window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 300) {
          scrollTopBtn.classList.add('show');
        } else {
          scrollTopBtn.classList.remove('show');
        }
      }, 100));

      // Smooth scroll to top
      scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // Utility Functions
  function throttle(func, limit) {
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
  }

  function isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.top <= windowHeight - threshold &&
      rect.bottom >= threshold &&
      rect.left <= windowWidth - threshold &&
      rect.right >= threshold
    );
  }

})();