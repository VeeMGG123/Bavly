/**
 * ====================================================================
 * LOVE YOU — Romantic Surprise Website Application Logic
 * Developed By Peter Medhat
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Read configuration or provide safe romantic defaults
  const config = window.CONFIG || {
    password: '29/6/2026',
    recipientName: 'My Dearest Love',
    senderName: 'Yours Always',
    websiteLogo: 'little love note ♥',
    headerSubtitle: 'Every moment with you is my favorite memory.',
    heroTag: "OPEN WHEN YOU'RE READY",
    heroHeading: 'A little note. A lot of love.',
    heroSubtitle: 'Click the sealed envelope below to uncover what my heart has been holding.',
    envelopeImage: 'images/envelope.jpg',
    letterHeading: 'A note for you',
    letterDate: 'Forever & Always',
    loveLetter: 'My dearest,\n\nYou are my heart and my home.\n\nأحبك ♥',
    letterSignature: 'Forever and always yours,\nWith all my love ♥',
    galleryTitle: 'Our memories ♥',
    gallerySubtitle: 'Snapshots of the moments that stole my heart forever.',
    photos: [],
    youtubeLink: 'https://www.youtube.com/watch?v=rtOvBOTyX00',
    introCaption: 'Some words are never enough.',
    introDurationMs: 6500,
    developerCredit: 'Developed By Peter Medhat'
  };

  // Populate dynamic textual content from config
  populateStaticContent(config);

  // Initialize Particle Canvas
  initParticles();

  // Initialize Login Screen
  initLogin(config);

  // Initialize Envelope Interaction
  initEnvelope(config);

  // Initialize Gallery
  initGallery(config);

  // Initialize YouTube Soundtrack
  initSoundtrack(config);
});

/**
 * Populate static text elements from config
 */
function populateStaticContent(config) {
  const logoEl = document.getElementById('site-logo');
  if (logoEl && config.websiteLogo) logoEl.textContent = config.websiteLogo;

  const headerSub = document.getElementById('site-subtitle');
  if (headerSub && config.headerSubtitle) headerSub.textContent = config.headerSubtitle;

  const heroTag = document.getElementById('hero-tag');
  if (heroTag && config.heroTag) heroTag.textContent = config.heroTag;

  const heroHeading = document.getElementById('hero-heading');
  if (heroHeading && config.heroHeading) heroHeading.textContent = config.heroHeading;

  const heroSub = document.getElementById('hero-subtitle');
  if (heroSub && config.heroSubtitle) heroSub.textContent = config.heroSubtitle;

  const introCaption = document.getElementById('intro-caption-text');
  if (introCaption && config.introCaption) introCaption.textContent = config.introCaption;

  const envelopeImg = document.getElementById('envelope-custom-bg');
  if (envelopeImg && config.envelopeImage) {
    envelopeImg.src = config.envelopeImage;
    envelopeImg.onerror = () => {
      envelopeImg.style.display = 'none';
    };
  }

  const letterHeading = document.getElementById('letter-heading');
  if (letterHeading && config.letterHeading) letterHeading.textContent = config.letterHeading;

  const letterDate = document.getElementById('letter-date');
  if (letterDate && config.letterDate) letterDate.textContent = config.letterDate;

  const letterBody = document.getElementById('letter-body');
  if (letterBody && config.loveLetter) {
    letterBody.textContent = config.loveLetter;
  }

  const letterSig = document.getElementById('letter-signature');
  if (letterSig && config.letterSignature) {
    letterSig.textContent = config.letterSignature;
  }

  const galTitle = document.getElementById('gallery-title');
  if (galTitle && config.galleryTitle) galTitle.textContent = config.galleryTitle;

  const galSub = document.getElementById('gallery-subtitle');
  if (galSub && config.gallerySubtitle) galSub.textContent = config.gallerySubtitle;

  const soundTitle = document.getElementById('soundtrack-title');
  if (soundTitle && config.soundtrackTitle) soundTitle.textContent = config.soundtrackTitle;

  const soundSub = document.getElementById('soundtrack-subtitle');
  if (soundSub && config.soundtrackSubtitle) soundSub.textContent = config.soundtrackSubtitle;
}

/**
 * Handle Login Screen & Secret Word Validation
 */
