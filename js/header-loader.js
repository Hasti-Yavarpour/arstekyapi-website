// Header Loader and Navigation JavaScript
// This file loads the appropriate header and handles all navigation functionality

document.addEventListener('DOMContentLoaded', function() {

  // Determine which header to load based on current page
  function loadHeader() {
    const isEnglishPage = window.location.pathname.includes('/en/');
    const headerFile = isEnglishPage ? '/partials/header-en.html' : '/partials/header.html';

    // Find the header placeholder
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) {
      console.error('Header placeholder not found. Add <div id="header-placeholder"></div> to your HTML.');
      return;
    }

    // Fetch and insert header
    fetch(headerFile)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Header file not found: ${headerFile}`);
        }
        return response.text();
      })
      .then(html => {
        headerPlaceholder.innerHTML = html;
        // Initialize navigation after header is loaded
        initializeNavigation();
      })
      .catch(error => {
        console.error('Error loading header:', error);
        // Fallback: show error message
        headerPlaceholder.innerHTML = `
          <div style="background: #f87171; color: white; padding: 1rem; text-align: center;">
            Header could not be loaded. Please check that ${headerFile} exists.
          </div>
        `;
      });
  }

  // Initialize all navigation functionality
  function initializeNavigation() {

    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
      });
    }

    // Get all navigation elements
    const languageBtn = document.getElementById('language-btn');
    const languageMenu = document.getElementById('language-menu');
    const dropdownArrow = document.getElementById('dropdown-arrow');

    const mobileLanguageBtn = document.getElementById('mobile-language-btn');
    const mobileLanguageMenu = document.getElementById('mobile-language-menu');
    const mobileDropdownArrow = document.getElementById('mobile-dropdown-arrow');

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Desktop Language Dropdown
    if (languageBtn && languageMenu) {
      languageBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Close mobile language menu if open
        if (mobileLanguageMenu && !mobileLanguageMenu.classList.contains('hidden')) {
          mobileLanguageMenu.classList.add('hidden');
          if (mobileDropdownArrow) {
            mobileDropdownArrow.style.transform = 'rotate(0deg)';
          }
        }

        // Toggle desktop dropdown
        const isHidden = languageMenu.classList.contains('hidden');
        if (isHidden) {
          languageMenu.classList.remove('hidden');
          if (dropdownArrow) {
            dropdownArrow.style.transform = 'rotate(180deg)';
          }
        } else {
          languageMenu.classList.add('hidden');
          if (dropdownArrow) {
            dropdownArrow.style.transform = 'rotate(0deg)';
          }
        }
      });
    }

    // Mobile Language Dropdown
    if (mobileLanguageBtn && mobileLanguageMenu) {
      mobileLanguageBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Close desktop language menu if open
        if (languageMenu && !languageMenu.classList.contains('hidden')) {
          languageMenu.classList.add('hidden');
          if (dropdownArrow) {
            dropdownArrow.style.transform = 'rotate(0deg)';
          }
        }

        // Close mobile hamburger menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }

        // Toggle mobile language dropdown
        const isHidden = mobileLanguageMenu.classList.contains('hidden');
        if (isHidden) {
          mobileLanguageMenu.classList.remove('hidden');
          if (mobileDropdownArrow) {
            mobileDropdownArrow.style.transform = 'rotate(180deg)';
          }
        } else {
          mobileLanguageMenu.classList.add('hidden');
          if (mobileDropdownArrow) {
            mobileDropdownArrow.style.transform = 'rotate(0deg)';
          }
        }
      });
    }

    // Mobile Menu Toggle
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();

        // Close mobile language menu if open
        if (mobileLanguageMenu && !mobileLanguageMenu.classList.contains('hidden')) {
          mobileLanguageMenu.classList.add('hidden');
          if (mobileDropdownArrow) {
            mobileDropdownArrow.style.transform = 'rotate(0deg)';
          }
        }

        mobileMenu.classList.toggle('hidden');
      });
    }

    // Close all dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      // Close desktop language dropdown
      if (languageBtn && languageMenu &&
          !languageBtn.contains(e.target) && !languageMenu.contains(e.target)) {
        languageMenu.classList.add('hidden');
        if (dropdownArrow) {
          dropdownArrow.style.transform = 'rotate(0deg)';
        }
      }

      // Close mobile language dropdown
      if (mobileLanguageBtn && mobileLanguageMenu &&
          !mobileLanguageBtn.contains(e.target) && !mobileLanguageMenu.contains(e.target)) {
        mobileLanguageMenu.classList.add('hidden');
        if (mobileDropdownArrow) {
          mobileDropdownArrow.style.transform = 'rotate(0deg)';
        }
      }

      // Close mobile menu
      if (mobileMenuBtn && mobileMenu &&
          !mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    });

    // Close mobile menu when clicking on navigation links
    const mobileLinks = mobileMenu?.querySelectorAll('a');
    if (mobileLinks) {
      mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
          mobileMenu.classList.add('hidden');
        });
      });
    }

    // Close language dropdowns when selecting a language
    const languageLinks = languageMenu?.querySelectorAll('a');
    if (languageLinks) {
      languageLinks.forEach(link => {
        link.addEventListener('click', function() {
          languageMenu.classList.add('hidden');
          if (dropdownArrow) {
            dropdownArrow.style.transform = 'rotate(0deg)';
          }
        });
      });
    }

    const mobileLanguageLinks = mobileLanguageMenu?.querySelectorAll('a');
    if (mobileLanguageLinks) {
      mobileLanguageLinks.forEach(link => {
        link.addEventListener('click', function() {
          mobileLanguageMenu.classList.add('hidden');
          if (mobileDropdownArrow) {
            mobileDropdownArrow.style.transform = 'rotate(0deg)';
          }
        });
      });
    }

    // Close dropdowns on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (languageMenu) {
          languageMenu.classList.add('hidden');
          if (dropdownArrow) {
            dropdownArrow.style.transform = 'rotate(0deg)';
          }
        }
        if (mobileLanguageMenu) {
          mobileLanguageMenu.classList.add('hidden');
          if (mobileDropdownArrow) {
            mobileDropdownArrow.style.transform = 'rotate(0deg)';
          }
        }
        if (mobileMenu) {
          mobileMenu.classList.add('hidden');
        }
      }
    });

    // Highlight active navigation link
    highlightActiveLink();
  }

  // Highlight the current page in navigation
  function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');

      // Check if this link matches the current page
      if (linkPath === currentPath ||
          (currentPath === '/' && linkPath === '/index.html') ||
          (currentPath === '/en/' && linkPath === '/en/index.html')) {
        link.classList.add('text-[#1B4F72]', 'font-semibold');
        link.classList.remove('text-gray-700');
      }
    });
  }

  // Start loading the header
  loadHeader();
});