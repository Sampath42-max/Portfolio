// Diamond Background Animation
class DiamondBackground {
    constructor() {
        this.canvas = document.getElementById('diamondCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.diamonds = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
        this.createDiamonds();
        this.animate();
        this.handleResize();
        this.handleMouse();
    }
    
    init() {
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createDiamonds() {
        const numDiamonds = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < numDiamonds; i++) {
            this.diamonds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2,
                opacity: Math.random() * 0.5 + 0.2,
                color: Math.random() > 0.5 ? '#00d4ff' : '#ff00ff'
            });
        }
    }
    
    drawDiamond(diamond) {
        this.ctx.save();
        this.ctx.translate(diamond.x, diamond.y);
        this.ctx.rotate(diamond.rotation * Math.PI / 180);
        
        // Create diamond shape
        this.ctx.beginPath();
        this.ctx.moveTo(0, -diamond.size);
        this.ctx.lineTo(diamond.size * 0.7, 0);
        this.ctx.lineTo(0, diamond.size);
        this.ctx.lineTo(-diamond.size * 0.7, 0);
        this.ctx.closePath();
        
        // Set diamond color with opacity
        this.ctx.strokeStyle = diamond.color;
        this.ctx.globalAlpha = diamond.opacity;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Add inner diamond for 3D effect
        this.ctx.beginPath();
        this.ctx.moveTo(0, -diamond.size * 0.5);
        this.ctx.lineTo(diamond.size * 0.35, 0);
        this.ctx.lineTo(0, diamond.size * 0.5);
        this.ctx.lineTo(-diamond.size * 0.35, 0);
        this.ctx.closePath();
        this.ctx.globalAlpha = diamond.opacity * 0.3;
        this.ctx.fillStyle = diamond.color;
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    updateDiamond(diamond) {
        // Move diamond
        diamond.x += diamond.speedX;
        diamond.y += diamond.speedY;
        diamond.rotation += diamond.rotationSpeed;
        
        // Mouse interaction
        const dx = this.mouseX - diamond.x;
        const dy = this.mouseY - diamond.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
            const force = (150 - distance) / 150;
            diamond.x -= dx * force * 0.01;
            diamond.y -= dy * force * 0.01;
            diamond.opacity = Math.min(1, diamond.opacity + force * 0.02);
        } else {
            diamond.opacity = Math.max(0.2, diamond.opacity - 0.01);
        }
        
        // Wrap around screen
        if (diamond.x < -diamond.size) diamond.x = this.canvas.width + diamond.size;
        if (diamond.x > this.canvas.width + diamond.size) diamond.x = -diamond.size;
        if (diamond.y < -diamond.size) diamond.y = this.canvas.height + diamond.size;
        if (diamond.y > this.canvas.height + diamond.size) diamond.y = -diamond.size;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections between nearby diamonds
        this.drawConnections();
        
        // Update and draw diamonds
        this.diamonds.forEach(diamond => {
            this.updateDiamond(diamond);
            this.drawDiamond(diamond);
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.diamonds.length; i++) {
            for (let j = i + 1; j < this.diamonds.length; j++) {
                const dx = this.diamonds[i].x - this.diamonds[j].x;
                const dy = this.diamonds[i].y - this.diamonds[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.diamonds[i].x, this.diamonds[i].y);
                    this.ctx.lineTo(this.diamonds[j].x, this.diamonds[j].y);
                    this.ctx.stroke();
                }
            }
        }
        this.ctx.globalAlpha = 1;
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.diamonds = [];
            this.createDiamonds();
        });
    }
    
    handleMouse() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
}

// Navigation functionality
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Hamburger menu toggle
        this.hamburger.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.hamburger.classList.toggle('active');
        });
        
        // Close mobile menu when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.hamburger.classList.remove('active');
            });
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            } else {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            }
        });
        
        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Typing animation for hero section