function initLogin(config) {
  const form = document.getElementById('login-form');
  const input = document.getElementById('password-input');
  const errorMsg = document.getElementById('login-error');
  const card = document.querySelector('.login-card');
  const loginScreen = document.getElementById('login-screen');

  if (!form || !input) return;

  // Autofocus input
  input.focus();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = input.value.trim();
    const targetPassword = (config.password || '').trim();

    if (entered.toLowerCase() === targetPassword.toLowerCase()) {
      // Success! Clear errors and proceed to cinematic intro
      errorMsg.classList.remove('visible');
      errorMsg.textContent = '';
      
      // Animate card exit
      card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = 'scale(1.08) translateY(-20px)';
      card.style.opacity = '0';

      setTimeout(() => {
        loginScreen.classList.add('hidden');
        startCinematicIntro(config);
      }, 550);
    } else {
      // Password error feedback
      showLoginError('That is not the secret word, my love. Try again... ♥');
      if (card) {
        card.classList.remove('shake');
        // Force reflow
        void card.offsetWidth;
        card.classList.add('shake');
      }
      input.select();
    }
  });

  function showLoginError(msg) {
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.classList.add('visible');
    }
  }
}

/**
 * Cinematic LOVE YOU Intro Animation
 * Calculates parametric heart coordinates and animates scattered words into a symmetrical heart shape
 */
function startCinematicIntro(config) {
  const introScreen = document.getElementById('cinematic-intro');
  const universe = document.getElementById('intro-universe');
  const caption = document.getElementById('intro-caption-text');
  const skipBtn = document.getElementById('intro-skip-btn');
  const mainSite = document.getElementById('main-website');

  if (!introScreen || !universe) return;

  introScreen.classList.remove('hidden');

  // Variations of LOVE YOU
  const variations = [
    { text: 'LOVE YOU', class: 'variation-uppercase', color: '#fda4af' },
    { text: 'love you', class: 'variation-lowercase', color: '#f43f5e' },
    { text: 'LOVE YOU ♥', class: 'variation-heart', color: '#fb7185' },
    { text: 'love you ♥', class: 'variation-lowercase', color: '#ffb3c1' },
    { text: 'LOVE YOU', class: 'variation-uppercase', color: '#ffe4e6' },
  ];

  // Mathematical parametric heart formula:
  // x = 16 * sin^3(t)
  // y = -(13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t))
  const points = [];
  const totalOuterPoints = 80; // Perimeter
  const totalMidPoints = 48;   // Inner layer 1
  const totalInnerPoints = 28; // Inner layer 2

  // Generate outer perimeter
  for (let i = 0; i < totalOuterPoints; i++) {
    const t = (i / totalOuterPoints) * 2 * Math.PI;
    points.push({ t, scaleMultiplier: 1.0 });
  }

  // Generate mid contour
  for (let i = 0; i < totalMidPoints; i++) {
    const t = (i / totalMidPoints) * 2 * Math.PI;
    points.push({ t, scaleMultiplier: 0.72 });
  }

  // Generate inner contour
  for (let i = 0; i < totalInnerPoints; i++) {
    const t = (i / totalInnerPoints) * 2 * Math.PI;
    points.push({ t, scaleMultiplier: 0.45 });
  }

  // Compute screen-adaptive scale
  const minDim = Math.min(window.innerWidth, window.innerHeight);
  const heartScale = (minDim / 38) * 0.95;

  const wordElements = [];

  points.forEach((pt, index) => {
    const t = pt.t;
    const mult = pt.scaleMultiplier;

    // Mathematical heart coordinates centered at (0, 0)
    const heartX = (16 * Math.pow(Math.sin(t), 3)) * (heartScale / 16) * mult;
    const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * (heartScale / 16) * mult;

    const varIndex = index % variations.length;
    const variation = variations[varIndex];

    const span = document.createElement('span');
    span.className = `intro-word ${variation.class}`;
    span.textContent = variation.text;

    // Initial random scattered positions across the entire screen
    const scatterAngle = Math.random() * Math.PI * 2;
    const scatterDist = (Math.min(window.innerWidth, window.innerHeight) * 0.45) + (Math.random() * 260);
    const startX = Math.cos(scatterAngle) * scatterDist * (Math.random() > 0.5 ? 1 : 1.2);
    const startY = Math.sin(scatterAngle) * scatterDist;
    const startRot = (Math.random() - 0.5) * 80;

    span.style.transform = `translate3d(${startX}px, ${startY}px, 0) rotate(${startRot}deg) scale(0.65)`;
    span.style.opacity = '0';
    span.style.color = '#7c2d58';

    universe.appendChild(span);

    wordElements.push({
      el: span,
      heartX,
      heartY,
      index,
      targetColor: variation.color
    });
  });

  // Fade words in initially
  requestAnimationFrame(() => {
    wordElements.forEach(item => {
      item.el.style.opacity = `${0.3 + Math.random() * 0.4}`;
    });

    // Animate words towards heart coordinates after small kickoff delay
    setTimeout(() => {
      wordElements.forEach((item, i) => {
        const stagger = (i / wordElements.length) * 1.5;
        item.el.style.transitionDelay = `${stagger}s`;
        item.el.style.transform = `translate3d(${item.heartX}px, ${item.heartY}px, 0) rotate(0deg) scale(1)`;
        item.el.style.opacity = '1';
        item.el.style.color = item.targetColor;
        item.el.style.textShadow = '0 0 12px rgba(244, 63, 94, 0.7)';
      });

      // Show caption
      setTimeout(() => {
        if (caption) caption.classList.add('visible');
      }, 2200);
    }, 400);
  });

  let transitionTriggered = false;

  const transitionToMain = () => {
    if (transitionTriggered) return;
    transitionTriggered = true;

    introScreen.classList.add('fade-out');
    if (mainSite) {
      mainSite.classList.remove('hidden');
      setTimeout(() => {
        mainSite.classList.add('visible');
      }, 100);
    }

    setTimeout(() => {
      introScreen.classList.add('hidden');
    }, 1200);
  };

  // Skip button click
  if (skipBtn) {
    skipBtn.addEventListener('click', transitionToMain);
  }

  // Automatic transition after configured duration
  const autoDuration = config.introDurationMs || 6500;
  setTimeout(transitionToMain, autoDuration);
}

