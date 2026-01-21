// ============================================
// DOM Elementi
// ============================================
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const currentYear = document.getElementById('currentYear');

// ============================================
// Inicijalizacija
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Postavi trenutnu godinu u footer
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Inicijalizuj lazy loading slika
    initLazyLoading();

    // Inicijalizuj smooth scroll
    initSmoothScroll();

    // Inicijalizuj aktivni link tracking
    initActiveLinkTracking();

    // Inicijalizuj header scroll efekat
    initHeaderScroll();

    // Inicijalizuj hero slider
    initHeroSlider();

    // Inicijalizuj hero slider za proizvode
    initProductsHeroSlider();
});

// ============================================
// Hamburger Meni
// ============================================
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');

        // Prevencija scroll-a kada je meni otvoren
        if (!isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Zatvori meni kada se klikne na link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Zatvori meni kada se klikne van njega
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// Dropdown Meni
// ============================================
const productsDropdown = document.getElementById('productsDropdown');
const productsDropdownMenu = document.getElementById('productsDropdownMenu');
const navItemDropdown = document.querySelector('.nav-item-dropdown');

if (productsDropdown && productsDropdownMenu && navItemDropdown) {
    // Desktop: hover
    navItemDropdown.addEventListener('mouseenter', () => {
        navItemDropdown.classList.add('active');
    });

    navItemDropdown.addEventListener('mouseleave', () => {
        navItemDropdown.classList.remove('active');
    });

    // Mobile: click
    productsDropdown.addEventListener('click', (e) => {
        if (window.innerWidth <= 1023) {
            e.preventDefault();
            navItemDropdown.classList.toggle('active');
        }
    });

    // Zatvori dropdown kada se klikne na link
    const dropdownLinks = productsDropdownMenu.querySelectorAll('.dropdown-link');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            navItemDropdown.classList.remove('active');
            // Zatvori hamburger meni ako je otvoren
            if (hamburger && navMenu) {
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Zatvori dropdown kada se klikne van njega
    document.addEventListener('click', (e) => {
        if (!navItemDropdown.contains(e.target) && window.innerWidth > 1023) {
            navItemDropdown.classList.remove('active');
        }
    });
}

// ============================================
// Smooth Scroll
// ============================================
function initSmoothScroll() {
    // Smooth scroll za sve anchor linkove
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Preskoči prazne hash-ove
            if (href === '#' || href === '#home') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Aktivni Link Tracking (Scroll Spy)
// ============================================
function initActiveLinkTracking() {
    // Proveri trenutnu stranicu i postavi active klasu
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const currentHref = window.location.href;

    // Ako smo na about.html ili contact.html, postavi active klasu
    if (currentPage === 'about.html' || currentHref.includes('about.html') || currentHref.includes('pages/about.html')) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Proveri da li je link ka about stranici ili #about-hero
            if (href === '#about-hero' || href === 'about.html' || href === 'pages/about.html' ||
                (href.includes('about.html') && !href.includes('index.html'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    } else if (currentPage === 'contact.html' || currentHref.includes('contact.html') || currentHref.includes('pages/contact.html')) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Proveri da li je link ka contact stranici ili #contact-hero
            if (href === '#contact-hero' || href === 'contact.html' || href === 'pages/contact.html' ||
                (href.includes('contact.html') && !href.includes('index.html'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    const sections = document.querySelectorAll('section[id]');

    if (sections.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    // Ne menjaj active ako je link ka drugoj stranici (bez #)
                    if (href && href.includes('.html') && !href.includes('#')) {
                        return;
                    }
                    // Ne menjaj active ako je link ka trenutnoj stranici (about.html ili contact.html)
                    const isAboutLink = (href === '#about-hero' || href === 'about.html' || href === 'pages/about.html' ||
                        (href.includes('about.html') && !href.includes('index.html')));
                    const isContactLink = (href === '#contact-hero' || href === 'contact.html' || href === 'pages/contact.html' ||
                        (href.includes('contact.html') && !href.includes('index.html')));
                    if ((currentPage === 'about.html' || currentHref.includes('about.html') || currentHref.includes('pages/about.html')) && isAboutLink) {
                        return;
                    }
                    if ((currentPage === 'contact.html' || currentHref.includes('contact.html') || currentHref.includes('pages/contact.html')) && isContactLink) {
                        return;
                    }
                    link.classList.remove('active');
                    if (href === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Fallback za home sekciju
    window.addEventListener('scroll', () => {
        if (window.scrollY < 100 && (currentPage === 'index.html' || currentPage === '')) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                // Ne menjaj active ako je link ka drugoj stranici
                if (href && (href.includes('.html') && !href.includes('#'))) {
                    return;
                }
                if (href === '#home') {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });
}

// ============================================
// Header Scroll Efekat
// ============================================
function initHeaderScroll() {
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

// ============================================
// Lazy Loading Slika
// ============================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback za starije pretraživače
        images.forEach(img => {
            img.classList.add('loaded');
        });
    }
}

// ============================================
// Kontakt Forma Validacija i Toast
// ============================================
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validacija polja
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        const submitButton = contactForm.querySelector('button[type="submit"]');

        let isValid = true;

        // Reset prethodnih grešaka
        [name, email, message].forEach(field => {
            if (field) {
                field.setCustomValidity('');
            }
        });

        // Validacija imena
        if (name && name.value.trim().length < 2) {
            name.setCustomValidity('Ime mora imati najmanje 2 karaktera');
            isValid = false;
        }

        // Validacija email-a
        if (email && !email.validity.valid) {
            email.setCustomValidity('Unesite validnu email adresu');
            isValid = false;
        }

        // Validacija poruke
        if (message && message.value.trim().length < 10) {
            message.setCustomValidity('Poruka mora imati najmanje 10 karaktera');
            isValid = false;
        }

        // Proveri validnost forme
        if (!contactForm.checkValidity() || !isValid) {
            contactForm.reportValidity();
            return;
        }

        // EmailJS konfiguracija
        // ZAMENI OVE VREDNOSTI SA SVOJIM EmailJS PODACIMA:
        // 1. Registruj se na https://www.emailjs.com/
        // 2. Kreiraj Email Service (Gmail, Outlook, itd.)
        // 3. Kreiraj Email Template
        // 4. Uzmi Public Key, Service ID i Template ID
        const EMAILJS_PUBLIC_KEY = 'qHuFg54udCsElnsNc'; // Zameni sa svojim Public Key
        const EMAILJS_SERVICE_ID = 'service_af4uwr7'; // Zameni sa svojim Service ID
        const EMAILJS_TEMPLATE_ID = 'template_a0ozy1d'; // Zameni sa svojim Template ID
        const RECIPIENT_EMAIL = 'vojkan.panic@gmail.com'; // Email na koji se šalje

        // Inicijalizuj EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Slanje...';
        }

        try {
            // Proveri da li je EmailJS učitan
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS nije učitan. Proveri da li je script tag dodat u HTML.');
            }

            // Pripremi podatke za EmailJS
            const templateParams = {
                to_email: RECIPIENT_EMAIL,
                from_name: name ? name.value.trim() : 'Nepoznato',
                from_email: email ? email.value.trim() : 'nepoznato@email.com',
                company: document.getElementById('company')?.value.trim() || '',
                phone: document.getElementById('phone')?.value.trim() || '',
                topic: document.getElementById('topic')?.value || 'ostalo',
                message: message ? message.value.trim() : '',
                subject: 'SMIŽ kontakt forma'
            };

            // Pošalji email preko EmailJS
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );

            showToast('Poruka uspešno poslata. Hvala na poverenju!');
            contactForm.reset();
        } catch (error) {
            console.error('Form submission error:', error);

            // Ako EmailJS nije konfigurisan, prikaži uputstva
            if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' ||
                EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' ||
                EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
                showToast('EmailJS nije konfigurisan. Proveri script.js za uputstva.', 6000);
                console.log('📧 EmailJS Setup Instructions:');
                console.log('1. Go to https://www.emailjs.com/ and create a free account');
                console.log('2. Create an Email Service (Gmail, Outlook, etc.)');
                console.log('3. Create an Email Template with these variables:');
                console.log('   - {{to_email}}, {{from_name}}, {{from_email}}, {{company}}, {{phone}}, {{topic}}, {{message}}, {{subject}}');
                console.log('4. Get your Public Key, Service ID, and Template ID');
                console.log('5. Update the constants in script.js (lines ~250-253)');
            } else {
                showToast('Došlo je do greške. Molimo pokušajte ponovo.', 4000);
            }
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Pošalji upit';
            }
        }
    });

    // Ukloni custom validaciju na input
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.setCustomValidity('');
        });
    });
}

