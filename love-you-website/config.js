/**
 * ====================================================================
 * LOVE YOU — Romantic Surprise Website Configuration
 * ====================================================================
 * Developed By Peter Medhat
 * 
 * INSTRUCTIONS:
 * Customize this website by changing the values below.
 * Everything inside quotation marks "..." can be edited.
 * 
 * ⚠️ NOTE ON PASSWORD SECURITY:
 * This website is a personal romantic surprise for someone special,
 * not a high-security banking system. The secret password is visible
 * in this file to anyone inspecting the source code.
 * ====================================================================
 */

window.CONFIG = {
  // ------------------------------------------------------------------
  // 1. SECRET LOGIN PASSWORD
  // Change "forever" to any secret word or date you share (e.g. "love", "honey", "2024")
  // ------------------------------------------------------------------
  password: "forever",

  // ------------------------------------------------------------------
  // 2. NAMES & HEADERS
  // ------------------------------------------------------------------
  recipientName: "Maroska",
  senderName: "Bavly",
  websiteLogo: "little love note ♥",
  headerSubtitle: "Every moment with you is my favorite memory.",

  // ------------------------------------------------------------------
  // 3. HERO & ENVELOPE SECTION
  // ------------------------------------------------------------------
  heroTag: "OPEN WHEN YOU'RE READY",
  heroHeading: "A little note. A lot of love.",
  heroSubtitle: "Click the sealed envelope below to uncover what my heart has been holding.",

  /**
   * ENVELOPE IMAGE:
   * You can use a local file from the images folder (e.g., "images/envelope.jpg")
   * or paste any direct web image URL (e.g., "https://images.unsplash.com/...").
   */
  envelopeImage: "images/envelope.jpg",

  // ------------------------------------------------------------------
  // 4. ROMANTIC LOVE LETTER
  // Write your heartfelt message here. 
  // Line breaks and paragraphs are preserved.
  // Special characters, emojis, and Arabic text are fully supported!
  // ------------------------------------------------------------------
  letterHeading: "A note for you",
  letterDate: "October 13, 2026",
  loveLetter: `Dear Maroska, ❤️

I just want you to know how much you mean to me. I love you so much, but in a sisterly way, like you're my own sister. 🫶🏻❤️ You're not just a friend to me; you're family, someone I genuinely care about and never want to lose.

I'm so grateful to have you in my life, and I hope you always know that you can count on me whenever you need someone. No matter what happens, I'll always be here for you, supporting you, listening to you, and wishing the best for you.

You have a special place in my heart, and I'm really lucky to have someone like you in my life. I hope our bond always stays strong, because you're more than just a friend to me; you're a sister I'll always cherish. 🥹💗♾️`,

  letterSignature: "With love,\nBavly ❤️",

  // ------------------------------------------------------------------
  // 5. OUR MEMORIES PHOTO GALLERY
  // Add as many photos as you wish!
  // You can use files in the "images/" folder or paste full image URLs.
  // ------------------------------------------------------------------
  galleryTitle: "Our memories ♥",
  gallerySubtitle: "Snapshots of the moments that stole my heart forever.",
  photos: [
    {
      url: "images/photo1.jpg",
      caption: "ذكريات طفولتنا الجميلة وبركة زمان 🤍"
    },
    {
      url: "images/photo2.jpg",
      caption: "ضحكتك السكر من وإنتي صغيرة يا أحلى أخت 🌸"
    },
    {
      url: "images/photo3.jpg",
      caption: "سهراتنا ومكالماتنا اللي بالساعات ومابنشبعش كلام 📞🤍"
    },
    {
      url: "images/photo4.jpg",
      caption: "أرنوبتييييي 🐰🥕 أجمل رسمة وذكريات"
    }
  ],

  // ------------------------------------------------------------------
  // 6. OUR LITTLE SOUNDTRACK (YouTube Music Player)
  // Paste any YouTube video or song link here.
  // Supports formats like:
  // - https://www.youtube.com/watch?v=rtOvBOTyX00
  // - https://youtu.be/rtOvBOTyX00
  // ------------------------------------------------------------------
  soundtrackTitle: "Our little soundtrack.",
  soundtrackSubtitle: "Press play to listen to our song while you read.",
  youtubeLink: "https://youtu.be/Pan1Fbez0jE?si=gvjGRoWUGh-v8k96",

  // ------------------------------------------------------------------
  // 7. CINEMATIC INTRO SETTINGS
  // ------------------------------------------------------------------
  introCaption: "Some words are never enough.",
  introDurationMs: 6500, // Duration in milliseconds before smooth transition to main page

  // ------------------------------------------------------------------
  // 8. DEVELOPER CREDIT (DO NOT EDIT)
  // ------------------------------------------------------------------
  developerCredit: "Developed By Peter Medhat"
};
