/* ============================================================
   Tech Lume Website - JavaScript
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : 'auto';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = 'auto';
    });
  });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function highlightNavLink() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink);

  // Smooth scroll for internal links
  const allLinks = document.querySelectorAll('a[href^="#"]');

  allLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Scroll reveal animations
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // Counter animations
  const counters = document.querySelectorAll('.counter-num');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  function animateCounters() {
    counters.forEach(counter => {
      const finalValue = parseInt(counter.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const step = finalValue / (duration / 16); // 60fps
      let currentValue = 0;

      const timer = setInterval(() => {
        currentValue += step;
        if (currentValue >= finalValue) {
          counter.textContent = finalValue.toLocaleString();
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(currentValue).toLocaleString();
        }
      }, 16);
    });
  }

  // Observe each counter card
  const counterCards = document.querySelectorAll('.counter-card');
  counterCards.forEach(card => {
    counterObserver.observe(card);
  });

  // Service gallery toggle
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    const learnMore = card.querySelector('.service-learn');
    const gallery = card.querySelector('.service-gallery');

    if (learnMore && gallery) {
      learnMore.addEventListener('click', () => {
        gallery.classList.toggle('active');
        learnMore.textContent = gallery.classList.contains('active') ? 'View Less' : 'Learn More';
      });
    }
  });

  // Portfolio filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (category === 'all' || itemCategory === category) {
          item.classList.remove('hidden');
          // Trigger reflow to allow animation
          item.offsetHeight;
          item.classList.add('visible');
        } else {
          item.classList.add('hidden');
          item.classList.remove('visible');
        }
      });
    });
  });

  // Lightbox functionality
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-inner img');
  const lightboxCaption = document.querySelector('.lb-caption');
  const lightboxClose = document.querySelector('.lb-close');
  const lightboxPrev = document.querySelector('.lb-prev');
  const lightboxNext = document.querySelector('.lb-next');

  let currentIndex = 0;
  const allGalleryImages = [];

  // Collect all gallery images with their details
  document.querySelectorAll('.portfolio-item, .service-gallery img').forEach((item, index) => {
    if (item.tagName === 'IMG') {
      allGalleryImages.push({
        src: item.src,
        caption: item.alt || 'Gallery Image'
      });
    } else {
      const img = item.querySelector('img');
      const title = item.querySelector('.portfolio-overlay h4');
      allGalleryImages.push({
        src: img.src,
        caption: title.textContent || 'Portfolio Image'
      });
    }
  });

  // Open lightbox
  document.querySelectorAll('.portfolio-item, .service-gallery img').forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIndex = index;
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    if (index >= 0 && index < allGalleryImages.length) {
      lightboxImg.src = allGalleryImages[index].src;
      lightboxCaption.textContent = allGalleryImages[index].caption;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  // Close lightbox
  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  // Lightbox navigation
  lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + allGalleryImages.length) % allGalleryImages.length;
    openLightbox(currentIndex);
  });

  lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % allGalleryImages.length;
    openLightbox(currentIndex);
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('open')) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + allGalleryImages.length) % allGalleryImages.length;
        openLightbox(currentIndex);
      } else if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % allGalleryImages.length;
        openLightbox(currentIndex);
      }
    }
  });

  // Testimonial carousel (if exists)
  const testimonialContainer = document.querySelector('.testimonials');
  if (testimonialContainer) {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;

    function showTestimonial(index) {
      testimonialCards.forEach((card, i) => {
        card.style.display = i === index ? 'block' : 'none';
      });
    }

    // Auto-rotate testimonials
    setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
      showTestimonial(currentTestimonial);
    }, 5000);
  }

  // Form submission
  const contactForm = document.querySelector('form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple validation
      const nameInput = document.querySelector('input[name="name"]');
      const emailInput = document.querySelector('input[name="email"]');
      const messageInput = document.querySelector('textarea[name="message"]');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        alert('Please fill in all fields');
        return;
      }

      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        alert('Please enter a valid email address');
        return;
      }

      // Simulate form submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
});
