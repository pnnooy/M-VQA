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
  let mouseX = 0;
  let mouseY = 0;
  let particles = [];
  
  if (heroParticles) {
    createAdvancedParticles(heroParticles);
  }
  
  document.addEventListener('mousemove', function(e) {
    const hero = document.querySelector('.hero');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }
  });

  function createAdvancedParticles(container) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    window.addEventListener('resize', function() {
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    });
    
    const particleCount = 120;
    const connectionDistance = 200;
    const mouseRadius = 200;
    
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.originalOpacity = this.opacity;
      }
      
      update() {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouseRadius) {
          const force = (mouseRadius - dist) / mouseRadius;
          this.vx -= (dx / dist) * force * 0.02;
          this.vy -= (dy / dist) * force * 0.02;
          this.opacity = this.originalOpacity + force * 0.3;
        } else {
          this.opacity = this.originalOpacity;
        }
        
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        this.x = Math.max(0, Math.min(width, this.x));
        this.y = Math.max(0, Math.min(height, this.y));
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }
    
    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      drawConnections();
      
      requestAnimationFrame(animate);
    }
    
    animate();
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
