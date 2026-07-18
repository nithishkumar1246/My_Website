document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ==========================================================================
     THEME TOGGLE
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const bodyElement = document.body;

  // Read saved theme or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
    bodyElement.classList.remove('dark-theme');
    bodyElement.classList.add('light-theme');
  } else {
    bodyElement.classList.add('dark-theme');
    bodyElement.classList.remove('light-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    if (bodyElement.classList.contains('light-theme')) {
      bodyElement.classList.remove('light-theme');
      bodyElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      bodyElement.classList.remove('dark-theme');
      bodyElement.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    }
    // Re-initialize particles to update their color dynamically to match the theme
    if (typeof initParticles === 'function') {
      initParticles();
    }
  });

  /* ==========================================================================
     CUSTOM CURSOR TRACKING
     ========================================================================== */
  const cursorDot = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.custom-cursor-follower');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Immediate dot tracking
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  // Follower lagging animation loop
  function animateCursor() {
    // 0.15 makes the follower lag smoothly
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    if (cursorFollower) {
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Add hover effect to interactive items
  const interactiveSelector = 'a, button, .project-card, .cert-card, .filter-btn, .cert-filter-btn, .form-group input, .form-group textarea';
  document.querySelectorAll(interactiveSelector).forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  /* ==========================================================================
     STICKY HEADER & ACTIVE SECTION HIGHLIGHT
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header scroll class toggle
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Intersection Observer for highlighting menu links
  const sectionObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the middle of screen
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        // Remove active class from all links
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });

        // Also update mobile drawer link active status
        document.querySelectorAll('.drawer-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, sectionObserverOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  /* ==========================================================================
     MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileMenuBtn.addEventListener('click', openDrawer);
  mobileMenuClose.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  /* ==========================================================================
     PROJECTS SHOWCASE FILTER
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // Trigger slight scale fade-in animation
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ==========================================================================
     MODALS FUNCTIONALITY
     ========================================================================== */
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtns = document.querySelectorAll('.close-modal-btn');
  const modals = document.querySelectorAll('.modal');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
      }
    });
  });

  function closeAllModals() {
    modals.forEach(modal => {
      modal.classList.remove('open');
      const video = modal.querySelector('video');
      if (video) {
        video.pause();
      }
      const iframe = modal.querySelector('iframe');
      if (iframe) {
        const src = iframe.src;
        iframe.src = src;
      }
    });
    document.body.style.overflow = '';
  }

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Close modal when clicking on backdrop
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // Close modals on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      closeDrawer();
    }
  });

  /* ==========================================================================
     CONTACT FORM VALIDATION & SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const successOverlay = document.getElementById('success-overlay');
  const successCloseBtn = document.getElementById('success-close-btn');

  // Input elements
  const formFields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate: (val) => val.trim().length > 0
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate: (val) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(val).toLowerCase());
      }
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('message-error'),
      validate: (val) => val.trim().length > 0
    }
  };

  // Set real-time validation on input/blur events
  Object.keys(formFields).forEach(key => {
    const field = formFields[key];

    // Clear invalid class on focus
    field.input.addEventListener('focus', () => {
      field.input.closest('.form-group').classList.remove('invalid');
    });

    // Validate on blur
    field.input.addEventListener('blur', () => {
      const isValid = field.validate(field.input.value);
      if (!isValid) {
        field.input.closest('.form-group').classList.add('invalid');
      } else {
        field.input.closest('.form-group').classList.remove('invalid');
      }
    });
  });

  // Form submit event
  const submitBtn = document.getElementById('form-submit-btn');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;

    // Validate all fields
    Object.keys(formFields).forEach(key => {
      const field = formFields[key];
      const isValid = field.validate(field.input.value);

      if (!isValid) {
        field.input.closest('.form-group').classList.add('invalid');
        isFormValid = false;
      } else {
        field.input.closest('.form-group').classList.remove('invalid');
      }
    });

    if (isFormValid) {
      // Show loading state on button
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Opening Gmail… <i data-lucide="loader-2"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();

      // Build Gmail compose URL with form data pre-filled
      const senderName = formFields.name.input.value.trim();
      const senderEmail = formFields.email.input.value.trim();
      const senderMessage = formFields.message.input.value.trim();

      const subject = encodeURIComponent(`Portfolio Contact from ${senderName}`);
      const body = encodeURIComponent(
        `Hi Nithish,\n\n${senderMessage}\n\n---\nSent by: ${senderName}\nReply to: ${senderEmail}`
      );

      const gmailUrl = `https://mail.google.com/mail/?view=cm&to=nithishkumar6341@gmail.com&su=${subject}&body=${body}`;

      // Use programmatic anchor click — never blocked by popup blockers
      const tempLink = document.createElement('a');
      tempLink.href = gmailUrl;
      tempLink.target = '_blank';
      tempLink.rel = 'noopener noreferrer';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);

      // Show success overlay, reset form & button
      setTimeout(() => {
        successOverlay.classList.add('show');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i data-lucide="send"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 400);
    }
  });


  // Reset success overlay
  successCloseBtn.addEventListener('click', () => {
    successOverlay.classList.remove('show');
  });

  /* ==========================================================================
     CV MODAL ACTIONS
     ========================================================================== */
  const printCvBtn = document.getElementById('print-cv-btn');
  const downloadCvPdf = document.getElementById('download-cv-pdf');

  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (downloadCvPdf) {
    downloadCvPdf.addEventListener('click', (e) => {
      const href = downloadCvPdf.getAttribute('href');
      if (href === '#' || !href) {
        e.preventDefault();
        alert("No physical PDF file found in assets/resume.pdf yet. Opening the print menu so you can save the interactive CV as a PDF directly!");
        window.print();
      }
    });
  }

  /* ==========================================================================
     HIRE ME FORM VALIDATION & REDIRECTION
     ========================================================================== */
  const hireForm = document.getElementById('hire-form');
  const hireSubmitBtn = document.getElementById('hire-submit-btn');

  if (hireForm) {
    const hireFields = {
      company: {
        input: document.getElementById('hire-company'),
        error: document.getElementById('hire-company-error'),
        validate: (val) => val.trim().length > 0
      },
      position: {
        input: document.getElementById('hire-position'),
        error: document.getElementById('hire-position-error'),
        validate: (val) => val.trim().length > 0
      },
      message: {
        input: document.getElementById('hire-message'),
        error: document.getElementById('hire-message-error'),
        validate: (val) => val.trim().length > 0
      }
    };

    // Real-time validation on input/blur
    Object.keys(hireFields).forEach(key => {
      const field = hireFields[key];
      field.input.addEventListener('focus', () => {
        field.input.closest('.form-group').classList.remove('invalid');
      });
      field.input.addEventListener('blur', () => {
        const isValid = field.validate(field.input.value);
        if (!isValid) {
          field.input.closest('.form-group').classList.add('invalid');
        } else {
          field.input.closest('.form-group').classList.remove('invalid');
        }
      });
    });

    hireForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isFormValid = true;

      // Validate all fields
      Object.keys(hireFields).forEach(key => {
        const field = hireFields[key];
        const isValid = field.validate(field.input.value);
        if (!isValid) {
          field.input.closest('.form-group').classList.add('invalid');
          isFormValid = false;
        } else {
          field.input.closest('.form-group').classList.remove('invalid');
        }
      });

      if (isFormValid) {
        // Show loading state
        hireSubmitBtn.disabled = true;
        hireSubmitBtn.innerHTML = 'Opening Gmail… <i data-lucide="loader-2"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();

        const companyName = hireFields.company.input.value.trim();
        const positionTitle = hireFields.position.input.value.trim();
        const salaryValue = document.getElementById('hire-salary').value.trim() || 'Not Specified';
        const locationValue = document.getElementById('hire-location').value.trim() || 'Not Specified';
        const offerMessage = hireFields.message.input.value.trim();

        const subject = encodeURIComponent(`Job Offer: ${positionTitle} at ${companyName}`);

        const bodyText = `Dear Nithish Kumar,\n\nI am writing to extend a job offer / project proposal for the position of "${positionTitle}" at ${companyName}.\n\nHere are the details of the offer:\n- Company: ${companyName}\n- Position: ${positionTitle}\n- Proposed Compensation: ${salaryValue}\n- Location Type: ${locationValue}\n\nDetails:\n${offerMessage}\n\nWe look forward to hearing from you!\n\nBest regards,\n[Your Name]\n[Contact Info]`;

        const body = encodeURIComponent(bodyText);
        const gmailUrl = `https://mail.google.com/mail/?view=cm&to=nithishkumar6341@gmail.com&su=${subject}&body=${body}`;

        // Open in a new tab
        const tempLink = document.createElement('a');
        tempLink.href = gmailUrl;
        tempLink.target = '_blank';
        tempLink.rel = 'noopener noreferrer';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);

        // Reset form, enable button, close modal after brief timeout
        setTimeout(() => {
          hireForm.reset();
          hireSubmitBtn.disabled = false;
          hireSubmitBtn.innerHTML = 'Generate Offer Email <i data-lucide="send"></i>';
          if (typeof lucide !== 'undefined') lucide.createIcons();
          closeAllModals();
        }, 800);
      }
    });
  }

  /* ==========================================================================
     INTERACTIVE PARTICLE BACKGROUND CANVAS
     ========================================================================== */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let mouse = {
    x: null,
    y: null,
    radius: 120
  };

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Clear coordinates when mouse leaves window
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Setup size based on screen viewport
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 200);
  });

  // Particle Class Definition
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    // Draw individual dot
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    // Update coordinates, boundaries, and mouse interaction
    update() {
      // Bounce off walls
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Mouse push-away interaction
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          // Push particles away from mouse
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * 3;
          let directionY = forceDirectionY * force * 3;

          this.x -= directionX;
          this.y -= directionY;
        }
      }

      // Standard linear movement
      this.x += this.directionX;
      this.y += this.directionY;

      this.draw();
    }
  }

  // Populate particles array
  function initParticles() {
    particles = [];
    // Number of dots scales with resolution for consistent density
    let numberOfParticles = (canvas.width * canvas.height) / 13000;
    numberOfParticles = Math.min(numberOfParticles, 120); // Cap it to ensure CPU safety

    // Color variables read dynamically from styles
    const computedStyles = getComputedStyle(document.body);
    const particleColor = computedStyles.getPropertyValue('--accent-color').trim() || '#a78bfa';

    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 2) + 1; // 1px to 3px
      let x = Math.random() * (canvas.width - size * 2) + size;
      let y = Math.random() * (canvas.height - size * 2) + size;
      let directionX = (Math.random() * 0.4) - 0.2; // Slow floating speeds
      let directionY = (Math.random() * 0.4) - 0.2;

      particles.push(new Particle(x, y, directionX, directionY, size, particleColor));
    }
  }

  // Draw connecting lines between close particles
  function connectParticles() {
    const computedStyles = getComputedStyle(document.body);
    const lineColor = computedStyles.getPropertyValue('--border-color').trim() || 'rgba(255,255,255,0.08)';

    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 90) {
          // Fade connection lines out as distance increases
          let opacity = (1 - (distance / 90)) * 0.15;
          ctx.strokeStyle = lineColor.replace(/[\d\.]+\)$/, `${opacity})`); // Dynamic opacity swap
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update every particle
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }

    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  // Start background canvas execution
  resizeCanvas();
  animateParticles();

  /* ==========================================================================
     HERO MODE SWITCHER INTERACTION (AI vs. IoT)
     ========================================================================== */
  const modeSwitchBtns = document.querySelectorAll('.mode-switch-btn');
  const modeSlider = document.querySelector('.mode-slider');
  const blobContainer = document.querySelector('.visual-blob-container');

  function updateMode(mode, clickedBtn) {
    if (!blobContainer || !clickedBtn) return;

    // Set active mode attribute for styling transitions
    blobContainer.setAttribute('data-active-mode', mode);

    // Toggle active classes
    modeSwitchBtns.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    // Position slider pill dynamically
    if (modeSlider) {
      const left = clickedBtn.offsetLeft;
      const width = clickedBtn.offsetWidth;
      modeSlider.style.transform = `translateX(${left - 5}px)`;
      modeSlider.style.width = `${width}px`;
    }

    // Dynamically update canvas particles color
    const computedStyles = getComputedStyle(document.body);
    const accentVar = mode === 'ai' ? '--accent-secondary' : '--accent-color';
    const targetColor = computedStyles.getPropertyValue(accentVar).trim();

    if (particles && Array.isArray(particles)) {
      particles.forEach(p => {
        p.color = targetColor;
      });
    }
  }

  if (modeSwitchBtns.length > 0) {
    // Initial triggering of mode layout alignment after window load/render
    const initialActive = document.querySelector('.mode-switch-btn.active');
    if (initialActive) {
      // Small timeout guarantees layout engine has computed offsetWidths/offsetLefts
      setTimeout(() => {
        updateMode(initialActive.getAttribute('data-mode'), initialActive);
      }, 200);
    }

    modeSwitchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        updateMode(mode, btn);
      });
    });

    // Handle recalculating slider translate properties on screen resize
    window.addEventListener('resize', () => {
      const activeBtn = document.querySelector('.mode-switch-btn.active');
      if (activeBtn && modeSlider) {
        const left = activeBtn.offsetLeft;
        const width = activeBtn.offsetWidth;
        modeSlider.style.transform = `translateX(${left - 5}px)`;
        modeSlider.style.width = `${width}px`;
      }
    });
  }

  /* ==========================================================================
     CERTIFICATIONS SHOWCASE FILTER
     ========================================================================== */
  const certFilterBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards = document.querySelectorAll('.cert-card');

  certFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active state
      certFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      certCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // Scale fade-in transition
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ==========================================================================
     3D PARALLAX TILT & INTERACTIVE CLICK FOR PROFILE PICTURE
     ========================================================================== */
  const visualContainer = document.querySelector('.visual-blob-container');
  const heroVisual = document.querySelector('.hero-visual');

  if (visualContainer && heroVisual) {
    // 3D Parallax Tilt Effect on MouseMove
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Max rotation angles of 12 degrees
      const rotX = -(y / (rect.height / 2)) * 12;
      const rotY = (x / (rect.width / 2)) * 12;

      visualContainer.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    // Reset tilt on MouseLeave
    heroVisual.addEventListener('mouseleave', () => {
      visualContainer.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });

    // Interactive Tap/Click on Profile to Switch Active Mode
    visualContainer.style.cursor = 'pointer';
    visualContainer.addEventListener('click', () => {
      const inactiveBtn = document.querySelector('.mode-switch-btn:not(.active)');
      if (inactiveBtn) {
        inactiveBtn.click();
      }
    });
  }

  // Re-initialize Lucide icons in the new section if needed
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
