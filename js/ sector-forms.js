/**
 * SECTOR-FORMS.JS - Contact Form Logic & Sector-Specific Form Handling
 * ARS TEK YAPI A.Ş. Website
 */

// Form Configuration
const FORM_CONFIG = {
  sectors: {
    'healthcare': {
      name: 'Sağlık & Tıp',
      fields: ['patient-data', 'hipaa-compliance', 'telemedicine'],
      questions: [
        'Hasta verilerini nasıl yönetiyorsunuz?',
        'HIPAA uyumluluğu gerekli mi?',
        'Telemedicine entegrasyonu planlıyor musunuz?'
      ]
    },
    'manufacturing': {
      name: 'İmalat & Endüstri',
      fields: ['production-volume', 'automation-level', 'iot-sensors'],
      questions: [
        'Günlük üretim hacminiz nedir?',
        'Mevcut otomasyon seviyeniz?',
        'IoT sensör altyapınız var mı?'
      ]
    },
    'retail': {
      name: 'Perakende & E-ticaret',
      fields: ['store-count', 'online-platform', 'inventory-system'],
      questions: [
        'Kaç mağazanız bulunuyor?',
        'Online satış platformunuz var mı?',
        'Envanter yönetim sisteminiz nasıl?'
      ]
    },
    'finance': {
      name: 'Finans & Bankacılık',
      fields: ['transaction-volume', 'regulatory-compliance', 'security-level'],
      questions: [
        'Günlük işlem hacminiz?',
        'Hangi düzenlemelere tabi?',
        'Güvenlik standartlarınız?'
      ]
    },
    'real-estate': {
      name: 'Gayrimenkul & İnşaat',
      fields: ['property-count', 'smart-building', 'iot-integration'],
      questions: [
        'Kaç gayrimenkul yönetiyorsunuz?',
        'Akıllı bina teknolojileri kullanıyor musunuz?',
        'IoT entegrasyonu planlıyor musunuz?'
      ]
    }
  },

  services: {
    'ai-ml': 'AI & Makine Öğrenmesi',
    'iot': 'IoT Sistemleri',
    'web-development': 'Web & Uygulama Geliştirme',
    'fintech': 'Fintech Çözümleri',
    'smart-home': 'Akıllı Ev Otomasyonu'
  },

  budgetRanges: [
    '€5,000 - €15,000',
    '€15,000 - €50,000',
    '€50,000 - €100,000',
    '€100,000+'
  ],

  timelines: [
    '1-3 ay',
    '3-6 ay',
    '6-12 ay',
    '12+ ay'
  ]
};

// Contact Form Handler
class ContactFormHandler {
  constructor(formSelector = '#contact-form') {
    this.form = document.querySelector(formSelector);
    this.currentStep = 1;
    this.totalSteps = 3;
    this.formData = {};
    this.validationRules = {};

    if (this.form) {
      this.init();
    }
  }

  init() {
    this.setupForm();
    this.setupValidation();
    this.setupSectorLogic();
    this.setupStepWizard();
    this.setupFileUpload();
    this.bindEvents();
  }

  setupForm() {
    // Add form enhancement classes
    this.form.classList.add('space-y-6');

    // Setup form fields with proper styling
    this.form.querySelectorAll('input, select, textarea').forEach(field => {
      field.classList.add(
        'w-full', 'px-4', 'py-3', 'border', 'border-gray-300', 'rounded-lg',
        'focus:ring-2', 'focus:ring-[#1B4F72]', 'focus:border-[#1B4F72]',
        'transition-colors', 'duration-200'
      );
    });
  }

  setupValidation() {
    this.validationRules = {
      name: { required: true, minLength: 2 },
      email: { required: true, email: true },
      company: { required: true, minLength: 2 },
      phone: { required: true, pattern: /^[\+]?[0-9\s\-\(\)]{10,}$/ },
      sector: { required: true },
      message: { required: true, minLength: 10 }
    };
  }

  setupSectorLogic() {
    const sectorSelect = this.form.querySelector('#sector');
    const dynamicFields = this.form.querySelector('#dynamic-fields');

    if (sectorSelect && dynamicFields) {
      sectorSelect.addEventListener('change', (e) => {
        this.generateSectorFields(e.target.value, dynamicFields);
      });
    }
  }

