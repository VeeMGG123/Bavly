
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";

type SiteConfig = {
  recipientName: string;
  senderName: string;
  message: string;
  musicUrl: string;
};

type GalleryPhoto = {
  id: string;
  url: string;
  storagePath: string | null;
};

const VISITOR_PASSWORD = "29/6/2026";
const ADMIN_USER_ID = "5b382fac-5ee4-4cb3-a67c-1249ee840843";

const DEFAULT_CONFIG: SiteConfig = {
  recipientName: "Maroska",
  senderName: "Bavly",
  message: `Dear Maroska,

I made this little place just for you, to remind you how special you are to me.

Some people make ordinary moments unforgettable, and you are one of those people. I hope this little surprise brings a smile to your face and reminds you that you are appreciated more than words can explain.

Thank you for the beautiful memories and for being the person you are.

With love, always,
Bavly ❤️`,
  musicUrl: "",
};

function getYouTubeId(value: string) {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.replace(/^www\./, "");
    let id = "";

    if (host === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (
      [
        "youtube.com",
        "m.youtube.com",
        "music.youtube.com",
        "youtube-nocookie.com",
      ].includes(host)
    ) {
      if (url.pathname === "/watch") {
        id = url.searchParams.get("v") ?? "";
      } else {
        id =
          url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ?? "";
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : "";
  } catch {
    return "";
  }
}

function errorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const item = error as {
      message?: string;
      code?: string;
      details?: string;
      hint?: string;
    };

    return [
      item.message,
      item.code ? `Code: ${item.code}` : "",
      item.details ? `Details: ${item.details}` : "",
      item.hint ? `Hint: ${item.hint}` : "",
    ]
      .filter(Boolean)
      .join(" | ");
  }

  return String(error);
}

