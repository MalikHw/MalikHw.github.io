// Cursor glow effect
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Smooth scroll and active nav link
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Update active nav link
            const sectionId = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Parallax effect on scroll
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content, .culture-image img, .beach-image img');
    
    parallaxElements.forEach((el, index) => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Glitch effect on hover
const glitchText = document.querySelector('.glitch');

glitchText.addEventListener('mouseenter', () => {
    let iterations = 0;
    const maxIterations = 3;
    
    const interval = setInterval(() => {
        if (iterations >= maxIterations) {
            clearInterval(interval);
            glitchText.textContent = 'DJERBA';
            return;
        }
        
        glitchText.textContent = glitchText.textContent
            .split('')
            .map((char, index) => {
                if (index < iterations * 2) {
                    return 'DJERBA'[index];
                }
                return String.fromCharCode(65 + Math.floor(Math.random() * 26));
            })
            .join('');
        
        iterations++;
    }, 50);
});

// Card hover animation stagger
const cards = document.querySelectorAll('.content-card');

cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Beach cards parallax on mouse move
const beachCards = document.querySelectorAll('.beach-card');

beachCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;
        
        const img = card.querySelector('.beach-image img');
        img.style.transform = `scale(1.1) translateX(${percentX * 10}px) translateY(${percentY * 10}px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        const img = card.querySelector('.beach-image img');
        img.style.transform = 'scale(1)';
    });
});

// Scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #0ea5e9, #06b6d4, #f59e0b);
    z-index: 10000;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// Reveal animations on scroll
const revealElements = document.querySelectorAll('.content-card, .culture-item, .beach-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// Typing effect for hero description (on load)
window.addEventListener('load', () => {
    const heroDesc = document.querySelector('.hero-description');
    const text = heroDesc.textContent;
    heroDesc.textContent = '';
    heroDesc.style.opacity = '1';
    
    let i = 0;
    const typingInterval = setInterval(() => {
        if (i < text.length) {
            heroDesc.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
        }
    }, 50);
});
