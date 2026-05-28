document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. HEADER SCROLL EFFECT
       ========================================================================== */
    const header = document.getElementById('mainHeader');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    /* ==========================================================================
       2. SCROLL REVEAL ANIMATIONS (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.fade-in, .fade-in-up');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                // Once it animates in, we don't need to observe it anymore
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));


    /* ==========================================================================
       3. BACK TO TOP BUTTON
       ========================================================================== */
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    /* ==========================================================================
       4. FAQ ACCORDION LOGIC
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question-btn');
        
        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-question-btn').setAttribute('aria-expanded', 'false');
            });
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });


    /* ==========================================================================
       5. GALLERY LIGHTBOX MODAL
       ========================================================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let currentIndex = 0;
    const imagesData = Array.from(galleryItems).map(item => {
        const img = item.querySelector('.gallery-img');
        const cap = item.querySelector('.overlay-text');
        return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            caption: cap ? cap.textContent : ''
        };
    });
    
    const openLightbox = (index) => {
        currentIndex = index;
        const data = imagesData[currentIndex];
        
        lightboxImg.setAttribute('src', data.src);
        lightboxImg.setAttribute('alt', data.alt);
        lightboxCaption.textContent = data.caption;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop page scrolling
    };
    
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore page scrolling
    };
    
    const showNext = () => {
        currentIndex = (currentIndex + 1) % imagesData.length;
        openLightbox(currentIndex);
    };
    
    const showPrev = () => {
        currentIndex = (currentIndex - 1 + imagesData.length) % imagesData.length;
        openLightbox(currentIndex);
    };
    
    // Attach click events to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
    
    // Lightbox Controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNext);
    lightboxPrev.addEventListener('click', showPrev);
    
    // Close lightbox clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        }
    });


    /* ==========================================================================
       6. CONTACT FORM SUBMISSION (Mailto Generator)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const formSubmitBtn = document.getElementById('formSubmitBtn');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('clientName').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        const email = document.getElementById('clientEmail').value.trim();
        const message = document.getElementById('clientMessage').value.trim();
        
        if (!name || !phone) {
            showFeedback('אנא מלאו את שדות החובה: שם ומספר טלפון.', 'error');
            return;
        }
        
        // Show loading state on button
        const originalBtnContent = formSubmitBtn.innerHTML;
        formSubmitBtn.innerHTML = '<span>מכין את הפנייה...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
        formSubmitBtn.disabled = true;
        
        // Construct email components
        const recipient = 'y0548574849@gmail.com';
        const subject = encodeURIComponent(`פנייה חדשה מדף הנחיתה: ${name}`);
        
        let bodyContent = `שלום יהודית,\n\n`;
        bodyContent += `התקבלה פנייה חדשה מדף הנחיתה של סדנת "יצירה חדה":\n\n`;
        bodyContent += `👤 שם מלא / שם הקייטנה: ${name}\n`;
        bodyContent += `📞 טלפון לחזרה: ${phone}\n`;
        if (email) bodyContent += `✉️ כתובת אימייל: ${email}\n`;
        if (message) bodyContent += `💬 הודעה / בקשות מיוחדות:\n${message}\n\n`;
        bodyContent += `--- נשלח מדף הנחיתה של יצירה חדה ---`;
        
        const body = encodeURIComponent(bodyContent);
        
        // Build mailto link
        const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
        
        setTimeout(() => {
            // Open user's email client
            window.location.href = mailtoLink;
            
            showFeedback('מעולה! תוכנת הדוא"ל שלך נפתחת כעת לשליחת הפרטים. תודה רבה!', 'success');
            contactForm.reset();
            
            // Restore button
            formSubmitBtn.innerHTML = originalBtnContent;
            formSubmitBtn.disabled = false;
        }, 800);
    });
    
    function showFeedback(text, type) {
        formFeedback.textContent = text;
        formFeedback.className = 'form-feedback'; // reset
        formFeedback.classList.add(type);
        
        // Scroll feedback into view
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide feedback after 8 seconds if successful
        if (type === 'success') {
            setTimeout(() => {
                formFeedback.style.display = 'none';
            }, 8000);
        }
    }
});
