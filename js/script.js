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

let mobileMenuBackdrop = null;

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

    // Inicijalizuj hero slidere na internim stranicama
    initPageHeroSliders();

    // Inicijalizuj hero slider za proizvode
    initProductsHeroSlider();

    // Inicijalizuj mapu projekata (lazy)
    initProjectsMap();
});

// ============================================
// Hamburger Meni
// ============================================
if (hamburger && navMenu) {
    const ensureMobileBackdrop = () => {
        if (mobileMenuBackdrop) return;
        mobileMenuBackdrop = document.createElement('div');
        mobileMenuBackdrop.className = 'mobile-menu-backdrop';
        mobileMenuBackdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(mobileMenuBackdrop);

        mobileMenuBackdrop.addEventListener('click', () => {
            closeMobileMenu();
        });
    };

    const setMobileMenuState = (isOpen) => {
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        navMenu.classList.toggle('active', isOpen);
        document.body.classList.toggle('menu-open', isOpen);

        if (mobileMenuBackdrop) {
            mobileMenuBackdrop.classList.toggle('active', isOpen);
        }
    };

    const closeMobileMenu = () => {
        setMobileMenuState(false);

        if (productsDropdown && navItemDropdown && window.innerWidth <= 1023) {
            navItemDropdown.classList.remove('active');
            productsDropdown.setAttribute('aria-expanded', 'false');
        }
    };

    ensureMobileBackdrop();
    hamburger.setAttribute('aria-controls', 'navMenu');

    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        setMobileMenuState(!isExpanded);
    });

    // Zatvori meni kada se klikne na link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1023 && link.id === 'productsDropdown') {
                return;
            }
            closeMobileMenu();
        });
    });

    // Zatvori meni kada se klikne van njega
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1023) {
            closeMobileMenu();
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
    const setDropdownState = (isOpen) => {
        navItemDropdown.classList.toggle('active', isOpen);
        productsDropdown.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    // Desktop: hover
    navItemDropdown.addEventListener('mouseenter', () => {
        if (window.innerWidth > 1023) {
            setDropdownState(true);
        }
    });

    navItemDropdown.addEventListener('mouseleave', () => {
        if (window.innerWidth > 1023) {
            setDropdownState(false);
        }
    });

    // Mobile: click
    productsDropdown.addEventListener('click', (e) => {
        if (window.innerWidth <= 1023) {
            e.preventDefault();
            const isOpen = navItemDropdown.classList.contains('active');
            setDropdownState(!isOpen);
        }
    });

    // Zatvori dropdown kada se klikne na link
    const dropdownLinks = productsDropdownMenu.querySelectorAll('.dropdown-link');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            setDropdownState(false);
            // Zatvori hamburger meni ako je otvoren
            if (hamburger && navMenu) {
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                if (mobileMenuBackdrop) {
                    mobileMenuBackdrop.classList.remove('active');
                }
            }
        });
    });

    // Zatvori dropdown kada se klikne van njega
    document.addEventListener('click', (e) => {
        if (!navItemDropdown.contains(e.target)) {
            setDropdownState(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1023) {
            setDropdownState(false);
        }
    });
}

