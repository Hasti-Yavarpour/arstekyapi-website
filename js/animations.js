/**
 * ANIMATIONS.JS - Hero Animations, Parallax Effects & AOS Customizations
 * ARS TEK YAPI A.Ş. Website
 */

// Animation Configuration
const ANIMATION_CONFIG = {
  duration: {
    fast: 300,
    normal: 500,
    slow: 800,
    verySlow: 1200
  },
  easing: {
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  delays: {
    stagger: 150,
    sequence: 200
  }
};

// Hero Section Animations
class HeroAnimations {
  constructor() {
    this.heroSection = document.querySelector('.hero-section');
    this.heroTitle = document.querySelector('.hero-title');
    this.heroSubtitle = document.querySelector('.hero-subtitle');
    this.heroCTA = document.querySelector('.hero-cta');
    this.heroImage = document.querySelector('.hero-image');
    this.init();
  }

  init() {
    if (this.heroSection) {
      this.setupHeroIntro();
      this.setupTypingEffect();
      this.setupFloatingElements();
    }
  }

  // Hero Introduction Animation
  setupHeroIntro() {
    const elements = [
      { el: this.heroTitle, delay: 0 },
      { el: this.heroSubtitle, delay: ANIMATION_CONFIG.delays.sequence },
      { el: this.heroCTA, delay: ANIMATION_CONFIG.delays.sequence * 2 },
      { el: this.heroImage, delay: ANIMATION_CONFIG.delays.sequence * 1.5 }
    ];

    elements.forEach(({ el, delay }) => {
      if (el) {
        // Start hidden
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';

        setTimeout(() => {
          el.style.transition = `all ${ANIMATION_CONFIG.duration.slow}ms ${ANIMATION_CONFIG.easing.easeOut}`;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
      }
    });
  }

  // Typing Effect for Hero Title
  setupTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const texts = [
      'AI & Yapay Zeka Çözümleri',
      'IoT & Akıllı Sistemler',
      'Özel Yazılım Geliştirme',
      'Fintech Çözümleri'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeWriter = () => {
      const currentText = texts[textIndex];
      const shouldComplete = isDeleting ?
        currentText.substring(0, charIndex - 1) :
        currentText.substring(0, charIndex + 1);

      typingElement.textContent = shouldComplete;

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
      }

      charIndex += isDeleting ? -1 : 1;
      setTimeout(typeWriter, typeSpeed);
    };

    setTimeout(typeWriter, 1000);
  }

  // Floating Elements Animation
  setupFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');

    floatingElements.forEach((element, index) => {
      const delay = index * 500;
      const duration = 3000 + (index * 500);

      setTimeout(() => {
        element.style.animation = `float ${duration}ms ${ANIMATION_CONFIG.easing.easeInOut} infinite`;
      }, delay);
    });
  }
}

// Scroll-based Animations
class ScrollAnimations {
  constructor() {
    this.scrollY = 0;
    this.ticking = false;
    this.init();
  }

  init() {
    this.setupParallax();
    this.setupScrollProgress();
    this.setupCounterAnimations();
    this.setupRevealAnimations();
    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    this.scrollY = window.scrollY;

    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateParallax();
        this.updateScrollProgress();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  // Parallax Effects
  setupParallax() {
    this.parallaxElements = document.querySelectorAll('[data-parallax]');
  }

  updateParallax() {
    this.parallaxElements.forEach(element => {
      const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
      const yPos = -(this.scrollY * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  // Scroll Progress Indicator
  setupScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
      this.progressBar = progressBar;
    } else {
      // Create progress bar if it doesn't exist
      this.progressBar = document.createElement('div');
      this.progressBar.className = 'scroll-progress fixed top-0 left-0 h-1 bg-[#1B4F72] z-50 transition-all duration-300';
      document.body.appendChild(this.progressBar);
    }
  }

  updateScrollProgress() {
    if (!this.progressBar) return;

    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (this.scrollY / documentHeight) * 100;
    this.progressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
  }

  // Counter Animations
  setupCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    const observerOptions = {
      threshold: 0.7,
      rootMargin: '0px 0px -50px 0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          this.animateCounter(entry.target);
          entry.target.classList.add('counted');
        }
      });
    }, observerOptions);

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = parseInt(element.getAttribute('data-duration')) || 2000;
    const suffix = element.getAttribute('data-suffix') || '';

    let start = 0;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);

      element.textContent = current.toLocaleString('tr-TR') + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString('tr-TR') + suffix;
      }
    };

    requestAnimationFrame(updateCounter);
  }

  // Reveal Animations on Scroll
  setupRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(50px)';
      element.style.transition = `all ${ANIMATION_CONFIG.duration.slow}ms ${ANIMATION_CONFIG.easing.easeOut}`;
      revealObserver.observe(element);
    });
  }
}

