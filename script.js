const _0x4f2a = ['aHR0cHM6Ly9zY3JpcHQu', 'Z29vZ2xlLmNvbS9tYWNy', 'b3Mvcy9BS2Z5Y2J3R19v', 'TFp6cFUycXduNXFYa0lX', 'SW8ydFhQbWhZTVNzNWVB', 'ZXpwYjJPVVBiRjFDRC1N', 'dzBYVkZUUkFRNkcwSEFi', 'Uk8vZXhlYw=='];
const GOOGLE_SCRIPT_URL = atob(_0x4f2a.join(''));
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
        // Tự động nhảy số người tham dự
        const attendanceSelect = rsvpForm.querySelector('select[name="attendance"]');
        const guestCountSelect = rsvpForm.querySelector('select[name="guestCount"]');

        if (attendanceSelect && guestCountSelect) {
            attendanceSelect.addEventListener('change', function () {
                if (this.value === 'Không') {
                    guestCountSelect.value = '0';
                    guestCountSelect.style.pointerEvents = 'none';
                    guestCountSelect.style.opacity = '0.6';
                } else if (this.value === 'Có') {
                    guestCountSelect.style.pointerEvents = 'auto';
                    guestCountSelect.style.opacity = '1';
                    guestCountSelect.value = '1';
                }
            });
        }

        const submitBtn = rsvpForm.querySelector('button[type="submit"]');
        submitBtn.addEventListener('click', () => {
            if (!rsvpForm.checkValidity()) {
                alert("Vui lòng điền và chọn đầy đủ các thông tin bắt buộc (*) trước khi gửi lời chúc nhé!");
            }
        });

        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = rsvpForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';
            btn.disabled = true;

            const formData = new FormData(rsvpForm);

            // Thuật toán chống Replay Attack (Nonce + Timestamp + Token)
            const nonce = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
            const timestamp = Date.now().toString();
            
            const _0xkey = ['V0VERElOR1', '9IQ18yMDI2X', '1NFQ1VSRV', '9LRVk='];
            const secret = atob(_0xkey.join(''));
            
            const message = nonce + timestamp + secret;
            const encoder = new TextEncoder();
            const data = encoder.encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const token = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            formData.append('nonce', nonce);
            formData.append('timestamp', timestamp);
            formData.append('token', token);
            formData.append('apiKey', secret);

            if (GOOGLE_SCRIPT_URL === '') {
                // Giả lập 
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
                //reall
                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                }).catch(err => console.error('Lỗi ngầm:', err));

                // thanh cong
                setTimeout(() => {
                    const guestName = formData.get('name') || 'bạn';
                    const attendance = formData.get('attendance');

                    document.getElementById('thankYouName').innerText = guestName;

                    const msgEl = document.getElementById('thankYouMessage');
                    if (attendance === 'Có') {
                        msgEl.innerText = 'Lời chúc của Quý khách là niềm hạnh phúc của gia đình chúng tôi. Hẹn gặp Quý khách trong ngày đặc biệt!';
                    } else {
                        msgEl.innerText = 'Dù Quý khách không thể tham dự, lời chúc của Quý khách vẫn là món quà tinh thần vô cùng ý nghĩa đối với gia đình chúng tôi.';
                    }

                    rsvpForm.style.display = 'none';
                    const formTitle = document.querySelector('.form-title');
                    if (formTitle) formTitle.style.display = 'none';

                    const thankYouUI = document.getElementById('thankYouUI');
                    if (thankYouUI) thankYouUI.style.display = 'block';

                    // cap nhat loi chuc--
                    let messageText = formData.get('message') || '';
                    if (messageText.trim() !== '') {
                        const newWishHtml = `
                            <div class="wish-card" style="border: 1px solid #55875c; background: #f4f8f4; animation: fadeIn 0.5s ease;">
                                <div class="wish-quote-icon"><i class="fa-solid fa-quote-left"></i></div>
                                <div class="wish-message">${String(messageText).replace(/\n/g, '<br>')}</div>
                                <div class="wish-meta">
                                    <div class="wish-author">
                                        <span class="author-name">${guestName}</span>
                                        <span class="author-rel">${formData.get('guestOf') ? 'Khách của ' + formData.get('guestOf') : ''}</span>
                                    </div>
                                    <div class="wish-date">Vừa xong</div>
                                </div>
                            </div>
                        `;

                        const grid1 = document.getElementById('wishesGrid1');
                        const grid2 = document.getElementById('wishesGrid2');
                        const modalList = document.getElementById('wishesModalList');

                        // Xóa dòng "Chưa có lời chúc nào" (lúc khởi tạo đầu tien)
                        if (grid1 && grid1.innerHTML.includes('Chưa có lời chúc nào')) {
                            grid1.innerHTML = '';
                            if (grid2) grid2.innerHTML = '';
                        }

                        if (grid1) grid1.insertAdjacentHTML('afterbegin', newWishHtml);
                        if (grid2) grid2.insertAdjacentHTML('afterbegin', newWishHtml);

                        if (window.allFetchedWishes) {
                            window.allFetchedWishes.unshift({
                                name: guestName,
                                message: messageText,
                                guestOf: formData.get('guestOf') || '',
                                timestamp: new Date().toISOString()
                            });
                            if (typeof window.renderSortedWishes === 'function') window.renderSortedWishes();
                        } else {
                            if (modalList) modalList.insertAdjacentHTML('afterbegin', newWishHtml);
                        }

                        const countEl = document.getElementById('wishesTotalCount');
                        if (countEl) {
                            let currentCount = parseInt(countEl.innerText.replace(/[^0-9]/g, '')) || 0;
                            countEl.innerText = `${currentCount + 1} Lời chúc`;
                        }

                        // Khởi động lại animation cuộn từ đầu để hiện lời chúc mới nhất
                        const track = document.getElementById('wishesMarqueeTrack');
                        if (track) {
                            track.classList.remove('run-animation');
                            void track.offsetWidth; // Ép trình duyệt cập nhật thay đổi (reflow)
                            track.classList.add('run-animation');
                        }

                        // Tự động cuộn nhẹ màn hình xuống khu vực lời chúc
                        const container = document.querySelector('.wishes-marquee-container');
                        if (container) {
                            container.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }
                    // --------------------------------------------------

                    rsvpForm.reset();
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 800); // thanh cong
            }
        });
    }
    // 5.5 Fetch and Display Wishes
    window.allFetchedWishes = [];
    window.renderSortedWishes = () => {
        const modalList = document.getElementById('wishesModalList');
        const sortSelect = document.getElementById('wishesSortSelect');
        if (!modalList || !window.allFetchedWishes) return;

        let order = sortSelect ? sortSelect.value : 'newest';
        let sorted = [...window.allFetchedWishes];
        if (order === 'oldest') {
            sorted.reverse();
        }

        let htmlAll = '';
        sorted.forEach(wish => {
            htmlAll += createWishCard(wish);
        });
        modalList.innerHTML = htmlAll;
    };

    const wishesGrid = document.getElementById('wishesGrid');
    const wishesLoading = document.getElementById('wishesLoading');
    const btnViewAllWishes = document.getElementById('btnViewAllWishes');
    const wishesModal = document.getElementById('wishesModal');
    const closeWishesModal = document.getElementById('closeWishesModal');
    const wishesModalList = document.getElementById('wishesModalList');
    const wishesTotalCount = document.getElementById('wishesTotalCount');

    const createWishCard = (wish) => {
        let dateObj = new Date(wish.timestamp);
        let dateStr = '';
        if (!isNaN(dateObj)) {
            const h = String(dateObj.getHours()).padStart(2, '0');
            const m = String(dateObj.getMinutes()).padStart(2, '0');
            const d = String(dateObj.getDate()).padStart(2, '0');
            const mo = String(dateObj.getMonth() + 1).padStart(2, '0');
            const y = dateObj.getFullYear();
            dateStr = `${h}:${m} - ${d}/${mo}/${y}`;
        }

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

                    // Hiển thị 21 lc
                    let htmlPreview = '';
                    const previewCount = Math.min(wishes.length, 21);
                    for (let i = 0; i < previewCount; i++) {
                        htmlPreview += createWishCard(wishes[i]);
                    }

                    const wishesGrid1 = document.getElementById('wishesGrid1');
                    const wishesGrid2 = document.getElementById('wishesGrid2');

                    if (wishesGrid1) wishesGrid1.innerHTML = htmlPreview;
                    if (wishesGrid2) wishesGrid2.innerHTML = htmlPreview; // Nhân bản để cuộn vòng tròn

                    // Ép Safari tính toán lại kích thước DOM trước khi chạy hiệu ứng để tránh lỗi render
                    const track = document.getElementById('wishesMarqueeTrack');
                    if (track) {
                        void track.offsetHeight;

                        // Dùng IntersectionObserver để theo dõi khi nào người dùng cuộn tới Lời chúc
                        const container = document.querySelector('.wishes-marquee-container');
                        if (container) {
                            const observer = new IntersectionObserver((entries) => {
                                if (entries[0].isIntersecting) {
                                    // Đợi 1 giây (1000ms) sau khi nhìn thấy mới bắt đầu cuộn
                                    setTimeout(() => {
                                        track.classList.add('run-animation');
                                    }, 1000);
                                    // Ngắt theo dõi để chỉ kích hoạt 1 lần duy nhất
                                    observer.disconnect();
                                }
                            }, { threshold: 0.2 }); // Kích hoạt khi cuộn tới 20% khung container

                            observer.observe(container);
                        } else {
                            track.classList.add('run-animation');
                        }
                    }

                    // Render Modal
                    if (wishes.length > 0) {
                        if (btnViewAllWishes) {
                            btnViewAllWishes.style.display = 'inline-block';
                            btnViewAllWishes.innerText = `XEM TẤT CẢ (${wishes.length})`;
                        }
                        if (wishesTotalCount) wishesTotalCount.innerText = wishes.length;

                        window.allFetchedWishes = wishes;
                        if (typeof window.renderSortedWishes === 'function') window.renderSortedWishes();
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
            
            // Tự động phát nhạc khi mở thiệp (nếu trình duyệt cho phép)
            const bgMusic = document.getElementById('bgMusic');
            const playPauseBtn = document.getElementById('playPauseBtn');
            if (bgMusic && bgMusic.paused) {
                bgMusic.play().then(() => {
                    if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                }).catch(e => console.log("Trình duyệt chặn tự động phát nhạc:", e));
            }
        }
    }, 1600);
}

