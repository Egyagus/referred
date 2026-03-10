// ===== Intersection Observer for fade-in animations =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

// ===== Animated stat counters =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  counters.forEach((counter) => {
    const target = parseInt(counter.dataset.target);
    const duration = 1600;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
}

// Trigger counters when hero stats come into view
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    });
  },
  { threshold: 0.5 }
);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ===== Mobile nav toggle =====
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('active');
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileToggle.classList.remove('active');
    });
  });
}

// ===== File upload =====
const fileUpload = document.getElementById('file-upload');
const fileInput = document.getElementById('resume');

if (fileUpload && fileInput) {
  fileUpload.addEventListener('click', () => fileInput.click());

  fileUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUpload.classList.add('dragover');
  });

  fileUpload.addEventListener('dragleave', () => {
    fileUpload.classList.remove('dragover');
  });

  fileUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUpload.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      showFileName(e.dataTransfer.files[0].name);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
      showFileName(fileInput.files[0].name);
    }
  });

  function showFileName(name) {
    fileUpload.classList.add('has-file');
    const content = fileUpload.querySelector('.upload-content');
    content.innerHTML = `
      <div class="upload-icon" style="background: #dcfce7; color: #16a34a;">&#10003;</div>
      <p style="font-weight: 500; color: #1d1d1f;">${name}</p>
      <p class="upload-hint">Click to change file</p>
    `;
  }
}

// ===== Form submission (native multipart POST) =====
// Show success modal if redirected back after submission
if (new URLSearchParams(window.location.search).get('submitted') === 'true') {
  window.history.replaceState({}, '', window.location.pathname);
  document.getElementById('success-modal').classList.add('active');
}

// Show loading state on submit
const form = document.getElementById('referral-form');
if (form) {
  form.addEventListener('submit', () => {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
  });
}

// ===== Close modal =====
function closeModal() {
  document.getElementById('success-modal').classList.remove('active');
}

// Close on overlay click
const modalOverlay = document.getElementById('success-modal');
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ===== Smooth scroll offset for fixed nav =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 60;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
