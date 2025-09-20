/**
 * ARS TEK YAPI - Services Page Specific JavaScript
 * Handles services page interactions and animations
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    initServicesPage();
  });

  function initServicesPage() {
    initServiceNavigation();
    initFAQAccordion();
    initTechStackInteractions();
    initIndustryTags();
    initProcessStepsAnimation();
    initServiceCardsInteraction();
    initServiceCTAButtons();
    initServiceForms();
    initScrollAnimations();
    initBackToTop();
    initLanguageDropdown();
    initMobileMenu();
    initScrollToTop();
  }

  // Services Navigation & Scrolling
  function initServiceNavigation() {
    const serviceNavLinks = document.querySelectorAll('.services-nav-links a[href^="#"]');

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

          // Calculate scroll position accounting for sticky headers
          const headerHeight = 80;
          const serviceNavHeight = 80;
          const offsetTop = targetElement.offsetTop - headerHeight - serviceNavHeight;

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
    }, 16);

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

  // FAQ Accordion Functionality
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
        question.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            question.click();
          }
        });
      }
    });
  }

  // Technology Stack Interactions
  function initTechStackInteractions() {
    const techItems = document.querySelectorAll('.tech-item');

    techItems.forEach((item, index) => {
      // Add hover effects
      item.addEventListener('mouseenter', () => {
        item.style.setProperty('--hover-delay', (index * 50) + 'ms');
      });

      // Add click interaction
      item.addEventListener('click', function() {
        const techName = this.querySelector('span')?.textContent;
        if (techName) {
          console.log(`Tech clicked: ${techName}`);

          // Add click feedback animation
          this.style.transform = 'translateY(-5px) scale(0.95)';
          setTimeout(() => {
            this.style.transform = 'translateY(-5px)';
          }, 150);
        }
      });

      // Make items keyboard accessible
      item.setAttribute('tabindex', '0');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });
  }

  // Industry Tags Interactions
  function initIndustryTags() {
    const industryTags = document.querySelectorAll('.industry-tag');

    industryTags.forEach(tag => {
      tag.addEventListener('click', function() {
        const industry = this.textContent.trim();
        const industrySlug = industry.toLowerCase()
          .replace(/[^a-z0-9\s]/gi, '')
          .replace(/\s+/g, '-');
        window.location.href = `/industries.html#${industrySlug}`;
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

  // Process Steps Animation
  function initProcessStepsAnimation() {
    const processSteps = document.querySelectorAll('.process-step');

    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 200);
        }
      });
    }, observerOptions);

    processSteps.forEach(step => {
      step.style.opacity = '0';
      step.style.transform = 'translateY(30px)';
      step.style.transition = 'all 0.6s ease';
      processObserver.observe(step);
    });
  }

  // Service Cards Interaction
  function initServiceCardsInteraction() {
    const serviceCards = document.querySelectorAll('.service-card, .tech-item, .industry-tag');

    serviceCards.forEach((card, index) => {
      // Add hover effects
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
        card.style.setProperty('--hover-delay', (index * 50) + 'ms');
      });

      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });

      // Add click tracking
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; // Don't interfere with links

        const cardTitle = card.querySelector('h3, .service-title')?.textContent || 'Unknown Service';
        console.log(`Service card clicked: ${cardTitle}`);
      });
    });
  }

  // Service CTA Buttons
  function initServiceCTAButtons() {
    const ctaButtons = document.querySelectorAll('.service-cta, .btn');

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

  // Service Forms
  function initServiceForms() {
    const serviceForms = document.querySelectorAll('form[data-service]');

    serviceForms.forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Basic validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
          } else {
            field.classList.remove('error');
          }
        });

        if (isValid) {
          const serviceType = form.getAttribute('data-service');
          console.log(`Form submitted for service: ${serviceType}`);

          showFormSuccess(form);
        }
      });
    });
  }

  function showFormSuccess(form) {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.textContent = 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.';
    successMessage.style.cssText = `
      background: #10B981;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      text-align: center;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    `;

    form.appendChild(successMessage);
    form.reset();

    // Animate in
    setTimeout(() => {
      successMessage.style.opacity = '1';
      successMessage.style.transform = 'translateY(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
      successMessage.style.opacity = '0';
      successMessage.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        successMessage.remove();
      }, 300);
    }, 5000);
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

  // Back to Top Button
  function initBackToTop() {
    let backToTopBtn = document.querySelector('.services-back-to-top');

    // Create back to top button if it doesn't exist
    if (!backToTopBtn) {
      backToTopBtn = document.createElement('button');
      backToTopBtn.className = 'services-back-to-top';
      backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
      backToTopBtn.setAttribute('aria-label', 'Yukarı çık');
      backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #1B4F72;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
      `;
      document.body.appendChild(backToTopBtn);
    }

    const toggleBackToTopButton = throttle(() => {
      if (window.scrollY > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
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

  // Language Dropdown (same as index.js)
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

  // Mobile Menu (same as index.js)
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

  // Scroll to Top Button (same as index.js)
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

  // Utility Functions (same as index.js)
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

  // Service-specific utility functions
  function scrollToService(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = 80;
      const serviceNavHeight = 80;
      const offsetTop = element.offsetTop - headerHeight - serviceNavHeight;

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

  function showServiceModal(serviceName) {
    const details = getServiceDetails(serviceName);
    if (details) {
      console.log('Show modal for:', details);
      // Modal implementation can be added here
    }
  }

  // Add CSS for animations and effects
  function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .error {
        border-color: #EF4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
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
    `;
    document.head.appendChild(style);
  }

  // Initialize custom styles
  addCustomStyles();

  // Export functions for potential use in other scripts
  window.ServicesPage = {
    scrollToService,
    getServiceDetails,
    showServiceModal
  };

  // Log that services page JS is loaded
  console.log('Services page JavaScript initialized successfully');

})();