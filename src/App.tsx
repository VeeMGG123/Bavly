
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type SiteConfig = {
  password: string;
  recipientName: string;
  senderName: string;
  message: string;
  musicUrl: string;
  photos: string[];
};

const DEFAULT_CONFIG: SiteConfig = {
  password: "29/6/2026",
  recipientName: "Maroska",
  senderName: "Bavly",
  message: `Dear Maroska,

I made this little place just for you, to remind you how special you are to me.

Some people make ordinary moments unforgettable, and you are one of those people. I hope this little surprise brings a smile to your face and reminds you that you are appreciated more than words can explain.

Thank you for the beautiful memories and for being the person you are.

With love, always,
Bavly ❤️`,
  musicUrl: "",
  photos: [
    "/images/photo1.jpg",
    "/images/photo2.jpg",
    "/images/photo3.jpg",
    "/images/photo4.jpg",
  ],
};

const STORAGE_KEY = "love-you-config-v3";

function loadConfig(): SiteConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved) as Partial<SiteConfig>;

      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        musicUrl: parsed.musicUrl ?? "",
        photos: Array.isArray(parsed.photos)
          ? parsed.photos
          : DEFAULT_CONFIG.photos,
      };
    }

    // Migrate settings from the previous version.
    const oldSaved = localStorage.getItem("love-you-config");

    if (oldSaved) {
      const parsed = JSON.parse(oldSaved) as Partial<SiteConfig>;

      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        musicUrl:
          parsed.musicUrl?.includes("youtube.com") ||
          parsed.musicUrl?.includes("youtu.be")
            ? parsed.musicUrl
            : "",
        photos: Array.isArray(parsed.photos)
          ? parsed.photos
          : DEFAULT_CONFIG.photos,
      };
    }
  } catch {
    // Continue with default settings.
  }

  return DEFAULT_CONFIG;
}

