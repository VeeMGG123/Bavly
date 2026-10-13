
/**
 * ====================================================================
 * LOVE YOU — Romantic Surprise Website
 * Developed By Peter Medhat
 * ====================================================================
 */

(() => {
  'use strict';

  const DEFAULT_CONFIG = {
    password: '29/6/2026',
    recipientName: 'Maroska',
    senderName: 'Bavly',
    websiteLogo: 'little love note ♥',
    headerSubtitle: 'Every moment with you is my favorite memory.',
    heroTag: "OPEN WHEN YOU'RE READY",
    heroHeading: 'A little note. A lot of love.',
    heroSubtitle:
      'Click the sealed envelope below to uncover what my heart has been holding.',
    envelopeImage: 'images/envelope.jpg',
    letterHeading: 'A note for you',
    letterDate: 'October 13, 2026',
    loveLetter:
      'Dear Maroska, ❤️\n\n' +
      'I just want you to know how much you mean to me. ' +
      "I love you so much, but in a sisterly way, like you're my own sister. 🫶🏻❤️ " +
      "You're not just a friend to me; you're family, someone I genuinely care about and never want to lose.\n\n" +
      "I'm so grateful to have you in my life, and I hope you always know that you can count on me whenever you need someone. " +
      "No matter what happens, I'll always be here for you, supporting you, listening to you, and wishing the best for you.\n\n" +
      "You have a special place in my heart, and I'm really lucky to have someone like you in my life. " +
      "I hope our bond always stays strong, because you're more than just a friend to me; you're a sister I'll always cherish. 🥹💗♾️",
    letterSignature: 'With love,\nBavly ❤️',
    galleryTitle: 'Our memories ♥',
    gallerySubtitle:
      'Snapshots of the moments that stole my heart forever.',
    photos: [],
    youtubeLink: 'https://www.youtube.com/watch?v=rtOvBOTyX00',
    soundtrackTitle: 'Our little soundtrack.',
    soundtrackSubtitle:
      'Press play to listen to our song while you read.',
    introCaption: 'Some words are never enough.',
    introDurationMs: 6500,
    developerCredit: 'Developed By Peter Medhat'
  };

  // New storage key: old saved galleries will not override new settings.
  const PHOTO_STORAGE_KEY = 'vanilla_romantic_photos_v2';

  let config;
  let galleryPhotos = [];
  let soundtrackPlaying = false;
  let introStarted = false;
  let galleryInitialized = false;
  let soundtrackInitialized = false;
  let introTimers = [];
  let animationFrame = null;

  function getConfig() {
    const supplied =
      window.CONFIG && typeof window.CONFIG === 'object'
        ? window.CONFIG
        : {};

    return { ...DEFAULT_CONFIG, ...supplied };
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const element = byId(id);

    if (element && value !== undefined && value !== null) {
      element.textContent = String(value);
    }
  }

  function setMultilineText(element, value) {
    if (!element) return;

    element.replaceChildren();

    String(value ?? '')
      .split('\n')
      .forEach((line, index) => {
        if (index > 0) {
          element.appendChild(document.createElement('br'));
        }

        element.appendChild(document.createTextNode(line));
      });
  }

  function safeLocalStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeLocalStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  function safeLocalStorageRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage may be disabled by the browser.
    }
  }

  function getSavedPhotos() {
    try {
      const raw = safeLocalStorageGet(PHOTO_STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed.filter(
        photo =>
          photo &&
          typeof photo.url === 'string' &&
          typeof photo.caption === 'string'
      );
    } catch {
      return [];
    }
  }

  function initialize() {
    config = getConfig();

    populateStaticContent();
    initParticles();
    initLogin();
    initEnvelope();
    initGallery();
    initSoundtrack();
  }

  function populateStaticContent() {
    setText('site-logo', config.websiteLogo);
    setText('site-subtitle', config.headerSubtitle);
    setText('hero-tag', config.heroTag);
    setText('hero-heading', config.heroHeading);
    setText('hero-subtitle', config.heroSubtitle);
    setText('intro-caption-text', config.introCaption);
    setText('letter-heading', config.letterHeading);
    setText('letter-date', config.letterDate);
    setText('gallery-title', config.galleryTitle);
    setText('gallery-subtitle', config.gallerySubtitle);
    setText('soundtrack-title', config.soundtrackTitle);
    setText('soundtrack-subtitle', config.soundtrackSubtitle);

    setMultilineText(byId('letter-body'), config.loveLetter);
    setMultilineText(byId('letter-signature'), config.letterSignature);

    const envelopeImg = byId('envelope-custom-bg');

    if (envelopeImg && config.envelopeImage) {
      envelopeImg.style.display = '';
      envelopeImg.src = config.envelopeImage;

      envelopeImg.onerror = () => {
        envelopeImg.style.display = 'none';
      };
    }
  }

  // ---------------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------------

  function initLogin() {
    const form = byId('login-form');
    const input = byId('password-input');
    const errorMsg = byId('login-error');
    const card = document.querySelector('.login-card');
    const loginScreen = byId('login-screen');

    if (!form || !input || !loginScreen) return;

    const hint = document.querySelector('.login-hint');

    // Avoid advertising the password on the login screen.
    if (hint) {
      hint.textContent = 'A little surprise is waiting just for you. ♥';
    }

    form.addEventListener('submit', event => {
      event.preventDefault();

      const entered = input.value.trim();
      const target = String(config.password ?? '').trim();

      if (entered.toLowerCase() === target.toLowerCase() && target) {
        if (errorMsg) {
          errorMsg.classList.remove('visible');
          errorMsg.textContent = '';
        }

        const button = form.querySelector('button[type="submit"]');
        if (button) button.disabled = true;

        if (card) {
          card.style.transition =
            'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
          card.style.transform = 'scale(1.08) translateY(-20px)';
          card.style.opacity = '0';
        }

        window.setTimeout(() => {
          loginScreen.classList.add('hidden');
          startCinematicIntro();
        }, 550);
      } else {
        if (errorMsg) {
          errorMsg.textContent =
            'That is not the secret word. Please try again. ♥';
          errorMsg.classList.add('visible');
        }

        if (card) {
          card.classList.remove('shake');
          void card.offsetWidth;
          card.classList.add('shake');
        }

        input.select();
      }
    });
  }

  // ---------------------------------------------------------------
  // CINEMATIC INTRO
  // ---------------------------------------------------------------

  function startCinematicIntro() {
    if (introStarted) return;
    introStarted = true;

    const introScreen = byId('cinematic-intro');
    const universe = byId('intro-universe');
    const caption = byId('intro-caption-text');
    const skipBtn = byId('intro-skip-btn');
    const mainSite = byId('main-website');

    if (!introScreen || !universe) {
      if (mainSite) {
        mainSite.classList.remove('hidden');
        mainSite.classList.add('visible');
      }
      return;
    }

    introScreen.classList.remove('hidden', 'fade-out');
    universe.replaceChildren();

    if (caption) caption.classList.remove('visible');

    const variations = [
      { text: 'LOVE YOU', class: 'variation-uppercase', color: '#fda4af' },
      { text: 'love you', class: 'variation-lowercase', color: '#f43f5e' },
      { text: 'LOVE YOU ♥', class: 'variation-heart', color: '#fb7185' },
      { text: 'love you ♥', class: 'variation-lowercase', color: '#ffb3c1' },
      { text: 'LOVE YOU', class: 'variation-uppercase', color: '#ffe4e6' }
    ];

    const points = [];

    [80, 48, 28].forEach((count, layer) => {
      const multiplier = [1, 0.72, 0.45][layer];

      for (let i = 0; i < count; i++) {
        points.push({
          t: (i / count) * Math.PI * 2,
          scaleMultiplier: multiplier
        });
      }
    });

    const minDim = Math.min(window.innerWidth, window.innerHeight);
    const heartScale = (minDim / 38) * 0.95;
    const wordElements = [];

    points.forEach((point, index) => {
      const t = point.t;
      const multiplier = point.scaleMultiplier;

      const heartX =
        16 * Math.pow(Math.sin(t), 3) * (heartScale / 16) * multiplier;

      const heartY =
        -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        ) *
        (heartScale / 16) *
        multiplier;

      const variation = variations[index % variations.length];
      const span = document.createElement('span');

      span.className = `intro-word ${variation.class}`;
      span.textContent = variation.text;
      span.style.color = '#7c2d58';

      const angle = Math.random() * Math.PI * 2;
      const distance = minDim * 0.45 + Math.random() * 260;
      const startX = Math.cos(angle) * distance;
      const startY = Math.sin(angle) * distance;
      const rotation = (Math.random() - 0.5) * 80;

      span.style.transform =
        `translate3d(${startX}px, ${startY}px, 0) ` +
        `rotate(${rotation}deg) scale(0.65)`;

      span.style.opacity = '0';
      universe.appendChild(span);

      wordElements.push({
        el: span,
        heartX,
        heartY,
        color: variation.color
      });
    });

    requestAnimationFrame(() => {
      wordElements.forEach(item => {
        item.el.style.opacity = String(0.3 + Math.random() * 0.4);
      });

      introTimers.push(
        window.setTimeout(() => {
          wordElements.forEach((item, index) => {
            item.el.style.transitionDelay =
              `${(index / wordElements.length) * 1.5}s`;

            item.el.style.transform =
              `translate3d(${item.heartX}px, ${item.heartY}px, 0) ` +
              'rotate(0deg) scale(1)';

            item.el.style.opacity = '1';
            item.el.style.color = item.color;
            item.el.style.textShadow =
              '0 0 12px rgba(244, 63, 94, 0.7)';
          });

          introTimers.push(
            window.setTimeout(() => {
              if (caption) caption.classList.add('visible');
            }, 2200)
          );
        }, 400)
      );
    });

    let transitioned = false;

    function transitionToMain() {
      if (transitioned) return;
      transitioned = true;

      introTimers.forEach(timer => window.clearTimeout(timer));
      introTimers = [];

      if (skipBtn) skipBtn.removeEventListener('click', transitionToMain);

      introScreen.classList.add('fade-out');

      if (mainSite) {
        mainSite.classList.remove('hidden');

        window.setTimeout(() => {
          mainSite.classList.add('visible');
        }, 100);
      }

      window.setTimeout(() => {
        introScreen.classList.add('hidden');
      }, 1200);
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', transitionToMain);
    }

    const duration = Number(config.introDurationMs) || 6500;
    introTimers.push(window.setTimeout(transitionToMain, duration));
  }

  // ---------------------------------------------------------------
  // ENVELOPE
  // ---------------------------------------------------------------

  function initEnvelope() {
    const envelope = byId('romantic-envelope');
    const letterSection = byId('letter-section');
    const hint = byId('envelope-hint-label');

    if (!envelope) return;

    function toggleEnvelope() {
      const isOpen = envelope.classList.toggle('is-open');

      if (hint) {
        hint.textContent = isOpen
          ? 'Click envelope to fold closed'
          : 'Click to open my heart';
      }

      if (letterSection) {
        letterSection.classList.toggle('revealed', isOpen);

        if (isOpen) {
          window.setTimeout(() => {
            letterSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }, 600);
        }
      }
    }

    envelope.addEventListener('click', toggleEnvelope);

    envelope.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleEnvelope();
      }
    });
  }

  // ---------------------------------------------------------------
  // GALLERY
  // ---------------------------------------------------------------

  function initGallery() {
    const grid = byId('gallery-grid');
    if (!grid) return;

    if (!galleryInitialized) {
      galleryInitialized = true;

      const configuredPhotos = Array.isArray(config.photos)
        ? config.photos.filter(
            photo => photo && typeof photo.url === 'string'
          )
        : [];

      // Priority: current config.js photos, then newly saved local uploads.
      // Old v1 localStorage entries are deliberately ignored.
      galleryPhotos =
        configuredPhotos.length > 0
          ? configuredPhotos
          : getSavedPhotos();

      if (galleryPhotos.length === 0) {
        galleryPhotos = [
          {
            url: 'images/photo1.jpg',
            caption: 'Our favorite memory under the golden light'
          },
          {
            url: 'images/photo2.jpg',
            caption: 'The day laughter never stopped'
          },
          {
            url: 'images/photo3.jpg',
            caption: 'Just the two of us, peaceful and together'
          },
          {
            url: 'images/photo4.jpg',
            caption: 'Every sunset is sweeter by your side'
          }
        ];
      }

      setupPhotoUpload();
      setupLightbox();
    }

    renderGallery();
  }

  function renderGallery() {
    const grid = byId('gallery-grid');
    if (!grid) return;

    grid.replaceChildren();

    galleryPhotos.forEach((photo, index) => {
      const card = document.createElement('div');
      card.className = 'photo-card';

      const media = document.createElement('div');
      media.className = 'photo-card-media';

      const img = document.createElement('img');
      img.className = 'photo-card-img';
      img.src = photo.url;
      img.alt = photo.caption || `Memory ${index + 1}`;
      img.loading = 'lazy';

      img.onerror = () => {
        if (!media.contains(img)) return;

        const fallback = document.createElement('div');
        fallback.className = 'photo-fallback';

        const heart = document.createElement('span');
        heart.textContent = '♥';

        const captionText = document.createElement('span');
        captionText.textContent =
          photo.caption || 'A special moment with you ♥';

        fallback.append(heart, captionText);
        media.replaceChildren(fallback);
      };

      media.appendChild(img);

      const caption = document.createElement('div');
      caption.className = 'photo-caption';
      caption.textContent = photo.caption || 'Our memory ♥';

      card.append(media, caption);

      card.addEventListener('click', () => {
        openLightbox(photo);
      });

      grid.appendChild(card);
    });
  }

  function setupPhotoUpload() {
    const uploadBtn = byId('vanilla-photo-upload-btn');
    const fileInput = byId('vanilla-photo-input');

    if (!uploadBtn || !fileInput) return;

    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async event => {
      const files = Array.from(event.target.files || []).filter(file =>
        file.type.startsWith('image/')
      );

      if (files.length === 0) return;

      const defaultCaptions = [
        '🤍 الصورة دي هي اللي خلتنا نبدأ نتكلم',
        '🤍 تغفيلة ليكي وإنتِ صغيرة',
        '📞🤍 سهراتنا ومكالماتنا اللي بالساعات',
        '🤍 بحبك يا أرنوبتييييي'
      ];

      try {
        const newPhotos = await Promise.all(
          files.map(
            (file, index) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = () => {
                  resolve({
                    url: reader.result,
                    caption:
                      defaultCaptions[index] ||
                      file.name.replace(/\.[^/.]+$/, '')
                  });
                };

                reader.onerror = () => reject(
                  new Error(`Could not read ${file.name}`)
                );

                reader.readAsDataURL(file);
              })
          )
        );

        galleryPhotos = newPhotos;

        const saved = safeLocalStorageSet(
          PHOTO_STORAGE_KEY,
          JSON.stringify(newPhotos)
        );

        renderGallery();

        if (!saved) {
          window.alert(
            'تم عرض الصور، لكن المتصفح لم يسمح بحفظها. ' +
            'قد تحتاج إلى اختيارها مرة أخرى بعد تحديث الصفحة.'
          );
        } else {
          window.alert(
            'تم تحديث الصور على هذا الجهاز. ' +
            'ملاحظة: الصور لم تُرفع إلى GitHub أو Vercel.'
          );
        }
      } catch {
        window.alert('حصلت مشكلة أثناء قراءة الصور. جرّب صورًا أخرى.');
      } finally {
        fileInput.value = '';
      }
    });
  }

  function setupLightbox() {
    const modal = byId('lightbox-modal');
    const closeBtn = byId('lightbox-close-btn');

    if (!modal || !closeBtn) return;

    closeBtn.addEventListener('click', closeLightbox);

    modal.addEventListener('click', event => {
      if (event.target === modal) closeLightbox();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeLightbox();
    });
  }

  function openLightbox(photo) {
    const modal = byId('lightbox-modal');
    const img = byId('lightbox-img');
    const caption = byId('lightbox-caption');

    if (!modal || !img || !caption) return;

    img.src = photo.url;
    img.alt = photo.caption || 'Memory full view';
    caption.textContent = photo.caption || '';
    modal.classList.add('active');
  }

  function closeLightbox() {
    const modal = byId('lightbox-modal');
    if (modal) modal.classList.remove('active');
  }

  // ---------------------------------------------------------------
  // YOUTUBE SOUNDTRACK
  // ---------------------------------------------------------------

  function extractYouTubeId(url) {
    if (!url) return null;

    try {
      const parsed = new URL(url);
      let id = '';

      if (parsed.hostname === 'youtu.be') {
        id = parsed.pathname.slice(1);
      } else if (
        parsed.hostname === 'youtube.com' ||
        parsed.hostname.endsWith('.youtube.com')
      ) {
        if (parsed.pathname === '/watch') {
          id = parsed.searchParams.get('v') || '';
        } else {
          const match = parsed.pathname.match(
            /^\/(?:embed|shorts|live)\/([^/]+)/
          );
          if (match) id = match[1];
        }
      }

      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    } catch {
      return null;
    }
  }

  function initSoundtrack() {
    const container = byId('youtube-video-container');
    const videoId = extractYouTubeId(config.youtubeLink);

    if (container) {
      container.replaceChildren();

      if (videoId) {
        const iframe = document.createElement('iframe');
        iframe.src =
          `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1`;
        iframe.title = 'Our Romantic Soundtrack';
        iframe.allow =
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';

        container.appendChild(iframe);
      } else {
        const message = document.createElement('p');
        message.className = 'video-fallback-message';
        message.textContent =
          'Add a valid YouTube link in config.js ♥';
        container.appendChild(message);
      }
    }

    if (soundtrackInitialized) return;
    soundtrackInitialized = true;

    const toggleBtn = byId('toggle-soundtrack-btn');
    const btnIcon = byId('music-btn-icon');
    const btnText = byId('music-btn-text');
    const statusText = byId('music-status-text');
    const hiddenPlayer = byId('hidden-music-player');

    if (!toggleBtn || !hiddenPlayer) return;

    function updateButton(playing) {
      if (btnIcon) btnIcon.textContent = playing ? '⏸️' : '🎵';

      if (btnText) {
        btnText.textContent = playing
          ? 'إيقاف الأغنية ⏸️'
          : 'تشغيل أغنيتنا 🎵';
      }

      if (statusText) {
        statusText.style.display = playing ? 'block' : 'none';
      }

      toggleBtn.style.transform = playing ? 'scale(1.05)' : 'scale(1)';
      toggleBtn.setAttribute('aria-pressed', String(playing));
    }

    toggleBtn.addEventListener('click', () => {
      if (!videoId) {
        window.alert('رابط الأغنية غير صحيح. راجع youtubeLink في config.js.');
        return;
      }

      soundtrackPlaying = !soundtrackPlaying;

      if (soundtrackPlaying) {
        const iframe = document.createElement('iframe');

        iframe.src =
          `https://www.youtube-nocookie.com/embed/${videoId}` +
          '?autoplay=1&playsinline=1';

        iframe.title = 'Soundtrack Above Envelope';
        iframe.allow = 'autoplay; encrypted-media';
        iframe.setAttribute('aria-hidden', 'true');

        Object.assign(iframe.style, {
          position: 'fixed',
          width: '1px',
          height: '1px',
          opacity: '0',
          pointerEvents: 'none',
          bottom: '0',
          left: '0'
        });

        hiddenPlayer.replaceChildren(iframe);
      } else {
        // Removing the iframe stops playback.
        hiddenPlayer.replaceChildren();
      }

      updateButton(soundtrackPlaying);
    });
  }

  // ---------------------------------------------------------------
  // AMBIENT PARTICLES
  // ---------------------------------------------------------------

  function initParticles() {
    const canvas = byId('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    const particleCount = Math.min(
      Math.floor(window.innerWidth / 18),
      65
    );

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.45 + 0.15),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * 0.02 + 0.01
    }));

    function render() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(particle => {
        particle.y += particle.speedY;
        particle.x += particle.speedX;

        if (particle.y < -10) {
          particle.y = height + 10;
          particle.x = Math.random() * width;
        }

        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;

        const opacity = Math.max(
          0.1,
          Math.min(
            0.7,
            particle.opacity +
              Math.sin(Date.now() * 0.002) * particle.pulse
          )
        );

        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(251, 113, 133, ${opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(244, 63, 94, 0.4)';
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(render);
    }

    if (animationFrame) cancelAnimationFrame(animationFrame);
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, {
      once: true
    });
  } else {
    initialize();
  }
})();
