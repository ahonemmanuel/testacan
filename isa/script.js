// Version JavaScript simplifiée du clone ISA World
// Compatible avec tous les navigateurs

class ISAWorldApp {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 4;
        this.autoPlayInterval = null;
        this.countAnimationTriggered = false;

        this.init();
    }

    init() {
        this.setupSlider();
        this.setupCountryModal();
        this.setupStatsAnimation();
        this.setupMobileMenu();
        this.setupFormHandlers();
        this.setupSmoothScrolling();
    }

    // Slider fonctionnalité
    setupSlider() {
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const sliderContainer = document.querySelector('.hero-slider');

        // Auto-play
        this.startAutoPlay();

        // Boutons navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Navigation par points
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause auto-play au survol
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
            sliderContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }

    goToSlide(slideIndex) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');

        // Retirer la classe active
        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove('active');
        }
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove('active');
        }

        // Ajouter la classe active
        if (slides[slideIndex]) slides[slideIndex].classList.add('active');
        if (dots[slideIndex]) dots[slideIndex].classList.add('active');

        this.currentSlide = slideIndex;
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    // Modal des pays
    setupCountryModal() {
        const countryBtn = document.getElementById('countryBtn');
        const countryModal = document.getElementById('countryModal');
        const closeModal = document.getElementById('closeModal');

        if (countryBtn && countryModal) {
            countryBtn.addEventListener('click', () => {
                countryModal.classList.add('active');
            });
        }

        if (closeModal && countryModal) {
            closeModal.addEventListener('click', () => {
                countryModal.classList.remove('active');
            });
        }

        // Fermer en cliquant à l'extérieur
        if (countryModal) {
            countryModal.addEventListener('click', (e) => {
                if (e.target === countryModal) {
                    countryModal.classList.remove('active');
                }
            });
        }

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && countryModal && countryModal.classList.contains('active')) {
                countryModal.classList.remove('active');
            }
        });
    }

    // Animation des statistiques
    setupStatsAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');

        const animateCount = (element, target, duration = 2000) => {
            let start = 0;
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Animation fluide
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + (target - start) * easeOutCubic);

                element.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    element.textContent = target.toLocaleString();
                }
            };

            requestAnimationFrame(updateCount);
        };

        // Observer pour déclencher l'animation
        if ('IntersectionObserver' in window) {
            const statsObserver = new IntersectionObserver((entries) => {
                for (let i = 0; i < entries.length; i++) {
                    const entry = entries[i];
                    if (entry.isIntersecting && !this.countAnimationTriggered) {
                        this.countAnimationTriggered = true;

                        for (let j = 0; j < statNumbers.length; j++) {
                            const stat = statNumbers[j];
                            const target = parseInt(stat.getAttribute('data-count') || '0');
                            animateCount(stat, target);
                        }
                    }
                }
            }, { threshold: 0.5 });

            const statsSection = document.querySelector('.stats-section');
            if (statsSection) {
                statsObserver.observe(statsSection);
            }
        }
    }

    // Menu mobile
    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mainNav = document.querySelector('.main-nav');

        if (mobileMenuBtn && mainNav) {
            mobileMenuBtn.addEventListener('click', () => {
                mainNav.classList.toggle('active');
            });

            // Fermer en cliquant à l'extérieur
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.main-nav') && !e.target.closest('.mobile-menu-btn')) {
                    mainNav.classList.remove('active');
                }
            });
        }
    }

    // Gestion des formulaires
    setupFormHandlers() {
        // Formulaire de contact
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(e);
            });
        }

        // Formulaire newsletter
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterForm(e);
            });
        }
    }

    handleContactForm(e) {
        const form = e.target;
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        for (let i = 0; i < requiredFields.length; i++) {
            const input = requiredFields[i];
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ff4444';
            } else {
                input.style.borderColor = '';
            }
        }

        if (isValid) {
            this.showNotification('Message envoyé avec succès!', 'success');
            form.reset();
        } else {
            this.showNotification('Veuillez remplir tous les champs requis.', 'error');
        }
    }

    handleNewsletterForm(e) {
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');

        if (emailInput && emailInput.value.trim() && this.isValidEmail(emailInput.value)) {
            this.showNotification('Inscription réussie à la newsletter!', 'success');
            form.reset();
        } else {
            this.showNotification('Veuillez entrer une adresse email valide.', 'error');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Système de notifications
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.textContent = message;

        // Styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 600;
            z-index: 10001;
            background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Suppression après 4 secondes
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Navigation fluide
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');

        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        }
    }
}

// Styles supplémentaires pour le menu mobile et animations
const additionalCSS = `
.main-nav.active {
    display: flex !important;
    position: fixed;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    z-index: 999;
}

.main-nav.active ul {
    flex-direction: column;
    width: 100%;
    padding: 20px;
}

.main-nav.active li {
    width: 100%;
    border-bottom: 1px solid #eee;
}

.main-nav.active a {
    display: block;
    padding: 15px 0;
    width: 100%;
}

.animate-in {
    animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Ajouter les styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Animation de chargement
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #1a1c26;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid #d8a857;
                border-top: 3px solid transparent;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        </div>
    `;

    document.body.appendChild(loader);

    // Retirer le loader
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(loader)) {
                document.body.removeChild(loader);
            }
        }, 500);
    }, 1000);
});

// Initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new ISAWorldApp();
});
