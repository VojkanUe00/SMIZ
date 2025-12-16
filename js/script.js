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
    
    // Inicijalizuj products slider
    initProductsSlider();
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
        anchor.addEventListener('click', function(e) {
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
function initProductsSlider() {
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderPrev = document.getElementById('sliderPrev');
    const sliderNext = document.getElementById('sliderNext');
    
    if (!sliderTrack || !sliderPrev || !sliderNext) return;
    
    const cards = sliderTrack.querySelectorAll('.product-card-link');
    if (cards.length === 0) return;
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Funkcija za ažuriranje klasa kartica
    function updateCards() {
        const isMobile = window.innerWidth <= 767;
        const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1023;
        
        cards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next');
            
            if (isMobile) {
                // Na mobilnim uređajima prikaži samo aktivnu karticu
                if (index === currentIndex) {
                    card.classList.add('active');
                }
            } else {
                // Na desktopu i tabletima prikaži tri kartice
                const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
                const nextIndex = (currentIndex + 1) % totalCards;

                if (index === currentIndex) {
                    card.classList.add('active');
                } else if (index === prevIndex) {
                    card.classList.add('prev');
                } else if (index === nextIndex) {
                    card.classList.add('next');
                }
            }
        });
        
        // Centriranje aktivne kartice
        if (isMobile) {
            // Na mobilnim uređajima jednostavno pomeri track
            // Koristimo requestAnimationFrame da osiguramo da su sve kartice renderovane
            requestAnimationFrame(() => {
                const container = sliderTrack.parentElement;
                const containerWidth = container.offsetWidth;
                const offset = currentIndex * containerWidth;
                sliderTrack.style.transform = `translateX(-${offset}px)`;
            });
        } else {
            // Na desktopu i tabletima centriraj aktivnu karticu
            // Koristimo requestAnimationFrame da osiguramo da su sve kartice renderovane
            requestAnimationFrame(() => {
                const container = sliderTrack.parentElement;
                const containerWidth = container.offsetWidth;
                
                // Širine kartica i gap (iz CSS-a)
                const sideCardWidth = isTablet ? 320 : 300;
                const activeCardWidth = isTablet ? 360 : 380;
                const gap = 16; // var(--spacing-md)
                
                // Izračunaj offset za centriranje aktivne kartice
                // Sve kartice pre aktivne su side kartice (iste širine)
                const offsetBeforeActive = currentIndex * (sideCardWidth + gap);
                
                // Centriraj aktivnu karticu
                const centerOffset = (containerWidth / 2) - (activeCardWidth / 2);
                const finalOffset = centerOffset - offsetBeforeActive;
                
                sliderTrack.style.transform = `translateX(${finalOffset}px)`;
            });
        }
    }
    
    // Funkcija za pomeranje na sledeću karticu
    function nextCard() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCards();
    }
    
    // Funkcija za pomeranje na prethodnu karticu
    function prevCard() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCards();
    }
    
    // Event listeneri za dugmad
    sliderNext.addEventListener('click', nextCard);
    sliderPrev.addEventListener('click', prevCard);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevCard();
        } else if (e.key === 'ArrowRight') {
            nextCard();
        }
    });
    
    // Swipe gesture za mobilne uređaje
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    sliderTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextCard();
            } else {
                prevCard();
            }
        }
    }
    
    // Inicijalizacija
    updateCards();
    
    // Ažuriraj na resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCards();
        }, 250);
    });
}


