// Modern Portfolio JavaScript - Interactive Features

class ModernPortfolio {
    constructor() {
        this.currentSection = 'hero';
        this.isScrolling = false;
        this.typingTexts = [
            'Creative Developer',
            'Web Technology',
            'Problem Solver',
        ];
        this.typingIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startTypingAnimation();
        this.animateSkillBars();
        this.setupIntersectionObserver();
        this.initFloatingShapes();
        this.setupFormValidation();
        this.loadTheme();
        window.addEventListener('load', () => {
            this.setupProjectSliders();
        });
    }

    setupEventListeners() {
        // Floating navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.scrollToSection(section);
            });
        });

        // Dark mode toggle
        const modeToggle = document.getElementById('modeToggle');
        modeToggle.addEventListener('click', () => this.toggleTheme());

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());

        // Form submission
        const contactForm = document.getElementById('contactForm');
        contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Button actions
        window.scrollToSection = (section) => this.scrollToSection(section);
        window.downloadResume = () => this.downloadResume();
        window.closeModal = () => this.closeModal();

        // Smooth scroll for hero buttons
        document.querySelectorAll('.glass-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.onclick) return;
                e.preventDefault();
                const href = btn.getAttribute('href') || btn.dataset.section;
                if (href && href.startsWith('#')) {
                    this.scrollToSection(href.substring(1));
                }
            });
        });

        // Skill bars animation trigger
        window.addEventListener('scroll', () => this.checkSkillBarsVisibility());
    }

    // Typing Animation
    startTypingAnimation() {
        const typingElement = document.getElementById('typingText');
        if (!typingElement) return;

        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseTime = 2000;

        const type = () => {
            const currentText = this.typingTexts[this.typingIndex];

            if (this.isDeleting) {
                typingElement.textContent = currentText.substring(0, this.charIndex - 1);
                this.charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, this.charIndex + 1);
                this.charIndex++;
            }

            let nextTimeout = this.isDeleting ? deleteSpeed : typeSpeed;

            if (!this.isDeleting && this.charIndex === currentText.length) {
                nextTimeout = pauseTime;
                this.isDeleting = true;
            } else if (this.isDeleting && this.charIndex === 0) {
                this.isDeleting = false;
                this.typingIndex = (this.typingIndex + 1) % this.typingTexts.length;
            }

            setTimeout(type, nextTimeout);
        };

        type();
    }

    // Scroll Navigation
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        this.isScrolling = true;

        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        this.updateActiveNav(sectionId);

        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }

    updateActiveNav(activeSection) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === activeSection) {
                item.classList.add('active');
            }
        });
        this.currentSection = activeSection;
    }

    handleScroll() {
        if (this.isScrolling) return;

        const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
        let currentSection = 'hero';

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    currentSection = sectionId;
                }
            }
        });

        if (currentSection !== this.currentSection) {
            this.updateActiveNav(currentSection);
        }
    }

    // Theme Toggle
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);

        const icon = document.querySelector('.mode-toggle i');
        icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';

        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        const icon = document.querySelector('.mode-toggle i');
        if (icon) {
            icon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Skill Bars Animation
    animateSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');

        skillItems.forEach(item => {
            const level = item.dataset.level;
            const progressBar = item.querySelector('.skill-fill');
            if (progressBar) {
                setTimeout(() => {
                    progressBar.style.width = level + '%';
                }, 500);
            }
        });
    }

    checkSkillBarsVisibility() {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;

        const rect = skillsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible && !skillsSection.classList.contains('animated')) {
            skillsSection.classList.add('animated');
            this.animateSkillBars();
        }
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');

                    if (entry.target.classList.contains('about-card')) {
                        entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                    }

                    if (entry.target.classList.contains('timeline-card')) {
                        const cards = entry.target.parentElement.querySelectorAll('.timeline-card');
                        cards.forEach((card, index) => {
                            if (card === entry.target) {
                                card.style.animationDelay = `${index * 0.2}s`;
                            }
                        });
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.about-card, .timeline-card, .exp-card, .project-card, .contact-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Floating shapes animation
    initFloatingShapes() {
        const shapes = document.querySelectorAll('.shape');

        shapes.forEach((shape, index) => {
            const randomX = Math.random() * window.innerWidth;
            const randomY = Math.random() * window.innerHeight;

            shape.style.left = randomX + 'px';
            shape.style.top = randomY + 'px';

            setInterval(() => {
                const newX = Math.random() * window.innerWidth;
                const newY = Math.random() * window.innerHeight;

                shape.style.transition = 'all 8s ease-in-out';
                shape.style.left = newX + 'px';
                shape.style.top = newY + 'px';
            }, 8000 + (index * 1000));
        });
    }

    // Project Cards Interaction
    setupProjectCards() {
        document.querySelectorAll('.project-card').forEach(card => {
            const overlay = card.querySelector('.project-overlay');

            card.addEventListener('mouseenter', () => {
                if (overlay) overlay.style.opacity = '1';
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                if (overlay) overlay.style.opacity = '0';
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Image Slider
    setupProjectSliders() {
        document.querySelectorAll('.slider').forEach(slider => {
            const slides = slider.querySelector('.slides');
            const total = slides.children.length;
            const dotsContainer = slider.querySelector('.slide-dots');
            let current = 0;

            // Build dots
            for (let i = 0; i < total; i++) {
                const dot = document.createElement('span');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            }

            function goTo(index) {
                current = (index + total) % total;
                slides.style.transform = `translateX(-${current * 100}%)`;
                dotsContainer.querySelectorAll('span').forEach((d, i) => {
                    d.classList.toggle('active', i === current);
                });
            }

            slider.querySelector('.prev').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                goTo(current - 1);
            });

            slider.querySelector('.next').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                goTo(current + 1);
            });
        });
    }

    // Form Validation and Submission
    setupFormValidation() {
        const form = document.getElementById('contactForm');
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        this.clearFieldError(field);

        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
            case 'text':
                if (value.length < 2) {
                    errorMessage = 'This field must be at least 2 characters';
                    isValid = false;
                }
                break;
            case 'textarea':
                if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) errorDiv.remove();
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const inputs = form.querySelectorAll('input, textarea, select');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Please fix the errors before submitting', 'error');
            return;
        }

        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            this.showSuccessModal();
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            inputs.forEach(input => this.clearFieldError(input));
        }, 2000);
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    closeModal() {
        const modal = document.getElementById('successModal');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Resume Download
    downloadResume() {
        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,Alex Morgan - Resume\n\nThis is a demo resume download.';
        link.download = 'Alex_Morgan_Resume.txt';
        link.click();
        this.showNotification('Resume download started!', 'success');
    }
}

