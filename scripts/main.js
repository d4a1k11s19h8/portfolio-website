// scripts/main.js

let globalObserver;

// --- Core Setup ---

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupScrollObserver(); 
    observePageElements(); 
    setupMobileNavigation();
    injectFooter(); // <-- ADDED: Injects the footer
});

function initializeApp() {
    console.log('Portfolio website initialized');
    loadPortfolioData();
}

async function loadPortfolioData() {
    try {
        const response = await fetch('data/portfolio-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        window.portfolioData = data;
        console.log('Portfolio data loaded successfully');
    } catch (error) {
        console.error('Error loading portfolio data:', error);
    }
}

// --- Animation Logic ---

function setupScrollObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    globalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                globalObserver.unobserve(entry.target); 
            }
        });
    }, observerOptions);
}

function observePageElements() {
    if (!globalObserver) return; 

    const elementsToObserve = document.querySelectorAll(
        '.skill-category, .project-card, .section-title, ' + // index.html
        '.focus-card, .cta-container, ' + // index.html new
        '.about-hero, .timeline-item, .skill-category-detailed, .achievement-card, .stat, ' + // about.html
        '.project-card-detailed, ' + // projects.html
        '.contact-method, .contact-form-container, .quick-link' // contact.html
    );
    
    elementsToObserve.forEach(el => {
        el.classList.add('fade-in'); 
        globalObserver.observe(el);  
    });
}

window.observePageElements = observePageElements;

// --- Mobile Navigation ---

function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// --- *** NEW: Footer Injection *** ---

function injectFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;

    const footerHTML = `
        <div class="footer-container">
            <div class="footer-socials">
                <a href="https://github.com/d4a1k11s19h8" class="social-link-footer" target="_blank">GitHub</a>
                <a href="https://linkedin.com/in/rathoredaksh2004" class="social-link-footer" target="_blank">LinkedIn</a>
                <a href="https://codeforces.com/profile/daksh1515" class="social-link-footer" target="_blank">Codeforces</a>
            </div>
            <div class="footer-bottom">
                <a href="#" class="back-to-top">Back to Top ↑</a>
                <p>&copy; ${new Date().getFullYear()} Daksh Rathore. All rights reserved.</p>
            </div>
        </div>
    `;
    
    footerPlaceholder.innerHTML = footerHTML;

    // Add event listener for back-to-top
    const backToTop = footerPlaceholder.querySelector('.back-to-top');
    if(backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}


// --- Utilities ---

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.utils = {
    debounce
};