// ============================================
// Toast Notification
// ============================================
function showToast(message, duration = 3000) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('show');

    // Sakrij toast nakon određenog vremena
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);

    // Sakrij toast na klik
    toast.addEventListener('click', () => {
        toast.classList.remove('show');
    }, { once: true });
}

// ============================================
// Accessibility Improvements
// ============================================
// Dodaj keyboard navigation za hamburger meni
if (hamburger) {
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });
}

// Dodaj keyboard navigation za nav linkove
navLinks.forEach(link => {
    link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            link.click();
        }
    });
});

// ============================================
// Performance Optimizations
// ============================================
// Throttle za scroll event
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimizovani scroll handler
const optimizedScrollHandler = throttle(() => {
    // Scroll-based funkcionalnost ovde
}, 100);

window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// ============================================
// Products Slider
// ============================================
function initHeroSlider() {
    const hero = document.querySelector('.hero-slider');
    if (!hero) return;

    const layers = hero.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('heroDots');
    const announcementEl = document.getElementById('heroSlideAnnouncement');

    if (layers.length < 2 || !dotsContainer) return;

    const imagePaths = [
        'images/door/AKV staklena.jpeg',
        'images/door/AKV.jpeg',
        'images/door/akv.jpg',
        'images/door/akv(1).jpg',
        'images/door/akv(2).jpg',
        'images/door/akv(3).jpg',
        'images/door/akv(4).jpg',
        'images/door/harmonika.jpeg',
        'images/door/harmonika(1).jpeg',
        'images/door/harmonika(2).jpeg',
        'images/door/harmonika(3).jpeg',
        'images/door/Hermetik 1.jpeg',
        'images/door/hermetik i akv stakleni.jpeg',
        'images/door/Hermetik staklena.jpeg',
        'images/door/hermetik.jpeg',
        'images/door/Hermetik(1).jpeg',
        'images/door/hermetik(2).jpeg',
        'images/door/klizna (zavesa).jpg',
        'images/door/klizna (zavesa)(1).jpg',
        'images/door/RKV .jpeg',
        'images/door/RKV hodnik.jpeg',
        'images/door/RKV hodnik(1).jpeg',
        'images/door/rkv olovna.jpg',
        'images/door/rkv olovna(1).jpg',
        'images/door/rkv olovna(2).jpg',
        'images/door/rkv olovna(3).jpg',
        'images/door/RKV.jpeg',
        'images/door/RKV(1).jpeg',
        'images/door/Teleskop akv.jpeg',
        'images/door/zaokretna .jpg',
        'images/door/Zaokretna 2 kom.jpg',
        'images/door/zaokretna automatska.jpg',
        'images/door/zaokretna hodnik.jpeg',
        'images/door/zaokretna plus rkv hodnik.jpg',
        'images/door/Zaokretna staklena.jpeg',
        'images/door/zaokretna.jpeg',
        'images/door/Zaokretna.jpg',
        'images/door/zaokretnba plus rkv hodnik.jpg'
    ];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const preloaded = new Set();
    const slides = imagePaths.map((path) => ({
        src: encodeURI(path),
        label: formatLabel(path)
    }));

    if (!slides.length) return;

    let activeIndex = 0;
    let activeLayer = 0;
    let timer = null;
    let isPaused = prefersReducedMotion.matches;
    let isTransitioning = false;
    let pendingIndex = null;
    const interval = 3000;

    function formatLabel(path) {
        const filename = path.split('/').pop() || '';
        const base = filename.replace(/\.[^/.]+$/, '');
        const cleaned = base
            .replace(/\(.*?\)/g, '')
            .replace(/\s+/g, ' ')
            .replace(/[_-]+/g, ' ')
            .trim();

        if (!cleaned) return 'Specijalna vrata';

        return cleaned
            .split(' ')
            .map(word => {
                if (word.length <= 3) return word.toUpperCase();
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');
    }

    function preloadImage(src) {
        if (preloaded.has(src)) return Promise.resolve();
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            if (img.complete) {
                preloaded.add(src);
                resolve();
            } else {
                img.onload = () => {
                    preloaded.add(src);
                    resolve();
                };
                img.onerror = () => resolve();
            }
        });
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.hero-dot');
        dots.forEach((dot, index) => {
            const isActive = index === activeIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    }

    function announceSlide(label) {
        if (!announcementEl) return;
        announcementEl.textContent = `Prikaz: ${label}`;
    }

    function applySlide(index, shouldAnnounce = true) {
        const slide = slides[index];
        const nextLayerIndex = (activeLayer + 1) % layers.length;
        const nextLayer = layers[nextLayerIndex];
        const currentLayer = layers[activeLayer];

        nextLayer.style.backgroundImage = `url('${slide.src}')`;
        nextLayer.classList.add('is-visible');
        currentLayer.classList.remove('is-visible');
        activeLayer = nextLayerIndex;

        if (shouldAnnounce) {
            announceSlide(slide.label);
        }
        updateDots();
    }

    function setActiveIndex(index, options = {}) {
        const newIndex = (index + slides.length) % slides.length;
        if (newIndex === activeIndex && hero.classList.contains('is-ready')) return;

        if (isTransitioning) {
            pendingIndex = newIndex;
            return;
        }

        isTransitioning = true;
        const { announce = true } = options;
        const slide = slides[newIndex];

        preloadImage(slide.src).finally(() => {
            activeIndex = newIndex;
            applySlide(activeIndex, announce);
            isTransitioning = false;

            if (pendingIndex !== null && pendingIndex !== activeIndex) {
                const next = pendingIndex;
                pendingIndex = null;
                setActiveIndex(next, { announce: true });
            }
        });
    }

    function nextSlide() {
        setActiveIndex(activeIndex + 1);
    }

    function prevSlide() {
        setActiveIndex(activeIndex - 1);
    }

    function startAuto() {
        if (timer || isPaused || slides.length < 2) return;
        timer = setInterval(nextSlide, interval);
    }

    function stopAuto() {
        if (!timer) return;
        clearInterval(timer);
        timer = null;
    }

    function initDots() {
        dotsContainer.innerHTML = slides
            .map((slide, index) => `
                <button class="hero-dot" type="button" data-index="${index}" aria-label="Prikaži ${slide.label}"></button>
            `)
            .join('');
    }

    dotsContainer.addEventListener('click', (event) => {
        const dot = event.target.closest('.hero-dot');
        if (!dot) return;
        const index = Number(dot.dataset.index);
        if (!Number.isNaN(index)) {
            setActiveIndex(index);
            stopAuto();
            if (!prefersReducedMotion.matches) {
                startAuto();
            }
        }
    });

    hero.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            nextSlide();
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            prevSlide();
        }
    });

    let pointerStartX = 0;
    let pointerStartY = 0;

    hero.addEventListener('pointerdown', (event) => {
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
    });

    hero.addEventListener('pointerup', (event) => {
        const diffX = pointerStartX - event.clientX;
        const diffY = pointerStartY - event.clientY;
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAuto();
        } else if (!isPaused) {
            startAuto();
        }
    });

    initDots();
    startAuto();
    preloadImage(slides[0].src).finally(() => {
        layers[0].style.backgroundImage = `url('${slides[0].src}')`;
        layers[0].classList.add('is-visible');
        hero.classList.add('is-ready');
        announceSlide(slides[0].label);
        updateDots();

        slides.slice(1, 4).forEach((slide) => {
            preloadImage(slide.src);
        });

        startAuto();
    });
}