// Additional Utility Functions
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-bg');

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new ModernPortfolio();
    addSmoothScrolling();
    addParallaxEffect();

    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);
});

// Additional CSS animations
const additionalStyles = `
.animate-in {
    animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes slideInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

.form-group input.error,
.form-group textarea.error,
.form-group select.error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.field-error {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.field-error::before { content: '⚠'; }

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--glass-bg);
    backdrop-filter: var(--blur);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10000;
    box-shadow: var(--shadow-light);
}

.notification.show { transform: translateX(0); opacity: 1; }
.notification.error { border-color: #ef4444; background: rgba(239, 68, 68, 0.1); }
.notification.success { border-color: #10b981; background: rgba(16, 185, 129, 0.1); }

.modal {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.modal.show { opacity: 1; }

.modal-content {
    background: var(--glass-bg);
    backdrop-filter: var(--blur);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 3rem;
    text-align: center;
    max-width: 400px;
    margin: 2rem;
    transform: scale(0.7);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal.show .modal-content { transform: scale(1); }
.modal-icon { font-size: 4rem; color: #10b981; margin-bottom: 1.5rem; }
.modal-content h3 { font-size: 1.5rem; margin-bottom: 1rem; color: var(--text-primary); }
.modal-content p { color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6; }

body:not(.loaded) { overflow: hidden; }

body:not(.loaded)::before {
    content: '';
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: var(--primary-gradient);
    z-index: 10002;
}

body:not(.loaded)::after {
    content: '';
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 50px; height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    z-index: 10003;
}

@keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);