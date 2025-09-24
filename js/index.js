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
    // NOTE: Language dropdown, mobile menu, and scroll-to-top are now unified in global.js
    // so we intentionally do NOT call any local initializers here.
  }

  // Counter Animation
  function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    const options = { threshold: 0.7 };

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

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(element, target, suffix) {
    let current = 0;
    const frames = 60;
    const increment = target / frames;
    const duration = 2000; // 2s
    const stepTime = duration / frames;

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
          element.classList.add('typing-complete');
        }
      };

      setTimeout(typeWriter, 1000);
    });
  }

  // Hero Section Animations
  function initHeroAnimations() {
    const heroElements = document.querySelectorAll('.floating-element');

    heroElements.forEach((element, index) => {
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
      card.addEventListener('mouseenter', () => {
        card.style.setProperty('--hover-delay', (index * 50) + 'ms');
      });

      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        const serviceName = card.querySelector('.service-title')?.textContent || 'Unknown Service';
        console.log(`Service clicked: ${serviceName}`);

        const link = card.querySelector('a');
        if (link) window.location.href = link.href;
      });

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

    industryCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        const industryName = card.querySelector('h3')?.textContent || 'Unknown Industry';
        const industrySlug = industryName.toLowerCase()
          .replace(/[^a-z0-9\s]/gi, '')
          .replace(/\s+/g, '-');
        window.location.href = `/industries.html#${industrySlug}`;
      });

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

    portfolioCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const badges = card.querySelectorAll('.badge, [class*="bg-"][class*="text-"]');
        badges.forEach((badge, i) => {
          setTimeout(() => { badge.style.transform = 'scale(1.05)'; }, i * 100);
        });
      });

      card.addEventListener('mouseleave', () => {
        const badges = card.querySelectorAll('.badge, [class*="bg-"][class*="text-"]');
        badges.forEach(badge => { badge.style.transform = 'scale(1)'; });
      });

      card.addEventListener('click', (e) => {
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

    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      const isScrollingDown = scrollY > lastScrollY;

      animatedElements.forEach(element => {
        if (isInViewport(element, 100)) {
          element.classList.add('in-view');

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

      if (scrolled < window.innerHeight) {
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
      button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();
        console.log(`CTA clicked: ${buttonText}`);
        button.style.transform = 'scale(0.95)';
        setTimeout(() => { button.style.transform = ''; }, 150);
      });
    });
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
