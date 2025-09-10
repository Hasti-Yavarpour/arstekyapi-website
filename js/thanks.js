/**
 * Thanks Page JavaScript Functionality
 * Handles countdown timer, auto-redirect, and page interactions
 */

class ThanksPage {
  constructor() {
    this.countdown = 10;
    this.redirectUrl = '/index.html';
    this.countdownInterval = null;
    this.isRedirecting = false;

    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupPage();
      });
    } else {
      this.setupPage();
    }
  }

  setupPage() {
    // Get URL parameters to check for form submission data
    this.parseURLParams();

    // Start countdown timer
    this.startCountdown();

    // Setup event listeners
    this.setupEventListeners();

    // Initialize animations
    this.initAnimations();

    // Track page view (analytics placeholder)
    this.trackPageView();
  }

  parseURLParams() {
    const urlParams = new URLSearchParams(window.location.search);

    // Check if there's a custom redirect URL
    const redirectTo = urlParams.get('redirect');
    if (redirectTo) {
      this.redirectUrl = redirectTo;
    }

    // Check if there's a custom countdown time
    const countdownTime = urlParams.get('countdown');
    if (countdownTime && !isNaN(countdownTime) && countdownTime > 0) {
      this.countdown = parseInt(countdownTime);
    }

    // Get form data if available (for personalization)
    const userName = urlParams.get('name');
    const userEmail = urlParams.get('email');
    const userSector = urlParams.get('sector');

    this.personalizeMessage(userName, userEmail, userSector);
  }

  personalizeMessage(name, email, sector) {
    // Personalize the thank you message if user data is available
    const thankYouTitle = document.querySelector('.thanks-title');
    const thankYouMessage = document.querySelector('.thanks-message');

    if (name && thankYouTitle) {
      thankYouTitle.innerHTML = `Teşekkürler ${name}!`;
    }

    if (sector && thankYouMessage) {
      const sectorText = this.getSectorText(sector);
      if (sectorText) {
        thankYouMessage.innerHTML += ` ${sectorText} sektöründeki deneyimimizle size en uygun çözümleri sunacağız.`;
      }
    }
  }

  getSectorText(sector) {
    const sectorMap = {
      'finance': 'Fintech ve bankacılık',
      'manufacturing': 'İmalat ve endüstri',
      'healthcare': 'Sağlık teknolojileri',
      'retail': 'E-ticaret ve perakende',
      'real-estate': 'Akıllı ev ve inşaat',
      'transportation': 'Lojistik ve taşımacılık',
      'agriculture': 'Tarım teknolojileri',
      'education': 'Eğitim teknolojileri',
      'hospitality': 'Otelcilik ve turizm',
      'energy': 'Enerji ve kamu hizmetleri'
    };

    return sectorMap[sector] || null;
  }

  startCountdown() {
    // Update initial countdown display
    this.updateCountdownDisplay();

    // Start the countdown interval
    this.countdownInterval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        this.handleRedirect();
      } else {
        this.updateCountdownDisplay();
      }
    }, 1000);
  }

  updateCountdownDisplay() {
    const countdownElement = document.getElementById('countdown-number');
    const progressBar = document.querySelector('.progress-bar');

    if (countdownElement) {
      countdownElement.textContent = this.countdown;

      // Add pulse animation on each update
      countdownElement.style.transform = 'scale(1.1)';
      setTimeout(() => {
        countdownElement.style.transform = 'scale(1)';
      }, 150);
    }

    // Update progress bar
    if (progressBar) {
      const initialTime = parseInt(progressBar.dataset.initialTime) || 10;
      const progressPercentage = (this.countdown / initialTime) * 100;
      progressBar.style.width = `${progressPercentage}%`;
    }
  }

  handleRedirect() {
    if (this.isRedirecting) return;

    this.isRedirecting = true;

    // Clear the interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    // Show redirecting message
    const countdownContainer = document.querySelector('.countdown-container');
    if (countdownContainer) {
      countdownContainer.innerHTML = `
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
          <span class="text-white font-semibold">Ana sayfaya yönlendiriliyorsunuz...</span>
        </div>
      `;
    }

    // Redirect after a short delay for UX
    setTimeout(() => {
      window.location.href = this.redirectUrl;
    }, 1500);
  }

  setupEventListeners() {
    // Handle manual navigation buttons
    const homeButton = document.getElementById('home-button');
    const contactButton = document.getElementById('contact-button');
    const cancelRedirectButton = document.getElementById('cancel-redirect');

    if (homeButton) {
      homeButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.stopCountdownAndRedirect('/index.html');
      });
    }

    if (contactButton) {
      contactButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.stopCountdownAndRedirect('/contact.html');
      });
    }

    if (cancelRedirectButton) {
      cancelRedirectButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.cancelAutoRedirect();
      });
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.stopCountdown();
    });

    // Handle page visibility change (stop countdown when tab is not active)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseCountdown();
      } else {
        this.resumeCountdown();
      }
    });
  }

  stopCountdownAndRedirect(url) {
    this.stopCountdown();
    window.location.href = url;
  }

  stopCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  pauseCountdown() {
    this.stopCountdown();
  }

  resumeCountdown() {
    if (!this.isRedirecting && this.countdown > 0) {
      this.startCountdown();
    }
  }

  cancelAutoRedirect() {
    this.stopCountdown();

    const countdownContainer = document.querySelector('.countdown-container');
    if (countdownContainer) {
      countdownContainer.innerHTML = `
        <div class="text-center">
          <i class="fas fa-pause text-2xl text-orange-400 mb-2"></i>
          <p class="text-white font-semibold">Otomatik yönlendirme durduruldu</p>
          <p class="text-blue-200 text-sm mt-1">İstediğiniz zaman menüden gezinebilirsiniz</p>
        </div>
      `;
    }

    // Show notification
    this.showNotification('Otomatik yönlendirme iptal edildi', 'info');
  }

  initAnimations() {
    // Trigger entrance animations
    setTimeout(() => {
      const successIcon = document.querySelector('.success-icon');
      if (successIcon) {
        successIcon.style.animation = 'successPulse 2s ease-in-out infinite';
      }
    }, 300);

    // Animate step cards on scroll
    this.observeStepCards();
  }

  observeStepCards() {
    const stepCards = document.querySelectorAll('.step-card');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = `fadeInUp 0.6s ease-out ${index * 0.2}s both`;
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      stepCards.forEach(card => observer.observe(card));
    }
  }

  showNotification(message, type = 'success') {
    // Create and show a notification
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;

    const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    notification.classList.add(bgColor);

    notification.innerHTML = `
      <div class="flex items-center text-white">
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle mr-3"></i>
        <span class="font-medium">${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Slide in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto hide after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(full)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  trackPageView() {
    // Placeholder for analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: 'Thank You Page',
        page_location: window.location.href
      });
    }

    // Track form submission success
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submission', {
        event_category: 'engagement',
        event_label: 'contact_form_success'
      });
    }
  }
}

// Initialize the thanks page when script loads
const thanksPage = new ThanksPage();

// Export for potential external use
window.ThanksPage = ThanksPage;