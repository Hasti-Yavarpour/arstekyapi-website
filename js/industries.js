/**
 * INDUSTRIES PAGE FUNCTIONALITY
 * Handles filtering, animations, and interactive elements
 */

class IndustriesPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupFilterTabs();
        this.setupIndustryCards();
        this.setupScrollAnimations();
        this.setupSearchFilter();
        this.setupExpandableContent();
    }

    /**
     * Setup filter tabs functionality
     */
    setupFilterTabs() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        const industryCards = document.querySelectorAll('.industry-card');

        if (!filterTabs.length || !industryCards.length) return;

        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();

                // Remove active class from all tabs
                filterTabs.forEach(t => t.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');

                // Get filter category
                const filterCategory = tab.getAttribute('data-filter');

                // Filter industry cards
                this.filterIndustries(filterCategory, industryCards);

                // Update URL hash without page jump
                if (filterCategory !== 'all') {
                    history.replaceState(null, null, `#${filterCategory}`);
                } else {
                    history.replaceState(null, null, window.location.pathname);
                }
            });
        });

        // Handle initial filter from URL hash
        this.handleInitialFilter();
    }

    /**
     * Handle initial filter based on URL hash
     */
    handleInitialFilter() {
        const hash = window.location.hash.substr(1);
        if (hash) {
            const targetTab = document.querySelector(`[data-filter="${hash}"]`);
            if (targetTab) {
                targetTab.click();
            }
        }
    }

    /**
     * Filter industries based on category
     */
    filterIndustries(category, cards) {
        cards.forEach(card => {
            card.classList.add('filtering');

            setTimeout(() => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.classList.remove('hide');
                    card.classList.add('show');
                } else {
                    card.classList.add('hide');
                    card.classList.remove('show');
                }

                card.classList.remove('filtering');
            }, 150);
        });

        // Update results count
        setTimeout(() => {
            this.updateResultsCount(category);
        }, 300);
    }

    /**
     * Update results count display
     */
    updateResultsCount(category) {
        const visibleCards = document.querySelectorAll('.industry-card.show, .industry-card:not(.hide)');
        const countElement = document.getElementById('results-count');

        if (countElement) {
            const count = visibleCards.length;
            const categoryText = category === 'all' ? 'Tüm Sektörler' : this.getCategoryDisplayName(category);
            countElement.textContent = `${categoryText} (${count} sektör)`;
        }
    }

    /**
     * Get display name for category
     */
    getCategoryDisplayName(category) {
        const categoryNames = {
            'healthcare': 'Sağlık & Tıp',
            'manufacturing': 'İmalat & Endüstri',
            'retail': 'Perakende',
            'finance': 'Finans & Bankacılık',
            'transportation': 'Taşımacılık',
            'realestate': 'Gayrimenkul',
            'agriculture': 'Tarım & Gıda',
            'education': 'Eğitim',
            'hospitality': 'Otelcilik',
            'energy': 'Enerji'
        };

        return categoryNames[category] || category;
    }

    /**
     * Setup industry cards hover animations and interactions
     */
    setupIndustryCards() {
        const industryCards = document.querySelectorAll('.industry-card');

        industryCards.forEach(card => {
            // Add hover animation with magnetic effect
            card.addEventListener('mouseenter', (e) => {
                this.addCardHoverEffect(card);
            });

            card.addEventListener('mouseleave', (e) => {
                this.removeCardHoverEffect(card);
            });

            // Add click to expand functionality
            const expandBtn = card.querySelector('.expand-btn');
            if (expandBtn) {
                expandBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleCardExpansion(card);
                });
            }

            // Add CTA button click tracking
            const ctaBtn = card.querySelector('.industry-cta');
            if (ctaBtn) {
                ctaBtn.addEventListener('click', (e) => {
                    this.trackCTAClick(card.getAttribute('data-category'));
                });
            }
        });
    }

    /**
     * Add hover effect to card
     */
    addCardHoverEffect(card) {
        const techTags = card.querySelectorAll('.tech-tag');

        techTags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'translateY(-2px)';
                tag.style.boxShadow = '0 4px 12px rgba(27, 79, 114, 0.2)';
            }, index * 50);
        });
    }

    /**
     * Remove hover effect from card
     */
    removeCardHoverEffect(card) {
        const techTags = card.querySelectorAll('.tech-tag');

        techTags.forEach(tag => {
            tag.style.transform = '';
            tag.style.boxShadow = '';
        });
    }

    /**
     * Toggle card expansion for more details
     */
    toggleCardExpansion(card) {
        const expandableContent = card.querySelector('.expandable-content');
        const expandBtn = card.querySelector('.expand-btn');
        const expandIcon = expandBtn.querySelector('i');

        if (!expandableContent) return;

        if (expandableContent.style.maxHeight) {
            // Collapse
            expandableContent.style.maxHeight = null;
            expandableContent.classList.remove('expanded');
            expandIcon.classList.remove('fa-chevron-up');
            expandIcon.classList.add('fa-chevron-down');
            expandBtn.innerHTML = '<i class="fas fa-chevron-down mr-2"></i>Daha Fazla Bilgi';
        } else {
            // Expand
            expandableContent.style.maxHeight = expandableContent.scrollHeight + "px";
            expandableContent.classList.add('expanded');
            expandIcon.classList.remove('fa-chevron-down');
            expandIcon.classList.add('fa-chevron-up');
            expandBtn.innerHTML = '<i class="fas fa-chevron-up mr-2"></i>Daha Az Bilgi';
        }
    }

    /**
     * Setup search/filter functionality
     */
    setupSearchFilter() {
        const searchInput = document.getElementById('industry-search');

        if (!searchInput) return;

        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value.toLowerCase().trim();
                this.searchIndustries(searchTerm);
            }, 300);
        });

        // Clear search button
        const clearBtn = document.getElementById('clear-search');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.searchIndustries('');
                clearBtn.style.display = 'none';
            });
        }

        // Show/hide clear button
        searchInput.addEventListener('input', (e) => {
            const clearBtn = document.getElementById('clear-search');
            if (clearBtn) {
                clearBtn.style.display = e.target.value ? 'block' : 'none';
            }
        });
    }

    /**
     * Search industries by text
     */
    searchIndustries(searchTerm) {
        const industryCards = document.querySelectorAll('.industry-card');
        let visibleCount = 0;

        industryCards.forEach(card => {
            const title = card.querySelector('.industry-title').textContent.toLowerCase();
            const content = card.querySelector('.industry-content').textContent.toLowerCase();
            const isVisible = !searchTerm || title.includes(searchTerm) || content.includes(searchTerm);

            if (isVisible) {
                card.style.display = 'block';
                card.classList.add('show');
                card.classList.remove('hide');
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.remove('show');
                card.classList.add('hide');
            }
        });

        // Update search results count
        const resultsElement = document.getElementById('search-results-count');
        if (resultsElement) {
            if (searchTerm) {
                resultsElement.textContent = `"${searchTerm}" için ${visibleCount} sonuç bulundu`;
                resultsElement.style.display = 'block';
            } else {
                resultsElement.style.display = 'none';
            }
        }
    }

    /**
     * Setup scroll-triggered animations
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');

                    // Stagger animation for industry cards
                    if (entry.target.classList.contains('industry-card')) {
                        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                        setTimeout(() => {
                            entry.target.style.transform = 'translateY(0)';
                            entry.target.style.opacity = '1';
                        }, delay);
                    }
                }
            });
        }, observerOptions);

        // Observe industry cards
        document.querySelectorAll('.industry-card').forEach(card => {
            card.style.transform = 'translateY(30px)';
            card.style.opacity = '0';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }

    /**
     * Setup expandable content sections
     */
    setupExpandableContent() {
        const expandButtons = document.querySelectorAll('.expand-toggle');

        expandButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = button.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);

                if (targetContent) {
                    this.toggleExpandableSection(targetContent, button);
                }
            });
        });
    }

    /**
     * Toggle expandable section
     */
    toggleExpandableSection(content, button) {
        const isExpanded = content.classList.contains('expanded');
        const icon = button.querySelector('i');

        if (isExpanded) {
            content.classList.remove('expanded');
            content.style.maxHeight = '0';
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        } else {
            content.classList.add('expanded');
            content.style.maxHeight = content.scrollHeight + 'px';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    }

    /**
     * Track CTA button clicks for analytics
     */
    trackCTAClick(category) {
        // Analytics tracking can be implemented here
        console.log(`CTA clicked for category: ${category}`);

        // Example: Google Analytics event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'Industries',
                'event_label': category,
                'value': 1
            });
        }
    }

    /**
     * Update filter tabs on window resize
     */
    updateFilterTabsOnResize() {
        const filterContainer = document.querySelector('.filter-tabs');
        if (!filterContainer) return;

        // Handle mobile scrolling for filter tabs
        if (window.innerWidth <= 768) {
            filterContainer.classList.add('mobile-scroll');
        } else {
            filterContainer.classList.remove('mobile-scroll');
        }
    }
}

