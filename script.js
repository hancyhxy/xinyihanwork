// /Users/qiansui/Desktop/xinyihan/personalwebsite/script.js
// Interactive JavaScript functionality for Xinyi Han's portfolio website
// Handles view switching, animations, and real-time features

class PortfolioManager {
    constructor() {
        this.currentView = 'gallery';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startClock();
        this.animateOnLoad();
    }

    setupEventListeners() {
        // Tab switching functionality
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Project card hover effects
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
        });

        // Project row interactions
        const projectRows = document.querySelectorAll('.project-row');
        projectRows.forEach(row => {
            row.addEventListener('click', this.handleProjectClick.bind(this));
        });

        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Email link interaction
        const emailLink = document.querySelector('.email-link');
        if (emailLink) {
            emailLink.addEventListener('click', this.handleEmailClick.bind(this));
        }

        // Scroll-based animations
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyPress.bind(this));

        // Resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    switchView(view) {
        if (this.currentView === view) return;

        // Update tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.view === view);
        });

        // Hide current view
        const currentViewElement = document.getElementById(`${this.currentView}-view`);
        if (currentViewElement) {
            currentViewElement.style.opacity = '0';
            setTimeout(() => {
                currentViewElement.style.display = 'none';
                this.showView(view);
            }, 200);
        }

        this.currentView = view;
    }

    showView(view) {
        const viewElement = document.getElementById(`${view}-view`);
        if (viewElement) {
            viewElement.style.display = 'block';
            // Force reflow
            viewElement.offsetHeight;
            viewElement.style.opacity = '1';
            
            // Add animation class
            viewElement.classList.add('fade-in-up');
            setTimeout(() => {
                viewElement.classList.remove('fade-in-up');
            }, 600);
        }
    }

    handleCardHover(e) {
        const card = e.currentTarget;
        const image = card.querySelector('.placeholder-image');
        
        // Add subtle animation
        if (image) {
            image.style.transform = 'scale(1.02)';
        }
    }

    handleCardLeave(e) {
        const card = e.currentTarget;
        const image = card.querySelector('.placeholder-image');
        
        if (image) {
            image.style.transform = 'scale(1)';
        }
    }

    handleProjectClick(e) {
        const row = e.currentTarget;
        const projectName = row.querySelector('.project-name').textContent;
        
        // Simulate project navigation (in a real app, this would navigate to project detail)
        console.log(`Navigating to project: ${projectName}`);
        
        // Add click feedback
        row.style.transform = 'scale(0.98)';
        setTimeout(() => {
            row.style.transform = 'scale(1)';
        }, 150);
    }

    handleNavClick(e) {
        e.preventDefault();
        const target = e.target.getAttribute('href');
        
        if (target.startsWith('#')) {
            const element = document.querySelector(target);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }

    handleEmailClick(e) {
        // Track email click (in a real app, this would send analytics)
        console.log('Email link clicked');
        
        // Add subtle feedback
        const link = e.currentTarget;
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'scale(1)';
        }, 150);
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.nav-header');
        
        // Update header appearance based on scroll
        if (scrolled > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }

        // Parallax effect for hero section (subtle)
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const speed = scrolled * 0.5;
            heroSection.style.transform = `translateY(${speed}px)`;
        }
    }

    handleKeyPress(e) {
        // Keyboard shortcuts
        if (e.key === 'g') {
            this.switchView('gallery');
        } else if (e.key === 'i') {
            this.switchView('index');
        } else if (e.key === 'Escape') {
            // Reset to gallery view
            this.switchView('gallery');
        }
    }

    handleResize() {
        // Debounced resize handler
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.adjustLayoutForScreenSize();
        }, 250);
    }

    adjustLayoutForScreenSize() {
        const width = window.innerWidth;
        const galleryGrid = document.querySelector('.gallery-grid');
        
        // Adjust grid layout based on screen size
        if (width <= 480) {
            galleryGrid.style.gridTemplateColumns = '1fr';
        } else if (width <= 768) {
            galleryGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            galleryGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        }
    }

    startClock() {
        const updateTime = () => {
            const timeElement = document.getElementById('current-time');
            if (timeElement) {
                const now = new Date();
                // Sydney timezone
                const sydneyTime = new Intl.DateTimeFormat('en-US', {
                    timeZone: 'Australia/Sydney',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }).format(now);
                
                timeElement.textContent = sydneyTime;
            }
        };

        // Update immediately and then every second
        updateTime();
        setInterval(updateTime, 1000);
    }

    animateOnLoad() {
        // Stagger animation for project cards
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Animate hero text
        const heroText = document.querySelector('.hero-text');
        if (heroText) {
            heroText.style.opacity = '0';
            heroText.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                heroText.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                heroText.style.opacity = '1';
                heroText.style.transform = 'translateY(0)';
            }, 300);
        }
    }

    // Utility method for smooth animations
    smoothTransition(element, property, value, duration = 300) {
        return new Promise(resolve => {
            element.style.transition = `${property} ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            element.style[property] = value;
            
            setTimeout(resolve, duration);
        });
    }

    // Method to add new project dynamically (for future use)
    addProject(projectData) {
        const { name, type, year, company, status, featured = false } = projectData;
        
        if (this.currentView === 'gallery') {
            this.addProjectCard(projectData);
        } else {
            this.addProjectRow(projectData);
        }
    }

    addProjectCard(projectData) {
        const galleryGrid = document.querySelector('.gallery-grid');
        const card = document.createElement('div');
        card.className = `project-card${projectData.featured ? ' featured' : ''}`;
        
        card.innerHTML = `
            <div class="project-image">
                <div class="placeholder-image"></div>
            </div>
            <div class="project-info">
                <h3>${projectData.name}</h3>
                <p>${projectData.type}</p>
            </div>
        `;
        
        // Add with animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        galleryGrid.appendChild(card);
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    }

    addProjectRow(projectData) {
        const table = document.querySelector('.projects-table');
        const row = document.createElement('div');
        row.className = 'project-row';
        
        row.innerHTML = `
            <span class="year">${projectData.year}</span>
            <span class="project-name">${projectData.name} ●</span>
            <span class="project-type">${projectData.type}</span>
            <span class="company">${projectData.company}</span>
            <span class="status">${projectData.status}</span>
        `;
        
        table.appendChild(row);
    }
}

// Performance optimization: Use requestAnimationFrame for smooth animations
class AnimationManager {
    constructor() {
        this.animations = new Set();
        this.isRunning = false;
    }

    add(callback) {
        this.animations.add(callback);
        if (!this.isRunning) {
            this.start();
        }
    }

    remove(callback) {
        this.animations.delete(callback);
        if (this.animations.size === 0) {
            this.stop();
        }
    }

    start() {
        this.isRunning = true;
        this.tick();
    }

    stop() {
        this.isRunning = false;
    }

    tick() {
        if (!this.isRunning) return;
        
        this.animations.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Animation callback error:', error);
                this.animations.delete(callback);
            }
        });

        if (this.animations.size > 0) {
            requestAnimationFrame(() => this.tick());
        } else {
            this.isRunning = false;
        }
    }
}

// Initialize the portfolio when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if all required elements exist
    const requiredElements = ['.nav-header', '.hero-section', '.gallery-view'];
    const missingElements = requiredElements.filter(selector => !document.querySelector(selector));
    
    if (missingElements.length > 0) {
        console.error('Missing required elements:', missingElements);
        return;
    }

    // Initialize the portfolio
    window.portfolioManager = new PortfolioManager();
    window.animationManager = new AnimationManager();
    
    console.log('Portfolio initialized successfully');
});

// Global utility functions
window.utils = {
    // Debounce function for performance
    debounce(func, wait) {
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
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format time for different timezones
    formatTime(timezone = 'Australia/Sydney') {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(new Date());
    }
};

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // In production, this would send error reports to monitoring service
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}