document.addEventListener('DOMContentLoaded', function () {

    // =========================================
    // Sticky Header
    // =========================================
    const header = document.getElementById('header');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // =========================================
    // Mobile Menu Toggle
    // =========================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('nav');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        if (!header.contains(event.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });

    // =========================================
    // Active Link Handling
    // =========================================
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // =========================================
    // Animated Counters
    // =========================================
    const counters = document.querySelectorAll('.stat-number');

    if (counters.length > 0) {
        const speed = 200; // The lower the slower

        const animateCounters = () => {
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;

                    // Lower inc to slow and higher to slow
                    const inc = target / speed;

                    if (count < target) {
                        // Add inc to count and output in counter
                        counter.innerText = Math.ceil(count + inc);
                        // Call function every ms
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCount();
            });
        };

        // Trigger animation when stats section is in view
        let animated = false;
        const statsSection = document.querySelector('.hero-stats');

        if (statsSection) {
            window.addEventListener('scroll', function () {
                const sectionPos = statsSection.getBoundingClientRect().top;
                const screenPos = window.innerHeight / 1.3;

                if (sectionPos < screenPos && !animated) {
                    animateCounters();
                    animated = true;
                }
            });
        }
    }

    // =========================================
    // Testimonials Slider (Swiper)
    // =========================================
    if (document.querySelector('.testimonial-slider')) {
        const swiper = new Swiper('.testimonial-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    }

    // =========================================
    // Scroll Animation (Fade In)
    // =========================================
    const fadeElems = document.querySelectorAll('.service-card, .feature-card, .about-text, .about-image-main, .pricing-card, .team-card, .service-detail-card');

    const checkFade = () => {
        const triggerBottom = window.innerHeight / 5 * 4;

        fadeElems.forEach(elem => {
            const boxTop = elem.getBoundingClientRect().top;

            if (boxTop < triggerBottom) {
                elem.classList.add('visible');
            }
        });
    };

    // Add CSS for fade animation
    const style = document.createElement('style');
    style.innerHTML = `
        .service-card, .feature-card, .about-text, .about-image-main, .pricing-card, .team-card, .service-detail-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .service-card.visible, .feature-card.visible, .about-text.visible, .about-image-main.visible, .pricing-card.visible, .team-card.visible, .service-detail-card.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', checkFade);
    checkFade(); // Check on load

    // =========================================
    // Contact Form Validation
    // =========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            const inputs = contactForm.querySelectorAll('input, select, textarea');
            let isValid = true;

            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });

            if (isValid) {
                const btn = contactForm.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                const statusDiv = document.getElementById('form-status');
                const formData = new FormData(contactForm);

                btn.innerText = 'Sending...';
                btn.disabled = true;
                statusDiv.innerHTML = '';

                fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        statusDiv.innerHTML = '<div style="background-color: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 20px;">Thanks for your message! We will get back to you soon.</div>';
                        contactForm.reset();
                        btn.innerText = 'Message Sent!';
                        btn.style.backgroundColor = '#28a745';

                        setTimeout(() => {
                            btn.innerText = originalText;
                            btn.disabled = false;
                            btn.style.backgroundColor = '';
                            // Optional: clear success message after some time
                            // setTimeout(() => { statusDiv.innerHTML = ''; }, 5000);
                        }, 3000);
                    } else {
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                statusDiv.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                            } else {
                                statusDiv.innerHTML = '<div style="background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 20px;">Oops! There was a problem submitting your form</div>';
                            }
                            btn.innerText = originalText;
                            btn.disabled = false;
                        });
                    }
                }).catch(error => {
                    statusDiv.innerHTML = '<div style="background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 20px;">Oops! There was a problem submitting your form</div>';
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
            }
        });
    }

    // Handle URL parameters for service selection
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');

    if (serviceParam && document.getElementById('service')) {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect.querySelector(`option[value="${serviceParam}"]`)) {
            serviceSelect.value = serviceParam;
        }
    }
});
