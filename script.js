document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const navHeight = navbar.offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll(
    '.section-header, .card, .feature-card, .timeline-item, .structure-card, ' +
    '.dataset-stat-card, .detail-card, .metric-card, .track-card, .note-item, ' +
    '.submission-card, .submission-steps, .organizer-card, .advisor-card, .contact-card'
  );

  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.classList.add('animate-hidden');
    observer.observe(el);
  });

  const style = document.createElement('style');
  style.textContent = `
    .animate-hidden {
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const statNumbers = document.querySelectorAll('.stat-number, .stat-value');
  
  const countObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const text = target.textContent;
        const number = parseInt(text.replace(/,/g, ''));
        
        if (!isNaN(number)) {
          animateCount(target, 0, number, 1500);
        }
        countObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => countObserver.observe(num));

  function animateCount(element, start, end, duration) {
    const startTime = performance.now();
    const hasComma = element.textContent.includes(',');
    let animationId = null;
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(start + (end - start) * easeOutExpo);
      
      element.textContent = hasComma ? current.toLocaleString() : current;
      
      if (progress < 1) {
        animationId = requestAnimationFrame(update);
      } else {
        element.textContent = hasComma ? end.toLocaleString() : end;
      }
    }
    
    animationId = requestAnimationFrame(update);
  }

  const heroParticles = document.querySelector('.hero-particles');
  if (heroParticles) {
    createParticles(heroParticles);
  }

  function createParticles(container) {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${Math.random() * 10 + 10}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      container.appendChild(particle);
    }

    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
      @keyframes float {
        0%, 100% {
          transform: translateY(0) translateX(0);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(floatStyle);
  }

  const buttons = document.querySelectorAll('.btn, .nav-cta, .contact-email');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
        width: 100px;
        height: 100px;
        margin-left: -50px;
        margin-top: -50px;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);

  const tableRows = document.querySelectorAll('.dataset-table tbody tr:not(.total-row)');
  
  tableRows.forEach(row => {
    row.addEventListener('mouseenter', function() {
      this.style.background = 'var(--primary-50)';
      this.style.transition = 'background 0.2s ease';
    });
    
    row.addEventListener('mouseleave', function() {
      this.style.background = '';
    });
  });

  const sections = document.querySelectorAll('section[id]');
  
  const navObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => navObserver.observe(section));

  const navActiveStyle = document.createElement('style');
  navActiveStyle.textContent = `
    .nav-links a.active {
      color: var(--primary);
      background: var(--primary-50);
    }
  `;
  document.head.appendChild(navActiveStyle);

  console.log('M-VQA Challenge website initialized successfully');
});
