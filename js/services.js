/**
 * ARS TEK YAPI - Services Page JavaScript
 * Complete updated version with all fixes
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Services page script loading...');
    initServicesPage();
  });

  function initServicesPage() {
    initNavigation();
    initServiceInteractions();
    initFAQAccordion();
    initScrollAnimations();
    initBackToTop();
    console.log('Services page initialized successfully');
  }

  // ===================================
  // NAVIGATION FUNCTIONALITY
  // ===================================

  function initNavigation() {
    initLanguageDropdown();
    initMobileMenu();
    initServiceNavigation();
  }

  function initLanguageDropdown() {
    const languageBtn = document.getElementById('language-btn');
    const languageMenu = document.getElementById('language-menu');
    const dropdownArrow = document.getElementById('dropdown-arrow');
    const currentLangText = document.getElementById('current-lang-text');
    const currentLangEmoji = document.getElementById('current-lang-emoji');

    console.log('Language elements:', { languageBtn, languageMenu, dropdownArrow });

    // Set initial language display based on URL
    const path = window.location.pathname;
    const isEnglish = path.startsWith('/en/');

    if (currentLangText) {
      currentLangText.textContent = isEnglish ? 'EN' : 'TR';
    }
    if (currentLangEmoji) {
      currentLangEmoji.textContent = isEnglish ? '🇬🇧' : '🇹🇷';
    }

    // Language dropdown functionality
    if (languageBtn && languageMenu) {
      languageBtn.addEventListener('click', function(e) {
        console.log('Language button clicked');
        e.preventDefault();
        e.stopPropagation();

        const isHidden = languageMenu.classList.contains('hidden');

        // Toggle menu
        languageMenu.classList.toggle('hidden');

        // Toggle arrow
        if (dropdownArrow) {
          if (isHidden) {
            dropdownArrow.style.transform = 'rotate(180deg)';
          } else {
            dropdownArrow.style.transform = 'rotate(0deg)';
          }
        }

        // Update aria-expanded
        languageBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!languageBtn.contains(e.target) && !languageMenu.contains(e.target)) {
          languageMenu.classList.add('hidden');
          if (dropdownArrow) {
            dropdownArrow.style.transform = 'rotate(0deg)';
          }
          languageBtn.setAttribute('aria-expanded', 'false');
        }
      });
    } else {
      console.log('Language dropdown elements not found');
    }
  }

  function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    console.log('Mobile menu elements:', { mobileMenuBtn, mobileMenu });

    if (mobileMenuBtn && mobileMenu) {
      let mobileMenuOpen = false;

      mobileMenuBtn.addEventListener('click', function(e) {
        console.log('Mobile menu button clicked');
        e.preventDefault();
        e.stopPropagation();

        mobileMenuOpen = !mobileMenuOpen;

        // Toggle menu
        mobileMenu.classList.toggle('hidden', !mobileMenuOpen);

        // Update aria-expanded
        mobileMenuBtn.setAttribute('aria-expanded', mobileMenuOpen ? 'true' : 'false');
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', function(e) {
        if (mobileMenuOpen && !mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
          mobileMenuOpen = false;
          mobileMenu.classList.add('hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Close mobile menu on window resize to desktop
      window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024 && mobileMenuOpen) {
          mobileMenuOpen = false;
          mobileMenu.classList.add('hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    } else {
      console.log('Mobile menu elements not found');
    }
  }

  function initServiceNavigation() {
    const serviceNavLinks = document.querySelectorAll('.services-nav-links a[href^="#"], .service-hero-tab[href^="#"]');

    serviceNavLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Remove active class from all links
          serviceNavLinks.forEach(navLink => navLink.classList.remove('active'));
          // Add active class to clicked link
          this.classList.add('active');

          // Calculate scroll position accounting for fixed headers
          const headerHeight = 80;
          const offsetTop = targetElement.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });

    // Update active navigation link based on scroll position
    const handleNavScroll = throttle(() => {
      updateActiveNavOnScroll(serviceNavLinks);
    }, 100);

    window.addEventListener('scroll', handleNavScroll, { passive: true });
  }

  function updateActiveNavOnScroll(serviceNavLinks) {
    const serviceSections = document.querySelectorAll('.service-section[id]');
    let currentSection = '';

    serviceSections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        currentSection = section.getAttribute('id');
      }
    });

    serviceNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // ===================================
  // SERVICE PAGE INTERACTIONS
  // ===================================

  function initServiceInteractions() {
    initTechStackInteractions();
    initIndustryTags();
    initServiceCTAButtons();
    initServiceCards();
  }

  function initTechStackInteractions() {
    const techItems = document.querySelectorAll('.tech-item');

    techItems.forEach((item, index) => {
      // Add hover delay for staggered animations
      item.addEventListener('mouseenter', () => {
        item.style.setProperty('--hover-delay', (index * 50) + 'ms');
      });

      // Add click interaction with feedback
      item.addEventListener('click', function() {
        const techName = this.querySelector('span')?.textContent;
        if (techName) {
          console.log(`Tech clicked: ${techName}`);

          // Add click feedback animation
          this.style.transform = 'scale(0.95)';
          setTimeout(() => {
            this.style.transform = '';
          }, 150);
        }
      });

      // Make items keyboard accessible
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `${item.querySelector('span')?.textContent || 'Teknoloji'} hakkında bilgi`);

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });
  }

  function initIndustryTags() {
    const industryTags = document.querySelectorAll('.industry-tag');

    industryTags.forEach(tag => {
      tag.addEventListener('click', function() {
        const industry = this.textContent.trim();
        console.log(`Industry clicked: ${industry}`);

        // Add click feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);

        // Navigate to industries page (you can customize this)
        const industrySlug = industry.toLowerCase()
          .replace(/[^a-z0-9\s]/gi, '')
          .replace(/\s+/g, '-');

        // For now, just log. You can uncomment below to navigate:
        // window.location.href = `/industries.html#${industrySlug}`;
      });

      // Make tags keyboard accessible
      tag.setAttribute('tabindex', '0');
      tag.setAttribute('role', 'button');
      tag.setAttribute('aria-label', `${tag.textContent.trim()} sektörü hakkında daha fazla bilgi`);

      tag.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tag.click();
        }
      });
    });
  }

  function initServiceCTAButtons() {
    const ctaButtons = document.querySelectorAll('.service-cta');

    ctaButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        const buttonText = button.textContent.trim();
        console.log(`Service CTA clicked: ${buttonText}`);

        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = '';
        }, 150);

        // Add ripple effect
        addRippleEffect(this, e);
      });
    });
  }

  function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-demo, .process-step');

    serviceCards.forEach((card, index) => {
      // Add staggered hover effects
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        card.style.setProperty('--hover-delay', (index * 50) + 'ms');
      });

      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
  }

  // ===================================
  // FAQ FUNCTIONALITY
  // ===================================

  function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (question && answer) {
        question.addEventListener('click', function() {
          const isActive = item.classList.contains('active');

          // Close all FAQ items
          faqItems.forEach(faq => {
            faq.classList.remove('active');
            const faqAnswer = faq.querySelector('.faq-answer');
            if (faqAnswer) {
              faqAnswer.style.maxHeight = '0';
            }
          });

          // Open clicked item if it wasn't already active
          if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
          }
        });

        // Add keyboard navigation
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');

        question.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            question.click();
          }
        });
      }
    });
  }

  // ===================================
  // SCROLL ANIMATIONS & EFFECTS
  // ===================================

  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos], .process-step, .service-demo');
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

  function initBackToTop() {
    let backToTopBtn = document.querySelector('.services-back-to-top');

    // Create back to top button if it doesn't exist
    if (!backToTopBtn) {
      backToTopBtn = document.createElement('button');
      backToTopBtn.className = 'services-back-to-top';
      backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
      backToTopBtn.setAttribute('aria-label', 'Yukarı çık');
      document.body.appendChild(backToTopBtn);
    }

    const toggleBackToTopButton = throttle(() => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, 100);

    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', toggleBackToTopButton, { passive: true });
    toggleBackToTopButton(); // Initial check
  }

  // ===================================
  // UTILITY FUNCTIONS
  // ===================================

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

  function addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');

    // Set element position to relative if not already
    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    }
    element.style.overflow = 'hidden';

    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // ===================================
  // PUBLIC API
  // ===================================

  // Service-specific utility functions for external use
  function scrollToService(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = 80;
      const offsetTop = element.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  function getServiceDetails(serviceName) {
    const serviceDetails = {
      'ai-ml': {
        title: 'AI & Makine Öğrenmesi',
        description: 'NLP, tahmine dayalı analitik ve AI sohbet robotları ile iş süreçlerinizi otomatikleştirin.',
        technologies: ['Python', 'TensorFlow', 'scikit-learn', 'OpenAI API'],
        industries: ['Finans', 'Sağlık', 'Perakende', 'İmalat']
      },
      'iot': {
        title: 'IoT Sistemleri & Otomasyon',
        description: 'Sensörler, mikrodenetleyiciler ve kontrol panelleri ile akıllı sistemler.',
        technologies: ['ESP32', 'Raspberry Pi', 'Arduino', 'MQTT'],
        industries: ['Tarım', 'İmalat', 'Akıllı Ev', 'Enerji']
      },
      'web-development': {
        title: 'Web & Uygulama Geliştirme',
        description: 'Yönetici panelleri, e-ticaret ve kontrol panelleri.',
        technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
        industries: ['Perakende', 'Finans', 'Eğitim', 'Sağlık']
      },
      'fintech': {
        title: 'Fintech Çözümleri',
        description: 'Ödeme API\'leri, KYC ve dolandırıcılık önleme araçları.',
        technologies: ['Django', 'PostgreSQL', 'Redis', 'Stripe API'],
        industries: ['Bankacılık', 'Finans', 'E-ticaret', 'Sigortacılık']
      },
      'smart-home': {
        title: 'Akıllı Ev Otomasyonu',
        description: 'Kilitler, iklim, aydınlatma, güneş enerjisi ve kontrol panelleri.',
        technologies: ['ESP32', 'Home Assistant', 'MQTT', 'React Native'],
        industries: ['Gayrimenkul', 'İnşaat', 'Enerji', 'Güvenlik']
      }
    };

    return serviceDetails[serviceName] || null;
  }

  // Export functions for potential use in other scripts
  window.ServicesPage = {
    scrollToService,
    getServiceDetails
  };

  // Add custom styles for animations
  const style = document.createElement('style');
  style.textContent = `
    .in-view {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    .scroll-down {
      animation: slideInUp 0.6s ease-out;
    }

    .scroll-up {
      animation: slideInDown 0.6s ease-out;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }

    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

})();