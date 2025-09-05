/**
 * SERVICES PAGE JAVASCRIPT
 * services.js for ARS TEK YAPI A.Ş.
 * Handles services page specific functionality
 */

document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // SERVICES NAVIGATION & SCROLLING
    // ===================================

    /**
     * Handle smooth scrolling to service sections
     */
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
                    const headerHeight = 80; // Main navbar
                    const serviceNavHeight = 80; // Services nav
                    const offsetTop = targetElement.offsetTop - headerHeight - serviceNavHeight;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Update active navigation link based on scroll position
     */
    function updateActiveNavOnScroll() {
        const serviceNavLinks = document.querySelectorAll('.services-nav-links a[href^="#"]');
        const serviceSections = document.querySelectorAll('.service-section[id]');

        let currentSection = '';

        serviceSections.forEach(section => {
            const sectionTop = section.offsetTop - 200; // Offset for better UX
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
    // FAQ ACCORDION FUNCTIONALITY
    // ===================================

    /**
     * Initialize FAQ accordion functionality
     */
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

    /**
     * Add hover effects and click interactions for tech items
     */
    function initTechStackInteractions() {
        const techItems = document.querySelectorAll('.tech-item');

        techItems.forEach(item => {
            // Add click event for potential modal or tooltip
            item.addEventListener('click', function() {
                const techName = this.querySelector('span')?.textContent;
                if (techName) {
                    // You can extend this to show modal with tech details
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

    /**
     * Handle industry tag clicks
     */
    function initIndustryTags() {
        const industryTags = document.querySelectorAll('.industry-tag');

        industryTags.forEach(tag => {
            tag.addEventListener('click', function() {
                const industry = this.textContent.trim();
                // Redirect to industries page with anchor or filter
                window.location.href = `/industries.html#${industry.toLowerCase().replace(/\s+/g, '-')}`;
            });
        });
    }

    // ===================================
    // SERVICES BACK TO TOP BUTTON
    // ===================================

    /**
     * Initialize back to top button functionality
     */
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

        // Show/hide button based on scroll position
        function toggleBackToTopButton() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Smooth scroll to top
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Initial check
        toggleBackToTopButton();

        // Add to scroll event listener
        window.addEventListener('scroll', toggleBackToTopButton);
    }

    // ===================================
    // PROCESS STEPS ANIMATION
    // ===================================

    /**
     * Animate process steps when they come into view
     */
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
                    }, index * 200); // Stagger animation
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

    /**
     * Add interaction effects to service cards
     */
    function initServiceCardsInteraction() {
        const serviceCards = document.querySelectorAll('.service-card, .tech-item, .industry-tag');

        serviceCards.forEach(card => {
            // Add mouse enter/leave effects
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

    /**
     * Handle service CTA button interactions
     */
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
    // SCROLL PROGRESS INDICATOR
    // ===================================

    /**
     * Add scroll progress indicator for services page
     */
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #1B4F72, #2C3E50);
            z-index: 9999;
            transition: width 0.25s ease;
        `;
        document.body.appendChild(progressBar);

        function updateScrollProgress() {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = Math.min(scrolled, 100) + '%';
        }

        window.addEventListener('scroll', updateScrollProgress);
        updateScrollProgress(); // Initial call
    }

    // ===================================
    // FORM VALIDATIONS (if contact forms exist)
    // ===================================

    /**
     * Handle service-specific contact forms
     */
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
                    // Here you would typically send the form data
                    const serviceType = form.getAttribute('data-service');
                    console.log(`Form submitted for service: ${serviceType}`);

                    // Show success message
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
    // MAIN SCROLL EVENT HANDLER
    // ===================================

    function handleScroll() {
        updateActiveNavOnScroll();
    }

    // Throttle scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 10);
    });

    // ===================================
    // INITIALIZE ALL FUNCTIONALITY
    // ===================================

    // Initialize all services page functionality
    initServiceNavigation();
    initFAQ();
    initTechStackInteractions();
    initIndustryTags();
    initBackToTop();
    initProcessStepsAnimation();
    initServiceCardsInteraction();
    initServiceCTAButtons();
    initScrollProgress();
    initServiceForms();

    // Log that services page JS is loaded
    console.log('Services page JavaScript initialized successfully');
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Smooth scroll to element by ID
 * @param {string} elementId - The ID of the element to scroll to
 */
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

/**
 * Get service details for modal/popup (can be extended)
 * @param {string} serviceName - Name of the service
 */
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
        // Add more services as needed
    };

    return serviceDetails[serviceName] || null;
}

/**
 * Show service modal with details (can be implemented later)
 * @param {string} serviceName - Name of the service
 */
function showServiceModal(serviceName) {
    const details = getServiceDetails(serviceName);
    if (details) {
        // Implementation for modal display
        console.log('Show modal for:', details);
    }
}

// Export functions for potential use in other scripts
window.ServicesPage = {
    scrollToService,
    getServiceDetails,
    showServiceModal
};


// Force section title colors with JavaScript
document.addEventListener('DOMContentLoaded', function() {
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
});