/**
 * Realistic Interactive CSS Envelope Logic
 */
function initEnvelope(config) {
  const envelope = document.getElementById('romantic-envelope');
  const letterSection = document.getElementById('letter-section');
  const toggleHint = document.getElementById('envelope-hint-label');

  if (!envelope) return;

  envelope.addEventListener('click', () => {
    const isOpen = envelope.classList.toggle('is-open');

    if (isOpen) {
      if (toggleHint) toggleHint.textContent = 'Click envelope to fold closed';
      if (letterSection) {
        letterSection.classList.add('revealed');
        // Smoothly scroll down to revealed letter after envelope flap opens
        setTimeout(() => {
          letterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 600);
      }
    } else {
      if (toggleHint) toggleHint.textContent = 'Click to open my heart';
      if (letterSection) {
        letterSection.classList.remove('revealed');
      }
    }
  });
}

/**
 * Responsive Photo Gallery & Lightbox
 */
function initGallery(config) {
  const grid = document.getElementById('gallery-grid');
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');

  if (!grid) return;

  const photos = config.photos && config.photos.length > 0 ? config.photos : [
    { url: 'images/photo1.jpg', caption: 'Our favorite memory under the golden light' },
    { url: 'images/photo2.jpg', caption: 'The day laughter never stopped' },
    { url: 'images/photo3.jpg', caption: 'Just the two of us, peaceful and together' },
    { url: 'images/photo4.jpg', caption: 'Every sunset is sweeter by your side' }
  ];

  grid.innerHTML = '';

  photos.forEach((photo, idx) => {
    const card = document.createElement('div');
    card.className = 'photo-card';

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'photo-card-media';

    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = photo.caption || `Memory ${idx + 1}`;
    img.className = 'photo-card-img';
    img.loading = 'lazy';

    // Elegant fallback if photo fails to load
    img.onerror = () => {
      mediaWrap.innerHTML = `
        <div class="photo-fallback">
          <svg viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span>${photo.caption || 'A special moment with you ♥'}</span>
        </div>
      `;
    };

    mediaWrap.appendChild(img);

    const caption = document.createElement('div');
    caption.className = 'photo-caption';
    caption.textContent = photo.caption || 'Our memory ♥';

    card.appendChild(mediaWrap);
    card.appendChild(caption);

    // Click to open lightbox
    card.addEventListener('click', () => {
      if (modal && modalImg && modalCaption) {
        modalImg.src = photo.url;
        modalCaption.textContent = photo.caption || '';
        modal.classList.add('active');
      }
    });

    grid.appendChild(card);
  });

  // Wire up photo upload button
  const uploadBtn = document.getElementById('vanilla-photo-upload-btn');
  const fileInput = document.getElementById('vanilla-photo-input');

  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const newPhotos = [];
      let loaded = 0;
      const defaultCaptions = [
        '🤍الصوره دي هي اللي خلتنا نبدأ نتكلم',
        '🤍تغفيله ليكي وانت صغيره',
        '📞🤍سهراتنا ومكالماتنا اللي بالساعات ومابنشبعش كلام ',
        '🤍بحبك يا أرنوبتييييي '
      ];

      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newPhotos.push({
            url: event.target.result,
            caption: defaultCaptions[index] || file.name.replace(/\.[^/.]+$/, '')
          });
          loaded++;
          if (loaded === files.length) {
            config.photos = newPhotos;
            try {
              localStorage.setItem('vanilla_romantic_photos', JSON.stringify(newPhotos));
            } catch (err) {}
            initGallery(config);
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Check if photos previously saved in localStorage
  try {
    const saved = localStorage.getItem('vanilla_romantic_photos');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        config.photos = parsed;
      }
    }
  } catch (err) {}

  // Close lightbox modal handlers
  if (modal && closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal.classList.remove('active');
    });
  }
}

