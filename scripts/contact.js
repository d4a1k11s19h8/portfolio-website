// Contact Page Functionality
class ContactManager {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.formMessage = document.getElementById('formMessage');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupSocialInteractions();
    }

    setupEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Add interaction effects to contact methods
        const contactMethods = document.querySelectorAll('.contact-method');
        contactMethods.forEach(method => {
            method.addEventListener('mouseenter', this.handleMethodHover);
            method.addEventListener('mouseleave', this.handleMethodLeave);
        });

        // Add click effects to quick links
        const quickLinks = document.querySelectorAll('.quick-link');
        quickLinks.forEach(link => {
            link.addEventListener('click', this.handleQuickLinkClick);
        });
    }

    setupFormValidation() {
        const inputs = this.form?.querySelectorAll('input, textarea');
        if (inputs) {
            inputs.forEach(input => {
                input.addEventListener('blur', (e) => this.validateField(e.target));
                input.addEventListener('input', (e) => this.clearFieldError(e.target));
            });
        }
    }

    setupSocialInteractions() {
        const socialIcons = document.querySelectorAll('.social-icon');
        socialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', this.handleSocialHover);
            icon.addEventListener('mouseleave', this.handleSocialLeave);
        });
    }

    // *** BUG FIX: Replaced simulation with a real fetch request to Formspree ***
    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showFormMessage('Please correct the errors in the form.', 'error');
            return;
        }

        const formData = new FormData(this.form);
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Show loading state
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        submitBtn.disabled = true;
        this.formMessage.classList.add('hidden'); // Hide old messages

        try {
            // Get the action URL from the form's HTML
            const formAction = this.form.getAttribute('action');
            if (!formAction || formAction.includes('YOUR_FORM_ID_HERE')) {
                throw new Error('Formspree URL is not set. Please update contact.html.');
            }

            const response = await fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                this.showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.form.reset();
                this.form.querySelectorAll('.success').forEach(el => el.classList.remove('success'));
            } else {
                throw new Error('Form submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormMessage(error.message || 'Failed to send message. Please try again or contact me directly via email.', 'error');
        } finally {
            // Reset button state
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
            submitBtn.disabled = false;
        }
    }

    // *** REMOVED: simulateFormSubmission() is no longer needed ***

    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearFieldError(field);

        if (value.length === 0 && field.required) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value.length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        } else if (field.type === 'text' && field.name === 'name' && value.length > 0) {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
        } else if (field.name === 'message' && value.length > 0) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else if (value.length > 0) {
            this.showFieldSuccess(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    showFieldSuccess(field) {
        field.classList.add('success');
        field.classList.remove('error');
        this.clearFieldError(field);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showFormMessage(message, type) {
        if (!this.formMessage) return;

        this.formMessage.textContent = message;
        this.formMessage.className = `form-message ${type}`;
        this.formMessage.classList.remove('hidden');

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.formMessage.classList.add('hidden');
            }, 5000);
        }
    }

    handleMethodHover(e) {
        const method = e.currentTarget;
        method.style.transform = 'translateX(10px)';
        method.style.boxShadow = 'var(--shadow-lg)';
    }

    handleMethodLeave(e) {
        const method = e.currentTarget;
        method.style.transform = 'translateX(0)';
        method.style.boxShadow = 'var(--shadow)';
    }

    handleSocialHover(e) {
        const icon = e.currentTarget;
        icon.style.transform = 'scale(1.1) translateY(-2px)';
    }

    handleSocialLeave(e) {
        const icon = e.currentTarget;
        icon.style.transform = 'scale(1) translateY(0)';
    }

    handleQuickLinkClick(e) {
        const link = e.currentTarget;
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'scale(1)';
        }, 150);
    }
}

// Initialize Contact Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactManager();
});

// *** ALL CSS INJECTION CODE HAS BEEN REMOVED ***
// It now lives in styles/contact.css