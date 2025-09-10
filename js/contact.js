/**
 * ARS TEK YAPI - Contact Page JavaScript
 * Contact form functionality with Formspree integration
 * Language-aware version with full dropdown support
 */

window.ARS = window.ARS || {};

// Contact page app object
window.ContactApp = {
  // Configuration
  config: {
    formspreeEndpoint: 'https://formspree.io/f/mgvldorz',
    maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
    allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'],
    maxFiles: 3
  },

  // State
  state: {
    uploadedFiles: [],
    isSubmitting: false,
    currentLanguage: 'tr' // default to Turkish
  },

  // Localized messages
  messages: {
    tr: {
      required: 'Bu alan zorunludur.',
      email: 'Geçerli bir e-posta adresi giriniz.',
      tooShort: (min) => `En az ${min} karakter olmalıdır.`,
      tooLong: (max) => `En fazla ${max} karakter olabilir.`,
      invalid: 'Geçersiz değer.',
      bannerTitle: 'Hata:',
      bannerBody: 'Lütfen form hatalarını düzeltin.',
      submitting: 'Gönderiliyor...',
      submitError: 'Form gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz veya doğrudan e-posta ile iletişime geçin.'
    },
    en: {
      required: 'This field is required.',
      email: 'Please enter a valid email address.',
      tooShort: (min) => `Must be at least ${min} characters.`,
      tooLong: (max) => `Must be at most ${max} characters.`,
      invalid: 'Invalid value.',
      bannerTitle: 'Error:',
      bannerBody: 'Please correct the form errors.',
      submitting: 'Sending...',
      submitError: 'An error occurred while sending the form. Please try again or contact us directly via email.'
    }
  },

  // Sector options (language-aware)
  sectors: {
    tr: [
      { value: '', text: 'Sektörünüzü seçin...', disabled: true },
      { value: 'healthcare', text: 'Sağlık & Tıp' },
      { value: 'manufacturing', text: 'İmalat & Endüstri' },
      { value: 'retail', text: 'Perakende & E-ticaret' },
      { value: 'finance', text: 'Finans & Bankacılık' },
      { value: 'transportation', text: 'Taşımacılık & Lojistik' },
      { value: 'real-estate', text: 'Gayrimenkul & İnşaat' },
      { value: 'agriculture', text: 'Tarım & Gıda' },
      { value: 'education', text: 'Eğitim & Öğretim' },
      { value: 'hospitality', text: 'Otelcilik & Turizm' },
      { value: 'energy', text: 'Enerji & Kamu Hizmetleri' },
      { value: 'technology', text: 'Teknoloji & Yazılım' },
      { value: 'other', text: 'Diğer' }
    ],
    en: [
      { value: '', text: 'Select your industry...', disabled: true },
      { value: 'healthcare', text: 'Healthcare & Medical' },
      { value: 'manufacturing', text: 'Manufacturing & Industry' },
      { value: 'retail', text: 'Retail & E-commerce' },
      { value: 'finance', text: 'Finance & Banking' },
      { value: 'transportation', text: 'Transportation & Logistics' },
      { value: 'real-estate', text: 'Real Estate & Construction' },
      { value: 'agriculture', text: 'Agriculture & Food' },
      { value: 'education', text: 'Education & Training' },
      { value: 'hospitality', text: 'Hospitality & Tourism' },
      { value: 'energy', text: 'Energy & Utilities' },
      { value: 'technology', text: 'Technology & Software' },
      { value: 'other', text: 'Other' }
    ]
  },

  // FAQ data (language-aware)
  faqs: {
    tr: [
      {
        question: 'Proje süreçleriniz nasıl işliyor?',
        answer: 'Projelerimiz analiz, tasarım, geliştirme, test ve teslim aşamalarından oluşur. Her aşamada müşterimizle yakın çalışarak şeffaf bir süreç yürütüyoruz.'
      },
      {
        question: 'Hangi teknolojileri kullanıyorsunuz?',
        answer: 'AI/ML için Python ve TensorFlow, IoT için ESP32 ve Raspberry Pi, web geliştirme için React ve Django kullanıyoruz. Projenize en uygun teknoloji yığınını öneriyoruz.'
      },
      {
        question: 'Proje süresi ne kadar sürer?',
        answer: 'Proje karmaşıklığına göre değişir. Basit IoT projeleri 2-4 hafta, kapsamlı AI entegrasyonları 2-6 ay sürebilir. İlk görüşmede size detaylı zaman çizelgesi sunuyoruz.'
      },
      {
        question: 'Destek hizmetleriniz nelerdir?',
        answer: '7/24 teknik destek, düzenli bakım, güncelleme hizmetleri ve eğitim programları sunuyoruz. Teslim sonrası 1 yıl garanti kapsamındayız.'
      },
      {
        question: 'Fiyatlandırma nasıl çalışıyor?',
        answer: 'Her proje için özel teklifler hazırlıyoruz. İlk danışmanlık ücretsizdir. Proje kapsamı belirlendikten sonra sabit fiyat veya zaman bazlı fiyatlandırma seçenekleri sunuyoruz.'
      }
    ],
    en: [
      {
        question: 'How do your project processes work?',
        answer: 'Our process begins with a detailed analysis of your needs. We conduct a free consultation, create a customized project plan, develop with regular feedback, and provide post-launch support. Each project follows agile methodology for maximum efficiency.'
      },
      {
        question: 'What technologies do you use?',
        answer: 'We use cutting-edge technologies including Python, Node.js, React, AI frameworks (TensorFlow, PyTorch), IoT platforms (ESP32, Raspberry Pi), cloud services (AWS, Azure), and industry-specific tools. Technology selection depends on your specific project requirements.'
      },
      {
        question: 'How long do projects take?',
        answer: 'It varies depending on project complexity. Simple IoT projects take 2-4 weeks, comprehensive AI integrations can take 2-6 months. We provide you with a detailed timeline during the initial consultation.'
      },
      {
        question: 'What support services do you provide?',
        answer: 'We offer 24/7 technical support, regular system maintenance, security updates, performance optimization, staff training, and emergency response services. Support packages are customized according to your needs.'
      },
      {
        question: 'Do you provide cost estimates?',
        answer: 'Yes, we provide free detailed cost estimates. After understanding your requirements, we prepare a comprehensive proposal including development costs, infrastructure requirements, and ongoing maintenance fees.'
      },
      {
        question: 'Can you work with existing systems?',
        answer: 'Absolutely! We specialize in system integration and can seamlessly connect new solutions with your existing infrastructure. We ensure minimal disruption to your current operations during the integration process.'
      }
    ]
  },

  // Detect current language from page
  detectLanguage: function() {
    // Check data-lang attribute on body
    const body = document.body;
    if (body.getAttribute('data-lang')) {
      this.state.currentLanguage = body.getAttribute('data-lang');
      return this.state.currentLanguage;
    }

    // Check URL path
    const path = window.location.pathname;
    if (path.includes('/en/')) {
      this.state.currentLanguage = 'en';
    } else {
      this.state.currentLanguage = 'tr';
    }

    return this.state.currentLanguage;
  },

  // Get localized message
  getMessage: function(key, ...args) {
    const lang = this.state.currentLanguage;
    const msgPack = this.messages[lang] || this.messages.tr;

    if (typeof msgPack[key] === 'function') {
      return msgPack[key](...args);
    }

    return msgPack[key] || key;
  },

  // Show banner error above form
  showBannerError: function(customMessage) {
    const banner = document.getElementById('form-error-banner');
    if (!banner) return;

    // Set text
    const strongEl = banner.querySelector('strong');
    const spanEl = banner.querySelector('span');
    if (strongEl) strongEl.textContent = this.getMessage('bannerTitle');
    if (spanEl) spanEl.textContent = customMessage || this.getMessage('bannerBody');

    // Reveal
    banner.classList.remove('hidden');

    // Scroll to banner
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  hideBannerError: function() {
    const banner = document.getElementById('form-error-banner');
    if (banner) banner.classList.add('hidden');
  },

  // Initialize navigation functionality
  initNavigation: function() {
    // Language dropdown elements
    const languageBtn = document.getElementById('language-btn');
    const languageMenu = document.getElementById('language-menu');
    const dropdownArrow = document.getElementById('dropdown-arrow');

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Language dropdown toggle
    if (languageBtn && languageMenu) {
      languageBtn.addEventListener('click', function(e) {
        e.stopPropagation();

        // Toggle dropdown visibility
        languageMenu.classList.toggle('hidden');

        // Rotate arrow
        if (dropdownArrow) {
          dropdownArrow.classList.toggle('rotate-180');
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!languageBtn.contains(e.target) && !languageMenu.contains(e.target)) {
          languageMenu.classList.add('hidden');
          if (dropdownArrow) {
            dropdownArrow.classList.remove('rotate-180');
          }
        }
      });
    }

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu?.querySelectorAll('a');
    if (mobileLinks) {
      mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
          mobileMenu.classList.add('hidden');
        });
      });
    }
  },

  // Initialize contact page
  init: function() {
    this.detectLanguage();
    this.initNavigation();
    this.populateSectorDropdown();
    this.setupEventListeners();
    this.initFormValidation();
    this.renderFAQs();
  },

  // Populate sector dropdown
  populateSectorDropdown: function() {
    const select = document.getElementById('sector-select');
    if (!select) return;

    const lang = this.state.currentLanguage;
    const sectorList = this.sectors[lang] || this.sectors.tr;

    select.innerHTML = '';
    sectorList.forEach(sector => {
      const option = document.createElement('option');
      option.value = sector.value;
      option.textContent = sector.text;
      if (sector.disabled) option.disabled = true;
      if (sector.value === '') option.selected = true;
      select.appendChild(option);
    });
  },

  // Setup event listeners
  setupEventListeners: function() {
    // Contact form submission
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit(e);
      });
    }

    // Real-time form validation
    const inputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
    inputs.forEach(input => {
      input.addEventListener('blur', (e) => {
        this.validateField(e.target);
      });

      input.addEventListener('input', (e) => {
        this.clearFieldError(e.target);
      });
    });
  },

  // Initialize form validation
  initFormValidation: function() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('invalid', (e) => {
        e.preventDefault();
        this.showFieldError(input, this.getValidationMessage(input));
      });
    });
  },

  getValidationMessage: function(input) {
    const validity = input.validity;

    if (validity.valueMissing) {
      return this.getMessage('required');
    }
    if (validity.typeMismatch) {
      if (input.type === 'email') return this.getMessage('email');
    }
    if (validity.tooShort) {
      return this.getMessage('tooShort', input.minLength);
    }
    if (validity.tooLong) {
      return this.getMessage('tooLong', input.maxLength);
    }

    return this.getMessage('invalid');
  },

  // Validate individual field
  validateField: function(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    // Clear previous errors
    this.clearFieldError(field);

    // Required field check
    if (field.hasAttribute('required') && !value) {
      message = this.getMessage('required');
      isValid = false;
    }

    // Email validation
    if (field.type === 'email' && value && !this.isValidEmail(value)) {
      message = this.getMessage('email');
      isValid = false;
    }

    // Name validation (minimum 2 characters)
    if (field.name === 'name' && value && value.length < 2) {
      message = this.getMessage('tooShort', 2);
      isValid = false;
    }

    // Message validation (minimum 10 characters)
    if (field.name === 'message' && value && value.length < 10) {
      message = this.getMessage('tooShort', 10);
      isValid = false;
    }

    if (!isValid) {
      this.showFieldError(field, message);
    }

    return isValid;
  },

  // Show field error
  showFieldError: function(field, message) {
    field.classList.add('error');
    field.classList.remove('border-gray-300');
    field.classList.add('border-red-500');

    // Remove existing error
    const existingError = field.parentNode.querySelector('.form-error, .error-message');
    if (existingError) {
      existingError.remove();
    }

    // Add new error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error error-message flex items-center text-red-600 text-sm mt-1';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i>${message}`;
    field.parentNode.appendChild(errorDiv);
  },

  // Clear field error
  clearFieldError: function(field) {
    field.classList.remove('error');
    field.classList.remove('border-red-500');
    field.classList.add('border-gray-300');

    const errorDiv = field.parentNode.querySelector('.form-error, .error-message');
    if (errorDiv) errorDiv.remove();

    // If no fields have error class, hide the top banner
    const anyError = document.querySelector('.form-input.error, .form-textarea.error, .form-select.error');
    if (!anyError) this.hideBannerError();
  },

  // Email validation utility
  isValidEmail: function(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  },

  // Show general error message
  showError: function(message) {
    // You can implement a toast notification or modal here
    alert(message); // Simple implementation
  },

  // Handle form submission
  handleFormSubmit: async function(event) {
    const form = event.target;

    if (this.state.isSubmitting) return;

    // Validate all fields
    const inputs = form.querySelectorAll('.form-input, .form-textarea, .form-select');
    let isFormValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      // Show banner and scroll to it
      this.showBannerError();

      // Focus the first invalid field
      const firstInvalid = form.querySelector('.form-input.error, .form-textarea.error, .form-select.error')
                           || form.querySelector(':invalid');
      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: true });
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Show loading state
    this.state.isSubmitting = true;
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span>${this.getMessage('submitting')}`;
    form.classList.add('form-loading');

    try {
      const formData = new FormData(form);

      // Add sector info
      const sectorSelect = form.querySelector('#sector-select');
      const lang = this.state.currentLanguage;
      const sectorList = this.sectors[lang] || this.sectors.tr;
      const selectedSector = sectorList.find(s => s.value === sectorSelect.value);
      if (selectedSector) {
        formData.append('sector_name', selectedSector.text);
      }

      // Add language info
      formData.append('form_language', lang);

      // Set the correct redirect URL based on language
      const baseUrl = window.location.origin;
      const redirectUrl = lang === 'en' ? `${baseUrl}/en/thanks.html` : `${baseUrl}/thanks.html`;

      // Update the hidden field
      const nextField = form.querySelector('input[name="_next"]');
      if (nextField) {
        nextField.value = redirectUrl;
      }

      // Add metadata
      const subjectPrefix = lang === 'en' ? 'New Contact Form - ARS TEK YAPI' : 'Yeni İletişim Formu - ARS TEK YAPI';
      formData.append('_subject', subjectPrefix);
      formData.append('_replyto', formData.get('email'));

      // Submit to Formspree
      const response = await fetch(this.config.formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Hide any previous error banner
        this.hideBannerError();

        // Redirect to the correct thank you page
        window.location.href = redirectUrl;
      } else {
        const data = await response.json().catch(() => null);
        const msg = data?.errors?.map(e => e.message).join('\n')
                || data?.message
                || `HTTP ${response.status} – Form submission failed`;
        throw new Error(msg);
      }

    } catch (error) {
      console.error('Form submission error:', error);
      this.showError(error.message || this.getMessage('submitError'));
    } finally {
      // Reset loading state
      this.state.isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      form.classList.remove('form-loading');
    }
  },

  // Reset form
  resetForm: function(form) {
    form.reset();
    this.state.uploadedFiles = [];

    // Clear all errors
    const errors = form.querySelectorAll('.form-error, .error-message');
    errors.forEach(error => error.remove());

    const inputsWithError = form.querySelectorAll('.error');
    inputsWithError.forEach(input => input.classList.remove('error'));
  },

  // Render FAQs
  renderFAQs: function() {
    const container = document.querySelector('.faq-container');
    if (!container) return;

    const lang = this.state.currentLanguage;
    const faqList = this.faqs[lang] || this.faqs.tr;

    const faqsHtml = faqList.map((faq, index) => `
      <div class="faq-item border-b border-gray-200">
        <button class="faq-question w-full text-left py-6 flex justify-between items-center hover:text-brand-primary transition-colors" data-faq="${index}">
          <span class="text-lg font-semibold text-gray-900">${faq.question}</span>
          <svg class="faq-arrow w-6 h-6 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div class="faq-answer pb-6" style="display: none;" data-faq="${index}">
          <p class="text-gray-600 leading-relaxed">
            ${faq.answer}
          </p>
        </div>
      </div>
    `).join('');

    container.innerHTML = faqsHtml;

    // Add FAQ event listeners after rendering
    this.initFAQEventListeners();
  },

  // Initialize FAQ event listeners
  initFAQEventListeners: function() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
      question.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleFAQ(question);
      });
    });
  },

  // Toggle FAQ
  toggleFAQ: function(questionElement) {
    const faqIndex = questionElement.dataset.faq;
    const answerElement = document.querySelector(`.faq-answer[data-faq="${faqIndex}"]`);
    const arrow = questionElement.querySelector('.faq-arrow');

    if (!answerElement) return;

    // Close other FAQs first
    const allQuestions = document.querySelectorAll('.faq-question');
    const allAnswers = document.querySelectorAll('.faq-answer');
    const allArrows = document.querySelectorAll('.faq-arrow');

    allQuestions.forEach((q, i) => {
      if (q !== questionElement) {
        q.classList.remove('text-brand-primary');
      }
    });

    allAnswers.forEach((a, i) => {
      if (a !== answerElement) {
        a.style.display = 'none';
      }
    });

    allArrows.forEach((arr, i) => {
      if (arr !== arrow) {
        arr.classList.remove('rotate-180');
      }
    });

    // Toggle current FAQ
    const isOpen = answerElement.style.display === 'block';

    if (isOpen) {
      // Close current FAQ
      answerElement.style.display = 'none';
      questionElement.classList.remove('text-brand-primary');
      if (arrow) arrow.classList.remove('rotate-180');
    } else {
      // Open current FAQ
      answerElement.style.display = 'block';
      questionElement.classList.add('text-brand-primary');
      if (arrow) arrow.classList.add('rotate-180');
    }
  },

  // Utility functions
  getFileExtension: function(filename) {
    return filename.split('.').pop().toLowerCase();
  },

  getFileType: function(filename) {
    const ext = this.getFileExtension(filename);

    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'document';
    if (['txt'].includes(ext)) return 'text';

    return 'file';
  },

  getFileIcon: function(fileType) {
    const icons = {
      'image': 'fa-image',
      'pdf': 'fa-file-pdf',
      'document': 'fa-file-word',
      'text': 'fa-file-alt',
      'file': 'fa-file'
    };

    return icons[fileType] || 'fa-file';
  },

  formatFileSize: function(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
};

// Initialize contact app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  ContactApp.init();
});

// Export for use in other files
window.ARS.Contact = ContactApp;