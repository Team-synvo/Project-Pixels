
// Visitor Tracking - Client-side only for static hosting
function initVisitorTracking() {
    try {
        const totalEl = document.getElementById('totalVisits');
        if (totalEl) {
            // For static hosting, show a placeholder or remove the counter
            totalEl.textContent = '-';
        }
    } catch (error) {
        console.error('Error initializing visitor tracking:', error);
    }
}

// Initialize visitor tracking on page load
initVisitorTracking();

// Search Functionality
const searchInput = document.getElementById('searchInput');
const scriptCards = document.querySelectorAll('.script-card');
const documentarySections = document.querySelectorAll('.documentary-section');
const documentarySeparator = document.getElementById('documentary-separator');
const disclaimerSection = document.querySelector('.disclaimer-section');
const noResults = document.getElementById('noResults');
const searchTerm = document.getElementById('searchTerm');

searchInput.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase().trim();
    let hasVisibleCards = false;

    scriptCards.forEach(card => {
        const scriptName = card.getAttribute('data-script-name') || '';
        const matchesSearch = scriptName.includes(query);

        if (matchesSearch) {
            card.classList.remove('hidden');
            hasVisibleCards = true;
        } else {
            card.classList.add('hidden');
        }
    });

    // Show/hide documentary sections and disclaimer based on search
    if (query === '') {
        documentarySections.forEach(section => section.classList.remove('hidden'));
        if (documentarySeparator) documentarySeparator.classList.remove('hidden');
        if (disclaimerSection) disclaimerSection.classList.remove('hidden');
        noResults.style.display = 'none';
    } else {
        documentarySections.forEach(section => section.classList.add('hidden'));
        if (documentarySeparator) documentarySeparator.classList.add('hidden');
        if (disclaimerSection) disclaimerSection.classList.add('hidden');

        if (!hasVisibleCards) {
            searchTerm.textContent = e.target.value;
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
});

// Copy Code Functionality
window.copyCode = function(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;

    navigator.clipboard.writeText(code).then(() => {
        // Change icon to check mark
        button.classList.add('copied');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;

        // Reset after 2 seconds
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code:', err);
    });
}

// Toggle Instructions
window.toggleInstructions = function(button) {
    const instructionsContent = button.nextElementSibling;
    const isActive = button.classList.contains('active');

    if (isActive) {
        button.classList.remove('active');
        instructionsContent.classList.remove('show');
    } else {
        button.classList.add('active');
        instructionsContent.classList.add('show');
    }
}

// Pill Menu Filter Functionality
window.filterContent = function(filter) {
    const jailbreaksSections = document.querySelectorAll('.ai-section');
    const documentarySections = document.querySelectorAll('.documentary-section');
    const separators = document.querySelectorAll('.separator');
    const disclaimerSection = document.querySelector('.disclaimer-section');
    const heroSection = document.querySelector('.hero-section');
    
    // Update active pill
    document.querySelectorAll('.pill-nav-item').forEach(pill => {
        pill.classList.remove('active');
    });
    const activeFilter = document.querySelector(`[data-filter="${filter}"]`);
    if (activeFilter) activeFilter.classList.add('active');
    
    // Reset search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    const scriptCards = document.querySelectorAll('.script-card');
    scriptCards.forEach(card => card.classList.remove('hidden'));
    const noResults = document.getElementById('noResults');
    if (noResults) noResults.style.display = 'none';
    
    switch(filter) {
        case 'all':
            if (heroSection) heroSection.classList.remove('hidden');
            jailbreaksSections.forEach(section => section.classList.remove('hidden'));
            documentarySections.forEach(section => section.classList.remove('hidden'));
            separators.forEach(sep => sep.classList.remove('hidden'));
            if (disclaimerSection) disclaimerSection.classList.remove('hidden');
            break;
            
        case 'jailbreaks':
            if (heroSection) heroSection.classList.add('hidden');
            jailbreaksSections.forEach(section => section.classList.remove('hidden'));
            documentarySections.forEach(section => section.classList.add('hidden'));
            separators.forEach((sep, index) => {
                if (index === 0) sep.classList.add('hidden');
                else sep.classList.add('hidden');
            });
            if (disclaimerSection) disclaimerSection.classList.add('hidden');
            break;
            
        case 'documentation':
            if (heroSection) heroSection.classList.add('hidden');
            jailbreaksSections.forEach(section => section.classList.add('hidden'));
            documentarySections.forEach((section, index) => {
                if (section.id === 'how-it-works') {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
            separators.forEach(sep => sep.classList.add('hidden'));
            if (disclaimerSection) disclaimerSection.classList.add('hidden');
            break;
            
        case 'defense':
            if (heroSection) heroSection.classList.add('hidden');
            jailbreaksSections.forEach(section => section.classList.add('hidden'));
            documentarySections.forEach((section, index) => {
                if (section.id === 'defense') {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
            separators.forEach(sep => sep.classList.add('hidden'));
            if (disclaimerSection) disclaimerSection.classList.remove('hidden');
            break;
    }
}

// Smooth scroll for anchor links (if any are added later)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll shadow to navbar
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 10) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// ENHANCED LIQUID GLASS EFFECTS
// ============================================

// Particle System
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        if (this.y < 0) this.y = this.canvas.height;
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize Particle Canvas
const particleCanvas = document.getElementById('particleCanvas');
if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    function resizeCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }

    function initParticles() {
        particles = [];
        // Reduce particles on mobile for better performance
        const isMobile = window.innerWidth < 768;
        const baseCount = Math.floor((particleCanvas.width * particleCanvas.height) / 15000);
        const particleCount = isMobile ? Math.min(baseCount, 30) : Math.min(baseCount, 100);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(particleCanvas));
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        // Draw connections between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        animationFrameId = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    // Pause animation when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrameId);
        } else {
            animateParticles();
        }
    });
}

// Cursor Glow Effect
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow) {
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        
        requestAnimationFrame(animateGlow);
    }

    animateGlow();
}

// Ripple Effect on Card Click
function createRipple(e, element) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    let container = element.querySelector('.ripple-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'ripple-container';
        element.appendChild(container);
    }
    
    container.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 800);
}

// Add ripple effect to cards
document.querySelectorAll('.script-card, .doc-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
            createRipple(e, card);
        }
    });
});

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Add scroll-reveal class to elements
document.querySelectorAll('.script-card, .doc-card, .hero-section, .documentary-section').forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
});

// Parallax Effect on Scroll
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    
    document.querySelectorAll('.gradient-blob').forEach((blob, index) => {
        const speed = 0.5 + (index * 0.2);
        blob.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Enhanced Card Hover with Tilt Effect (Desktop only)
if (window.innerWidth > 768) {
    document.querySelectorAll('.script-card, .doc-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Add rainbow glass effect to badges on hover
document.querySelectorAll('.badge').forEach(badge => {
    badge.classList.add('glass-rainbow');
});

// Performance: Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        el.classList.add('revealed');
    });
}
