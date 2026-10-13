/**
 * @license
 * LOVE YOU — Romantic Surprise Website
 * Developed By Peter Medhat
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Heart, 
  Lock, 
  Sparkles, 
  Disc, 
  Download, 
  RotateCcw, 
  Settings, 
  X, 
  ExternalLink,
  ChevronDown,
  Image as ImageIcon
} from 'lucide-react';

interface PhotoItem {
  url: string;
  caption: string;
}

interface SiteConfig {
  password: string;
  recipientName: string;
  senderName: string;
  websiteLogo: string;
  headerSubtitle: string;
  heroTag: string;
  heroHeading: string;
  heroSubtitle: string;
  envelopeImage: string;
  letterHeading: string;
  letterDate: string;
  loveLetter: string;
  letterSignature: string;
  galleryTitle: string;
  gallerySubtitle: string;
  photos: PhotoItem[];
  soundtrackTitle: string;
  soundtrackSubtitle: string;
  youtubeLink: string;
  introCaption: string;
  introDurationMs: number;
  developerCredit: string;
}

const DEFAULT_CONFIG: SiteConfig = {
  password: 'forever',
  recipientName: 'Maroska',
  senderName: 'Bavly',
  websiteLogo: 'little love note ♥',
  headerSubtitle: 'Every moment with you is my favorite memory.',
  heroTag: "OPEN WHEN YOU'RE READY",
  heroHeading: 'A little note. A lot of love.',
  heroSubtitle: 'Click the sealed envelope below to uncover what my heart has been holding.',
  envelopeImage: '/images/envelope.jpg',
  letterHeading: 'A note for you',
  letterDate: 'October 13, 2026',
  loveLetter: `Dear Maroska, ❤️

I just want you to know how much you mean to me. I love you so much, but in a sisterly way, like you're my own sister. 🫶🏻❤️ You're not just a friend to me; you're family, someone I genuinely care about and never want to lose.

I'm so grateful to have you in my life, and I hope you always know that you can count on me whenever you need someone. No matter what happens, I'll always be here for you, supporting you, listening to you, and wishing the best for you.

You have a special place in my heart, and I'm really lucky to have someone like you in my life. I hope our bond always stays strong, because you're more than just a friend to me; you're a sister I'll always cherish. 🥹💗♾️`,
  letterSignature: "With love,\nBavly ❤️",
  galleryTitle: 'Our memories ♥',
  gallerySubtitle: 'Snapshots of the moments that stole my heart forever.',
  photos: [
    { url: '/images/photo1.jpg', caption: 'ذكريات طفولتنا الجميلة وبركة زمان 🤍' },
    { url: '/images/photo2.jpg', caption: 'ضحكتك السكر من وإنتي صغيرة يا أحلى أخت 🌸' },
    { url: '/images/photo3.jpg', caption: 'سهراتنا ومكالماتنا اللي بالساعات ومابنشبعش كلام 📞🤍' },
    { url: '/images/photo4.jpg', caption: 'أرنوبتييييي 🐰🥕 أجمل رسمة وذكريات' },
  ],
  soundtrackTitle: 'Our little soundtrack.',
  soundtrackSubtitle: 'Press play to listen to our song while you read.',
  youtubeLink: 'https://youtu.be/Pan1Fbez0jE?si=gvjGRoWUGh-v8k96',
  introCaption: 'Some words are never enough.',
  introDurationMs: 6500,
  developerCredit: 'Developed By Peter Medhat'
};

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [screen, setScreen] = useState<'login' | 'intro' | 'main'>('login');
  
  // Login State
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Intro Animation State
  const [introAssembled, setIntroAssembled] = useState(false);
  const [introCaptionVisible, setIntroCaptionVisible] = useState(false);

  // Envelope State
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  // Music State for Button Above Envelope
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Lightbox State
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  // Config Drawer Modal
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configDraft, setConfigDraft] = useState<SiteConfig>(DEFAULT_CONFIG);

  // Letter ref for auto-scrolling
  const letterRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedRealFiles, setUploadedRealFiles] = useState<Record<string, string>>({});
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  // Load any previously saved real photos from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('romantic_user_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setConfig(prev => ({
            ...prev,
            photos: parsed
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handlePhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const newPhotos: PhotoItem[] = [];
    const readMap: Record<string, string> = { ...uploadedRealFiles };

    let loadedCount = 0;
    fileList.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        readMap[file.name] = dataUrl;
        
        // Match existing captions or use file name
        const defaultCaptions = [
          'ذكريات طفولتنا الجميلة وبركة زمان 🤍',
          'ضحكتك السكر من وإنتي صغيرة يا أحلى أخت 🌸',
          'سهراتنا ومكالماتنا اللي بالساعات ومابنشبعش كلام 📞🤍',
          'أرنوبتييييي 🐰🥕 أجمل رسمة وذكريات'
        ];

        newPhotos.push({
          url: dataUrl,
          caption: defaultCaptions[idx] || file.name.replace(/\.[^/.]+$/, '')
        });

        loadedCount++;
        if (loadedCount === fileList.length) {
          setUploadedRealFiles(readMap);
          setConfig(prev => {
            const updated = { ...prev, photos: newPhotos };
            try {
              localStorage.setItem('romantic_user_photos', JSON.stringify(newPhotos));
            } catch (err) {}
            return updated;
          });
          setUploadSuccessMessage(`تم تحميل ${loadedCount} صور أصلية من جهازك بنجاح! ❤️`);
          setTimeout(() => setUploadSuccessMessage(''), 5000);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Floating background particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      pulse: number;
    }> = [];

    const count = Math.min(Math.floor(window.innerWidth / 20), 50);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.8,
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * 0.02 + 0.01,
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
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
        ctx.fillStyle = `rgba(251, 113, 133, ${Math.max(0.1, Math.min(0.65, p.opacity))})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(244, 63, 94, 0.35)';
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Handle Login Submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPassword.trim().toLowerCase() === config.password.trim().toLowerCase()) {
      setPasswordError('');
      setScreen('intro');
    } else {
      setPasswordError('That is not the secret word, my love. Try again... ♥');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  // Generate Heart Points for Intro Animation
  const heartPoints = useMemo(() => {
    const variations = [
      { text: 'LOVE YOU', className: 'font-bold uppercase tracking-wider', color: '#fda4af' },
      { text: 'love you', className: 'italic font-light', color: '#f43f5e' },
      { text: 'LOVE YOU ♥', className: 'font-semibold', color: '#fb7185' },
      { text: 'love you ♥', className: 'italic font-medium', color: '#ffb3c1' },
      { text: 'LOVE YOU', className: 'font-bold uppercase', color: '#ffe4e6' },
    ];

    const list: Array<{
      id: number;
      text: string;
      className: string;
      color: string;
      heartX: number;
      heartY: number;
      startX: number;
      startY: number;
      startRot: number;
      delay: number;
    }> = [];

    const totalOuter = 72;
    const totalMid = 44;
    const totalInner = 24;

    const layers = [
      { count: totalOuter, mult: 1.0 },
      { count: totalMid, mult: 0.72 },
      { count: totalInner, mult: 0.44 },
    ];

    // Reference heart dimensions
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const scale = isMobile ? 12 : 20;

    let index = 0;
    layers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const t = (i / layer.count) * 2 * Math.PI;
        // Parametric equations for a heart curve
        const hX = 16 * Math.pow(Math.sin(t), 3) * scale * layer.mult;
        const hY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale * layer.mult;

        const variation = variations[index % variations.length];

        const scatterAngle = Math.random() * Math.PI * 2;
        const scatterDist = 320 + Math.random() * 280;
        const sX = Math.cos(scatterAngle) * scatterDist;
        const sY = Math.sin(scatterAngle) * scatterDist;
        const sRot = (Math.random() - 0.5) * 80;

        list.push({
          id: index,
          text: variation.text,
          className: variation.className,
          color: variation.color,
          heartX: hX,
          heartY: hY,
          startX: sX,
          startY: sY,
          startRot: sRot,
          delay: (index / (totalOuter + totalMid + totalInner)) * 1.5,
        });

        index++;
      }
    });

    return list;
  }, []);

  // Control Intro Cinematic Flow
  useEffect(() => {
    if (screen === 'intro') {
      setIntroAssembled(false);
      setIntroCaptionVisible(false);

      // Trigger movement after mount
      const assembleTimer = setTimeout(() => {
        setIntroAssembled(true);
      }, 300);

      // Show caption
      const captionTimer = setTimeout(() => {
        setIntroCaptionVisible(true);
      }, 2200);

      // Transition to main
      const autoProceedTimer = setTimeout(() => {
        setScreen('main');
      }, config.introDurationMs || 6500);

      return () => {
        clearTimeout(assembleTimer);
        clearTimeout(captionTimer);
        clearTimeout(autoProceedTimer);
      };
    }
  }, [screen, config.introDurationMs]);

  // Toggle envelope and auto-scroll
  const handleEnvelopeClick = () => {
    const nextState = !envelopeOpen;
    setEnvelopeOpen(nextState);
    if (nextState) {
      setTimeout(() => {
        letterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 650);
    }
  };

  // Extract YouTube ID
  const youtubeVideoId = useMemo(() => {
    if (!config.youtubeLink) return null;
    const match = config.youtubeLink.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    );
    return match ? match[1] : null;
  }, [config.youtubeLink]);

  return (
    <div className="min-h-screen bg-[#090212] text-[#fff1f2] relative selection:bg-rose-500 selection:text-white">
      {/* Ambient Lighting Glows */}
      <div className="fixed top-[-100px] left-[10%] w-[480px] h-[480px] rounded-full bg-rose-600/20 blur-[100px] pointer-events-none animate-float-slow z-0" />
      <div className="fixed top-[40%] right-[-100px] w-[520px] h-[520px] rounded-full bg-purple-600/20 blur-[110px] pointer-events-none animate-float-slow z-0" />
      <div className="fixed bottom-[5%] left-[20%] w-[400px] h-[400px] rounded-full bg-pink-600/20 blur-[100px] pointer-events-none z-0" />

      {/* Floating particles background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 w-full h-full" />

      {/* Persistent Developer Credit: Developed By Peter Medhat */}
      <aside
        className="fixed bottom-2.5 left-1/2 -translate-x-1/2 z-[999999] pointer-events-auto select-none whitespace-nowrap"
        aria-label="Developer Credit"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13051c]/90 border border-pink-400/30 backdrop-blur-md shadow-[0_6px_20px_rgba(0,0,0,0.8),0_0_12px_rgba(244,63,94,0.25)] text-[10.5px] font-medium text-pink-100/90 whitespace-nowrap tracking-wider hover:border-pink-400/60 transition-all">
          <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500 animate-heart-pulse shrink-0" />
          <span className="whitespace-nowrap">Developed By Peter Medhat</span>
        </div>
      </aside>

      {/* Top toolbar removed as requested */}

      {/* ====================================================================
          SCREEN 1: ROMANTIC LOGIN
          ==================================================================== */}
      {screen === 'login' && (
        <main className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <div
            className={`w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#1a0a24]/80 backdrop-blur-xl border border-pink-500/25 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(244,63,94,0.2)] text-center transition-all ${
              isShaking ? 'animate-shake' : ''
            }`}
          >
            {/* Heart Badge */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-500/20 border border-rose-400/40 shadow-[0_0_20px_rgba(244,63,94,0.4)] mb-6 animate-heart-pulse">
              <Heart className="w-7 h-7 fill-rose-500 text-rose-500" />
            </div>

            <h1 className="font-serif-cormorant text-3xl sm:text-4xl font-semibold text-rose-50 mb-2">
              Just for you.
            </h1>
            <p className="text-sm sm:text-base text-rose-300/80 mb-8 leading-relaxed">
              Enter the secret word to open your surprise.
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="password"
                  value={enteredPassword}
                  onChange={(e) => {
                    setEnteredPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="Type your secret word..."
                  className="w-full px-5 py-3.5 rounded-2xl bg-black/40 border border-pink-500/30 text-white placeholder-rose-300/40 text-center text-base outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30 transition-all"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white font-semibold text-base shadow-[0_10px_25px_-5px_rgba(244,63,94,0.5)] hover:shadow-[0_15px_30px_-5px_rgba(244,63,94,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Unlock With Love</span>
                <Heart className="w-4 h-4 fill-white" />
              </button>

              {passwordError && (
                <p className="text-rose-300 text-sm mt-1 animate-fadeIn">
                  {passwordError}
                </p>
              )}
            </form>

            <div className="mt-8 pt-4 border-t border-pink-500/15 text-xs text-rose-300/60 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-400/60" />
              <span>Configured in config.js (default: <code>{config.password}</code>)</span>
            </div>
          </div>
        </main>
      )}

      {/* ====================================================================
          SCREEN 2: CINEMATIC LOVE YOU INTRO ANIMATION
          ==================================================================== */}
      {screen === 'intro' && (
        <section className="fixed inset-0 z-50 bg-[#090212] flex items-center justify-center overflow-hidden">
          {/* Center Heart Glow */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-rose-600/30 blur-[60px] pointer-events-none animate-heart-pulse" />

          {/* Universe of LOVE YOU words */}
          <div className="absolute inset-0 pointer-events-none">
            {heartPoints.map((pt) => {
              const currentX = introAssembled ? pt.heartX : pt.startX;
              const currentY = introAssembled ? pt.heartY : pt.startY;
              const currentRot = introAssembled ? 0 : pt.startRot;
              const currentScale = introAssembled ? 1 : 0.65;
              const currentOpacity = introAssembled ? 1 : 0.4;

              return (
                <span
                  key={pt.id}
                  className={`absolute left-1/2 top-1/2 select-none pointer-events-none text-xs sm:text-sm font-serif-cormorant ${pt.className}`}
                  style={{
                    transform: `translate3d(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px), 0) rotate(${currentRot}deg) scale(${currentScale})`,
                    opacity: currentOpacity,
                    color: introAssembled ? pt.color : '#831843',
                    textShadow: introAssembled
                      ? '0 0 10px rgba(244, 63, 94, 0.75)'
                      : 'none',
                    transition: `transform 3.5s cubic-bezier(0.22, 1, 0.36, 1) ${pt.delay}s, opacity 2.2s ease ${pt.delay}s, color 2s ease, text-shadow 2s ease`,
                  }}
                >
                  {pt.text}
                </span>
              );
            })}
          </div>

          {/* Intro Caption & Skip Button */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-center z-20 w-11/12 max-w-md">
            <p
              className={`font-serif-cormorant text-xl sm:text-2xl italic text-rose-100 transition-all duration-1000 ${
                introCaptionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {config.introCaption}
            </p>

            <button
              onClick={() => setScreen('main')}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-rose-500/30 border border-pink-400/40 text-pink-200 text-sm backdrop-blur-md transition-all hover:scale-105"
            >
              <span>Continue to note</span>
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            </button>
          </div>
        </section>
      )}

      {/* ====================================================================
          SCREEN 3: MAIN ROMANTIC WEBSITE
          ==================================================================== */}
      {screen === 'main' && (
        <main className="relative z-10 pb-28 pt-8">
          {/* Header */}
          <header className="text-center px-4 py-8 max-w-3xl mx-auto">
            <h1 className="font-script-romantic text-4xl sm:text-5xl text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)] mb-2">
              {config.websiteLogo}
            </h1>
            <p className="text-xs sm:text-sm uppercase tracking-widest text-rose-300/80">
              {config.headerSubtitle}
            </p>
          </header>

          {/* Hero & Interactive Envelope Section */}
          <section className="max-w-4xl mx-auto px-4 text-center py-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-pink-400/30 text-xs font-bold tracking-widest uppercase text-rose-200 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>{config.heroTag}</span>
            </div>

            <h2 className="font-serif-cormorant text-4xl sm:text-6xl font-semibold text-rose-50 mb-3 tracking-tight">
              {config.heroHeading}
            </h2>
            <p className="text-base sm:text-lg text-rose-200/80 max-w-xl mx-auto mb-6 leading-relaxed">
              {config.heroSubtitle}
            </p>

            {/* زر تشغيل الأغنية فوق الظرف مباشرة */}
            <div className="mb-8 flex flex-col items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 shadow-xl cursor-pointer border ${
                  isMusicPlaying
                    ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 text-white border-pink-300 shadow-[0_0_25px_rgba(244,63,94,0.6)] scale-105'
                    : 'bg-[#1e0a29]/90 hover:bg-[#2a0e3a] text-rose-200 border-pink-400/40 hover:border-pink-400/70 hover:scale-105'
                }`}
              >
                <Disc className={`w-4 h-4 text-rose-300 ${isMusicPlaying ? 'animate-vinyl-spin' : ''}`} />
                <span>
                  {isMusicPlaying ? 'إيقاف الأغنية ⏸️' : 'تشغيل أغنيتنا 🎵'}
                </span>
                <Heart className={`w-3.5 h-3.5 fill-rose-400 text-rose-400 ${isMusicPlaying ? 'animate-heart-pulse' : ''}`} />
              </button>

              {isMusicPlaying && (
                <span className="text-[11px] text-pink-300/80 animate-pulse flex items-center gap-1.5 font-sans">
                  <span>🎶 الأغنية شغالة دلوقتي... استمتعي بالكلام</span>
                </span>
              )}

              {/* مشغل يوتيوب مخفي للزرار */}
              {isMusicPlaying && youtubeVideoId && (
                <iframe
                  className="w-0 h-0 opacity-0 pointer-events-none absolute"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&enablejsapi=1`}
                  allow="autoplay"
                  title="Background Soundtrack"
                />
              )}
            </div>

            {/* 3D Realistic Interactive Envelope */}
            <div
              onClick={handleEnvelopeClick}
              className={`relative w-[320px] sm:w-[380px] h-[220px] sm:h-[250px] mx-auto cursor-pointer perspective-1000 select-none group transition-transform duration-300 hover:-translate-y-1 ${
                envelopeOpen ? 'envelope-open' : ''
              }`}
              role="button"
              tabIndex={0}
              aria-label="Toggle Love Letter Envelope"
            >
              <div className="absolute inset-0 w-full h-full bg-[#381232] rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_40px_rgba(244,63,94,0.25)] overflow-visible">
                {/* Envelope background photo/texture */}
                <img
                  src={config.envelopeImage}
                  alt="Envelope"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-40 pointer-events-none"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Layered Envelope Construction */}
                <div className="envelope-top-flap" />
                <div className="envelope-pocket-sides absolute inset-0 z-[4] pointer-events-none" />
                <div className="envelope-bottom-fold" />

                {/* Wax Seal Heart */}
                <div className="wax-seal-elem absolute top-[105px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-13 h-13 rounded-full bg-gradient-to-br from-rose-500 via-rose-700 to-rose-900 border border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.6),0_0_15px_rgba(244,63,94,0.5)] flex items-center justify-center z-[8] transition-all duration-500">
                  <Heart className="w-6 h-6 fill-white text-white drop-shadow-md" />
                </div>

                {/* Peek letter inside */}
                <div className="letter-peek-elem absolute top-3 left-5 right-5 h-44 bg-[#fffcf7] rounded-t-lg shadow-md z-[3] p-4 transition-transform duration-700 pointer-events-none border border-[#f3e5d8]">
                  <div className="flex flex-col gap-2 opacity-35">
                    <div className="h-1.5 bg-rose-400 rounded w-3/5" />
                    <div className="h-1.5 bg-rose-300 rounded w-full" />
                    <div className="h-1.5 bg-rose-300 rounded w-full" />
                    <div className="h-1.5 bg-rose-300 rounded w-4/5" />
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm text-rose-300/80 flex items-center justify-center gap-1.5">
              <span>{envelopeOpen ? 'Click envelope to fold closed' : 'Click to open my heart'}</span>
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            </p>

            {/* Revealed Romantic Love Letter */}
            <div
              ref={letterRef}
              className={`max-w-2xl mx-auto mt-10 transition-all duration-1000 ${
                envelopeOpen
                  ? 'opacity-100 translate-y-0 max-h-[3000px]'
                  : 'opacity-0 translate-y-10 max-h-0 overflow-hidden pointer-events-none'
              }`}
            >
              <article className="relative bg-[#fffcf7] text-[#2d1a29] rounded-3xl p-8 sm:p-14 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),0_0_0_1px_#f3e5d8,0_0_40px_rgba(254,205,211,0.4)] text-left overflow-hidden">
                {/* Decorative borders & watermark */}
                <div className="absolute inset-3 border border-pink-900/10 rounded-2xl pointer-events-none" />
                <div className="absolute right-6 bottom-4 text-8xl text-rose-500/[0.04] select-none pointer-events-none">
                  ♥
                </div>

                {/* Letter Header */}
                <div className="text-center mb-8 relative">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-rose-100 text-rose-600 mb-3 shadow-inner">
                    <Heart className="w-5 h-5 fill-rose-600" />
                  </div>
                  <h3 className="font-serif-cormorant text-3xl sm:text-4xl font-semibold text-[#50133c]">
                    {config.letterHeading}
                  </h3>
                  <p className="text-xs tracking-widest uppercase text-rose-900/60 mt-1">
                    {config.letterDate}
                  </p>
                </div>

                {/* Letter Body (Supports Multiline, Arabic dir=auto, Emojis) */}
                <div
                  className="font-serif-cormorant text-lg sm:text-xl leading-relaxed text-[#3b1d34] whitespace-pre-wrap break-words"
                  dir="auto"
                >
                  {config.loveLetter}
                </div>

                {/* Romantic Signature */}
                <div className="mt-10 pt-6 border-t border-dashed border-rose-900/20 text-right">
                  <div
                    className="font-script-romantic text-3xl sm:text-4xl text-rose-800 whitespace-pre-wrap leading-tight"
                    dir="auto"
                  >
                    {config.letterSignature}
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* ====================================================================
              OUR MEMORIES PHOTO GALLERY
              ==================================================================== */}
          <section className="max-w-5xl mx-auto px-4 py-16">
            <div className="text-center mb-8">
              <h2 className="font-serif-cormorant text-3xl sm:text-5xl font-semibold text-rose-50 mb-2">
                {config.galleryTitle}
              </h2>
              <p className="text-sm sm:text-base text-rose-300/80 max-w-md mx-auto mb-4">
                {config.gallerySubtitle}
              </p>

              {/* Upload Real Photos Button & Feedback */}
              <div className="flex flex-col items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotosUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-600/90 to-pink-600/90 hover:from-rose-500 hover:to-pink-500 text-white text-xs sm:text-sm font-medium shadow-lg border border-pink-400/40 backdrop-blur-md hover:scale-105 transition-all cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>📸 اختيار صورك الأصلية من جهازك (ملفات الواتساب)</span>
                </button>
                <p className="text-[11px] text-rose-300/60">
                  اختر الـ 4 صور من موبايلك أو الكمبيوتر ليتم عرضهم فوراً بكامل جودتهم الأصلية
                </p>
                {uploadSuccessMessage && (
                  <div className="mt-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-medium animate-fadeIn">
                    {uploadSuccessMessage}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {config.photos.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group bg-[#1b0b26]/80 border border-pink-500/20 rounded-2xl overflow-hidden shadow-xl hover:border-pink-400/60 hover:-translate-y-2 hover:scale-[1.02] transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-4/3 w-full bg-[#190826] overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.fallback-badge');
                        if (fallback) (fallback as HTMLElement).style.display = 'flex';
                      }}
                    />
                    {/* Fallback romantic illustration if image fails */}
                    <div className="fallback-badge hidden absolute inset-0 flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#35133d] to-[#170724]">
                      <Heart className="w-10 h-10 fill-rose-500 text-rose-500 mb-2 opacity-80" />
                      <span className="text-xs text-rose-200">{photo.caption}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-[#15081e]/95 border-t border-pink-500/10 font-serif-cormorant text-base text-rose-100 flex-1">
                    {photo.caption}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ====================================================================
              OUR LITTLE SOUNDTRACK (YOUTUBE MUSIC PLAYER)
              ==================================================================== */}
          <section className="max-w-3xl mx-auto px-4 py-8 mb-16">
            <div className="bg-[#190924]/80 border border-pink-500/25 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(244,63,94,0.15)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2e0828] to-[#110319] border-2 border-pink-400/40 flex items-center justify-center animate-vinyl-spin shadow-[0_0_20px_rgba(244,63,94,0.35)] shrink-0">
                  <Disc className="w-7 h-7 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-semibold text-rose-50">
                    {config.soundtrackTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-300/80">
                    {config.soundtrackSubtitle}
                  </p>
                </div>
              </div>

              {/* Responsive 16:9 Player */}
              <div className="relative w-full pb-[56.25%] h-0 rounded-2xl overflow-hidden bg-black border border-pink-500/20 shadow-lg">
                {youtubeVideoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&playsinline=1`}
                    title="Our Romantic Soundtrack"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#140520] text-rose-300">
                    <p className="font-serif-cormorant text-xl text-rose-100 mb-2">
                      Add your favorite YouTube song in config.js ♥
                    </p>
                    <p className="text-xs text-rose-300/60">
                      Paste any link into <code>youtubeLink</code> to hear your song.
                    </p>
                  </div>
                )}
              </div>

              <p className="mt-4 text-center text-xs text-rose-300/50">
                You can press play above to listen anytime. Configured in <code>config.js</code>.
              </p>
            </div>
          </section>
        </main>
      )}

      {/* Lightbox Modal for Photos */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[90vh] flex flex-col items-center"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-rose-400 p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              className="max-h-[75vh] w-auto rounded-xl border border-pink-500/30 object-contain shadow-2xl"
            />
            <p className="mt-3 font-serif-cormorant text-xl text-rose-100 text-center">
              {selectedPhoto.caption}
            </p>
          </div>
        </div>
      )}

      {/* Live Configuration Drawer/Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-[10001] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#180824] border border-pink-500/30 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl text-left">
            <div className="flex items-center justify-between pb-4 border-b border-pink-500/20 mb-6">
              <div>
                <h3 className="text-xl font-serif-cormorant font-semibold text-rose-50">
                  Live Preview Settings (config.js)
                </h3>
                <p className="text-xs text-rose-300/70">
                  Edit these values to preview your romantic changes instantly.
                </p>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1 rounded-full text-rose-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-rose-200 uppercase mb-1">
                  1. Secret Password
                </label>
                <input
                  type="text"
                  value={configDraft.password}
                  onChange={(e) =>
                    setConfigDraft({ ...configDraft, password: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-pink-500/30 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 uppercase mb-1">
                  2. Love Letter Text (Supports paragraphs & Arabic)
                </label>
                <textarea
                  rows={6}
                  value={configDraft.loveLetter}
                  onChange={(e) =>
                    setConfigDraft({ ...configDraft, loveLetter: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-pink-500/30 text-white font-serif-cormorant text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 uppercase mb-1">
                  3. Letter Signature
                </label>
                <input
                  type="text"
                  value={configDraft.letterSignature}
                  onChange={(e) =>
                    setConfigDraft({ ...configDraft, letterSignature: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-pink-500/30 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 uppercase mb-1">
                  4. YouTube Song Link
                </label>
                <input
                  type="text"
                  value={configDraft.youtubeLink}
                  onChange={(e) =>
                    setConfigDraft({ ...configDraft, youtubeLink: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-pink-500/30 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 uppercase mb-1">
                  5. Envelope Cover Image URL or Path
                </label>
                <input
                  type="text"
                  value={configDraft.envelopeImage}
                  onChange={(e) =>
                    setConfigDraft({ ...configDraft, envelopeImage: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-pink-500/30 text-white"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-pink-500/20 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setConfigDraft(DEFAULT_CONFIG);
                  setConfig(DEFAULT_CONFIG);
                  setShowConfigModal(false);
                }}
                className="px-4 py-2 text-xs text-rose-300 hover:text-white"
              >
                Reset to Defaults
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfig(configDraft);
                  setShowConfigModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md"
              >
                Apply Live Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