function initProductsHeroSlider() {
    const slider = document.getElementById('productsHero');
    const cardsContainer = document.getElementById('productsHeroCards');
    const prevButton = document.getElementById('productsHeroPrev');
    const nextButton = document.getElementById('productsHeroNext');
    const titleEl = document.getElementById('productsHeroTitle');
    const descriptionEl = document.getElementById('productsHeroDescription');
    const ctaEl = document.getElementById('productsHeroCta');
    const bgLayers = slider ? slider.querySelectorAll('.products-hero-bg-layer') : [];

    if (!slider || !cardsContainer || !prevButton || !nextButton || bgLayers.length < 2) return;

    // Jedinstveni izvor podataka za proizvode
    const products = [
        {
            title: 'Automatska vrata',
            description: 'Moderna i elegantna rešenja koja štede prostor, pružajući bezbednost i udobnost. Idealna za javne objekte, bolnice, poslovne zgrade i trgovine.',
            image: 'assets/product-1.svg',
            link: 'pages/automatska-vrata.html'
        },
        {
            title: 'Unutrašnja vrata',
            description: 'Širok asortiman unutrašnjih vrata za različite namene, od stambenih do javnih objekata. Proizvodnja po meri sa vrhunskim kvalitetom.',
            image: 'assets/product-1.svg',
            link: 'pages/unutrasnja-vrata.html'
        },
        {
            title: 'Industrijska i garažna vrata',
            description: 'Robusna i pouzdana rešenja za industrijske objekte, garaže i logističke centre. Hörmann kvalitet i sertifikovana bezbednost.',
            image: 'assets/product-3.svg',
            link: 'pages/industrijska-vrata.html'
        },
        {
            title: 'Bolnička vrata',
            description: 'Specijalizovana rešenja za zdravstvene ustanove, sa fokusom na higijenu, bezbednost i funkcionalnost. Više od 20 godina iskustva.',
            image: 'assets/product-2.svg',
            link: 'pages/bolnicka-vrata.html'
        },
        {
            title: 'Olovna stakla i  olovni limovi',
            description: 'Olovna stakla, olovni limovi, ploče i prizme za zaštitu od jonizujućeg zračenja. Za zdravstvene ustanove, laboratorije i industrijske objekte.',
            image: 'assets/product-2.svg',
            link: 'pages/zastita-od-radijacije.html'
        },
        {
            title: 'PRIMAX zaštitna rešenja',
            description: 'Kompletan program zaštitne opreme i sredstava od jonizujućeg zračenja za zdravstvene ustanove, laboratorije i industrijske objekte.',
            image: 'assets/product-2.svg',
            link: 'pages/primax.html'
        }
    ];

    let activeIndex = 0;
    let activeLayerIndex = 0;

    // Render mini kartica na dnu hero slider-a
    function renderCards() {
        cardsContainer.innerHTML = products
            .map((product, index) => `
                <div class="products-hero-card" data-index="${index}" role="option" tabindex="0" aria-selected="false">
                    <div class="products-hero-card-media">
                        <img src="${product.image}" alt="${product.title}" loading="lazy">
                    </div>
                    <div class="products-hero-card-title">${product.title}</div>
                    <a href="${product.link}" class="product-detail-btn">Detaljnije</a>
                </div>
            `)
            .join('');
    }

    // Fade efekat za pozadinu (crossfade između dva sloja)
    function updateBackground(imageUrl) {
        const nextLayerIndex = (activeLayerIndex + 1) % bgLayers.length;
        const nextLayer = bgLayers[nextLayerIndex];
        const currentLayer = bgLayers[activeLayerIndex];

        nextLayer.style.backgroundImage = `url('${imageUrl}')`;
        nextLayer.classList.add('is-visible');
        currentLayer.classList.remove('is-visible');
        activeLayerIndex = nextLayerIndex;
    }

    // Ažuriranje aktivnog sadržaja i stanja kartica
    function updateActiveState() {
        const product = products[activeIndex];
        const cards = cardsContainer.querySelectorAll('.products-hero-card');

        if (titleEl) titleEl.textContent = product.title;
        if (descriptionEl) descriptionEl.textContent = product.description;
        if (ctaEl) ctaEl.setAttribute('href', product.link);

        updateBackground(product.image);

        cards.forEach((card, index) => {
            const isActive = index === activeIndex;
            card.classList.toggle('is-active', isActive);
            card.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Scrolluj aktivnu karticu u vidno polje kada je red skrolabilan
        requestAnimationFrame(() => {
            const activeCard = cardsContainer.querySelector(`.products-hero-card[data-index="${activeIndex}"]`);
            if (!activeCard || cardsContainer.scrollWidth <= cardsContainer.clientWidth) return;

            if (activeIndex === 0) {
                cardsContainer.scrollLeft = 0;
                return;
            }

            activeCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
    }

    function setActiveIndex(index) {
        const newIndex = (index + products.length) % products.length;
        if (newIndex === activeIndex) return;
        activeIndex = newIndex;
        updateActiveState();
    }

    function nextSlide() {
        setActiveIndex(activeIndex + 1);
    }

    function prevSlide() {
        setActiveIndex(activeIndex - 1);
    }

    // Event listeneri za strelice
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Klik na karticu menja aktivni proizvod
    cardsContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.products-hero-card');
        if (!card) return;
        const index = Number(card.dataset.index);
        if (!Number.isNaN(index)) {
            setActiveIndex(index);
        }
    });

    // Keyboard navigacija za kartice
    cardsContainer.addEventListener('keydown', (event) => {
        if (event.target.classList.contains('products-hero-card') &&
            (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            const index = Number(event.target.dataset.index);
            if (!Number.isNaN(index)) {
                setActiveIndex(index);
            }
        }
    });

    // ArrowLeft / ArrowRight dok je slider fokusiran
    slider.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            prevSlide();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            nextSlide();
        }
    });

    // Swipe/drag podrška za mobilne uređaje
    let pointerStartX = 0;
    let pointerStartY = 0;

    cardsContainer.addEventListener('pointerdown', (event) => {
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
    });

    cardsContainer.addEventListener('pointerup', (event) => {
        const diffX = pointerStartX - event.clientX;
        const diffY = pointerStartY - event.clientY;
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });

    // Inicijalizacija
    renderCards();
    bgLayers[0].style.backgroundImage = `url('${products[0].image}')`;
    bgLayers[0].classList.add('is-visible');
    updateActiveState();
    requestAnimationFrame(() => {
        cardsContainer.scrollLeft = 0;
    });
}