class TypingAnimation {
    constructor() {
        this.element = document.querySelector('.typing-text');
        this.texts = [
            "Hi, I'm Sampath Kumar",
            "AI Engineer & Developer",
            "ECE Student & Innovator",
            "Building the Future with AI"
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        
        this.init();
    }
    
    init() {
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }
        
        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        
        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        // Add animation classes to elements
        this.addAnimationClasses();
        
        // Create intersection observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, this.observerOptions);
        
        // Observe elements
        this.observeElements();
    }
    
    addAnimationClasses() {
        // Add fade-in animation to section titles
        document.querySelectorAll('.section-title').forEach(el => {
            el.classList.add('fade-in');
        });
        
        // Add slide-in animations to cards
        document.querySelectorAll('.about-card, .project-card, .skill-category').forEach((el, index) => {
            el.classList.add(index % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
        });
        
        // Add fade-in to other elements
        document.querySelectorAll('.stat-item, .cert-item, .contact-item').forEach(el => {
            el.classList.add('fade-in');
        });
    }
    
    observeElements() {
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            this.observer.observe(el);
        });
    }
}

// Skills animation
class SkillsAnimation {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.isAnimated = false;
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isAnimated) {
                    this.animateSkills();
                    this.isAnimated = true;
                }
            });
        }, { threshold: 0.5 });
        
        const skillsSection = document.querySelector('.skills');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }
    
    animateSkills() {
        this.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            }, index * 100);
        });
    }
}

// 3D card effects
class CardEffects {
    constructor() {
        this.cards = document.querySelectorAll('.project-card, .about-card, .education-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                this.handleMouseMove(e, card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.handleMouseLeave(card);
            });
        });
    }
    
    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    }
    
    handleMouseLeave(card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
}

// Contact form functionality
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
    }
    
    handleSubmit() {
        // Get form data
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Here you would typically send the data to a server
        // For now, we'll show a success message
        this.showSuccessMessage();
        this.form.reset();
    }
    
    showSuccessMessage() {
        const button = this.form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        button.textContent = 'Message Sent!';
        button.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'linear-gradient(135deg, #00d4ff, #ff00ff)';
        }, 3000);
    }
}

// Floating elements animation
class FloatingElements {
    constructor() {
        this.elements = document.querySelectorAll('.floating-card, .hero-image');
        this.init();
    }
    
    init() {
        this.elements.forEach(element => {
            this.addFloatingAnimation(element);
        });
    }
    
    addFloatingAnimation(element) {
        let ticking = false;
        
        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const x = (e.clientX / window.innerWidth) * 10 - 5;
                    const y = (e.clientY / window.innerHeight) * 10 - 5;
                    
                    element.style.transform = `translate(${x}px, ${y}px) rotateX(${y}deg) rotateY(${x}deg)`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

// Performance optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy load images if any
        this.lazyLoadImages();
        
        // Optimize scroll events
        this.optimizeScrollEvents();
        
        // Preload critical resources
        this.preloadResources();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    optimizeScrollEvents() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Scroll-based animations go here
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    preloadResources() {
        // Preload critical CSS and fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core components
    new DiamondBackground();
    new Navigation();
    new TypingAnimation();
    new ScrollAnimations();
    new SkillsAnimation();
    new CardEffects();
    new ContactForm();
    new FloatingElements();
    new PerformanceOptimizer();
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Console welcome message
    console.log(`
    ╔══════════════════════════════════════╗
    ║          Sampath Kumar Gummidi       ║
    ║        AI Engineer & Developer       ║
    ║                                      ║
    ║  Portfolio built with passion 🚀     ║
    ║  Contact: sampathgummidi@gmail.com   ║
    ╚══════════════════════════════════════╝
    `);
});

// Additional utility functions
const utils = {
    // Smooth scroll to element
    scrollToElement: (elementId, offset = 70) => {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    },
    
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Export utils for global use
window.portfolioUtils = utils;
