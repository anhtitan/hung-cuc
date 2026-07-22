const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwG_oLZzpU2qwn5qXkIWIo2tXPmhYMSs5eAezpb2OUPbF1CD-Mw0XVFTRAQ6G0HAbRO/exec';
const initialWishesPromise = fetch(GOOGLE_SCRIPT_URL).then(res => res.json()).catch(err => ({ result: 'error', error: err }));

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

    // 4.5 Emoji Picker Logic
    const emojiBtn = document.getElementById('emojiBtn');
    const emojiPicker = document.getElementById('emojiPicker');
    const wishTextarea = document.getElementById('wishTextarea');

    if (emojiBtn && emojiPicker && wishTextarea) {
        // Toggle picker visibility
        emojiBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            emojiPicker.classList.toggle('active');
        });

        // Hide picker when clicking outside
        document.addEventListener('click', (e) => {
            if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
                emojiPicker.classList.remove('active');
            }
        });

        // Handle emoji selection
        emojiPicker.addEventListener('emoji-click', event => {
            const cursorPosition = wishTextarea.selectionStart;
            const textBefore = wishTextarea.value.substring(0, cursorPosition);
            const textAfter = wishTextarea.value.substring(cursorPosition, wishTextarea.value.length);

            wishTextarea.value = textBefore + event.detail.unicode + textAfter;

            // Restore cursor position
            wishTextarea.selectionStart = cursorPosition + event.detail.unicode.length;
            wishTextarea.selectionEnd = cursorPosition + event.detail.unicode.length;

            // Focus textarea
            wishTextarea.focus();
        });
    }

    // 5. Submit form RSVPs & Wishes
    // GOOGLE_SCRIPT_URL has been moved to global scope for prefetching
    const rsvpForm = document.getElementById('rsvpForm');
    const formMessage = document.getElementById('formMessage');

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

                    // Tự động tải lại danh sách lời chúc sau 2 giây (đợi Google Sheets ghi dữ liệu xong)
                    setTimeout(() => {
                        if (typeof fetchWishes === 'function') fetchWishes();
                    }, 2000);
                }, 800); // Báo thành công chỉ sau chưa tới 1 giây
            }
        });
    }
    // 5.5 Fetch and Display Wishes
    const wishesGrid = document.getElementById('wishesGrid');
    const wishesLoading = document.getElementById('wishesLoading');
    const btnViewAllWishes = document.getElementById('btnViewAllWishes');
    const wishesModal = document.getElementById('wishesModal');
    const closeWishesModal = document.getElementById('closeWishesModal');
    const wishesModalList = document.getElementById('wishesModalList');
    const wishesTotalCount = document.getElementById('wishesTotalCount');

    const createWishCard = (wish) => {
        let dateObj = new Date(wish.timestamp);
        let dateStr = isNaN(dateObj) ? '' : dateObj.toLocaleDateString('vi-VN');

        return `
            <div class="wish-card">
                <div class="wish-quote-icon"><i class="fa-solid fa-quote-left"></i></div>
                <div class="wish-message">${String(wish.message || '').replace(/\n/g, '<br>')}</div>
                <div class="wish-meta">
                    <div class="wish-author">
                        <span class="author-name">${wish.name}</span>
                        <span class="author-rel">${wish.guestOf ? 'Khách của ' + wish.guestOf : ''}</span>
                    </div>
                    <div class="wish-date">${dateStr}</div>
                </div>
            </div>
        `;
    };

    let isFirstLoad = true;
    const fetchWishes = () => {
        if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === '') return;

        let fetchPromise;
        if (isFirstLoad) {
            fetchPromise = initialWishesPromise;
            isFirstLoad = false;
        } else {
            fetchPromise = fetch(GOOGLE_SCRIPT_URL).then(res => res.json());
        }

        fetchPromise
            .then(data => {
                if (data.result === 'success') {
                    // Giữ nguyên mảng (mới nhất lên đầu) từ Apps Script
                    const wishes = data.data;
                    if (wishesLoading) wishesLoading.style.display = 'none';

                    if (wishes.length === 0) {
                        const wishesGrid1 = document.getElementById('wishesGrid1');
                        if (wishesGrid1) wishesGrid1.innerHTML = '<p class="text-center" style="grid-column: 1/-1; color: #666;">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc nhé!</p>';
                        return;
                    }

                    // Hiển thị tất cả lời chúc (hoặc tối đa 20 lời chúc mới nhất để cuộn)
                    let htmlPreview = '';
                    const previewCount = Math.min(wishes.length, 20);
                    for (let i = 0; i < previewCount; i++) {
                        htmlPreview += createWishCard(wishes[i]);
                    }
                    
                    const wishesGrid1 = document.getElementById('wishesGrid1');
                    const wishesGrid2 = document.getElementById('wishesGrid2');
                    
                    if (wishesGrid1) wishesGrid1.innerHTML = htmlPreview;
                    if (wishesGrid2) wishesGrid2.innerHTML = htmlPreview; // Nhân bản để cuộn vòng tròn

                    // Render Modal
                    if (wishes.length > 0) {
                        if (btnViewAllWishes) {
                            btnViewAllWishes.style.display = 'inline-block';
                            btnViewAllWishes.innerText = `XEM TẤT CẢ (${wishes.length})`;
                        }
                        if (wishesTotalCount) wishesTotalCount.innerText = wishes.length;

                        let htmlAll = '';
                        wishes.forEach(wish => {
                            htmlAll += createWishCard(wish);
                        });
                        if (wishesModalList) wishesModalList.innerHTML = htmlAll;
                    }
                } else {
                    if (wishesLoading) wishesLoading.innerHTML = '<p>Không thể tải lời chúc.</p>';
                }
            })
            .catch(err => {
                console.error(err);
                if (wishesLoading) wishesLoading.innerHTML = '<p>Đã xảy ra lỗi khi tải lời chúc.</p>';
            });
    };

    if (btnViewAllWishes) {
        btnViewAllWishes.addEventListener('click', () => {
            wishesModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    if (closeWishesModal) {
        closeWishesModal.addEventListener('click', () => {
            wishesModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    if (wishesModal) {
        wishesModal.addEventListener('click', (e) => {
            if (e.target === wishesModal) {
                wishesModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Tự động tải lời chúc khi vào trang
    fetchWishes();


    // 6. Countdown Timer
    const countdown = () => {
        const countDate = new Date("Aug 8, 2026 14:00:00").getTime();
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
        "21071.jpg",
        "21072.jpg",
        "21073.jpg",
        "21074.jpg",
        "21075.jpg",
        "21076.jpg",
        "21077.jpg",
        "21078.jpg",
        "21079.jpg",
        "210710.jpg",
        "210711.jpg",
        "210712.jpg",
        "210713.jpg",
        "210714.jpg",
        "210715.jpg",
        "210716.jpg",
        "210717.jpg"
    ].map(name => `./assets/images/wd/${name}`);

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
            
            // Cập nhật thẻ meta SEO và Open Graph
            const ogDesc = document.querySelector('meta[property="og:description"]');
            const metaDesc = document.querySelector('meta[name="description"]');
            const customText = `Trân trọng kính mời ${guest} đến tham dự lễ cưới của Quang Hưng và Kim Cúc`;
            
            if (ogDesc) ogDesc.setAttribute('content', customText);
            if (metaDesc) metaDesc.setAttribute('content', customText);
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
        const staticEnv = document.getElementById('staticEnvelope');
        const animatedEnv = document.getElementById('animatedEnvelope');
        
        if (staticEnv && animatedEnv) {
            staticEnv.style.display = 'none';
            animatedEnv.style.display = 'block';
            
            // Ép trình duyệt render lại trước khi add class open
            void animatedEnv.offsetWidth;
        }

        // 1. Thêm class open để kích hoạt hiệu ứng lật nắp thiệp
        wrapper.classList.add('open');
        
        // 2. Chờ 1.2s cho hiệu ứng mở thiệp chạy xong rồi mới phóng to mờ dần
        setTimeout(() => {
            wrapper.style.transform = 'scale(1.2)';
            wrapper.style.opacity = '0';
        }, 1200);
    }

    // 3. Chờ thêm 500ms nữa (tổng 1700ms) để đóng hẳn overlay
    setTimeout(() => {
        if (overlay) {
            overlay.classList.add('hidden');
            document.body.classList.remove('no-scroll');

            // Kích hoạt hiệu ứng động cho ảnh và chữ
            const heroSection = document.getElementById('home');
            if (heroSection) heroSection.classList.add('animate-active');
        }
    }, 1600);
}
