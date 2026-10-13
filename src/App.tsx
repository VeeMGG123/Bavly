import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Heart,
  LockKeyhole,
  Mail,
  Music2,
  ImagePlus,
  Settings,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  VolumeX,
} from 'lucide-react';

type PhotoItem = {
  src: string;
  caption: string;
};

type SiteConfig = {
  password: string;
  recipientName: string;
  senderName: string;
  title: string;
  message: string;
  youtubeVideoId: string;
  photos: PhotoItem[];
};

declare global {
  interface Window {
    CONFIG?: Partial<SiteConfig>;
  }
}

const DEFAULT_CONFIG: SiteConfig = {
  password: '29/6/2026',
  recipientName: 'Maroska',
  senderName: 'Bavly',
  title: 'A Little Piece of My Heart',
  message: `Dear Maroska,

Some people make ordinary days feel special without even trying. You are one of those people.

I just wanted to make something a little different for you — a small corner of the internet filled with love, memories, and words that sometimes are easier to write than to say.

You deserve happiness, beautiful memories, and countless reasons to smile. No matter how busy life gets, I hope you always remember how special you are and how much you mean to the people who care about you.

Thank you for being you, for the little moments, the laughs, and all the memories that make life brighter.

This little website is just a small reminder that you are appreciated more than you know.

With lots of love,
Bavly ❤️`,
  youtubeVideoId: '',
  photos: [
    { src: '/images/photo1.jpg', caption: 'A memory to keep ✨' },
    { src: '/images/photo2.jpg', caption: 'Little moments, big memories 💗' },
    { src: '/images/photo3.jpg', caption: 'A reason to smile 🌷' },
    { src: '/images/photo4.jpg', caption: 'Always worth remembering 💌' },
  ],
};

