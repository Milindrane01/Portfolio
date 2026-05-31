// ===== Particle Background =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0, mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== Cursor Glow Effect =====
const cursorGlow = document.getElementById('cursorGlow');

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.classList.add('active');
});

document.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('active');
});

// ===== Navbar =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Mobile Navigation =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== Active Nav on Scroll =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.scrollY + 150;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}
window.addEventListener('scroll', updateActiveNav);

// ===== Typing Effect =====
const typingText = document.getElementById('typingText');
const titles = ['Cloud Engineer', 'AI Engineer', 'DevOps Architect', 'MLOps Specialist', 'Solutions Architect'];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const current = titles[titleIndex];

    if (isDeleting) {
        typingText.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
        speed = 2500;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        speed = 400;
    }

    setTimeout(typeEffect, speed);
}
setTimeout(typeEffect, 1800);

// ===== Counter Animation =====
function animateCounters() {
    const stats = document.querySelectorAll('.stat[data-count]');
    stats.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        const numberEl = stat.querySelector('.stat-number');
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            numberEl.textContent = Math.floor(current);
        }, 50);
    });
}

// Trigger counter when hero stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ===== Project Filters =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach((card, index) => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
                card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===== Skill Bar Animation =====
const skillBars = document.querySelectorAll('.skill-bar-fill');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.dataset.width;
            entry.target.style.width = width + '%';
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ===== Scroll Reveal Animations =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

// Apply reveal classes
document.querySelectorAll('.skill-category, .project-card, .cert-card, .timeline-item').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.08}s`;
    revealObserver.observe(el);
});

document.querySelectorAll('.about-grid').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

document.querySelectorAll('.contact-grid').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

document.querySelectorAll('.section-header').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ===== Tilt Effect on Skill Cards =====
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== Magnetic Effect on Buttons =====
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;

    // Create success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 24px; right: 24px; padding: 16px 24px;
        background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3);
        border-radius: 12px; color: #22c55e; font-size: 0.9rem;
        z-index: 10000; backdrop-filter: blur(10px);
        animation: fadeInDown 0.4s ease forwards;
    `;
    notification.innerHTML = `<i class="fas fa-check-circle"></i> Thanks ${name}! Message sent successfully.`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);

    contactForm.reset();
});

// ===== Smooth Section Transitions =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Fallback in case load event already fired
if (document.readyState === 'complete') {
    document.body.classList.add('loaded');
}

// ===== Stagger Children Animation =====
const staggerContainers = ['.skill-tags', '.certs-grid', '.project-filters'];
staggerContainers.forEach(selector => {
    document.querySelectorAll(selector).forEach(container => {
        container.classList.add('stagger-children');
        revealObserver.observe(container);
    });
});

// ===== Parallax on Scroll =====
const parallaxElements = document.querySelectorAll('.orb, .about-float-card');

function handleParallax() {
    const scrollY = window.scrollY;
    parallaxElements.forEach((el, i) => {
        const speed = (i + 1) * 0.03;
        el.style.transform = `translateY(${scrollY * speed}px)`;
    });
}
window.addEventListener('scroll', handleParallax, { passive: true });

// ===== Ripple Effect on Buttons =====
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== Smooth Number Morphing =====
function morphNumber(el, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(start + (target - start) * eased);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ===== Smooth Section Header Reveal =====
document.querySelectorAll('.section-tag').forEach(tag => {
    tag.classList.add('text-reveal');
    tag.style.animationPlayState = 'paused';
});

const tagObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            tagObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.section-tag').forEach(tag => tagObserver.observe(tag));

// ===== Smooth Hover Sound-like Feedback (visual pulse) =====
document.querySelectorAll('.project-card-inner, .cert-card, .skill-category').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, border-color 0.4s ease';
    });
    card.addEventListener('mouseleave', function() {
        this.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.6s ease, border-color 0.6s ease';
    });
});

// ===== Image Reveal on Scroll =====
const imageEl = document.querySelector('.image-placeholder');
if (imageEl) {
    imageEl.classList.add('image-reveal');
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                imgObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    imgObserver.observe(imageEl);
}

// ===== Smooth Scroll Progress Indicator =====
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px; z-index: 10001;
    background: var(--gradient); border-radius: 0 2px 2px 0;
    transition: width 0.1s linear; width: 0%;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
}, { passive: true });

// ===== Subtle Hover Glow Following Mouse on Cards =====
document.querySelectorAll('.skill-category, .project-card-inner, .cert-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
