document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target elements to animate
    const animateElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    animateElements.forEach(el => observer.observe(el));

    // 5. RSVP Form Submission to Google Sheets
    const rsvpForm = document.getElementById('rsvpForm');
    const formMessage = document.getElementById('formMessage');

    // MÃ GOOGLE SCRIPT URL SẼ ĐƯỢC DÁN VÀO ĐÂY:
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfMaIKaAwnXTxCOmMHJUvefmEJw368f3N4cFoZjUfc2iIGmuPujpuTVRGKHPHOaTPwCw/exec';

    if (rsvpForm) {
        const submitBtn = rsvpForm.querySelector('button[type="submit"]');
        submitBtn.addEventListener('click', () => {
            if (!rsvpForm.checkValidity()) {
                alert("Vui lòng điền và chọn đầy đủ các thông tin bắt buộc (*) trước khi gửi lời chúc nhé!");
            }
        });

        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = rsvpForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';
            btn.disabled = true;

            const formData = new FormData(rsvpForm);

            if (GOOGLE_SCRIPT_URL === '') {
                // Giả lập nếu chưa có link Google Script
                setTimeout(() => {
                    formMessage.innerText = 'Cảm ơn bạn!';
                    formMessage.style.display = 'block';
                    formMessage.style.color = '#55875c';
                    formMessage.style.marginTop = '20px';
                    formMessage.style.fontWeight = 'bold';
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1000);
            } else {
                // Gửi dữ liệu thật (Fire and forget)
                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                }).catch(err => console.error('Lỗi ngầm:', err));

                // Báo thành công ngay lập tức để người dùng không phải đợi Google phản hồi (Optimistic UI)
                setTimeout(() => {
                    formMessage.innerText = 'Cảm ơn bạn đã gửi lời chúc! Hẹn gặp bạn tại lễ cưới nhé.';
                    formMessage.style.display = 'block';
                    formMessage.style.color = '#55875c';
                    formMessage.style.marginTop = '20px';
                    formMessage.style.fontWeight = 'bold';
                    rsvpForm.reset();
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 800); // Báo thành công chỉ sau chưa tới 1 giây
            }
        });
    }

    // 6. Countdown Timer
    const countdown = () => {
        const countDate = new Date("Aug 8, 2026 00:00:00").getTime();
        const now = new Date().getTime();
        const gap = countDate - now;

        if (gap <= 0) return;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const d = Math.floor(gap / day);
        const h = Math.floor((gap % day) / hour);
        const m = Math.floor((gap % hour) / minute);
        const s = Math.floor((gap % minute) / second);

        const ds = document.getElementById('days');
        const hs = document.getElementById('hours');
        const ms = document.getElementById('minutes');
        const ss = document.getElementById('seconds');

        if (ds) ds.innerText = d < 10 ? '0' + d : d;
        if (hs) hs.innerText = h < 10 ? '0' + h : h;
        if (ms) ms.innerText = m < 10 ? '0' + m : m;
        if (ss) ss.innerText = s < 10 ? '0' + s : s;
    };

    setInterval(countdown, 1000);
    countdown();
    // 7. Gallery Slider
    const slides = document.querySelectorAll('.gallery-slider .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3000);
    }

    // 8. Lightbox Gallery
    const weddingImages = [
        "1.webp", "2.webp", "3.webp", "4.webp", "a (17).webp",
        "b1.webp", "b2.webp", "b3.webp", "b4.webp", "b5.webp", "b6.webp",
        "c2.webp", "c3.webp", "c4.webp",
        "d1.webp", "d2.webp", "d3.webp"
    ].map(name => `./assets/images/wedding/${name}`);

    let currentImageIndex = 0;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxCounter = document.querySelector('.lightbox-counter');

    const openLightbox = (index) => {
        if (!lightbox) return;
        currentImageIndex = index;
        lightboxImg.src = weddingImages[currentImageIndex];
        if (lightboxCounter) lightboxCounter.textContent = `${currentImageIndex + 1} / ${weddingImages.length}`;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
    };

    const changeImage = (step) => {
        currentImageIndex += step;
        if (currentImageIndex >= weddingImages.length) currentImageIndex = 0;
        if (currentImageIndex < 0) currentImageIndex = weddingImages.length - 1;
        lightboxImg.src = weddingImages[currentImageIndex];
        if (lightboxCounter) lightboxCounter.textContent = `${currentImageIndex + 1} / ${weddingImages.length}`;
    };

    // Bind click to gallery images
    const galleryImages = document.querySelectorAll('.gallery-slider .slide, .gallery-masonry-1 img, .gm2-inner-left-img, .gm2-inner-right img, .gm2-right-block img, .box-images img');
    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            const imgSrc = img.getAttribute('src');
            let index = weddingImages.findIndex(src => src === imgSrc);
            if (index === -1) index = 0;
            openLightbox(index);
        });
    });

    // Bind click to "Xem Tất Cả" button
    const btnAll = document.querySelector('.gallery .btn-primary');
    if (btnAll) {
        btnAll.innerText = `XEM TẤT CẢ (${weddingImages.length})`;
        btnAll.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(0);
        });
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); changeImage(-1); });
    if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); changeImage(1); });

    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('show')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'ArrowRight') changeImage(1);
    });

    // 9. Gift Copy & QR Flip
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-copy');
            navigator.clipboard.writeText(text);
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
        });
    });

    const qrBtns = document.querySelectorAll('.qr-btn');
    const qrBackBtns = document.querySelectorAll('.qr-back-btn');

    qrBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cardInner = btn.closest('.gift-card-inner');
            if (cardInner) cardInner.classList.add('show-qr');
        });
    });

    qrBackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cardInner = btn.closest('.gift-card-inner');
            if (cardInner) cardInner.classList.remove('show-qr');
        });
    });
});

// Invite Overlay Logic
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    let guest = urlParams.get('guest');

    const guestNameEl = document.getElementById('guestName');
    const overlay = document.getElementById('inviteOverlay');

    if (overlay && guestNameEl) {
        if (guest) {
            guestNameEl.textContent = guest;
        } else {
            guestNameEl.textContent = 'Các vị khách quý';
        }
        document.body.classList.add('no-scroll');
    }
});

function openInvite() {
    const overlay = document.getElementById('inviteOverlay');
    const wrapper = document.querySelector('.envelope-wrapper');

    // Cuộn lên đầu trang ngay lập tức
    window.scrollTo(0, 0);

    if (wrapper) {
        wrapper.style.transform = 'scale(1.2)';
        wrapper.style.opacity = '0';
    }

    setTimeout(() => {
        if (overlay) {
            overlay.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }
    }, 400);
}