/**
 * Utility functions for industries page
 */
const IndustriesUtils = {
    /**
     * Smooth scroll to industry section
     */
    scrollToIndustry(industryId) {
        const industryCard = document.querySelector(`[data-category="${industryId}"]`);
        if (industryCard) {
            industryCard.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // Highlight the card temporarily
            industryCard.classList.add('highlighted');
            setTimeout(() => {
                industryCard.classList.remove('highlighted');
            }, 2000);
        }
    },

    /**
     * Get random industry for featured content
     */
    getRandomIndustry() {
        const industries = ['healthcare', 'manufacturing', 'retail', 'finance', 'transportation', 'realestate', 'agriculture', 'education', 'hospitality', 'energy'];
        return industries[Math.floor(Math.random() * industries.length)];
    },

    /**
     * Format industry stats
     */
    formatStats(stats) {
        return Object.entries(stats).map(([key, value]) => {
            return `<div class="stat-item"><span class="stat-value">${value}</span><span class="stat-label">${key}</span></div>`;
        }).join('');
    }
};

/**
 * Initialize industries page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize industries page functionality
    const industriesPage = new IndustriesPage();

    // Handle window resize
    window.addEventListener('resize', () => {
        industriesPage.updateFilterTabsOnResize();
    });

    // Handle back/forward navigation
    window.addEventListener('popstate', () => {
        industriesPage.handleInitialFilter();
    });

    // Make utilities globally accessible
    window.IndustriesUtils = IndustriesUtils;
});

/**
 * Export for potential module usage
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IndustriesPage, IndustriesUtils };
}