function getYouTubeId(url: string): string {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");
    let id = "";

    if (host === "youtu.be") {
      id = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (
      [
        "youtube.com",
        "m.youtube.com",
        "music.youtube.com",
        "youtube-nocookie.com",
      ].includes(host)
    ) {
      if (parsed.pathname === "/watch") {
        id = parsed.searchParams.get("v") ?? "";
      } else {
        const match = parsed.pathname.match(
          /^\/(?:embed|shorts|live)\/([^/?]+)/
        );
        id = match?.[1] ?? "";
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : "";
  } catch {
    return "";
  }
}

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(loadConfig);

  // Password first, then animated intro, then the website.
  const [stage, setStage] = useState<"login" | "intro" | "site">("login");

  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [letterOpen, setLetterOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [musicRequested, setMusicRequested] = useState(false);

  const youtubeId = getYouTubeId(config.musicUrl);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      setNotice(
        "Browser storage is full. Try removing some uploaded photos."
      );
    }
  }, [config]);

  function updateConfig<K extends keyof SiteConfig>(
    key: K,
    value: SiteConfig[K]
  ) {
    setConfig((previous) => {
      const next = { ...previous, [key]: value };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        setNotice("Could not save this change in browser storage.");
      }

      return next;
    });
  }

  function saveAndCloseSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      setNotice("Settings saved successfully ❤️");
      setSettingsOpen(false);
    } catch {
      setNotice(
        "Settings could not be saved. Remove some photos and try again."
      );
    }
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (passwordInput.trim() === config.password) {
      setPasswordError("");
      setStage("intro");
    } else {
      setPasswordError("Wrong password. Try again ❤️");
    }
  }

  function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice("Please select an image.");
      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setNotice("Choose an image smaller than 1 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      setConfig((previous) => {
        const next = {
          ...previous,
          photos: [...previous.photos, reader.result as string],
        };

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          setNotice("Photo saved ❤️");
        } catch {
          setNotice("Not enough browser storage for this photo.");
        }

        return next;
      });
    };

    reader.onerror = () => setNotice("Could not read that image.");

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function removePhoto(index: number) {
    setConfig((previous) => {
      const next = {
        ...previous,
        photos: previous.photos.filter((_, i) => i !== index),
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // The updated state remains visible.
      }

      return next;
    });
  }

  function openMusic() {
    if (!youtubeId) {
      setSettingsOpen(true);
      setNotice("Paste your YouTube song link in Settings first.");
      return;
    }

    setMusicRequested(true);

    document.getElementById("music")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  function enterWebsite() {
    setStage("site");

    // Request autoplay when the music player becomes visible.
    setMusicRequested(Boolean(youtubeId));

    window.setTimeout(() => {
      document.getElementById("home")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }

  const heartRows = [
    "001100001100",
    "011110011110",
    "111111111111",
    "111111111111",
    "011111111110",
    "001111111100",
    "000111111000",
    "000011110000",
    "000001100000",
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-white">
      <style>{`
        @keyframes heartWord {
          0% {
            opacity: 0;
            transform: translate(var(--start-x), var(--start-y)) scale(0.3) rotate(-15deg);
            filter: blur(5px);
          }
          55% {
            opacity: 1;
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0);
            filter: blur(0);
          }
        }

        @keyframes heartGlow {
          0%, 100% {
            filter: drop-shadow(0 0 5px rgba(239, 68, 68, .15));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(239, 68, 68, .75));
          }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes floating {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-9px); }
        }

        .heart-glow {
          animation: heartGlow 2.4s ease-in-out infinite;
        }

        .intro-word {
          opacity: 0;
          animation: heartWord 1.1s cubic-bezier(.2,.8,.2,1) forwards;
          animation-delay: var(--delay);
        }

        .fade-up {
          animation: fadeUp .8s ease-out both;
        }

        .float-heart {
          animation: floating 3s ease-in-out infinite;
        }

        .glass-panel {
          background: linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.012));
          border: 1px solid rgba(255,255,255,.09);
          backdrop-filter: blur(16px);
        }

        .love-gradient {
          background: linear-gradient(100deg, #fff 15%, #fb7185 48%, #dc2626 75%, #fff 100%);
          background-size: 220% auto;
          color: transparent;
          background-clip: text;
          animation: loveShine 4s linear infinite;
        }

        @keyframes loveShine {
          to { background-position: 220% center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-word, .heart-glow, .fade-up, .float-heart, .love-gradient {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      {/* LOGIN FIRST */}
      {stage === "login" && (
        <section className="relative flex min-h-screen items-center justify-center px-5 py-12">
          <div className="pointer-events-none absolute left-[-100px] top-10 h-72 w-72 rounded-full bg-red-700/15 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 right-[-100px] h-72 w-72 rounded-full bg-rose-600/10 blur-[100px]" />

          <form
            onSubmit={handleLogin}
            className="glass-panel relative w-full max-w-md rounded-[2rem] p-8 text-center shadow-2xl shadow-red-950/20 sm:p-10"
          >
            <div className="float-heart mb-6 text-6xl">♥</div>

            <p className="mb-4 text-[10px] uppercase tracking-[.5em] text-rose-400">
              A private little surprise
            </p>

            <h1 className="text-4xl font-black tracking-tight">
              LOVE <span className="text-red-500">YOU.</span>
            </h1>

            <p className="mt-4 text-sm leading-7 text-zinc-400">
              There's something special waiting for you.
              Enter our special date to unlock it.
            </p>

            <input
              type="password"
              value={passwordInput}
              onChange={(event) => setPasswordInput(event.target.value)}
              placeholder="Enter the password"
              autoComplete="current-password"
              className="mt-8 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-4 text-center outline-none transition placeholder:text-zinc-600 focus:border-red-500"
              required
            />

            {passwordError && (
              <p className="mt-3 text-sm text-red-400">{passwordError}</p>
            )}

            <button
              type="submit"
              className="mt-5 w-full rounded-2xl bg-red-600 px-6 py-4 font-bold transition hover:scale-[1.02] hover:bg-red-500"
            >
              Unlock the Surprise ♥
            </button>

            <p className="mt-8 text-xs text-zinc-600">
              Made with love by PeterMedhat
            </p>
          </form>
        </section>
      )}

      {/* ANIMATED LOVE YOU INTRO AFTER LOGIN */}
      {stage === "intro" && (
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(127,29,29,0.23),transparent_65%)]" />

          <div className="relative z-10 w-full max-w-2xl">
            <p
              className="fade-up mb-8 text-[10px] uppercase tracking-[.55em] text-red-300 sm:text-xs"
              style={{ animationDelay: "0.2s" }}
            >
              A little message from my heart
            </p>

            <div className="heart-glow mx-auto mb-8 w-fit">
              <div className="grid grid-cols-12 gap-[2px] sm:gap-1">
                {heartRows.flatMap((row, rowIndex) =>
                  row.split("").map((cell, colIndex) => {
                    const active = cell === "1";
                    const delay = (rowIndex * 12 + colIndex) * 0.045;

                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="flex h-5 w-5 items-center justify-center sm:h-8 sm:w-8"
                      >
                        {active && (
                          <span
                            className="intro-word text-[7px] font-black text-red-500 sm:text-[10px]"
                            style={
                              {
                                "--delay": `${delay}s`,
                                "--start-x": `${(colIndex - 5.5) * 13}px`,
                                "--start-y": `${(rowIndex - 4) * 13}px`,
                              } as React.CSSProperties
                            }
                          >
                            LOVE
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <h1
              className="fade-up text-5xl font-black tracking-[-.06em] sm:text-8xl"
              style={{ animationDelay: "1.5s" }}
            >
              <span className="love-gradient">LOVE YOU</span>
              <span className="text-red-500"> ♥</span>
            </h1>

            <p
              className="fade-up mt-5 text-sm tracking-wide text-zinc-400 sm:text-base"
              style={{ animationDelay: "1.9s" }}
            >
              {config.recipientName}, this little world is just for you.
            </p>

            <button
              type="button"
              onClick={enterWebsite}
              className="fade-up mt-9 rounded-full border border-red-500/60 bg-red-600 px-8 py-4 font-bold shadow-lg shadow-red-900/30 transition hover:scale-105 hover:bg-red-500"
              style={{ animationDelay: "2.2s" }}
            >
              Enter My World ♥
            </button>

            <p
              className="fade-up mt-5 text-xs text-zinc-600"
              style={{ animationDelay: "2.5s" }}
            >
              Developed By PeterMedhat
            </p>
          </div>
        </section>
      )}

      {/* MAIN WEBSITE */}
      {stage === "site" && (
        <>
          <header className="sticky top-0 z-30 border-b border-white/5 bg-black/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
              <a
                href="#home"
                className="shrink-0 text-lg font-black tracking-tight sm:text-xl"
              >
                LOVE<span className="text-red-500">YOU.</span>
              </a>

              <nav className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openMusic}
                  className="rounded-full border border-red-500/40 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-red-950 sm:px-4 sm:text-sm"
                >
                  ♪ Music
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  className="rounded-full border border-white/10 px-3 py-2 text-xs transition hover:border-red-500 sm:px-4 sm:text-sm"
                >
                  ⚙ Settings
                </button>
              </nav>
            </div>
          </header>

          <section
            id="home"
            className="relative flex min-h-[82vh] items-center justify-center overflow-hidden px-5 py-24 text-center"
          >
            <div className="pointer-events-none absolute left-[-100px] top-20 h-72 w-72 rounded-full bg-red-600/15 blur-[100px]" />
            <div className="pointer-events-none absolute bottom-0 right-[-100px] h-72 w-72 rounded-full bg-rose-500/10 blur-[100px]" />

            <div className="fade-up relative z-10 max-w-5xl">
              <p className="mb-6 text-[10px] uppercase tracking-[.55em] text-rose-300 sm:text-xs">
                To someone who means a lot
              </p>

              <h1 className="text-6xl font-black leading-[.98] tracking-[-.07em] sm:text-8xl md:text-9xl">
                LOVE
                <br />
                <span className="love-gradient">YOU.</span>
              </h1>

              <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-zinc-400 sm:text-lg">
                A little universe of memories, words, and moments,
                created especially for {config.recipientName}.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("letter")?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                  className="rounded-full bg-red-600 px-7 py-3 font-bold transition hover:bg-red-500"
                >
                  Read Your Letter ↓
                </button>

                <button
                  type="button"
                  onClick={openMusic}
                  className="rounded-full border border-white/15 px-7 py-3 font-semibold transition hover:border-red-500"
                >
                  Play Our Song ♪
                </button>
              </div>
            </div>
          </section>

          {/* LETTER */}
          <section
            id="letter"
            className="mx-auto max-w-4xl scroll-mt-24 px-5 py-20 text-center sm:py-28"
          >
            <p className="mb-3 text-[10px] uppercase tracking-[.45em] text-rose-300 sm:text-xs">
              From me to you
            </p>

            <h2 className="text-4xl font-black sm:text-6xl">
              Your <span className="text-red-500">Letter</span>
            </h2>

            <p className="mt-4 text-sm text-zinc-500">
              Some words deserve their own little envelope.
            </p>

            <button
              type="button"
              onClick={() => setLetterOpen((value) => !value)}
              aria-expanded={letterOpen}
              className="group mx-auto mt-10 flex flex-col items-center"
            >
              <span className="text-8xl transition duration-500 group-hover:scale-110 sm:text-9xl">
                {letterOpen ? "💌" : "✉️"}
              </span>

              <span className="mt-5 rounded-full border border-red-900/70 px-5 py-3 text-sm text-rose-300 transition group-hover:bg-red-950/50">
                {letterOpen ? "Close the letter ↑" : "Open your letter ♥"}
              </span>
            </button>

            {letterOpen && (
              <article className="fade-up mx-auto mt-10 max-w-2xl rounded-3xl border border-red-950/70 bg-[#111111] p-6 text-left shadow-2xl shadow-red-950/10 sm:p-10">
                <p className="mb-6 text-2xl font-bold text-rose-300">
                  Dear {config.recipientName},
                </p>

                <p className="whitespace-pre-wrap break-words text-base leading-8 text-zinc-300">
                  {config.message}
                </p>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-sm text-zinc-500">With love,</p>
                  <p className="mt-2 text-xl font-bold text-rose-300">
                    {config.senderName} ♥
                  </p>
                </div>
              </article>
            )}
          </section>

          {/* PHOTO GALLERY */}
          <section
            id="memories"
            className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:py-28"
          >
            <div className="mb-12 text-center">
              <p className="mb-3 text-[10px] uppercase tracking-[.45em] text-rose-300 sm:text-xs">
                Moments worth keeping
              </p>

              <h2 className="text-4xl font-black sm:text-6xl">
                Our <span className="text-red-500">Memories.</span>
              </h2>

              <p className="mt-4 text-sm text-zinc-500">
                Every picture holds a little story.
              </p>
            </div>

            {config.photos.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {config.photos.map((photo, index) => (
                  <article
                    key={`${index}-${photo.slice(0, 35)}`}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950"
                  >
                    <img
                      src={photo}
                      alt={`Memory ${index + 1}`}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="flex items-center justify-between gap-2 px-4 py-3">
                      <p className="text-sm text-zinc-400">
                        Memory {index + 1} ♥
                      </p>

                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="text-xs text-zinc-600 transition hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-zinc-500">
                Add your first memory using the button below.
              </p>
            )}

            <div className="mt-8 flex justify-center">
              <label className="cursor-pointer rounded-full border border-white/15 px-6 py-3 text-sm font-semibold transition hover:border-red-500 hover:bg-red-950/30">
                + Add a photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </section>

          {/* YOUTUBE MUSIC */}
          <section
            id="music"
            className="mx-auto max-w-4xl scroll-mt-24 px-5 py-20 sm:py-28"
          >
            <div className="glass-panel rounded-[2rem] p-6 text-center sm:p-10">
              <div className="float-heart mb-5 text-5xl text-red-500">♫</div>

              <p className="mb-3 text-[10px] uppercase tracking-[.45em] text-rose-300 sm:text-xs">
                The soundtrack of this moment
              </p>

              <h2 className="text-3xl font-black sm:text-5xl">
                Our Special <span className="text-red-500">Song.</span>
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-zinc-400">
                A song to make this moment even more special.
                Add your YouTube link in Settings.
              </p>

              {youtubeId ? (
                <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <iframe
                    key={`${youtubeId}-${musicRequested ? "play" : "idle"}`}
                    title="Our special song"
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${musicRequested ? "1" : "0"}&playsinline=1&rel=0`}
                    className="aspect-video w-full"
                    allow="autoplay; encrypted-media; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-dashed border-white/15 px-5 py-10">
                  <p className="text-sm text-zinc-400">
                    Your YouTube song link hasn't been added yet.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSettingsOpen(true)}
                    className="mt-5 rounded-full bg-red-600 px-6 py-3 font-bold transition hover:bg-red-500"
                  >
                    Add YouTube Song +
                  </button>
                </div>
              )}

              {youtubeId && (
                <button
                  type="button"
                  onClick={() => {
                    setMusicRequested(true);
                    setNotice(
                      "If the song does not start automatically, press Play inside the YouTube player."
                    );
                  }}
                  className="mt-6 rounded-full bg-red-600 px-7 py-3 font-bold transition hover:bg-red-500"
                >
                  ▶ Play Our Song
                </button>
              )}

              <p className="mt-5 text-xs leading-6 text-zinc-600">
                Some browsers block autoplay with sound. If that happens,
                press Play inside the YouTube player once.
              </p>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-white/5 px-5 py-10 text-center">
            <p className="text-sm text-zinc-500">
              Made with <span className="text-red-500">♥</span> and a little
              bit of magic.
            </p>

            <p className="mt-3 text-sm font-semibold text-zinc-400">
              Developed By{" "}
              <span className="text-red-400">PeterMedhat</span>
            </p>

            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="mt-4 text-xs text-zinc-600 transition hover:text-zinc-300"
            >
              Website Settings
            </button>
          </footer>

          {/* SETTINGS */}
          {settingsOpen && (
            <div
              className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/85 p-4 py-8 backdrop-blur-md"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setSettingsOpen(false);
                }
              }}
            >
              <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#101010] p-6 shadow-2xl sm:p-8">
                <div className="mb-7 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[.35em] text-rose-300">
                      Make it yours
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      Settings ⚙
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSettingsOpen(false)}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm hover:border-red-500"
                  >
                    Close ✕
                  </button>
                </div>

                <div className="space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm text-zinc-400">
                      Recipient name
                    </span>
                    <input
                      value={config.recipientName}
                      onChange={(event) =>
                        updateConfig("recipientName", event.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-red-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-zinc-400">
                      Sender name
                    </span>
                    <input
                      value={config.senderName}
                      onChange={(event) =>
                        updateConfig("senderName", event.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-red-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-zinc-400">
                      Login password
                    </span>
                    <input
                      value={config.password}
                      onChange={(event) =>
                        updateConfig("password", event.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-red-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-zinc-400">
                      Your letter
                    </span>
                    <textarea
                      rows={8}
                      value={config.message}
                      onChange={(event) =>
                        updateConfig("message", event.target.value)
                      }
                      className="w-full resize-y rounded-xl border border-white/10 bg-black px-4 py-3 leading-7 outline-none focus:border-red-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-zinc-400">
                      YouTube song URL
                    </span>

                    <input
                      type="url"
                      value={config.musicUrl}
                      onChange={(event) =>
                        updateConfig("musicUrl", event.target.value)
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-red-500"
                    />

                    <p className="mt-2 text-xs leading-5 text-zinc-600">
                      Paste the full YouTube link. Watch links, youtu.be,
                      Shorts, and embed links are supported.
                    </p>

                    {config.musicUrl.trim() && !youtubeId && (
                      <p className="mt-2 text-sm text-red-400">
                        This doesn't look like a valid YouTube video URL.
                      </p>
                    )}

                    {youtubeId && (
                      <p className="mt-2 text-sm text-emerald-400">
                        YouTube link recognized ✓
                      </p>
                    )}
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-zinc-400">
                      Add a photo
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-full file:border-0 file:bg-red-600 file:px-4 file:py-2 file:font-bold file:text-white"
                    />

                    <p className="mt-2 text-xs text-zinc-600">
                      Images must be 1 MB or smaller to help them fit
                      in browser storage.
                    </p>
                  </label>

                  <div className="flex flex-wrap gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        const reset = { ...DEFAULT_CONFIG };

                        setConfig(reset);
                        setMusicRequested(false);

                        try {
                          localStorage.setItem(
                            STORAGE_KEY,
                            JSON.stringify(reset)
                          );
                        } catch {
                          // State is reset for this session.
                        }

                        setNotice("Default settings restored.");
                      }}
                      className="rounded-full border border-white/10 px-5 py-3 text-sm transition hover:border-red-500"
                    >
                      Reset settings
                    </button>

                    <button
                      type="button"
                      onClick={saveAndCloseSettings}
                      className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold transition hover:bg-red-500"
                    >
                      Save Settings ✓
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </>
      )}

      {/* NOTIFICATIONS */}
      {notice && (
        <div
          role="status"
          className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-lg rounded-2xl border border-white/10 bg-zinc-950 px-5 py-4 text-center text-sm text-zinc-200 shadow-2xl"
        >
          <div className="flex items-center justify-between gap-4">
            <span>{notice}</span>

            <button
              type="button"
              onClick={() => setNotice("")}
              className="shrink-0 text-zinc-500 hover:text-white"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