document.addEventListener('DOMContentLoaded', () => {
    // 6. Music Player
    const bgMusic = document.getElementById('bgMusic');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const musicPlayerCard = document.getElementById('musicPlayerCard');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBarBg = document.getElementById('progressBarBg');
    const progressBarFill = document.getElementById('progressBarFill');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');

    if (bgMusic && musicToggleBtn) {
        // Toggle player visibility
        musicToggleBtn.addEventListener('click', (e) => {
            musicPlayerCard.classList.toggle('hidden');
        });

        // Close player when clicking outside
        document.addEventListener('click', (e) => {
            if (!musicPlayerCard.contains(e.target) && !musicToggleBtn.contains(e.target)) {
                if (!musicPlayerCard.classList.contains('hidden')) {
                    musicPlayerCard.classList.add('hidden');
                }
            }
        });

        // Play/Pause
        playPauseBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
            } else {
                bgMusic.pause();
            }
        });

        // Sync toggle button and play button state with audio events
        bgMusic.addEventListener('play', () => {
            musicToggleBtn.classList.add('playing');
            musicToggleBtn.setAttribute('data-tooltip', 'Đang phát nhạc');
            if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        });

        bgMusic.addEventListener('pause', () => {
            musicToggleBtn.classList.remove('playing');
            musicToggleBtn.setAttribute('data-tooltip', 'Phát nhạc');
            if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        });

        // Format time (seconds to M:SS)
        const formatTime = (time) => {
            if (isNaN(time)) return "0:00";
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };

        // Update progress and time
        bgMusic.addEventListener('timeupdate', () => {
            if (bgMusic.duration) {
                const progressPercent = (bgMusic.currentTime / bgMusic.duration) * 100;
                progressBarFill.style.width = `${progressPercent}%`;
                currentTimeEl.textContent = formatTime(bgMusic.currentTime);
            }
        });

        // Set total time when loaded
        bgMusic.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(bgMusic.duration);
        });

        // Seek when clicking on progress bar
        progressBarBg.addEventListener('click', (e) => {
            const width = progressBarBg.clientWidth;
            const clickX = e.offsetX;
            const duration = bgMusic.duration;
            bgMusic.currentTime = (clickX / width) * duration;
        });
    }
});
