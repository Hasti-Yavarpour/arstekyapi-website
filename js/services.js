/**
 * SERVICES PAGE JAVASCRIPT
 * services.js for ARS TEK YAPI A.Ş.
 * Handles ONLY services page specific functionality - NO NAVIGATION
 */

document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // FAQ ACCORDION FUNCTIONALITY
    // ===================================

    function initFAQ() {
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
            }
        });
    }

    // ===================================
    // TECHNOLOGY STACK INTERACTIONS
    // ===================================

    function initTechStackInteractions() {
        const techItems = document.querySelectorAll('.tech-item');

        techItems.forEach(item => {
            item.addEventListener('click', function() {
                const techName = this.querySelector('span')?.textContent;
                if (techName) {
                    console.log(`Clicked on ${techName}`);
                    // Add a subtle click feedback
                    this.style.transform = 'translateY(-5px) scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'translateY(-5px)';
                    }, 150);
                }
            });
        });
    }

    // ===================================
    // INDUSTRY TAGS INTERACTIONS
    // ===================================

    function initIndustryTags() {
        const industryTags = document.querySelectorAll('.industry-tag');

        industryTags.forEach(tag => {
            tag.addEventListener('click', function() {
                const industry = this.textContent.trim();
                window.location.href = `/industries.html#${industry.toLowerCase().replace(/\s+/g, '-')}`;
            });
        });
    }

    // ===================================
    // SERVICES BACK TO TOP BUTTON
    // ===================================

    function initBackToTop() {
        let backToTopBtn = document.querySelector('.services-back-to-top');

        if (!backToTopBtn) {
            backToTopBtn = document.createElement('button');
            backToTopBtn.className = 'services-back-to-top';
            backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            backToTopBtn.setAttribute('aria-label', 'Yukarı çık');
            document.body.appendChild(backToTopBtn);
        }

        function toggleBackToTopButton() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        toggleBackToTopButton();
        window.addEventListener('scroll', toggleBackToTopButton);
    }

    // ===================================
    // PROCESS STEPS ANIMATION
    // ===================================

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

    // ===================================
    // SERVICE CARDS INTERACTION
    // ===================================

    function initServiceCardsInteraction() {
        const serviceCards = document.querySelectorAll('.service-card, .tech-item, .industry-tag');

        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // ===================================
    // SERVICE CTA BUTTONS
    // ===================================

    function initServiceCTAButtons() {
        const ctaButtons = document.querySelectorAll('.service-cta');

        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Add ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-effect');

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add CSS for ripple effect
        const style = document.createElement('style');
        style.textContent = `
            .service-cta {
                position: relative;
                overflow: hidden;
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
    }

    // ===================================
    // FORM VALIDATIONS
    // ===================================

    function initServiceForms() {
        const serviceForms = document.querySelectorAll('form[data-service]');

        serviceForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

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
                    `;

                    form.appendChild(successMessage);
                    form.reset();

                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                }
            });
        });

        // Add error styles
        const style = document.createElement('style');
        style.textContent = `
            .error {
                border-color: #EF4444 !important;
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ===================================
    // INITIALIZE ALL FUNCTIONALITY
    // ===================================

    // Only initialize services-specific functionality
    initFAQ();
    initTechStackInteractions();
    initIndustryTags();
    initBackToTop();
    initProcessStepsAnimation();
    initServiceCardsInteraction();
    initServiceCTAButtons();
    initServiceForms();

    // Force section title colors with JavaScript
    const serviceColors = {
        'ai-ml': '#F39C12',
        'iot': '#27AE60',
        'web-development': '#2980B9',
        'fintech': '#8E44AD',
        'smart-home': '#E74C3C'
    };

    setTimeout(() => {
        Object.keys(serviceColors).forEach(serviceId => {
            const section = document.getElementById(serviceId);
            if (section) {
                const titles = section.querySelectorAll('h3, h3 i');
                titles.forEach(title => {
                    title.style.color = serviceColors[serviceId];
                });
            }
        });
    }, 100);

    console.log('Services page JavaScript initialized successfully - NO navigation conflicts');
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

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
        }
    };

    return serviceDetails[serviceName] || null;
}

function showServiceModal(serviceName) {
    const details = getServiceDetails(serviceName);
    if (details) {
        console.log('Show modal for:', details);
    }
}

// Export functions
window.ServicesPage = {
    scrollToService,
    getServiceDetails,
    showServiceModal
};