  generateSectorFields(sectorKey, container) {
    container.innerHTML = '';

    if (!sectorKey || !FORM_CONFIG.sectors[sectorKey]) return;

    const sector = FORM_CONFIG.sectors[sectorKey];

    // Create sector-specific fields
    const sectorSection = document.createElement('div');
    sectorSection.className = 'sector-fields space-y-4 p-4 bg-blue-50 rounded-lg border-l-4 border-[#1B4F72]';

    const title = document.createElement('h3');
    title.className = 'font-semibold text-[#1B4F72] mb-3';
    title.textContent = `${sector.name} - Özel Sorular`;
    sectorSection.appendChild(title);

    sector.questions.forEach((question, index) => {
      const fieldGroup = document.createElement('div');
      fieldGroup.className = 'form-group';

      const label = document.createElement('label');
      label.className = 'block text-sm font-medium text-gray-700 mb-2';
      label.textContent = question;

      const input = document.createElement('textarea');
      input.name = `sector_question_${index}`;
      input.className = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1B4F72] focus:border-[#1B4F72]';
      input.rows = 2;
      input.placeholder = 'Yanıtınızı buraya yazın...';

      fieldGroup.appendChild(label);
      fieldGroup.appendChild(input);
      sectorSection.appendChild(fieldGroup);
    });

    container.appendChild(sectorSection);

    // Animate in
    sectorSection.style.opacity = '0';
    sectorSection.style.transform = 'translateY(20px)';

    setTimeout(() => {
      sectorSection.style.transition = 'all 0.3s ease';
      sectorSection.style.opacity = '1';
      sectorSection.style.transform = 'translateY(0)';
    }, 100);
  }

  setupStepWizard() {
    const stepWizard = this.form.querySelector('.step-wizard');
    if (!stepWizard) return;

    this.createStepIndicators();
    this.setupStepNavigation();
  }

  createStepIndicators() {
    const stepContainer = document.createElement('div');
    stepContainer.className = 'step-indicators flex justify-between mb-8';

    const steps = [
      { title: 'Temel Bilgiler', icon: 'fas fa-user' },
      { title: 'Proje Detayları', icon: 'fas fa-cogs' },
      { title: 'Tamamla', icon: 'fas fa-check' }
    ];

    steps.forEach((step, index) => {
      const stepElement = document.createElement('div');
      stepElement.className = `step-indicator flex items-center ${index + 1 === this.currentStep ? 'text-[#1B4F72]' : 'text-gray-400'}`;

      stepElement.innerHTML = `
        <div class="step-circle w-10 h-10 rounded-full border-2 flex items-center justify-center mr-3 ${
          index + 1 === this.currentStep ? 'border-[#1B4F72] bg-[#1B4F72] text-white' : 'border-gray-300'
        }">
          <i class="${step.icon}"></i>
        </div>
        <span class="font-medium">${step.title}</span>
      `;

      stepContainer.appendChild(stepElement);
    });

    this.form.insertBefore(stepContainer, this.form.firstChild);
  }

  setupStepNavigation() {
    // Add step navigation buttons
    const navContainer = document.createElement('div');
    navContainer.className = 'step-navigation flex justify-between mt-6';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'prev-step px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors';
    prevBtn.innerHTML = '<i class="fas fa-arrow-left mr-2"></i>Önceki';
    prevBtn.style.visibility = this.currentStep === 1 ? 'hidden' : 'visible';

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'next-step px-6 py-3 bg-[#1B4F72] text-white rounded-lg hover:bg-[#143c5c] transition-colors';
    nextBtn.innerHTML = this.currentStep === this.totalSteps ?
      'Gönder <i class="fas fa-paper-plane ml-2"></i>' :
      'Sonraki <i class="fas fa-arrow-right ml-2"></i>';

    navContainer.appendChild(prevBtn);
    navContainer.appendChild(nextBtn);

    this.form.appendChild(navContainer);

    // Bind events
    prevBtn.addEventListener('click', () => this.previousStep());
    nextBtn.addEventListener('click', () => this.nextStep());
  }

