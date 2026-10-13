
import { useEffect, useState } from "react";

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

function loadConfig(): SiteConfig {
  try {
    const saved = localStorage.getItem("love-you-config");

    if (saved) {
      const parsed = JSON.parse(saved) as Partial<SiteConfig>;

      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        // Support the musicUrl saved by the previous version.
        musicUrl: parsed.musicUrl ?? "",
        photos: Array.isArray(parsed.photos)
          ? parsed.photos
          : DEFAULT_CONFIG.photos,
      };
    }
  } catch {
    // Use default settings.
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
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
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
  const [intro, setIntro] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [letterOpen, setLetterOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const youtubeId = getYouTubeId(config.musicUrl);

  useEffect(() => {
    try {
      localStorage.setItem("love-you-config", JSON.stringify(config));
    } catch {
      setNotice(
        "Some changes could not be saved. The browser may be out of storage."
      );
    }
  }, [config]);

  function updateConfig<K extends keyof SiteConfig>(
    key: K,
    value: SiteConfig[K]
  ) {
    setConfig((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function unlockSite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (passwordInput === config.password) {
      setUnlocked(true);
      setPasswordError("");
      setNotice("");
    } else {
      setPasswordError("That password isn't correct. Try again ❤️");
    }
  }

  function handlePhotoUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = event.target.files;
    if (!files?.length) return;

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      setNotice("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setNotice("Choose an image smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      setConfig((previous) => ({
        ...previous,
        photos: [...previous.photos, reader.result as string],
      }));

      setNotice("Your photo was added to the gallery ❤️");
    };

    reader.onerror = () => {
      setNotice("Could not read that image. Try another one.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function removePhoto(index: number) {
    setConfig((previous) => ({
      ...previous,
      photos: previous.photos.filter((_, i) => i !== index),
    }));
  }

  const heartRows = [
    "0110110",
    "1111111",
    "1111111",
    "0111110",
    "0011100",
    "0001000",
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-white">
      {intro && (
        <section className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-5 text-center">
          <div className="mb-8">
            {heartRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center">
                {row.split("").map((cell, colIndex) => (
                  <span
                    key={colIndex}
                    className="flex h-7 w-7 items-center justify-center text-[9px] font-bold text-red-500 sm:h-10 sm:w-10 sm:text-xs"
                    style={{
                      opacity: cell === "1" ? 1 : 0,
                      animation: "pulse 1.5s infinite",
                      animationDelay: `${(rowIndex + colIndex) * 0.08}s`,
                    }}
                  >
                    LOVE
                  </span>
                ))}
              </div>
            ))}
          </div>

          <p className="mb-3 text-xs uppercase tracking-[0.5em] text-red-400">
            A little surprise for you
          </p>

          <h1 className="mb-8 text-5xl font-black tracking-tight sm:text-7xl">
            LOVE <span className="text-red-600">YOU</span>
            <span className="text-red-500"> ♥</span>
          </h1>

          <button
            onClick={() => setIntro(false)}
            className="rounded-full bg-red-600 px-8 py-4 font-bold transition hover:scale-105 hover:bg-red-500"
          >
            Open My Heart ❤️
          </button>

          <p className="mt-5 text-xs text-zinc-500">
            Made with love, just for you.
          </p>
        </section>
      )}

      {!intro && !unlocked && (
        <section className="flex min-h-screen items-center justify-center px-5 py-12">
          <form
            onSubmit={unlockSite}
            className="w-full max-w-md rounded-3xl border border-red-950 bg-zinc-950 p-8 text-center shadow-2xl shadow-red-950/20 sm:p-10"
          >
            <div className="mb-5 text-6xl">❤️</div>

            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-red-400">
              Just between us
            </p>

            <h1 className="mb-3 text-3xl font-bold">
              A Special Surprise
            </h1>

            <p className="mb-7 text-sm text-zinc-400">
              Enter our special date to continue.
            </p>

            <input
              type="password"
              value={passwordInput}
              onChange={(event) => setPasswordInput(event.target.value)}
              placeholder="Enter the password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-4 outline-none transition focus:border-red-500"
              required
            />

            {passwordError && (
              <p className="mt-3 text-sm text-red-400">
                {passwordError}
              </p>
            )}

            <button
              type="submit"
              className="mt-5 w-full rounded-xl bg-red-600 px-5 py-4 font-bold transition hover:bg-red-500"
            >
              Unlock My Surprise ❤️
            </button>

            <button
              type="button"
              onClick={() => setIntro(true)}
              className="mt-5 text-sm text-zinc-500 hover:text-white"
            >
              Back to intro
            </button>
          </form>
        </section>
      )}

      {!intro && unlocked && (
        <>
          <header className="relative px-5 pb-16 pt-8 sm:pb-24 sm:pt-10">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
              <a href="#home" className="text-xl font-black tracking-tight">
                LOVE<span className="text-red-500">YOU.</span>
              </a>

              <button
                onClick={() => setSettingsOpen(true)}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm transition hover:border-red-500"
              >
                ⚙ Settings
              </button>
            </div>

            <div
              id="home"
              className="mx-auto max-w-4xl pt-20 text-center sm:pt-28"
            >
              <p className="mb-5 text-xs uppercase tracking-[0.5em] text-red-400 sm:text-sm">
                Made with all my heart
              </p>

              <h1 className="text-5xl font-black leading-tight sm:text-8xl">
                For{" "}
                <span className="text-red-500">
                  {config.recipientName}
                </span>
                <span className="text-red-500">.</span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-zinc-400 sm:text-lg">
                A little corner of the internet, made to keep some
                beautiful memories close.
              </p>

              <button
                onClick={() =>
                  document
                    .getElementById("letter")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-8 rounded-full bg-red-600 px-7 py-3 font-bold transition hover:bg-red-500"
              >
                Read your letter ↓
              </button>
            </div>

            <div className="pointer-events-none absolute left-[-70px] top-40 h-48 w-48 rounded-full bg-red-600/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-[-50px] h-56 w-56 rounded-full bg-red-600/10 blur-3xl" />
          </header>

          <section
            id="letter"
            className="mx-auto max-w-4xl px-5 py-16 text-center sm:py-24"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-red-400">
              A message from the heart
            </p>

            <h2 className="mb-10 text-3xl font-bold sm:text-5xl">
              Your <span className="text-red-500">Letter</span>
            </h2>

            <button
              type="button"
              onClick={() => setLetterOpen((previous) => !previous)}
              aria-expanded={letterOpen}
              className="group mx-auto flex flex-col items-center"
            >
              <span className="text-8xl transition duration-300 group-hover:scale-110 sm:text-9xl">
                {letterOpen ? "💌" : "✉️"}
              </span>

              <span className="mt-5 rounded-full border border-red-900 px-5 py-2 text-sm text-red-300 transition group-hover:bg-red-950">
                {letterOpen
                  ? "Close the letter ↑"
                  : "Tap to open the letter"}
              </span>
            </button>

            {letterOpen && (
              <article className="mx-auto mt-10 max-w-2xl rounded-3xl border border-red-950 bg-[#111111] p-6 text-left shadow-2xl shadow-red-950/10 sm:p-10">
                <p className="mb-6 text-2xl font-bold text-red-400">
                  Dear {config.recipientName},
                </p>

                <p className="whitespace-pre-wrap break-words text-base leading-8 text-zinc-300">
                  {config.message}
                </p>

                <div className="mt-8 border-t border-zinc-800 pt-6">
                  <p className="text-sm text-zinc-500">With love,</p>
                  <p className="mt-2 text-xl font-bold text-red-400">
                    {config.senderName} ❤️
                  </p>
                </div>
              </article>
            )}
          </section>

          <section
            id="memories"
            className="mx-auto max-w-6xl px-5 py-16 sm:py-24"
          >
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs uppercase tracking-[0.4em] text-red-400">
                Little moments, big feelings
              </p>

              <h2 className="text-3xl font-bold sm:text-5xl">
                Our <span className="text-red-500">Memories</span>
              </h2>

              <p className="mt-4 text-zinc-500">
                Every picture holds a little story.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {config.photos.map((photo, index) => (
                <article
                  key={`${photo}-${index}`}
                  className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
                >
                  <img
                    src={photo}
                    alt={`Memory ${index + 1}`}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />

                  <div className="flex items-center justify-between px-4 py-3">
                    <p className="text-sm text-zinc-400">
                      Memory {index + 1} ❤️
                    </p>

                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="text-xs text-zinc-600 transition hover:text-red-400"
                      aria-label={`Remove memory ${index + 1}`}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <label className="cursor-pointer rounded-full border border-zinc-700 px-6 py-3 text-sm font-bold transition hover:border-red-500 hover:bg-red-950/30">
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

          <section
            id="music"
            className="mx-auto max-w-3xl px-5 py-16 text-center"
          >
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 px-5 py-10 sm:px-10 sm:py-14">
              <div className="mb-5 text-5xl">🎵</div>

              <p className="mb-3 text-xs uppercase tracking-[0.4em] text-red-400">
                A song for this moment
              </p>

              <h2 className="text-2xl font-bold sm:text-4xl">
                Our Special Song
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-zinc-500">
                Your favorite song, straight from YouTube. Press play
                whenever you're ready.
              </p>

              {youtubeId ? (
                <div className="mt-7 overflow-hidden rounded-2xl border border-zinc-800 bg-black">
                  <iframe
                    key={youtubeId}
                    title="Our special song on YouTube"
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?playsinline=1&rel=0`}
                    className="aspect-video w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="mt-7 rounded-2xl border border-dashed border-zinc-700 px-5 py-8">
                  <p className="text-zinc-400">
                    Add your YouTube song link in Settings.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSettingsOpen(true)}
                    className="mt-5 rounded-full bg-red-600 px-6 py-3 font-bold transition hover:bg-red-500"
                  >
                    Add YouTube Link 🎵
                  </button>
                </div>
              )}

              <p className="mt-4 text-xs leading-6 text-zinc-600">
                If the video doesn't play, check that the video allows
                embedding on other websites.
              </p>
            </div>
          </section>

          <footer className="border-t border-zinc-900 px-5 py-8 text-center">
            <p className="text-sm text-zinc-500">
              Made with <span className="text-red-500">♥</span> and a little
              bit of magic.
            </p>

            <p className="mt-3 text-sm font-semibold text-zinc-400">
              Developed By <span className="text-red-400">PeterMedhat</span>
            </p>

            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="mt-4 text-xs text-zinc-700 hover:text-zinc-400"
            >
              Settings
            </button>
          </footer>

          {settingsOpen && (
            <div
              className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/80 p-4 py-8 backdrop-blur-sm"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setSettingsOpen(false);
                }
              }}
            >
              <section className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-[#101010] p-6 shadow-2xl sm:p-8">
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-red-400">
                      Personalize your page
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">
                      Settings ⚙
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSettingsOpen(false)}
                    className="rounded-full border border-zinc-700 px-3 py-2 text-sm hover:border-red-500"
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
                      className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-red-500"
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
                      className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-red-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-zinc-400">
                      Website password
                    </span>
                    <input
                      value={config.password}
                      onChange={(event) =>
                        updateConfig("password", event.target.value)
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-red-500"
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
                      className="w-full resize-y rounded-xl border border-zinc-700 bg-black px-4 py-3 leading-7 outline-none focus:border-red-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-zinc-400">
                      YouTube song link
                    </span>
                    <input
                      type="url"
                      value={config.musicUrl}
                      onChange={(event) =>
                        updateConfig("musicUrl", event.target.value)
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-red-500"
                    />

                    <p className="mt-2 text-xs leading-5 text-zinc-600">
                      Paste a YouTube video link, youtu.be link, Shorts
                      link, or embed link. The song player appears in
                      the Music section.
                    </p>

                    {config.musicUrl.trim() && !youtubeId && (
                      <p className="mt-2 text-sm text-red-400">
                        This link doesn't look like a valid YouTube video
                        link. Check it and try again.
                      </p>
                    )}

                    {youtubeId && (
                      <p className="mt-2 text-sm text-green-400">
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
                      Images must be 2 MB or smaller. Uploaded photos
                      are saved in this browser.
                    </p>
                  </label>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setConfig(DEFAULT_CONFIG);
                        setNotice("Default settings restored.");
                      }}
                      className="rounded-full border border-zinc-700 px-5 py-3 text-sm hover:border-red-500"
                    >
                      Reset settings
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSettingsOpen(false);
                        setNotice("Settings saved in this browser ❤️");
                      }}
                      className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold hover:bg-red-500"
                    >
                      Done ✓
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </>
      )}

      {notice && (
        <div
          role="status"
          className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-lg rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-center text-sm text-zinc-200 shadow-2xl"
        >
          <div className="flex items-center justify-between gap-4">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="text-zinc-500 hover:text-white"
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