export default function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [draft, setDraft] = useState(DEFAULT_CONFIG);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [stage, setStage] = useState<"login" | "intro" | "site">("login");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [letterOpen, setLetterOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminBusy, setAdminBusy] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [musicRequested, setMusicRequested] = useState(false);

  const isAdmin = session?.user?.id === ADMIN_USER_ID;
  const youtubeId = getYouTubeId(config.musicUrl);

  useEffect(() => {
    const client = supabase;

    if (!client) {
      setNotice(
        "Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
      );
      setLoadingData(false);
      return;
    }

    let active = true;

    async function loadRemoteData() {
      try {
        // Read settings independently so the actual failing query is visible.
        const { data: settings, error: settingsError } = await client
          .from("site_settings")
          .select("id,recipient_name,sender_name,message,music_url")
          .eq("id", 1)
          .maybeSingle();

        if (settingsError) {
          console.error("Supabase site_settings error:", settingsError);
          throw new Error(
            `site_settings: ${errorMessage(settingsError)}`
          );
        }

        const { data: gallery, error: galleryError } = await client
          .from("gallery_images")
          .select("id,image_url,storage_path,sort_order,created_at")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (galleryError) {
          console.error("Supabase gallery_images error:", galleryError);
          throw new Error(
            `gallery_images: ${errorMessage(galleryError)}`
          );
        }

        if (!active) return;

        if (settings) {
          setConfig({
            recipientName:
              settings.recipient_name || DEFAULT_CONFIG.recipientName,
            senderName: settings.sender_name || DEFAULT_CONFIG.senderName,
            message: settings.message || DEFAULT_CONFIG.message,
            musicUrl: settings.music_url || "",
          });
        } else {
          console.warn(
            "No site_settings row with id = 1. Using default content."
          );
        }

        setPhotos(
          (gallery ?? []).map((photo) => ({
            id: photo.id,
            url: photo.image_url,
            storagePath: photo.storage_path ?? null,
          }))
        );
      } catch (error) {
        console.error("Could not load Supabase content:", error);

        if (active) {
          setNotice(`Supabase error: ${errorMessage(error)}`);
        }
      } finally {
        if (active) setLoadingData(false);
      }
    }

    void client.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) console.error("Session error:", error);
        if (active) setSession(data?.session ?? null);
      })
      .catch((error) => console.error("Session error:", error));

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (active) setSession(nextSession);
    });

    void loadRemoteData();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setDraft(config);
  }, [config]);

  function updateDraft<K extends keyof SiteConfig>(
    key: K,
    value: SiteConfig[K]
  ) {
    setDraft((previous) => ({ ...previous, [key]: value }));
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (passwordInput === VISITOR_PASSWORD) {
      setPasswordError("");
      setStage("intro");
    } else {
      setPasswordError("Wrong password. Try again ❤️");
    }
  }

  async function handleAdminLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setNotice("Supabase is not configured.");
      return;
    }

    setAdminBusy(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail.trim(),
        password: adminPassword,
      });

      if (error) throw error;

      if (data.user?.id !== ADMIN_USER_ID) {
        await supabase.auth.signOut();
        setNotice("This account is not authorized to manage this website.");
        return;
      }

      setAdminPassword("");
      setNotice("Admin signed in ❤️");
    } catch (error) {
      console.error("Admin login error:", error);
      setNotice(`Admin login failed: ${errorMessage(error)}`);
    } finally {
      setAdminBusy(false);
    }
  }

  async function handleAdminLogout() {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      setNotice(`Couldn't sign out: ${error.message}`);
    } else {
      setNotice("Admin signed out.");
    }
  }

  async function saveAndCloseSettings() {
    if (!supabase || !isAdmin) {
      setNotice("Only the authorized admin can save changes.");
      return;
    }

    if (draft.musicUrl.trim() && !getYouTubeId(draft.musicUrl)) {
      setNotice("Please enter a valid YouTube video URL.");
      return;
    }

    setSaving(true);

    try {
      const values = {
        recipient_name:
          draft.recipientName.trim() || DEFAULT_CONFIG.recipientName,
        sender_name: draft.senderName.trim() || DEFAULT_CONFIG.senderName,
        message: draft.message,
        music_url: draft.musicUrl.trim(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("site_settings")
        .update(values)
        .eq("id", 1)
        .select("id")
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        throw new Error(
          "No settings row with id = 1 was updated. Check that the row exists and the admin UPDATE policy allows it."
        );
      }

      const nextConfig: SiteConfig = {
        recipientName: values.recipient_name,
        senderName: values.sender_name,
        message: values.message,
        musicUrl: values.music_url,
      };

      setConfig(nextConfig);
      setDraft(nextConfig);
      setNotice("Settings saved for everyone ❤️");
      setSettingsOpen(false);
    } catch (error) {
      console.error("Settings save error:", error);
      setNotice(`Couldn't save settings: ${errorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    if (!supabase || !isAdmin) {
      setNotice("Sign in as the authorized admin before adding photos.");
      input.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setNotice("Please select an image.");
      input.value = "";
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setNotice("Choose an image smaller than 8 MB.");
      input.value = "";
      return;
    }

    setUploading(true);
    setNotice("Uploading photo…");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const storagePath =
      `${Date.now()}-${crypto.randomUUID()}-${safeName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("love-gallery")
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Storage upload: ${errorMessage(uploadError)}`);
      }

      const { data: publicData } = supabase.storage
        .from("love-gallery")
        .getPublicUrl(storagePath);

      const { data: row, error: insertError } = await supabase
        .from("gallery_images")
        .insert({
          image_url: publicData.publicUrl,
          image_name: file.name,
          storage_path: storagePath,
          sort_order: photos.length,
        })
        .select("id,image_url,storage_path")
        .single();

      if (insertError) {
        await supabase.storage
          .from("love-gallery")
          .remove([storagePath]);

        throw new Error(
          `Gallery database insert: ${errorMessage(insertError)}`
        );
      }

      setPhotos((previous) => [
        ...previous,
        {
          id: row.id,
          url: row.image_url,
          storagePath: row.storage_path ?? null,
        },
      ]);

      setNotice("Photo saved for everyone ❤️");
    } catch (error) {
      console.error("Photo upload error:", error);
      setNotice(`Photo upload failed: ${errorMessage(error)}`);
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  async function removePhoto(photo: GalleryPhoto) {
    if (!supabase || !isAdmin) {
      setNotice("Only the authorized admin can remove photos.");
      return;
    }

    try {
      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", photo.id);

      if (error) throw error;

      setPhotos((previous) =>
        previous.filter((item) => item.id !== photo.id)
      );

      if (photo.storagePath) {
        const { error: storageError } = await supabase.storage
          .from("love-gallery")
          .remove([photo.storagePath]);

        if (storageError) {
          console.error("Storage cleanup error:", storageError);
          setNotice(
            "The photo was removed from the gallery, but its storage file could not be deleted."
          );
          return;
        }
      }

      setNotice("Photo removed.");
    } catch (error) {
      console.error("Photo delete error:", error);
      setNotice(`Couldn't remove the photo: ${errorMessage(error)}`);
    }
  }

  function openMusic() {
    if (!youtubeId) {
      setSettingsOpen(true);
      setNotice("Add your YouTube song link in Settings first.");
      return;
    }

    document
      .getElementById("music")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function enterWebsite() {
    setStage("site");
    setMusicRequested(Boolean(youtubeId));

    window.setTimeout(() => {
      document
        .getElementById("home")
        ?.scrollIntoView({ behavior: "smooth" });
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
          0% { opacity: 0; transform: translate(var(--start-x),var(--start-y)) scale(.3) rotate(-15deg); filter: blur(5px); }
          55% { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translate(0,0) scale(1) rotate(0); filter: blur(0); }
        }
        @keyframes heartGlow {
          0%,100% { filter: drop-shadow(0 0 5px rgba(239,68,68,.15)); }
          50% { filter: drop-shadow(0 0 20px rgba(239,68,68,.75)); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(25px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes floating {
          0%,100% { transform:translateY(0); }
          50% { transform:translateY(-9px); }
        }
        .heart-glow { animation:heartGlow 2.4s ease-in-out infinite; }
        .intro-word { opacity:0; animation:heartWord 1.1s cubic-bezier(.2,.8,.2,1) forwards; animation-delay:var(--delay); }
        .fade-up { animation:fadeUp .8s ease-out both; }
        .float-heart { animation:floating 3s ease-in-out infinite; }
        .glass-panel { background:linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.012)); border:1px solid rgba(255,255,255,.09); backdrop-filter:blur(16px); }
        .love-gradient { background:linear-gradient(100deg,#fff 15%,#fb7185 48%,#dc2626 75%,#fff 100%); background-size:220% auto; color:transparent; background-clip:text; animation:loveShine 4s linear infinite; }
        @keyframes loveShine { to { background-position:220% center; } }
        @media (prefers-reduced-motion:reduce) {
          .intro-word,.heart-glow,.fade-up,.float-heart,.love-gradient {
            animation-duration:.01ms!important;
            animation-iteration-count:1!important;
          }
        }
      `}</style>

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
              There&apos;s something special waiting for you. Enter our special
              date to unlock it.
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

            <p className="mt-8 text-xs text-zinc-500">
              Made With Love By Bavly
            </p>
          </form>
        </section>
      )}

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
                    const delay = (rowIndex * 12 + colIndex) * 0.045;

                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="flex h-5 w-5 items-center justify-center sm:h-8 sm:w-8"
                      >
                        {cell === "1" && (
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
          </div>
        </section>
      )}

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
                A little universe of memories, words, and moments, created
                especially for {config.recipientName}.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("letter")
                      ?.scrollIntoView({ behavior: "smooth" })
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

            {photos.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {photos.map((photo, index) => (
                  <article
                    key={photo.id}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950"
                  >
                    <img
                      src={photo.url}
                      alt={`Memory ${index + 1}`}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.style.opacity = "0.35";
                      }}
                    />
                    <div className="flex items-center justify-between gap-2 px-4 py-3">
                      <p className="text-sm text-zinc-400">
                        Memory {index + 1} ♥
                      </p>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => void removePhoto(photo)}
                          className="text-xs text-zinc-600 transition hover:text-red-400"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-zinc-500">
                No memories added yet.
              </p>
            )}

            {isAdmin && (
              <div className="mt-8 flex justify-center">
                <label
                  className={`cursor-pointer rounded-full border border-white/15 px-6 py-3 text-sm font-semibold transition hover:border-red-500 hover:bg-red-950/30 ${
                    uploading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  {uploading ? "Uploading…" : "+ Add a photo"}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(event) => void handlePhotoUpload(event)}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {!isAdmin && (
              <p className="mt-6 text-center text-xs text-zinc-600">
                Memories are lovingly kept here.
              </p>
            )}
          </section>

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
              </p>

              {youtubeId ? (
                <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <iframe
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
                    Your YouTube song link hasn&apos;t been added yet.
                  </p>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setSettingsOpen(true)}
                      className="mt-5 rounded-full bg-red-600 px-6 py-3 font-bold transition hover:bg-red-500"
                    >
                      Add YouTube Song +
                    </button>
                  )}
                </div>
              )}

              {youtubeId && (
                <button
                  type="button"
                  onClick={() => {
                    setMusicRequested(true);
                    setNotice(
                      "If the song doesn't start automatically, press Play inside the YouTube player."
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

          <footer className="border-t border-white/5 px-5 py-10 text-center">
            <p className="text-sm text-zinc-500">
              Made with <span className="text-red-500">♥</span> and a little
              bit of magic.
            </p>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="mt-4 text-xs text-zinc-600 transition hover:text-zinc-300"
            >
              Website Settings
            </button>
          </footer>

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
                      Private admin area
                    </p>
                    <h2 className="mt-2 text-2xl font-black">Settings ⚙</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(false)}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm hover:border-red-500"
                  >
                    Close ✕
                  </button>
                </div>

                {!isAdmin ? (
                  <>
                    <p className="mb-5 text-sm leading-6 text-zinc-400">
                      Sign in with your Supabase admin account to edit the
                      message, song, and shared gallery. Visitors do not need
                      this login to open the website.
                    </p>

                    <form
                      onSubmit={(event) => void handleAdminLogin(event)}
                      className="space-y-4"
                    >
                      <label className="block">
                        <span className="mb-2 block text-sm text-zinc-400">
                          Admin email
                        </span>
                        <input
                          type="email"
                          value={adminEmail}
                          onChange={(event) =>
                            setAdminEmail(event.target.value)
                          }
                          autoComplete="username"
                          required
                          className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-red-500"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm text-zinc-400">
                          Admin password
                        </span>
                        <input
                          type="password"
                          value={adminPassword}
                          onChange={(event) =>
                            setAdminPassword(event.target.value)
                          }
                          autoComplete="current-password"
                          required
                          className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-red-500"
                        />
                      </label>

                      <button
                        disabled={adminBusy}
                        type="submit"
                        className="w-full rounded-full bg-red-600 px-6 py-3 font-bold transition hover:bg-red-500 disabled:opacity-50"
                      >
                        {adminBusy ? "Signing in…" : "Admin Sign In"}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <p className="mb-5 text-sm text-emerald-400">
                      Admin signed in ✓ Changes you save are shared with
                      everyone.
                    </p>

                    <div className="space-y-5">
                      <label className="block">
                        <span className="mb-2 block text-sm text-zinc-400">
                          Recipient name
                        </span>
                        <input
                          value={draft.recipientName}
                          onChange={(event) =>
                            updateDraft("recipientName", event.target.value)
                          }
                          className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-red-500"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm text-zinc-400">
                          Sender name
                        </span>
                        <input
                          value={draft.senderName}
                          onChange={(event) =>
                            updateDraft("senderName", event.target.value)
                          }
                          className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-red-500"
                        />
                      </label>

                      <div className="rounded-xl border border-white/10 bg-black/50 px-4 py-3">
                        <p className="text-sm text-zinc-400">
                          Website password
                        </p>
                        <p className="mt-1 font-mono text-rose-300">
                          29/6/2026
                        </p>
                        <p className="mt-2 text-xs text-zinc-600">
                          The visitor password is fixed and cannot be changed
                          here.
                        </p>
                      </div>

                      <label className="block">
                        <span className="mb-2 block text-sm text-zinc-400">
                          Your letter
                        </span>
                        <textarea
                          rows={8}
                          value={draft.message}
                          onChange={(event) =>
                            updateDraft("message", event.target.value)
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
                          value={draft.musicUrl}
                          onChange={(event) =>
                            updateDraft("musicUrl", event.target.value)
                          }
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-red-500"
                        />
                        <p className="mt-2 text-xs leading-5 text-zinc-600">
                          Watch, youtu.be, Shorts, and embed links are
                          supported.
                        </p>
                        {draft.musicUrl.trim() &&
                          !getYouTubeId(draft.musicUrl) && (
                            <p className="mt-2 text-sm text-red-400">
                              This doesn&apos;t look like a valid YouTube video
                              URL.
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
                          disabled={uploading}
                          onChange={(event) =>
                            void handlePhotoUpload(event)
                          }
                          className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-full file:border-0 file:bg-red-600 file:px-4 file:py-2 file:font-bold file:text-white"
                        />
                        <p className="mt-2 text-xs text-zinc-600">
                          Images up to 8 MB. Photos are stored online for
                          everyone.
                        </p>
                      </label>

                      <div className="flex flex-wrap gap-3 pt-3">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => void saveAndCloseSettings()}
                          className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold transition hover:bg-red-500 disabled:opacity-50"
                        >
                          {saving ? "Saving…" : "Save Settings ✓"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleAdminLogout()}
                          className="rounded-full border border-white/10 px-5 py-3 text-sm transition hover:border-red-500"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </section>
            </div>
          )}
        </>
      )}

      {notice && (
        <div
          role="status"
          className="fixed bottom-8 left-4 right-4 z-[60] mx-auto max-w-lg rounded-2xl border border-white/10 bg-zinc-950 px-5 py-4 text-center text-sm text-zinc-200 shadow-2xl"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="break-words text-left">{notice}</span>
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

      <div className="pointer-events-none fixed bottom-2 left-0 right-0 z-[70] text-center text-[10px] font-medium tracking-wide text-zinc-600">
        Developed By Peter Medhat
      </div>

      {loadingData && (
        <div className="pointer-events-none fixed left-3 top-3 z-[80] rounded-full border border-white/10 bg-black/80 px-3 py-1 text-[10px] text-zinc-500">
          Loading saved content…
        </div>
      )}
    </main>
  );
}
