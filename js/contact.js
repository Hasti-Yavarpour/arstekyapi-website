/**
 * ARS TEK YAPI - Contact Page JavaScript
 * Contact form functionality with Formspree integration
 */

window.ARS = window.ARS || {};


// Contact page app object
window.ContactApp = {
  // Configuration
  config: {
    formspreeEndpoint: 'https://formspree.io/f/mgvldorz', // Replace with actual Formspree URL
    maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
    allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'],
    maxFiles: 3
  },

  // State
  state: {
    uploadedFiles: [],
    isSubmitting: false
  },

  // Sector options for the contact form
  sectors: [
    { value: '', text: 'Sektörünüzü seçin...' , disabled: true },
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
    { value: 'other', text: 'Diğer' }
  ],

  // FAQ data
  faqs: [
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

  // Initialize contact page
  init: function() {
    this.populateSectorDropdown();
    this.setupEventListeners();
    this.initFormValidation();
    this.renderFAQs();
  },

  // Populate sector dropdown
  populateSectorDropdown: function() {
    const select = ArsTekYapi.utils.$('#sector-select');
    if (!select) return;

    select.innerHTML = '';
    this.sectors.forEach(sector => {
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
    const form = ArsTekYapi.utils.$('#contact-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit(e);
      });
    }

    // Real-time form validation
    const inputs = ArsTekYapi.utils.$$('.form-input, .form-textarea, .form-select');
    inputs.forEach(input => {
      input.addEventListener('blur', (e) => {
        this.validateField(e.target);
      });

      input.addEventListener('input', (e) => {
        this.clearFieldError(e.target);
      });
    });

    // FAQ toggles
    document.addEventListener('click', (e) => {
      if (e.target.matches('.faq-question') || e.target.closest('.faq-question')) {
        const question = e.target.closest('.faq-question');
        this.toggleFAQ(question);
      }
    });
  },

  // Initialize file upload
  initFileUpload: function() {
    const uploadArea = ArsTekYapi.utils.$('.file-upload-area');
    const fileInput = ArsTekYapi.utils.$('#file-upload');

    if (!uploadArea || !fileInput) return;

    // Click to upload
    uploadArea.addEventListener('click', () => {
      fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
      this.handleFileSelect(e.target.files);
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      this.handleFileSelect(e.dataTransfer.files);
    });
  },

  // Handle file selection
  handleFileSelect: function(files) {
    const fileArray = Array.from(files);

    // Check total file limit
    if (this.state.uploadedFiles.length + fileArray.length > this.config.maxFiles) {
      this.showError(`Maksimum ${this.config.maxFiles} dosya yükleyebilirsiniz.`);
      return;
    }

    fileArray.forEach(file => {
      if (this.validateFile(file)) {
        const fileObj = {
          id: ArsTekYapi.utils.generateId(),
          file: file,
          name: file.name,
          size: this.formatFileSize(file.size),
          type: this.getFileType(file.name)
        };

        this.state.uploadedFiles.push(fileObj);
      }
    });

    this.updateFileList();
    this.updateUploadArea();
  },

  // Validate file
  validateFile: function(file) {
    // Check file size
    if (file.size > this.config.maxFileSize) {
      this.showError(`Dosya boyutu ${this.formatFileSize(this.config.maxFileSize)} boyutunu aşmamalıdır.`);
      return false;
    }

    // Check file type
    const extension = this.getFileExtension(file.name);
    if (!this.config.allowedFileTypes.includes(extension)) {
      this.showError(`Desteklenen dosya türleri: ${this.config.allowedFileTypes.join(', ')}`);
      return false;
    }

    return true;
  },

  // Update file list display
  updateFileList: function() {
    const container = ArsTekYapi.utils.$('.file-upload-list');
    if (!container) return;

    if (this.state.uploadedFiles.length === 0) {
      container.innerHTML = '';
      return;
    }

    const filesHtml = this.state.uploadedFiles.map(fileObj => `
      <div class="file-item">
        <div class="file-item-info">
          <i class="fas ${this.getFileIcon(fileObj.type)} file-item-icon"></i>
          <span class="file-item-name">${fileObj.name}</span>
          <span class="file-item-size">(${fileObj.size})</span>
        </div>
        <button type="button" class="file-item-remove" onclick="ContactApp.removeFile('${fileObj.id}')">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');

    container.innerHTML = filesHtml;
  },

  // Remove file
  removeFile: function(fileId) {
    this.state.uploadedFiles = this.state.uploadedFiles.filter(file => file.id !== fileId);
    this.updateFileList();
    this.updateUploadArea();
  },

  // Update upload area display
  updateUploadArea: function() {
    const uploadText = ArsTekYapi.utils.$('.file-upload-text');
    const uploadHint = ArsTekYapi.utils.$('.file-upload-hint');

    if (!uploadText || !uploadHint) return;

    const remainingFiles = this.config.maxFiles - this.state.uploadedFiles.length;

    if (remainingFiles > 0) {
      uploadText.textContent = 'Dosyalarınızı buraya sürükleyin veya tıklayarak seçin';
      uploadHint.textContent = `${remainingFiles} dosya daha ekleyebilirsiniz. Maks. ${this.formatFileSize(this.config.maxFileSize)} per dosya.`;
    } else {
      uploadText.textContent = 'Maksimum dosya sayısına ulaştınız';
      uploadHint.textContent = 'Yeni dosya eklemek için mevcut dosyaları kaldırın.';
    }
  },

  // Initialize form validation
  initFormValidation: function() {
    // Custom validation messages in Turkish
    const form = ArsTekYapi.utils.$('#contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('invalid', (e) => {
        e.preventDefault();
        this.showFieldError(input, this.getValidationMessage(input));
      });
    });
  },

  // Get Turkish validation messages
  getValidationMessage: function(input) {
    const validity = input.validity;

    if (validity.valueMissing) {
      return 'Bu alan zorunludur.';
    }
    if (validity.typeMismatch) {
      if (input.type === 'email') return 'Geçerli bir e-posta adresi giriniz.';
    }
    if (validity.tooShort) {
      return `En az ${input.minLength} karakter olmalıdır.`;
    }
    if (validity.tooLong) {
      return `En fazla ${input.maxLength} karakter olabilir.`;
    }

    return 'Geçersiz değer.';
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
      message = 'Bu alan zorunludur.';
      isValid = false;
    }

    // Email validation
    if (field.type === 'email' && value && !ArsTekYapi.utils.isValidEmail(value)) {
      message = 'Geçerli bir e-posta adresi giriniz.';
      isValid = false;
    }

    // Name validation (minimum 2 characters)
    if (field.name === 'name' && value && value.length < 2) {
      message = 'İsim en az 2 karakter olmalıdır.';
      isValid = false;
    }

    // Message validation (minimum 10 characters)
    if (field.name === 'message' && value && value.length < 10) {
      message = 'Mesaj en az 10 karakter olmalıdır.';
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

    // Remove existing error
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }

    // Add new error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
    field.parentNode.appendChild(errorDiv);
  },

  // Clear field error
  clearFieldError: function(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.form-error');
    if (errorDiv) {
      errorDiv.remove();
    }
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
      this.showError('Lütfen form hatalarını düzeltin.');
      return;
    }

    // Show loading state
    this.state.isSubmitting = true;
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span>Gönderiliyor...';
    form.classList.add('form-loading');

    try {
      const formData = new FormData(form);

      // Add sector info
      const sectorSelect = form.querySelector('#sector-select');
      const selectedSector = this.sectors.find(s => s.value === sectorSelect.value);
      if (selectedSector) {
        formData.append('sector_name', selectedSector.text);
      }


      // Add metadata
      formData.append('_subject', 'Yeni İletişim Formu - ARS TEK YAPI');
      formData.append('_replyto', formData.get('email'));
      formData.append('_next', window.location.origin + '/thanks.html');

      // Submit to Formspree
      const response = await fetch(this.config.formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        window.location.href = '/thanks.html';
      } else {
        const data = await response.json().catch(() => null);
        const msg = data?.errors?.map(e => e.message).join('\n')
                || data?.message
                || `HTTP ${response.status} – Form submission failed`;
        throw new Error(msg);
      }

    } catch (error) {
      console.error('Form submission error:', error);
      // Show the REAL reason from Formspree here
      this.showError(error.message || 'Form gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz veya doğrudan e-posta ile iletişime geçin.');
    } finally {
      // Reset loading state
      this.state.isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      form.classList.remove('form-loading');
    }

  },

  // Show success message
  showSuccessMessage: function() {
    const form = ArsTekYapi.utils.$('#contact-form');
    const successHtml = `
      <div class="success-message">
        <i class="fas fa-check-circle"></i>
        <div>
          <strong>Mesajınız başarıyla gönderildi!</strong><br>
          En kısa sürede size geri dönüş yapacağız. Teşekkür ederiz.
        </div>
      </div>
    `;

    form.insertAdjacentHTML('afterbegin', successHtml);

    // Scroll to success message
    const successMsg = form.querySelector('.success-message');
    successMsg.scrollIntoView({ behavior: 'smooth' });
  },

  // Reset form
  resetForm: function(form) {
    form.reset();
    this.state.uploadedFiles = [];
    this.updateFileList();
    this.updateUploadArea();

    // Clear all errors
    const errors = form.querySelectorAll('.form-error');
    errors.forEach(error => error.remove());

    const inputsWithError = form.querySelectorAll('.error');
    inputsWithError.forEach(input => input.classList.remove('error'));
  },

  // Render FAQs
  renderFAQs: function() {
    const container = ArsTekYapi.utils.$('.faq-container');
    if (!container) return;

    const faqsHtml = this.faqs.map((faq, index) => `
      <div class="faq-item">
        <button class="faq-question" data-faq="${index}">
          <span>${faq.question}</span>
          <i class="fas fa-chevron-down faq-icon"></i>
        </button>
        <div class="faq-answer" data-faq="${index}">
          <div class="faq-answer-content">
            ${faq.answer}
          </div>
        </div>
      </div>
    `).join('');

    container.innerHTML = faqsHtml;
  },

  // Toggle FAQ
  toggleFAQ: function(questionElement) {
    const faqIndex = questionElement.dataset.faq;
    const answerElement = ArsTekYapi.utils.$(`.faq-answer[data-faq="${faqIndex}"]`);

    // Close other FAQs
    const allQuestions = ArsTekYapi.utils.$$('.faq-question');
    const allAnswers = ArsTekYapi.utils.$$('.faq-answer');

    allQuestions.forEach((q, i) => {
      if (i.toString() !== faqIndex) {
        q.classList.remove('active');
      }
    });

    allAnswers.forEach((a, i) => {
      if (i.toString() !== faqIndex) {
        a.classList.remove('active');
      }
    });

    // Toggle current FAQ
    questionElement.classList.toggle('active');
    answerElement.classList.toggle('active');
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
ArsTekYapi.utils.ready(() => {
  ContactApp.init();
});

// Export for use in other files
window.ARS.Contact = ContactApp;