// ============================================
// Smooth Scroll
// ============================================
function initSmoothScroll() {
    // Smooth scroll samo za interne anchor linkove na istoj stranici
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
    const normalizePath = (value) => {
        if (!value) return '/';
        return value.endsWith('/') ? value : `${value}/`;
    };

    const currentPath = normalizePath(window.location.pathname || '/');

    navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#')) return;

        try {
            const url = new URL(href, window.location.origin);
            const linkPath = normalizePath(url.pathname);
            const isHome = linkPath === '/' && currentPath === '/';
            const isDirectMatch = linkPath === currentPath;
            const isProductsParent = linkPath === '/proizvodi/' && currentPath.startsWith('/proizvodi/');
            link.classList.toggle('active', isHome || isDirectMatch || isProductsParent);
        } catch {
            // noop
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
// Kontakt Forma (statički mailto)
// ============================================
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        let isValid = true;

        [name, email, message].forEach(field => {
            if (field) {
                field.setCustomValidity('');
            }
        });

        if (name && name.value.trim().length < 2) {
            name.setCustomValidity('Ime mora imati najmanje 2 karaktera');
            isValid = false;
        }

        if (email && !email.validity.valid) {
            email.setCustomValidity('Unesite validnu email adresu');
            isValid = false;
        }

        if (message && message.value.trim().length < 10) {
            message.setCustomValidity('Poruka mora imati najmanje 10 karaktera');
            isValid = false;
        }

        if (!contactForm.checkValidity() || !isValid) {
            contactForm.reportValidity();
            return;
        }

        const company = document.getElementById('company')?.value.trim() || '-';
        const phone = document.getElementById('phone')?.value.trim() || '-';
        const topic = document.getElementById('topic')?.value || 'ostalo';

        const subject = encodeURIComponent(`SMIŽ kontakt forma - ${topic}`);
        const body = encodeURIComponent(
            `Ime i prezime: ${name ? name.value.trim() : ''}\n` +
            `Email: ${email ? email.value.trim() : ''}\n` +
            `Kompanija: ${company}\n` +
            `Telefon: ${phone}\n` +
            `Vrsta upita: ${topic}\n\n` +
            `Poruka:\n${message ? message.value.trim() : ''}`
        );

        window.location.href = `mailto:office@smiz.rs?subject=${subject}&body=${body}`;
        showToast('Otvoren je email klijent. Hvala na upitu!', 4000);
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
function initBackgroundSlider({
    root,
    imagePaths,
    dotsContainer = null,
    announcementEl = null,
    interval = 3000
}) {
    if (!root || !Array.isArray(imagePaths) || imagePaths.length === 0) return;
    if (root.dataset.sliderInitialized === 'true') return; // Guard against double init to avoid duplicate listeners
    root.dataset.sliderInitialized = 'true'; // Mark slider as initialized for safety

    const layers = root.querySelectorAll('.hero-slide');
    if (!layers.length) return;

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
            const finalize = () => {
                preloaded.add(src);
                resolve();
            };
            const decodeIfPossible = () => {
                if (typeof img.decode === 'function') {
                    img.decode().then(finalize).catch(finalize);
                } else {
                    finalize();
                }
            };
            img.src = src;
            if (img.complete) {
                decodeIfPossible();
            } else {
                img.onload = decodeIfPossible;
                img.onerror = finalize;
            }
        });
    }

    function preloadUpcoming(index) {
        if (slides.length < 2) return;
        for (let offset = 1; offset <= 2; offset += 1) {
            const nextSlide = slides[(index + offset) % slides.length];
            if (nextSlide) {
                preloadImage(nextSlide.src); // Preload next images to keep transitions smooth
            }
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
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
        if (currentLayer && currentLayer !== nextLayer) {
            currentLayer.classList.remove('is-visible');
        }
        activeLayer = nextLayerIndex;

        if (shouldAnnounce) {
            announceSlide(slide.label);
        }
        updateDots();
        preloadUpcoming(index); // Warm next images after each activation
    }

    function setActiveIndex(index, options = {}) {
        const newIndex = (index + slides.length) % slides.length;
        if (newIndex === activeIndex && root.classList.contains('is-ready')) return;

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
        setActiveIndex(activeIndex + 1, { scrollToActive: true });
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
        if (!dotsContainer) return;
        dotsContainer.innerHTML = slides
            .map((slide, index) => `
                <button class="hero-dot" type="button" data-index="${index}" aria-label="Prikaži ${slide.label}"></button>
            `)
            .join('');
    }

    if (dotsContainer) {
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
    }

    root.addEventListener('keydown', (event) => {
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

    root.addEventListener('pointerdown', (event) => {
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
    });

    root.addEventListener('pointerup', (event) => {
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
    layers[0].style.backgroundImage = `url('${slides[0].src}')`; // Paint first slide ASAP to avoid blue-only hero
    layers[0].classList.add('is-visible');
    root.classList.add('is-ready'); // Allow first slide to show while preload finishes
    announceSlide(slides[0].label);
    updateDots();
    preloadImage(slides[0].src).finally(() => {
        slides.slice(1, 4).forEach((slide) => {
            preloadImage(slide.src);
        });
        preloadUpcoming(0);
        startAuto();
    });
}

function initHeroSlider() {
    const hero = document.getElementById('home');
    if (!hero || !hero.classList.contains('hero-slider')) return; // Ensure home slider runs only on #home

    const imagePaths = [
        'images/door/AKV staklena.jpeg',
        'images/door/harmonika.jpeg',
        'images/door/Hermetik staklena.jpeg',
        'images/door/klizna (zavesa).jpg',
        'images/door/RKV hodnik.jpeg',
        'images/door/rkv olovna.jpg',
        'images/door/zaokretna automatska.jpg',
        'images/door/Zaokretna staklena.jpeg'
    ];

    initBackgroundSlider({
        root: hero,
        imagePaths,
        dotsContainer: document.getElementById('heroDots'),
        announcementEl: document.getElementById('heroSlideAnnouncement'),
        interval: 3000
    });
}

function initPageHeroSliders() {
    const pageHeroImages = {
        about: [
            '../images/door/AKV staklena.jpeg',
            '../images/door/Hermetik staklena.jpeg',
            '../images/door/RKV hodnik.jpeg'
        ],
        contact: [
            '../images/door/zaokretna automatska.jpg',
            '../images/door/harmonika.jpeg',
            '../images/door/klizna (zavesa).jpg'
        ],
        'automatska-vrata': [
            '../images/door/zaokretna automatska.jpg',
            '../images/door/AKV.jpeg',
            '../images/door/zaokretna.jpeg'
        ],
        'unutrasnja-vrata': [
            '../images/door/klizna (zavesa).jpg',
            '../images/door/harmonika(1).jpeg',
            '../images/door/zaokretna .jpg'
        ],
        'industrijska-vrata': [
            '../images/door/RKV.jpeg',
            '../images/door/RKV(1).jpeg',
            '../images/door/RKV hodnik(1).jpeg'
        ],
        'garazna-vrata': [
            '../images/door/zaokretna.jpeg',
            '../images/door/zaokretna automatska.jpg',
            '../images/door/AKV.jpeg'
        ],
        'bolnicka-vrata': [
            '../images/door/hermetik.jpeg',
            '../images/door/Hermetik(1).jpeg',
            '../images/door/hermetik i akv stakleni.jpeg'
        ],
        'zastita-od-radijacije': [
            '../images/door/rkv olovna.jpg',
            '../images/door/rkv olovna(2).jpg',
            '../images/door/rkv olovna(3).jpg'
        ],
        primax: [
            '../images/door/AKV staklena.jpeg',
            '../images/door/AKV.jpeg',
            '../images/door/Teleskop akv.jpeg'
        ]
    };

    document.querySelectorAll('.page-hero.hero-slider[data-page-hero]').forEach((heroSection) => {
        const key = heroSection.dataset.pageHero;
        const images = pageHeroImages[key];
        if (!images || images.length === 0) return;

        initBackgroundSlider({
            root: heroSection,
            imagePaths: images,
            interval: 3500
        });
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
            image: 'images/door/zaokretna automatska.jpg',
            link: '/proizvodi/automatska-vrata/'
        },
        {
            title: 'Bolnička vrata',
            description: 'Specijalizovana rešenja za zdravstvene ustanove, sa fokusom na higijenu, bezbednost i funkcionalnost. Više od 20 godina iskustva.',
            image: 'images/door/hermetik.jpeg',
            link: '/proizvodi/bolnicka-vrata/'
        },
        {
            title: 'Unutrašnja vrata',
            description: 'Širok asortiman unutrašnjih vrata za različite namene, od stambenih do javnih objekata. Proizvodnja po meri sa vrhunskim kvalitetom.',
            image: 'images/door/klizna (zavesa).jpg',
            link: '/proizvodi/unutrasnja-vrata/'
        },
        {
            title: 'Industrijska vrata',
            description: 'Robusna i pouzdana rešenja za industrijske objekte i logističke centre. Hörmann kvalitet i sertifikovana bezbednost.',
            image: 'images/door/RKV hodnik.jpeg',
            link: '/proizvodi/industrijska-vrata/'
        },
        {
            title: 'Garažna vrata',
            description: 'Garažna segmentna, Berry kipujuća i RollMatic rolo vrata. Rešenja za privatne i zajedničke garaže.',
            image: 'images/door/zaokretna.jpeg',
            link: '/proizvodi/garazna-vrata/'
        },
        {
            title: 'Olovna stakla i olovni limovi',
            description: 'Olovna stakla, olovni limovi, ploče i prizme za zaštitu od jonizujućeg zračenja. Za zdravstvene ustanove, laboratorije i industrijske objekte.',
            image: 'images/door/rkv olovna.jpg',
            link: '/proizvodi/zastita-od-radijacije/'
        },
        {
            title: 'PRIMAX zaštitna rešenja',
            description: 'Kompletan program zaštitne opreme i sredstava od jonizujućeg zračenja za zdravstvene ustanove, laboratorije i industrijske objekte.',
            image: 'images/door/AKV staklena.jpeg',
            link: '/proizvodi/primax/'
        }
    ];

    const productsWithSrc = products.map((product) => ({
        ...product,
        imageSrc: encodeURI(product.image)
    }));
    const preloaded = new Set();
    let activeIndex = 0;
    let activeLayerIndex = 0;
    let cards = [];

    function preloadImage(src) {
        if (preloaded.has(src)) return Promise.resolve();
        return new Promise((resolve) => {
            const img = new Image();
            const finalize = () => {
                preloaded.add(src);
                resolve();
            };
            const decodeIfPossible = () => {
                if (typeof img.decode === 'function') {
                    img.decode().then(finalize).catch(finalize);
                } else {
                    finalize();
                }
            };
            img.src = src;
            if (img.complete) {
                decodeIfPossible();
            } else {
                img.onload = decodeIfPossible;
                img.onerror = finalize;
            }
        });
    }

    function scheduleThumbnailPreload() {
        const preloadTask = () => {
            const thumbnails = cardsContainer.querySelectorAll('.products-hero-card img');
            thumbnails.forEach((img) => {
                const src = img.currentSrc || img.src;
                if (!src) return;
                const preloader = new Image();
                preloader.src = src; // Warm cache to avoid decode jank
                if (typeof preloader.decode === 'function') {
                    preloader.decode().catch(() => { });
                }
                if (typeof img.decode === 'function') {
                    img.decode().catch(() => { });
                }
            });
        };

        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => Promise.resolve().then(preloadTask));
        } else {
            setTimeout(() => Promise.resolve().then(preloadTask), 0);
        }
    }

    // Render mini kartica na dnu hero slider-a
    function renderCards() {
        cardsContainer.innerHTML = productsWithSrc
            .map((product, index) => `
                <div class="products-hero-card" data-index="${index}" role="option" tabindex="0" aria-selected="false">
                    <div class="products-hero-card-media">
                        <img src="${product.imageSrc}" alt="${product.title}" loading="eager" decoding="async" ${index === 0 ? 'fetchpriority="high"' : ''}> <!-- Eager + async decode for smooth drag -->
                    </div>
                    <div class="products-hero-card-title">${product.title}</div>
                </div>
            `)
            .join('');
        cards = Array.from(cardsContainer.querySelectorAll('.products-hero-card'));
        scheduleThumbnailPreload(); // Preload/decode thumbnails without blocking interaction
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
    function updateActiveState({ scrollToActive = false } = {}) {
        const product = productsWithSrc[activeIndex];

        if (titleEl) titleEl.textContent = product.title;
        if (descriptionEl) descriptionEl.textContent = product.description;
        if (ctaEl) ctaEl.setAttribute('href', product.link);

        preloadImage(product.imageSrc).finally(() => {
            updateBackground(product.imageSrc);
        });

        cards.forEach((card, index) => {
            const isActive = index === activeIndex;
            card.classList.toggle('is-active', isActive);
            card.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        if (scrollToActive) {
            const activeCard = cards[activeIndex];
            if (activeCard) {
                activeCard.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest'
                }); // Center active card after arrow navigation
            }
        }
    }

    function setActiveIndex(index, options = {}) {
        const newIndex = (index + products.length) % products.length;
        if (newIndex === activeIndex) return;
        activeIndex = newIndex;
        updateActiveState(options);
        const nextIndex = (activeIndex + 1) % productsWithSrc.length;
        const prevIndex = (activeIndex - 1 + productsWithSrc.length) % productsWithSrc.length;
        preloadImage(productsWithSrc[nextIndex].imageSrc);
        preloadImage(productsWithSrc[prevIndex].imageSrc);
    }

    function nextSlide() {
        setActiveIndex(activeIndex + 1);
    }

    function prevSlide() {
        setActiveIndex(activeIndex - 1, { scrollToActive: true });
    }

    // Event listeneri za strelice
    function getScrollStep() {
        const firstCard = cards[0];
        if (!firstCard) return 0;
        const cardRect = firstCard.getBoundingClientRect();
        const containerStyles = window.getComputedStyle(cardsContainer);
        const gap = parseFloat(containerStyles.columnGap || containerStyles.gap || '0') || 0;
        return cardRect.width + gap;
    }

    nextButton.addEventListener('click', () => {
        const maxScrollLeft = cardsContainer.scrollWidth - cardsContainer.clientWidth;
        const isAtEnd = cardsContainer.scrollLeft >= maxScrollLeft - 2;
        if (isAtEnd && activeIndex === productsWithSrc.length - 1) {
            cardsContainer.scrollTo({ left: 0, behavior: 'smooth' }); // Wrap to start only after last card
            setActiveIndex(0, { scrollToActive: true });
            return;
        }
        cardsContainer.scrollBy({ left: getScrollStep(), behavior: 'smooth' }); // Native scroll helper
        nextSlide();
    });
    prevButton.addEventListener('click', () => {
        cardsContainer.scrollBy({ left: -getScrollStep(), behavior: 'smooth' }); // Native scroll helper
        prevSlide();
    });

    const isMobileViewport = () => window.innerWidth <= 1023;

    // Klik na karticu menja aktivni proizvod
    cardsContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.products-hero-card');
        if (!card) return;
        const index = Number(card.dataset.index);
        if (!Number.isNaN(index)) {
            setActiveIndex(index, { scrollToActive: true });
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

    // Mobile swipe: aktiviraj karticu najbližu centru kontejnera tokom skrola
    let scrollRaf = null;
    function updateActiveFromScroll() {
        if (!isMobileViewport()) return;
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
            scrollRaf = null;
            if (!cards.length) return;
            const containerRect = cardsContainer.getBoundingClientRect();
            const containerCenter = containerRect.left + containerRect.width / 2;
            let closestIndex = activeIndex;
            let closestDistance = Infinity;

            cards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const distance = Math.abs(cardCenter - containerCenter);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            if (closestIndex !== activeIndex) {
                setActiveIndex(closestIndex);
            }
        });
    }

    cardsContainer.addEventListener('scroll', updateActiveFromScroll, { passive: true });

    // Inicijalizacija
    renderCards();
    bgLayers[0].style.backgroundImage = `url('${productsWithSrc[0].imageSrc}')`;
    bgLayers[0].classList.add('is-visible');
    updateActiveState();

    productsWithSrc.slice(1, 4).forEach((product) => {
        preloadImage(product.imageSrc);
    });
}


// ============================================
// Projekti mapa (Leaflet + OSM)
// ============================================
function initProjectsMap() {
    const mapSection = document.getElementById('instalirani-projekti');
    const mapContainer = document.getElementById('projectsMap');
    const mapFallback = document.getElementById('projectsMapFallback');
    const mapWrapper = mapSection ? mapSection.querySelector('.map-embed') : null;

    if (!mapSection || !mapContainer || !mapWrapper) return;

    let hasInitialized = false;
    const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting || hasInitialized) return;
        hasInitialized = true;
        observer.disconnect();
        initializeMap().catch(() => {
            showMapFallback();
        });
    }, { rootMargin: '200px 0px', threshold: 0.1 });

    observer.observe(mapSection);

    async function initializeMap() {
        if (typeof window.L === 'undefined') {
            showMapFallback();
            return;
        }

        const locations = await fetchProjectLocations();
        if (!Array.isArray(locations) || locations.length === 0) {
            showMapFallback();
            return;
        }

        const map = L.map(mapContainer, {
            zoomControl: true,
            scrollWheelZoom: false
        }).setView([44.0165, 20.9073], 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const validPoints = [];

        locations.forEach((location) => {
            const lat = Number(location.lat);
            const lng = Number(location.lng);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

            validPoints.push([lat, lng]);

            const name = location.name ? `<strong>${escapeHtml(location.name)}</strong>` : '<strong>Project</strong>';
            const address = location.address ? `<div>${escapeHtml(location.address)}</div>` : '';
            const link = `https://www.google.com/maps?q=${lat},${lng}`;

            L.marker([lat, lng])
                .addTo(map)
                .bindPopup(`
                    <div class="map-info-window">
                        ${name}
                        ${address}
                        <a href="${link}" target="_blank" rel="noopener noreferrer">View on Google Maps</a>
                    </div>
                `);
        });

        if (!validPoints.length) {
            showMapFallback();
            return;
        }

        const bounds = L.latLngBounds(validPoints);
        map.fitBounds(bounds, { padding: [40, 40] });
    }

    function showMapFallback() {
        mapWrapper.classList.add('is-error');
        if (mapFallback) {
            mapFallback.style.display = 'flex';
        }
    }
}

async function fetchProjectLocations() {
    const response = await fetch('/assets/data/project-locations.json', { cache: 'no-store' });
    if (!response.ok) {
        throw new Error('Failed to load locations');
    }
    return response.json();
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