  nextStep() {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.updateStepDisplay();
      } else {
        this.submitForm();
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepDisplay();
    }
  }

  updateStepDisplay() {
    // Hide all steps
    this.form.querySelectorAll('.form-step').forEach((step, index) => {
      step.style.display = index + 1 === this.currentStep ? 'block' : 'none';
    });

    // Update indicators
    this.form.querySelectorAll('.step-indicator').forEach((indicator, index) => {
      const circle = indicator.querySelector('.step-circle');
      if (index + 1 === this.currentStep) {
        indicator.classList.add('text-[#1B4F72]');
        indicator.classList.remove('text-gray-400');
        circle.classList.add('border-[#1B4F72]', 'bg-[#1B4F72]', 'text-white');
        circle.classList.remove('border-gray-300');
      } else {
        indicator.classList.remove('text-[#1B4F72]');
        indicator.classList.add('text-gray-400');
        circle.classList.remove('border-[#1B4F72]', 'bg-[#1B4F72]', 'text-white');
        circle.classList.add('border-gray-300');
      }
    });

    // Update navigation buttons
    const prevBtn = this.form.querySelector('.prev-step');
    const nextBtn = this.form.querySelector('.next-step');

    if (prevBtn) {
      prevBtn.style.visibility = this.currentStep === 1 ? 'hidden' : 'visible';
    }

    if (nextBtn) {
      nextBtn.innerHTML = this.currentStep === this.totalSteps ?
        'Gönder <i class="fas fa-paper-plane ml-2"></i>' :
        'Sonraki <i class="fas fa-arrow-right ml-2"></i>';
    }
  }

  setupFileUpload() {
    const fileInput = this.form.querySelector('input[type="file"]');
    if (!fileInput) return;

    // Create custom file upload area
    const uploadArea = document.createElement('div');
    uploadArea.className = 'file-upload-area border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1B4F72] transition-colors cursor-pointer';
    uploadArea.innerHTML = `
      <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
      <p class="text-gray-600 mb-2">Dosyaları buraya sürükleyin veya tıklayın</p>
      <p class="text-sm text-gray-500">PDF, DOC, DOCX (Maks. 10MB)</p>
    `;

    fileInput.parentNode.insertBefore(uploadArea, fileInput);
    fileInput.style.display = 'none';

    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('border-[#1B4F72]', 'bg-blue-50');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('border-[#1B4F72]', 'bg-blue-50');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('border-[#1B4F72]', 'bg-blue-50');

      const files = Array.from(e.dataTransfer.files);
      this.handleFileUpload(files);
    });

    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      this.handleFileUpload(files);
    });
  }

  handleFileUpload(files) {
    const uploadArea = this.form.querySelector('.file-upload-area');
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length > 0) {
      uploadArea.innerHTML = `
        <i class="fas fa-file-check text-4xl text-green-500 mb-3"></i>
        <p class="text-green-600 mb-2">${validFiles.length} dosya seçildi</p>
        <p class="text-sm text-gray-500">${validFiles.map(f => f.name).join(', ')}</p>
      `;
    }
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitForm();
    });

    // Real-time validation
    this.form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => {
        this.validateField(field);
      });

      field.addEventListener('input', () => {
        this.clearFieldError(field);
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const rules = this.validationRules[field.name];

    if (!rules) return true;

    let isValid = true;
    let errorMessage = '';

    if (rules.required && !value) {
      isValid = false;
      errorMessage = 'Bu alan zorunludur.';
    } else if (rules.email && value && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Geçerli bir e-posta adresi girin.';
    } else if (rules.minLength && value.length < rules.minLength) {
      isValid = false;
      errorMessage = `En az ${rules.minLength} karakter olmalıdır.`;
    } else if (rules.pattern && value && !rules.pattern.test(value)) {
      isValid = false;
      errorMessage = 'Geçersiz format.';
    }

    this.displayFieldError(field, isValid, errorMessage);
    return isValid;
  }

  displayFieldError(field, isValid, message) {
    // Remove existing error
    this.clearFieldError(field);

    if (!isValid) {
      field.classList.add('border-red-500', 'ring-red-500');
      field.classList.remove('border-gray-300');

      const errorElement = document.createElement('div');
      errorElement.className = 'field-error text-red-500 text-sm mt-1';
      errorElement.textContent = message;

      field.parentNode.appendChild(errorElement);
    }
  }

  clearFieldError(field) {
    field.classList.remove('border-red-500', 'ring-red-500');
    field.classList.add('border-gray-300');

    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  }

  validateCurrentStep() {
    const currentStepElement = this.form.querySelector(`.form-step:nth-child(${this.currentStep})`);
    if (!currentStepElement) return true;

    const fields = currentStepElement.querySelectorAll('input, select, textarea');
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async submitForm() {
    const submitBtn = this.form.querySelector('button[type="submit"], .next-step');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Gönderiliyor...';

    try {
      const formData = new FormData(this.form);

      // Add sector-specific data
      const sector = formData.get('sector');
      if (sector && FORM_CONFIG.sectors[sector]) {
        formData.append('sector_name', FORM_CONFIG.sectors[sector].name);
      }

      // Submit to form handler (Formspree, Netlify, etc.)
      const response = await fetch(this.form.action || '/contact', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        this.showSuccessMessage();
      } else {
        throw new Error('Form submission failed');
      }

    } catch (error) {
      this.showErrorMessage(error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }

  showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    successMessage.innerHTML = `
      <div class="bg-white rounded-lg p-8 max-w-md text-center">
        <i class="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Mesajınız Gönderildi!</h3>
        <p class="text-gray-600 mb-6">En kısa sürede size geri dönüş yapacağız.</p>
        <button class="close-success px-6 py-3 bg-[#1B4F72] text-white rounded-lg hover:bg-[#143c5c] transition-colors">
          Tamam
        </button>
      </div>
    `;

    document.body.appendChild(successMessage);

    successMessage.querySelector('.close-success').addEventListener('click', () => {
      document.body.removeChild(successMessage);
      this.form.reset();
      window.location.href = '/thanks.html';
    });
  }

  showErrorMessage(error) {
    const errorAlert = document.createElement('div');
    errorAlert.className = 'error-alert bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
    errorAlert.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        <span>Bir hata oluştu: ${error}</span>
      </div>
    `;

    this.form.insertBefore(errorAlert, this.form.firstChild);

    setTimeout(() => {
      if (errorAlert.parentNode) {
        errorAlert.parentNode.removeChild(errorAlert);
      }
    }, 5000);
  }
}

// Quick Quote Calculator
class QuickQuoteCalculator {
  constructor() {
    this.calculator = document.querySelector('#quick-quote');
    if (this.calculator) {
      this.init();
    }
  }

  init() {
    this.setupCalculator();
    this.bindEvents();
  }

  setupCalculator() {
    const calculatorHTML = `
      <div class="quick-quote-form bg-gradient-to-r from-[#1B4F72] to-[#2C3E50] text-white p-6 rounded-lg">
        <h3 class="text-xl font-semibold mb-4">Hızlı Fiyat Hesaplama</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Hizmet Türü</label>
            <select id="quote-service" class="w-full px-3 py-2 bg-white text-gray-800 rounded">
              <option value="">Seçin...</option>
              ${Object.entries(FORM_CONFIG.services).map(([key, value]) =>
                `<option value="${key}">${value}</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Proje Süresi</label>
            <select id="quote-timeline" class="w-full px-3 py-2 bg-white text-gray-800 rounded">
              <option value="">Seçin...</option>
              ${FORM_CONFIG.timelines.map(timeline =>
                `<option value="${timeline}">${timeline}</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Karmaşıklık</label>
            <select id="quote-complexity" class="w-full px-3 py-2 bg-white text-gray-800 rounded">
              <option value="">Seçin...</option>
              <option value="simple">Basit</option>
              <option value="medium">Orta</option>
              <option value="complex">Karmaşık</option>
            </select>
          </div>
        </div>
        <div class="mt-4 text-center">
          <div id="quote-result" class="hidden">
            <div class="text-2xl font-bold mb-2">Tahmini Fiyat: <span id="quote-price">€0</span></div>
            <p class="text-sm opacity-90">Bu tahmini bir fiyattır. Kesin fiyat için iletişime geçin.</p>
          </div>
          <button id="get-quote" class="mt-4 px-6 py-3 bg-white text-[#1B4F72] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Fiyat Hesapla
          </button>
        </div>
      </div>
    `;

    this.calculator.innerHTML = calculatorHTML;
  }

  bindEvents() {
    const calculateBtn = document.getElementById('get-quote');
    calculateBtn.addEventListener('click', () => {
      this.calculateQuote();
    });
  }

  calculateQuote() {
    const service = document.getElementById('quote-service').value;
    const timeline = document.getElementById('quote-timeline').value;
    const complexity = document.getElementById('quote-complexity').value;

    if (!service || !timeline || !complexity) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    let basePrice = this.getBasePrice(service);
    let multiplier = this.getComplexityMultiplier(complexity);
    let timeMultiplier = this.getTimeMultiplier(timeline);

    const estimatedPrice = Math.round(basePrice * multiplier * timeMultiplier);

    document.getElementById('quote-price').textContent = `€${estimatedPrice.toLocaleString()}`;
    document.getElementById('quote-result').classList.remove('hidden');
  }

  getBasePrice(service) {
    const basePrices = {
      'ai-ml': 25000,
      'iot': 15000,
      'web-development': 8000,
      'fintech': 30000,
      'smart-home': 12000
    };

    return basePrices[service] || 10000;
  }

  getComplexityMultiplier(complexity) {
    const multipliers = {
      'simple': 0.7,
      'medium': 1.0,
      'complex': 1.5
    };

    return multipliers[complexity] || 1.0;
  }

  getTimeMultiplier(timeline) {
    const multipliers = {
      '1-3 ay': 1.2,
      '3-6 ay': 1.0,
      '6-12 ay': 0.9,
      '12+ ay': 0.8
    };

    return multipliers[timeline] || 1.0;
  }
}

// Initialize form handlers
document.addEventListener('DOMContentLoaded', () => {
  // Initialize contact form
  const contactForm = new ContactFormHandler();

  // Initialize quick quote calculator
  const quoteCalculator = new QuickQuoteCalculator();

  console.log('📝 Form handlers initialized');
});