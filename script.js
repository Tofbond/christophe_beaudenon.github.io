
// ---- Stage tabs ----
function switchStage(btn, id) {
    document.querySelectorAll('.stage-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.stage-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('stage-' + id).classList.add('active');
}


// ---- Safety fallback: reveal all elements after delay ----
setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        el.classList.add('visible');
    });
}, 1500);

// ============================================================
// Portfolio JS — Christophe Beaudenon · BTS SIO SISR
// ============================================================

// ---- Mark JS as loaded (enables reveal animations) ----
document.documentElement.classList.add('js-loaded');

// ---- CV Tabs ----
document.querySelectorAll('.cv-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.cv-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.cv-tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + tab).classList.add('active');
        // re-trigger reveal for newly visible items
        document.querySelectorAll('#tab-' + tab + ' .reveal').forEach(el => {
            el.classList.remove('visible');
            setTimeout(() => revealObserver.observe(el), 10);
        });
    });
});

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ---- Reveal on scroll ----
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- Modal system ----
function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(event, modal) {
    if (event.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(m => {
            m.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

// ---- Active nav link ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.style.color = link.getAttribute('href') === '#' + entry.target.id
                    ? 'var(--text)'
                    : '';
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ---- Slideshow system ----
const slideshows = {
    ftp: { current: 1, total: 8 },
    voip: { current: 1, total: 10 }
};

function openExpose(id) {
    const modal = document.getElementById('expose-' + id);
    if (!modal) return;
    // Small delay to avoid event bubbling closing the modal immediately
    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        initDots(id);
        updateSlideshow(id);
    }, 10);
}

function initDots(id) {
    const container = document.getElementById(id + '-dots');
    if (!container || container.children.length > 0) return;
    const ss = slideshows[id];
    for (let i = 1; i <= ss.total; i++) {
        const dot = document.createElement('button');
        dot.className = 'slideshow__dot' + (i === 1 ? ' active' : '');
        dot.onclick = () => { ss.current = i; updateSlideshow(id); };
        container.appendChild(dot);
    }
}

function changeSlide(id, dir) {
    const ss = slideshows[id];
    ss.current = Math.max(1, Math.min(ss.total, ss.current + dir));
    updateSlideshow(id);
}

function updateSlideshow(id) {
    const ss = slideshows[id];
    const track = document.getElementById(id + '-track');
    const slides = track.querySelectorAll('.slide');
    slides.forEach((s, i) => s.classList.toggle('active', i + 1 === ss.current));

    document.getElementById(id + '-current').textContent = ss.current;

    const dots = document.querySelectorAll('#' + id + '-dots .slideshow__dot');
    dots.forEach((d, i) => d.classList.toggle('active', i + 1 === ss.current));

    const prev = document.getElementById(id + '-prev');
    const next = document.getElementById(id + '-next');
    if (prev) prev.disabled = ss.current === 1;
    if (next) {
        if (ss.current === ss.total) {
            next.textContent = '✓ Fin';
            next.disabled = true;
        } else {
            next.textContent = 'Suivant →';
            next.disabled = false;
        }
    }
}
