// Central script for WagWorthy Walks
document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display dynamic content
    fetchPosts();
    
    // Helper - show inline form messages
    function showFormMessage(message, type = 'success') {
        const existing = document.querySelector('.form-message');
        if (existing) existing.remove();
        const msg = document.createElement('div');
        msg.className = 'form-message ' + type;
        msg.textContent = message;
        // Try to insert above the booking form or at top of page
        const form = document.getElementById('walkBookingForm');
        if (form && form.parentNode) {
            form.parentNode.insertBefore(msg, form);
        } else {
            document.body.insertBefore(msg, document.body.firstChild);
        }
        // Auto-remove
        setTimeout(() => { msg.classList.add('fade-out'); setTimeout(() => msg.remove(), 600); }, 3800);
    }

    // Set minimum date for booking date input
    const walkDate = document.getElementById('walkDate');
    if (walkDate) {
        walkDate.min = new Date().toISOString().split('T')[0];
    }

    // Smooth-scroll for same-page anchors (hash links)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Only intercept pure-fragment links (stay on page)
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return; // ignore empty anchors
            if (href.startsWith('#') && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // move keyboard focus for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        });
    });

    // If page loaded with a hash (including from another page), smoothly scroll and focus
    if (location.hash) {
        // Delay briefly so layout settles
        setTimeout(() => {
            try {
                const target = document.querySelector(location.hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    target.setAttribute('tabindex', '-1');
                    target.focus({ preventScroll: true });
                }
            } catch (err) { /* ignore invalid selectors */ }
        }, 80);
    }

    // Booking form handling (validation + success message + modal notification)
    const form = document.getElementById('walkBookingForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = (form.querySelector('#phoneNumber') || {}).value || '';
            const phonePattern = /^[0-9()+\-\s]{7,25}$/;
            if (!phonePattern.test(phone.trim())) {
                showFormMessage('Please enter a valid phone number (digits, spaces, +, - allowed).', 'error');
                return;
            }
            // Show modal notification
            showBookingModal();
            form.reset();
            // remove any prefill key
            try { localStorage.removeItem('prefillWalker'); } catch (e) {}
        });
    }

    // Modal notification for booking
    function showBookingModal() {
        // Remove any existing modal
        const existing = document.getElementById('booking-modal');
        if (existing) existing.remove();
        const modal = document.createElement('div');
        modal.id = 'booking-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-popup">
                <h2>Thank you!</h2>
                <p>Your walk request was sent. We will confirm shortly.</p>
                <button id="close-booking-modal" class="modal-close-btn">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
        // Trap focus and close on button or overlay click
        const closeBtn = modal.querySelector('#close-booking-modal');
        closeBtn.focus();
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        document.addEventListener('keydown', function escHandler(ev) {
            if (ev.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', escHandler); }
        });
    }

    // Prefill walker select if navigating from walkers page
    function applyPrefillWalker() {
        try {
            const pref = localStorage.getItem('prefillWalker');
            if (!pref) return false;
            const select = document.getElementById('walker');
            if (!select) return false;
            // try to match by value first
            const optionByValue = Array.from(select.options).find(o => o.value.toLowerCase() === pref.toLowerCase());
            if (optionByValue) {
                select.value = optionByValue.value;
                return true;
            }
            // otherwise try to match by visible text
            const optionByText = Array.from(select.options).find(o => o.textContent.toLowerCase().includes(pref.toLowerCase()));
            if (optionByText) {
                select.value = optionByText.value;
                return true;
            }
        } catch (e) { /* ignore */ }
        return false;
    }

    // Function to fetch posts from JSONPlaceholder API
    async function fetchPosts() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
            const posts = await response.json();
            displayPosts(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            const contentContainer = document.getElementById('dynamic-content');
            if (contentContainer) {
                contentContainer.innerHTML = '<p class="error">Failed to load content. Please try again later.</p>';
            }
        }
    }

    // Function to display posts in the DOM
    function displayPosts(posts) {
        const contentContainer = document.getElementById('dynamic-content');
        if (!contentContainer) return;
        
        contentContainer.innerHTML = '';

        posts.forEach(post => {
            // Create post element with a nice card design
            const postElement = document.createElement('div');
            postElement.className = 'post-card';
            
            // Transform the post title to make it relevant to dog walking
            const transformedTitle = transformTitle(post.title);
            
            postElement.innerHTML = `
                <h3>${transformedTitle}</h3>
                <p class="preview-text">${post.body.split(' ').slice(0, 15).join(' ')}...</p>
                <div class="post-footer">
                    <a href="walkers.html#blog-section" class="read-more">Read more →</a>
                </div>
            `;
            
            contentContainer.appendChild(postElement);
        });
    }

    // Function to transform generic titles into dog-walking related titles
    function transformTitle(title) {
        const dogRelatedTitles = [
            "Why Daily Walks Keep Your Dog Happy and Healthy",
            "Tips for Making Every Dog Walk More Enjoyable",
            "Building Strong Bonds Through Regular Walking"
        ];
        
        // Use a predefined title based on the index, or return the original if none match
        const index = Math.floor(Math.random() * dogRelatedTitles.length);
        return dogRelatedTitles[index];
    }

    // If prefill exists, apply and scroll to booking section
    if (applyPrefillWalker()) {
        const booking = document.getElementById('bookingSection');
        if (booking) {
            setTimeout(() => { booking.scrollIntoView({ behavior: 'smooth', block: 'start' }); booking.setAttribute('tabindex','-1'); booking.focus({preventScroll:true}); }, 120);
        }
        try { localStorage.removeItem('prefillWalker'); } catch (e) {}
    }

    // On walkers page: clicking Book a Walk buttons stores selection and navigates to main page
    document.querySelectorAll('.book-walker-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = btn.closest('.walker-card');
            if (!card) return;
            const nameEl = card.querySelector('h2');
            const fullName = nameEl ? nameEl.textContent.trim() : '';
            // map known walker display names to select values
            const map = {
                'Sarah Mitchell': 'sarah',
                'James Cooper': 'james',
                'Emma Rodriguez': 'emma',
                'Michael Chen': 'michael'
            };
            const val = map[fullName] || fullName;
            try { localStorage.setItem('prefillWalker', val); } catch (err) {}
            // Navigate to index page booking section
            window.location.href = 'index1.html#bookingSection';
        });
    });

    // Contact form handling - safer approach
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = (contactForm.querySelector('#contactName') || {}).value || '';
            const email = (contactForm.querySelector('#contactEmail') || {}).value || '';
            const subject = (contactForm.querySelector('#contactSubject') || {}).value || '';
            const message = (contactForm.querySelector('#contactMessage') || {}).value || '';

            // basic validation
            if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
                showFormMessage('Please fill in all fields before sending.', 'error');
                return;
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.trim())) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Limit sizes to avoid overly long URLs and to be safe
            const MAX_SUBJECT = 120;
            const MAX_MESSAGE = 2000;
            if (subject.length > MAX_SUBJECT) {
                showFormMessage(`Subject is too long (max ${MAX_SUBJECT} characters).`, 'error');
                return;
            }
            if (message.length > MAX_MESSAGE) {
                showFormMessage(`Message is too long (max ${MAX_MESSAGE} characters). Please shorten your message.`, 'error');
                return;
            }

            // Read recipient from data attribute (safer than hard-coding in script)
            const recipient = contactForm.dataset && contactForm.dataset.recipient ? contactForm.dataset.recipient.trim() : '';
            if (!recipient || recipient === 'yourgmailaddress@gmail.com') {
                showFormMessage('Contact recipient not configured. Please set the contact form recipient email in walkers.html data-recipient attribute.', 'error');
                return;
            }

            // Build safe urls
            const body = `From: ${name} (${email})\n\n${message}`;
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Instead of opening windows automatically (popups can be blocked or surprising),
            // show the user explicit, safe links to open the compose window.
            const linksContainer = document.getElementById('contact-links');
            if (!linksContainer) {
                showFormMessage('Unexpected error: missing links container.', 'error');
                return;
            }
            // Clear any previous content
            linksContainer.innerHTML = '';

            // Create a sanitized summary for the user to review (use textContent to avoid HTML injection)
            const summary = document.createElement('div');
            summary.className = 'compose-summary';
            const summaryTitle = document.createElement('strong');
            summaryTitle.textContent = 'Ready to compose your message';
            const summaryP = document.createElement('p');
            summaryP.textContent = `To: ${recipient} — Subject: ${subject}`;
            const preview = document.createElement('p');
            preview.textContent = message.length > 200 ? message.slice(0, 197) + '...' : message;
            summary.appendChild(summaryTitle);
            summary.appendChild(summaryP);
            summary.appendChild(preview);

            // Create Gmail compose link (user must click)
            const gmailLink = document.createElement('a');
            gmailLink.className = 'compose-btn';
            gmailLink.href = gmailUrl;
            gmailLink.target = '_blank';
            gmailLink.rel = 'noopener noreferrer';
            gmailLink.textContent = 'Open Gmail compose';

            // Create fallback mailto link
            const mailtoLink = document.createElement('a');
            mailtoLink.className = 'compose-btn secondary';
            mailtoLink.href = mailtoUrl;
            mailtoLink.textContent = 'Open default mail client';

            // Append to container
            linksContainer.appendChild(summary);
            linksContainer.appendChild(gmailLink);
            linksContainer.appendChild(mailtoLink);

            showFormMessage('Links available — click one to open your mail compose window. No message was sent automatically.', 'success');

            // Keep the form populated so user can edit before sending; do not auto-reset.
        });
    }

    // Enhance any 'Book a Walk' links inside the hero to behave consistently
    document.querySelectorAll('.booking-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // if link navigates to fragment on same page, the smooth-scroll handler above will run
        });
    });
});

/* Minimal styles for the inline messages (in case style.css doesn't include them) */
(function injectFormMessageStyles(){
    const css = `.form-message{position:relative;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-weight:600;max-width:900px;background:#0f172a;color:#fff;box-shadow:0 8px 24px rgba(2,6,23,0.16);}
    .form-message.error{background:#b91c1c}
    .form-message.fade-out{opacity:0;transition:opacity .6s ease}
    `;
    const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
})();
