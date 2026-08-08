/* ==========================================================================
   AHMED MAHMAD - PORTFOLIO INTERACTIVE JAVASCRIPT
   Vanilla JS logic for theme toggling, typing effects, scroll reveal, 
   animated stats, interactive form validation, and responsive mobile nav.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. THEME TOGGLE (DARK / LIGHT MODE) WITH LOCAL STORAGE
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('ahmed_portfolio_theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('ahmad_portfolio_theme', newTheme);
  });

  /* --------------------------------------------------------------------------
     2. HERO TYPING ANIMATION
     -------------------------------------------------------------------------- */
  const typingTextElement = document.getElementById('typingText');
  const titles = [
    "Computer Maintenance Technician",
    "Aspiring Software Developer",
    "Networking Enthusiast",
    "Cybersecurity Learner"
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
      typingTextElement.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingTextElement.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      // Pause at end of word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  if (typingTextElement) {
    typeEffect();
  }

  /* --------------------------------------------------------------------------
     3. SCROLL PROGRESS BAR & STICKY NAVBAR
     -------------------------------------------------------------------------- */
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;

    // Update scroll progress bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = scrolled + '%';
    }

    // Sticky Navbar class
    if (windowScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (windowScroll > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Highlight Active Nav Link on Scroll
    highlightActiveNav();
  });

  // Back to top click handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. MOBILE MENU DRAWER TOGGLE
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu(open) {
    const isOpen = typeof open === 'boolean' ? open : !navMenu.classList.contains('active');
    
    navMenu.classList.toggle('active', isOpen);
    mobileMenuBtn.classList.toggle('active', isOpen);
    if (navOverlay) navOverlay.classList.toggle('active', isOpen);
    mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());

    if (navOverlay) {
      navOverlay.addEventListener('click', () => toggleMobileMenu(false));
    }

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });
  }

  /* --------------------------------------------------------------------------
     5. ACTIVE NAV LINK HIGHLIGHTING
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     6. INTERSECTION OBSERVER FOR SCROLL REVEAL & ANIMATIONS
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* --------------------------------------------------------------------------
     7. ANIMATED STATS COUNTER
     -------------------------------------------------------------------------- */
  const counterElements = document.querySelectorAll('.counter');
  let animatedCounters = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedCounters) {
        animatedCounters = true;
        counterElements.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1500; // ms
          const step = Math.ceil(target / (duration / 20));
          let current = 0;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = current;
            }
          }, 20);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsStrip = document.querySelector('.hero-stats-strip');
  if (statsStrip) {
    counterObserver.observe(statsStrip);
  }

  /* --------------------------------------------------------------------------
     8. ANIMATED SKILLS PROGRESS BARS
     -------------------------------------------------------------------------- */
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const percent = fill.getAttribute('data-percent');
        fill.style.width = percent + '%';
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  /* --------------------------------------------------------------------------
     9. CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous error messages
      document.getElementById('nameError').textContent = '';
      document.getElementById('emailError').textContent = '';
      document.getElementById('messageError').textContent = '';
      formStatus.className = 'form-status-alert';
      formStatus.style.display = 'none';

      // Validate Name
      if (!nameInput.value.trim()) {
        document.getElementById('nameError').textContent = 'Please enter your name.';
        isValid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        document.getElementById('emailError').textContent = 'Please enter your email address.';
        isValid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        document.getElementById('messageError').textContent = 'Please enter a message.';
        isValid = false;
      }

      if (isValid) {
        // Show sending state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;

        // Simulate async submission delay
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;
          
          formStatus.textContent = 'Thank you! Your message has been sent successfully. Ahmed will respond soon.';
          formStatus.classList.add('success');
          
          contactForm.reset();
        }, 1200);
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. FOOTER DYNAMIC YEAR
     -------------------------------------------------------------------------- */
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});