/**
 * YouTube Music Player Helper
 * Extracts YouTube video ID from various link formats
 */
function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}

function initSoundtrack(config) {
  const container = document.getElementById('youtube-video-container');
  const videoId = extractYouTubeId(config.youtubeLink);

  if (container) {
    if (videoId) {
      container.innerHTML = `
        <iframe 
          src="https://www.youtube.com/embed/${videoId}?rel=0&playsinline=1" 
          title="Our Romantic Soundtrack" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `;
    } else {
      container.innerHTML = `
        <div class="video-fallback-message">
          <p style="font-family: var(--font-serif); font-size: 1.2rem; color: #fecdd3; margin-bottom: 0.5rem;">
            Add your favorite song in config.js ♥
          </p>
        </div>
      `;
    }
  }

  // Button above envelope
  const toggleBtn = document.getElementById('toggle-soundtrack-btn');
  const btnIcon = document.getElementById('music-btn-icon');
  const btnText = document.getElementById('music-btn-text');
  const statusText = document.getElementById('music-status-text');
  const hiddenPlayer = document.getElementById('hidden-music-player');
  let isPlaying = false;

  if (toggleBtn && videoId) {
    toggleBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        if (btnIcon) btnIcon.textContent = '⏸️';
        if (btnText) btnText.textContent = 'إيقاف الأغنية ⏸️';
        if (statusText) statusText.style.display = 'block';
        toggleBtn.style.background = 'linear-gradient(135deg, #e11d48 0%, #9f1239 100%)';
        toggleBtn.style.transform = 'scale(1.05)';
        if (hiddenPlayer) {
          hiddenPlayer.innerHTML = `
            <iframe 
              src="https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1" 
              allow="autoplay" 
              style="position: absolute; width: 0; height: 0; opacity: 0; pointer-events: none;"
              title="Soundtrack Above Envelope">
            </iframe>
          `;
        }
      } else {
        if (btnIcon) btnIcon.textContent = '🎵';
        if (btnText) btnText.textContent = 'تشغيل أغنيتنا 🎵';
        if (statusText) statusText.style.display = 'none';
        toggleBtn.style.background = 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)';
        toggleBtn.style.transform = 'scale(1)';
        if (hiddenPlayer) {
          hiddenPlayer.innerHTML = '';
        }
      }
    });
  }
}

/**
 * Ambient floating particle canvas
 */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 65);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.45 + 0.15),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * 0.02 + 0.01
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.opacity += Math.sin(Date.now() * 0.002) * p.pulse;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251, 113, 133, ${Math.max(0.1, Math.min(0.7, p.opacity))})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(244, 63, 94, 0.4)';
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}
