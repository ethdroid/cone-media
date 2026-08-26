// ============================================================
// CONE MEDIA — site behavior
// Entrance sequence · scroll reveals · mobile nav · EmailJS form
// ============================================================

// Initialize EmailJS with your public key
(function () {
    emailjs.init("aV25FzzU9i1Lwi1BM");
})();

// ------------------------------------------------------------
// Entrance overlay
// Plays on every page load; skipped only for reduced-motion users.
// ------------------------------------------------------------
const entrance = document.getElementById('entrance');
const nav = document.getElementById('nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function finishEntrance() {
    entrance.classList.add('is-done');
    nav.classList.add('is-visible');
    document.body.style.overflow = '';
}

if (reducedMotion) {
    entrance.style.display = 'none';
    nav.classList.add('is-visible');
} else {
    document.body.style.overflow = 'hidden';
    // Total choreography ≈ 1.7s, then lift the curtain
    setTimeout(finishEntrance, 1700);
    // Let impatient visitors skip with a click or key press
    entrance.addEventListener('click', finishEntrance);
    window.addEventListener('keydown', finishEntrance, { once: true });
}

// ------------------------------------------------------------
// Scroll-triggered reveals
// ------------------------------------------------------------
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !reducedMotion) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-inview');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
        // Small stagger for elements that share a container
        el.style.transitionDelay = `${(i % 4) * 70}ms`;
        io.observe(el);
    });
} else {
    revealEls.forEach((el) => el.classList.add('is-inview'));
}

// ------------------------------------------------------------
// Mobile nav
// ------------------------------------------------------------
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
});

// Close the mobile menu after choosing a link
navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
    });
});

// ------------------------------------------------------------
// Smooth scrolling with fixed-nav offset
// ------------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navHeight = nav.offsetHeight + 10;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
});

// ------------------------------------------------------------
// Contact form → EmailJS
// Uses the existing service / template; field names unchanged
// (firstName, lastName, companyName, email, phone, message).
// ------------------------------------------------------------
const contactForm = document.getElementById('contact-form');
const contactButton = document.getElementById('contact-submit');
const buttonText = document.getElementById('contact-button-text');
const spinner = document.getElementById('contact-spinner');
const statusDiv = document.getElementById('contact-status');

contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    contactButton.disabled = true;
    buttonText.classList.add('hidden');
    spinner.classList.remove('hidden');
    statusDiv.classList.add('hidden');

    emailjs.sendForm('service_37k89zl', 'template_dzbtue8', this)
        .then(function () {
            statusDiv.textContent = "Thank you! Your message has been sent. We'll get back to you within 24 hours.";
            statusDiv.classList.remove('error', 'hidden');
            statusDiv.classList.add('success');
            contactForm.reset();
        }, function (error) {
            statusDiv.textContent = 'Something went wrong sending your message. Please try again, or call us at (520) 870-9894.';
            statusDiv.classList.remove('success', 'hidden');
            statusDiv.classList.add('error');
            console.log('EmailJS Error:', error);
        })
        .finally(function () {
            contactButton.disabled = false;
            buttonText.classList.remove('hidden');
            spinner.classList.add('hidden');
        });
});

// ------------------------------------------------------------
// Footer year
// ------------------------------------------------------------
document.getElementById('year').textContent = new Date().getFullYear();
