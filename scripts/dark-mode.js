// Dark Mode Functionality
class DarkMode {
    constructor() {
        this.toggleBtn = document.getElementById('darkModeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        this.setTheme(this.currentTheme);
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.toggleBtn.addEventListener('click', () => this.toggleTheme());
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateToggleButton(theme);
        this.currentTheme = theme;
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add transition class for smooth theme change
        document.documentElement.classList.add('theme-transition');
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);
    }
    
    updateToggleButton(theme) {
        const icon = this.toggleBtn.querySelector('.toggle-icon');
        if (theme === 'dark') {
            icon.textContent = '☀️';
            icon.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.textContent = '🌙';
            icon.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
    
    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Initialize Dark Mode when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DarkMode();
});

// Add transition styles for theme switching
const style = document.createElement('style');
style.textContent = `
    .theme-transition * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
    }
`;
document.head.appendChild(style);