// Card Hover Animations
class CardAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupServiceCards();
    this.setupIndustryCards();
    this.setupPortfolioCards();
  }

  setupServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
      const icon = card.querySelector('.service-icon');
      const title = card.querySelector('.service-title');

      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(27, 79, 114, 0.15)';

        if (icon) {
          icon.style.transform = 'scale(1.1) rotateY(180deg)';
          icon.style.color = '#1B4F72';
        }

        if (title) {
          title.style.color = '#1B4F72';
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

        if (icon) {
          icon.style.transform = 'scale(1) rotateY(0deg)';
          icon.style.color = '';
        }

        if (title) {
          title.style.color = '';
        }
      });
    });
  }

  setupIndustryCards() {
    const industryCards = document.querySelectorAll('.industry-card');

    industryCards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => {
        // Stagger animation for nearby cards
        const siblingCards = [...industryCards].slice(
          Math.max(0, index - 1),
          Math.min(industryCards.length, index + 2)
        );

        siblingCards.forEach((siblingCard, siblingIndex) => {
          const delay = siblingIndex * 50;
          const scale = siblingCard === card ? 1.05 : 1.02;

          setTimeout(() => {
            siblingCard.style.transform = `scale(${scale})`;
            siblingCard.style.zIndex = siblingCard === card ? '10' : '5';
          }, delay);
        });
      });

      card.addEventListener('mouseleave', () => {
        industryCards.forEach(c => {
          c.style.transform = 'scale(1)';
          c.style.zIndex = '1';
        });
      });
    });
  }

  setupPortfolioCards() {
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    portfolioCards.forEach(card => {
      const image = card.querySelector('.portfolio-image');
      const overlay = card.querySelector('.portfolio-overlay');

      card.addEventListener('mouseenter', () => {
        if (image) {
          image.style.transform = 'scale(1.1)';
        }
        if (overlay) {
          overlay.style.opacity = '1';
          overlay.style.transform = 'translateY(0)';
        }
      });

      card.addEventListener('mouseleave', () => {
        if (image) {
          image.style.transform = 'scale(1)';
        }
        if (overlay) {
          overlay.style.opacity = '0';
          overlay.style.transform = 'translateY(20px)';
        }
      });
    });
  }
}

// Loading Animations
class LoadingAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupPageTransitions();
    this.setupImageLazyLoading();
  }

  setupPageTransitions() {
    // Fade in effect for new page loads
    document.body.style.opacity = '0';
    document.body.style.transition = `opacity ${ANIMATION_CONFIG.duration.normal}ms ease`;

    window.addEventListener('load', () => {
      document.body.style.opacity = '1';
    });
  }

  setupImageLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('opacity-50');
            img.classList.add('opacity-100');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.add('opacity-50', 'transition-opacity', 'duration-500');
        imageObserver.observe(img);
      });
    }
  }
}

// CSS Keyframes (Injected Dynamically)
const injectAnimationCSS = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 20px rgba(27, 79, 114, 0.3);
        transform: scale(1);
      }
      50% {
        box-shadow: 0 0 40px rgba(27, 79, 114, 0.6);
        transform: scale(1.05);
      }
    }

    @keyframes slide-in-bottom {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes fade-in-scale {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    .floating-element {
      animation: float 3s ease-in-out infinite;
    }

    .pulse-glow {
      animation: pulse-glow 2s ease-in-out infinite;
    }

    .slide-in-bottom {
      animation: slide-in-bottom 0.6s ease-out;
    }

    .fade-in-scale {
      animation: fade-in-scale 0.5s ease-out;
    }
  `;
  document.head.appendChild(style);
};

// Initialize Animations
document.addEventListener('DOMContentLoaded', () => {
  // Inject CSS animations
  injectAnimationCSS();

  // Initialize animation classes
  const heroAnimations = new HeroAnimations();
  const scrollAnimations = new ScrollAnimations();
  const cardAnimations = new CardAnimations();
  const loadingAnimations = new LoadingAnimations();

  // Custom AOS settings
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out-cubic',
      once: true,
      offset: 100,
      delay: 0,
      anchorPlacement: 'top-bottom'
    });
  }

  console.log('✨ Animations initialized successfully');
});