function readConfig(): SiteConfig {
  return {
    ...DEFAULT_CONFIG,
    ...(typeof window !== 'undefined' ? window.CONFIG : {}),
  };
}

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(readConfig);
  const [draft, setDraft] = useState<SiteConfig>(readConfig);
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [error, setError] = useState('');
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    try {
      if (window.CONFIG?.photos?.length) return;

      const saved = localStorage.getItem('bavly_user_photos_v2');
      if (!saved) return;

      const parsed = JSON.parse(saved) as PhotoItem[];
      if (Array.isArray(parsed)) {
        setConfig((current) => ({ ...current, photos: parsed }));
      }
    } catch (err) {
      console.error('Could not load saved photos:', err);
    }
  }, []);

  useEffect(() => {
    if (!unlocked || introFinished) return;

    const timer = window.setTimeout(() => setIntroFinished(true), 3200);
    return () => window.clearTimeout(timer);
  }, [unlocked, introFinished]);

  function checkPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.trim() === config.password) {
      setError('');
      setUnlocked(true);
    } else {
      setError('Not quite, try again, sweetheart 💗');
    }
  }

  function saveSettings() {
    setConfig(draft);

    try {
      localStorage.setItem(
        'bavly_user_photos_v2',
        JSON.stringify(draft.photos),
      );
    } catch (err) {
      console.error('Could not save photos:', err);
    }

    setPhotoIndex(0);
    setShowSettings(false);
  }

  function uploadPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith('image/'),
    );

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== 'string') return;

        setDraft((current) => ({
          ...current,
          photos: [
            ...current.photos,
            { src: reader.result as string, caption: 'A little memory 💗' },
          ],
        }));
      };

      reader.readAsDataURL(file);
    });

    event.target.value = '';
  }

  function updatePhotoCaption(index: number, caption: string) {
    setDraft((current) => ({
      ...current,
      photos: current.photos.map((photo, i) =>
        i === index ? { ...photo, caption } : photo,
      ),
    }));
  }

  function removePhoto(index: number) {
    setDraft((current) => ({
      ...current,
      photos: current.photos.filter((_, i) => i !== index),
    }));
  }

  const currentPhoto = config.photos[photoIndex];
  const youtubeId = config.youtubeVideoId.match(/^[a-zA-Z0-9_-]{11}$/)
    ? config.youtubeVideoId
    : '';

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0c0414] text-rose-50 selection:bg-rose-500 selection:text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-fuchsia-700/20 blur-[110px]" />
        <div className="absolute -bottom-40 -right-20 h-[30rem] w-[30rem] rounded-full bg-rose-600/15 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-700/10 blur-[100px]" />
      </div>

      <button
        onClick={() => {
          setDraft(config);
          setShowSettings(true);
        }}
        aria-label="Open website settings"
        className="absolute right-5 top-5 z-30 rounded-full border border-white/10 bg-white/5 p-3 text-rose-100/70 transition hover:bg-white/10 hover:text-white"
      >
        <Settings size={19} />
      </button>

      {!unlocked ? (
        <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-16">
          <div className="w-full max-w-md text-center">
            <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-rose-500/10" />
              <div className="absolute inset-2 rounded-full border border-rose-300/20" />
              <Heart size={43} className="animate-pulse fill-rose-500 text-rose-400" />
            </div>

            <p className="mb-4 text-xs uppercase tracking-[0.5em] text-rose-300/70">
              A little surprise for
            </p>
            <h1 className="mb-4 bg-gradient-to-r from-rose-200 via-pink-400 to-purple-300 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-7xl">
              LOVE YOU
            </h1>
            <p className="mb-9 text-sm leading-7 text-rose-100/60">
              Made with love, just for{' '}
              <span className="text-rose-300">{config.recipientName}</span>.
              <br />
              There&apos;s something waiting for you inside.
            </p>

            <form
              onSubmit={checkPassword}
              className="mx-auto max-w-sm rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-fuchsia-950/20 backdrop-blur-xl sm:p-8"
            >
              <div className="mb-5 flex items-center justify-center gap-2 text-sm text-rose-100/80">
                <LockKeyhole size={16} className="text-rose-300" />
                <span>A little secret first...</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError('');
                }}
                placeholder="Enter the secret password"
                autoComplete="off"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-center text-sm text-white outline-none placeholder:text-rose-100/30 focus:border-rose-400/60"
              />
              {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 px-5 py-4 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Open your surprise <Heart size={17} />
              </button>
            </form>

            <p className="mt-8 text-xs tracking-widest text-white/30">
              MADE WITH LOVE BY {config.senderName.toUpperCase()} ♥
            </p>
          </div>
        </section>
      ) : !introFinished ? (
        <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 text-center">
          <div className="relative mb-8 flex h-36 w-36 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-rose-500/10" />
            <Heart size={82} strokeWidth={1} className="animate-pulse fill-rose-500/20 text-rose-400" />
            <Sparkles size={25} className="absolute right-1 top-3 animate-bounce text-pink-200" />
          </div>
          <p className="animate-pulse text-3xl font-light tracking-[0.2em] text-rose-100 sm:text-5xl">
            LOVE YOU
          </p>
          <p className="mt-5 text-sm text-rose-200/50">A little moment, made just for you...</p>
          <button onClick={() => setIntroFinished(true)} className="mt-10 text-xs text-white/40 underline underline-offset-4 hover:text-white/80">
            Skip intro
          </button>
        </section>
      ) : (
        <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-5 py-20 sm:px-8">
          {!envelopeOpened ? (
            <div className="my-auto w-full max-w-xl py-10 text-center">
              <p className="mb-4 text-xs uppercase tracking-[0.45em] text-rose-300/70">You have a little letter</p>
              <h2 className="mb-4 text-4xl font-light leading-tight text-rose-50 sm:text-6xl">
                For you, <span className="font-serif italic text-rose-300">{config.recipientName}</span>
              </h2>
              <p className="mx-auto mb-12 max-w-md text-sm leading-7 text-rose-100/55">
                A few words from the heart, wrapped up just for you. Tap the envelope when you&apos;re ready.
              </p>
              <button onClick={() => setEnvelopeOpened(true)} aria-label="Open your letter" className="group relative mx-auto block w-full max-w-sm text-left transition duration-500 hover:-translate-y-2">
                <div className="relative h-52 overflow-hidden rounded-2xl border border-rose-200/20 bg-gradient-to-br from-rose-300 via-rose-500 to-fuchsia-700 shadow-2xl sm:h-60">
                  <div className="absolute inset-3 rounded-xl border border-white/25" />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-purple-950/30 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-rose-200/30" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Heart size={47} className="mb-3 fill-rose-50/90 text-rose-50" />
                    <span className="text-xs uppercase tracking-[0.35em] text-white/90">Open me</span>
                  </div>
                </div>
              </button>
              <p className="mt-8 text-xs text-rose-100/35">Made with love by {config.senderName}</p>
            </div>
          ) : (
            <div className="w-full">
              <button onClick={() => setEnvelopeOpened(false)} className="mb-8 flex items-center gap-2 text-sm text-rose-200/60 hover:text-white">
                <ArrowLeft size={16} /> Back to the envelope
              </button>

              <article className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-rose-200/15 bg-gradient-to-br from-[#211025] to-[#13091b] p-7 shadow-2xl sm:p-12 md:p-16">
                <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />
                <div className="relative">
                  <div className="mb-9 flex items-center gap-3">
                    <div className="rounded-full border border-rose-300/20 bg-rose-300/10 p-3"><Mail className="text-rose-300" size={21} /></div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-rose-300/60">A letter from the heart</p>
                      <p className="mt-1 text-xs text-white/40">Especially for {config.recipientName}</p>
                    </div>
                  </div>
                  <h2 className="mb-8 font-serif text-3xl leading-tight text-rose-100 sm:text-5xl">{config.title}</h2>
                  <div className="whitespace-pre-wrap font-serif text-base leading-8 text-rose-50/80 sm:text-lg sm:leading-9">{config.message}</div>
                  <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-7">
                    <Heart size={20} className="fill-rose-400 text-rose-400" />
                    <span className="font-serif text-xl italic text-rose-200">{config.senderName}</span>
                  </div>
                </div>
              </article>

              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <button onClick={() => setShowGallery(!showGallery)} className="flex items-center gap-2 rounded-full border border-rose-200/15 bg-white/5 px-6 py-3 text-sm text-rose-100 hover:bg-white/10">
                  <ImagePlus size={17} /> {showGallery ? 'Hide memories' : 'Our little memories'}
                </button>
                <button onClick={() => setMusicOn(!musicOn)} className="flex items-center gap-2 rounded-full border border-rose-200/15 bg-white/5 px-6 py-3 text-sm text-rose-100 hover:bg-white/10">
                  {musicOn ? <VolumeX size={17} /> : <Music2 size={17} />}
                  {musicOn ? 'Hide music' : 'A little music'}
                </button>
              </div>

              {showGallery && (
                <section className="mx-auto mt-14 max-w-3xl">
                  <div className="mb-7 text-center">
                    <p className="text-xs uppercase tracking-[0.4em] text-rose-300/60">Moments to keep</p>
                    <h3 className="mt-3 font-serif text-3xl text-rose-100">Little Memories</h3>
                  </div>
                  {currentPhoto ? (
                    <>
                      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-3">
                        <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-2xl bg-black/20 sm:min-h-96">
                          <img src={currentPhoto.src} alt={currentPhoto.caption} className="max-h-[520px] w-full object-contain" />
                          <button onClick={() => setPhotoIndex((photoIndex - 1 + config.photos.length) % config.photos.length)} aria-label="Previous photo" className="absolute left-3 rounded-full bg-black/50 p-3 text-white"><ArrowLeft size={19} /></button>
                          <button onClick={() => setPhotoIndex((photoIndex + 1) % config.photos.length)} aria-label="Next photo" className="absolute right-3 rounded-full bg-black/50 p-3 text-white"><ArrowRight size={19} /></button>
                        </div>
                        <p className="py-4 text-center font-serif text-lg italic text-rose-200">{currentPhoto.caption}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {config.photos.map((photo, index) => (
                          <button key={`${photo.src}-${index}`} onClick={() => setPhotoIndex(index)} aria-label={`Show photo ${index + 1}`} className={`h-2 rounded-full ${index === photoIndex ? 'w-8 bg-rose-400' : 'w-2 bg-white/20'}`} />
                        ))}
                      </div>
                    </>
                  ) : <p className="rounded-2xl border border-white/10 p-8 text-center text-sm text-white/50">Open settings to add photos.</p>}
                </section>
              )}

              {musicOn && (
                <section className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
                  <Music2 className="mx-auto mb-3 text-rose-300" size={25} />
                  <h3 className="mb-2 font-serif text-xl">Our soundtrack</h3>
                  {youtubeId ? (
                    <iframe className="mt-4 aspect-video w-full rounded-xl" src={`https://www.youtube-nocookie.com/embed/${youtubeId}`} title="Our soundtrack" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  ) : <p className="text-sm text-white/50">Add a YouTube video ID in settings.</p>}
                </section>
              )}
            </div>
          )}
          <footer className="mt-16 pb-2 text-center text-[10px] uppercase tracking-[0.35em] text-white/25">Crafted with ♥ by {config.senderName}</footer>
        </section>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-md sm:items-center" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowSettings(false); }}>
          <section className="my-auto w-full max-w-2xl rounded-3xl border border-white/10 bg-[#180d20] p-5 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-rose-300/60">Personalize your surprise</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Website settings</h2>
              </div>
              <button onClick={() => setShowSettings(false)} aria-label="Close settings" className="rounded-full p-2 text-white/60 hover:bg-white/10"><X size={21} /></button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-rose-100/70">Recipient name
                <input value={draft.recipientName} onChange={(e) => setDraft({ ...draft, recipientName: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" />
              </label>
              <label className="text-sm text-rose-100/70">Your name
                <input value={draft.senderName} onChange={(e) => setDraft({ ...draft, senderName: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" />
              </label>
              <label className="text-sm text-rose-100/70 sm:col-span-2">Password
                <input value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" />
              </label>
              <label className="text-sm text-rose-100/70 sm:col-span-2">Letter title
                <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" />
              </label>
              <label className="text-sm text-rose-100/70 sm:col-span-2">Letter message
                <textarea rows={9} value={draft.message} onChange={(e) => setDraft({ ...draft, message: e.target.value })} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 leading-7 text-white outline-none" />
              </label>
              <label className="text-sm text-rose-100/70 sm:col-span-2">YouTube video ID
                <input value={draft.youtubeVideoId} onChange={(e) => setDraft({ ...draft, youtubeVideoId: e.target.value })} placeholder="Example: dQw4w9WgXcQ" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" />
              </label>
            </div>

            <div className="mt-7 border-t border-white/10 pt-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div><h3 className="font-semibold text-white">Photo gallery</h3><p className="mt-1 text-xs text-white/45">Add images from your device.</p></div>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  <Upload size={16} /> Upload photos
                  <input type="file" accept="image/*" multiple onChange={uploadPhotos} className="hidden" />
                </label>
              </div>
              <div className="space-y-3">
                {draft.photos.map((photo, index) => (
                  <div key={`${photo.src.slice(0, 40)}-${index}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <img src={photo.src} alt="" className="h-14 w-14 rounded-lg bg-black/20 object-cover" />
                    <input value={photo.caption} onChange={(e) => updatePhotoCaption(index, e.target.value)} aria-label={`Caption for photo ${index + 1}`} className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none" />
                    <button onClick={() => removePhoto(index)} aria-label={`Remove photo ${index + 1}`} className="rounded-lg p-2 text-rose-300/70 hover:bg-rose-400/10"><X size={17} /></button>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-white/35">Uploaded photos are saved in this browser. To make them available to everyone, add image files to public/images and redeploy.</p>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button onClick={() => setShowSettings(false)} className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/70">Cancel</button>
              <button onClick={saveSettings} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white">Save changes <Heart size={16} /></button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
