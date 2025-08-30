/**
 * ARS TEK YAPI - About Page Specific JavaScript
 * Handles about page interactions and animations
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    initAboutPage();
  });

  function initAboutPage() {
    initTimelineAnimations();
    initStatsCounters();
    initTeamCards();
    initValueCards();
    initExpertiseCards();
    initAdvantageCards();
    initScrollProgressBar();
    initParallaxEffects();
    initTypingEffect();
    initIntersectionObserver();
  }

  // Timeline Animations
  function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timelineItems.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';

          // Animate timeline dot
          const dot = entry.target.querySelector('::before');
          setTimeout(() => {
            entry.target.classList.add('timeline-active');
          }, 300);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });

    timelineItems.forEach((item, index) => {
      // Initial state
      item.style.opacity = '0';
      item.style.transform = 'translateX(-30px)';
      item.style.transition = 'all 0.6s ease';
      item.style.transitionDelay = `${index * 0.1}s`;

      observer.observe(item);
    });
  }

  // Stats Counter Animation
  function initStatsCounters() {
    const counters = document.querySelectorAll('.stat-number');

    if (counters.length === 0) return;

    const animateCounter = (element) => {
      const target = parseInt(element.textContent) || 0;
      const suffix = element.textContent.replace(/[0-9]/g, '');
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
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.7
    });

    counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  // Team Cards Interactions
  function initTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');

    teamCards.forEach(card => {
      const avatar = card.querySelector('.team-avatar');
      const socialLinks = card.querySelectorAll('.social-link');

      card.addEventListener('mouseenter', () => {
        // Add hover effects
        socialLinks.forEach((link, index) => {
          setTimeout(() => {
            link.style.transform = 'translateY(-3px) scale(1.1)';
          }, index * 50);
        });
      });

      card.addEventListener('mouseleave', () => {
        socialLinks.forEach(link => {
          link.style.transform = 'translateY(0) scale(1)';
        });
      });

      // Team member modal or detailed view
      card.addEventListener('click', (e) => {
        if (e.target.closest('.social-link')) return;

        const memberName = card.querySelector('.team-name')?.textContent;
        console.log(`Team member clicked: ${memberName}`);

        // Could trigger a modal with more details
        // showTeamMemberModal(memberName);
      });

      // Keyboard accessibility
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  // Value Cards Animations
  function initValueCards() {
    const valueCards = document.querySelectorAll('.value-card');

    valueCards.forEach(card => {
      const icon = card.querySelector('.value-icon');

      card.addEventListener('mouseenter', () => {
        // Create ripple effect
        createRippleEffect(card);

        // Icon animation
        if (icon) {
          icon.style.transform = 'scale(1.1) rotate(10deg)';
        }
      });

      card.addEventListener('mouseleave', () => {
        if (icon) {
          icon.style.transform = 'scale(1) rotate(0deg)';
        }
      });
    });
  }

  // Expertise Cards Interactions
  function initExpertiseCards() {
    const expertiseCards = document.querySelectorAll('.expertise-card');

    expertiseCards.forEach(card => {
      const badges = card.querySelectorAll('.tech-badge');

      card.addEventListener('mouseenter', () => {
        // Animate tech badges sequentially
        badges.forEach((badge, index) => {
          setTimeout(() => {
            badge.style.transform = 'scale(1.05) translateY(-2px)';
            badge.style.boxShadow = '0 4px 12px rgba(27, 79, 114, 0.2)';
          }, index * 100);
        });
      });

      card.addEventListener('mouseleave', () => {
        badges.forEach(badge => {
          badge.style.transform = 'scale(1) translateY(0)';
          badge.style.boxShadow = 'none';
        });
      });

      // Badge click interactions
      badges.forEach(badge => {
        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          const tech = badge.textContent.trim();
          console.log(`Technology clicked: ${tech}`);

          // Could show more info about the technology
          // showTechInfo(tech);
        });
      });
    });
  }

  // Advantage Cards Interactions
  function initAdvantageCards() {
    const advantageCards = document.querySelectorAll('.advantage-card');

    advantageCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        // Add dynamic shadow based on mouse position
        card.addEventListener('mousemove', handleMouseMove);
      });

      card.addEventListener('mouseleave', () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.style.boxShadow = '';
        card.style.transform = 'translateY(-4px)';
      });
    });

    function handleMouseMove(e) {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  }

  // Scroll Progress Bar
  function initScrollProgressBar() {
    let progressBar = document.querySelector('.scroll-progress');

    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress';
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary), var(--tech-blue));
        z-index: 1000;
        transition: width 0.1s ease;
      `;
      document.body.appendChild(progressBar);
    }

    const updateProgress = throttle(() => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      progressBar.style.width = scrollPercent + '%';
    }, 10);

    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  // Parallax Effects for About Page
  function initParallaxEffects() {
    const heroSection = document.querySelector('.about-hero');
    const statsSection = document.querySelector('.stats-section');

    if (!heroSection && !statsSection) return;

    const handleParallax = throttle(() => {
      const scrolled = window.pageYOffset;

      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
          const rate = scrolled * 0.3;
          heroSection.style.transform = `translateY(${rate}px)`;
        }
      }

      if (statsSection) {
        const statsRect = statsSection.getBoundingClientRect();
        if (statsRect.bottom > 0 && statsRect.top < window.innerHeight) {
          const rate = (scrolled - statsSection.offsetTop) * 0.2;
          statsSection.style.backgroundPosition = `center ${rate}px`;
        }
      }
    }, 16);

    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  // Typing Effect for Hero Text
  function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-text');

    typingElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.style.borderRight = '2px solid currentColor';

      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 80);
        } else {
          // Blinking cursor effect
          setInterval(() => {
            element.style.borderRightColor =
              element.style.borderRightColor === 'transparent' ? 'currentColor' : 'transparent';
          }, 500);
        }
      };

      // Start typing after page load
      setTimeout(typeWriter, 500);
    });
  }

  // Intersection Observer for General Animations
  function initIntersectionObserver() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');

          // Add custom classes for additional effects
          if (entry.target.classList.contains('value-card')) {
            setTimeout(() => {
              entry.target.classList.add('card-revealed');
            }, 200);
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  // Utility Functions
  function createRippleEffect(element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = rect.width / 2;
    const y = rect.height / 2;

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(27, 79, 114, 0.1);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
      z-index: 1;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    // Add keyframes if not exists
    if (!document.querySelector('#ripple-keyframes')) {
      const style = document.createElement('style');
      style.id = 'ripple-keyframes';
      style.textContent = `
        @keyframes ripple-animation {
          to {
            transform: scale(2);
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

  // Team Member Modal (optional feature)
  function showTeamMemberModal(memberName) {
    // This could be expanded to show a modal with team member details
    console.log(`Showing modal for: ${memberName}`);

    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <h3>Team Member: ${memberName}</h3>
        <p>Detailed information about ${memberName} would go here.</p>
        <button class="btn btn-primary close-modal">Close</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
      modal.remove();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // Technology Information (optional feature)
  function showTechInfo(tech) {
    console.log(`Showing info for technology: ${tech}`);
    // Could show tooltip or modal with technology information
  }

  // Export functions for potential external use
  window.AboutPage = {
    initStatsCounters,
    createRippleEffect,
    showTeamMemberModal
  };

})();
