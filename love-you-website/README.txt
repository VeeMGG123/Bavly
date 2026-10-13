====================================================================
LOVE YOU — Romantic Surprise Website
====================================================================
Developed By Peter Medhat

Thank you for choosing this romantic surprise website!
Everything is designed to be elegant, cinematic, emotional, and 100%
customizable without any coding knowledge.

No Node.js, npm, or servers are needed. You can run this website 
directly in your browser.

====================================================================
TABLE OF CONTENTS
====================================================================
1. How to Extract and Open the Website
2. How to Change the Secret Login Password
3. How to Edit the Romantic Love Letter
4. How to Add Your Own Photos
5. How to Change the Envelope Image
6. How to Add Your Favorite YouTube Song
7. Understanding the Cinematic Intro Animation
8. Troubleshooting & Common Questions
9. Developer Information

====================================================================
1. HOW TO EXTRACT AND OPEN THE WEBSITE
====================================================================
1. If you received a .ZIP file, right-click it and choose:
   - On Windows: "Extract All..."
   - On Mac: Double-click to unzip
2. Open the unzipped folder ("love-you-website").
3. Double-click "index.html" to open the website in Google Chrome,
   Safari, Microsoft Edge, or Firefox.
4. That's it! The website runs immediately offline or online.

====================================================================
2. HOW TO CHANGE THE SECRET LOGIN PASSWORD
====================================================================
1. Open "config.js" in any text editor (Notepad, VS Code, or TextEdit).
2. Look for Section 1:
   password: "forever",
3. Replace "forever" with your secret word, nickname, anniversary,
   or special date (e.g., "mylove", "sweetheart", "2024").
4. Save the file (Ctrl+S or Cmd+S) and refresh "index.html" in your browser.

* Note: This website is created as a romantic surprise gift. The password
  is stored inside config.js for convenience so it runs without a database.

====================================================================
3. HOW TO EDIT THE ROMANTIC LOVE LETTER
====================================================================
1. In "config.js", look for Section 4:
   letterHeading: "A note for you",
   loveLetter: `...your text here...`,
   letterSignature: "Forever and always yours,\nWith all my love ♥"
2. Write whatever your heart feels!
   - You can write multiple paragraphs.
   - Line breaks and empty lines are preserved automatically.
   - Special characters, emojis (♥, 🌹, ✨), and Arabic text (e.g. أحبك)
     are fully supported.
3. Save the file and refresh "index.html".

====================================================================
4. HOW TO ADD YOUR OWN PHOTOS
====================================================================
1. Copy your personal photos into the "images" folder.
   - Recommended names: photo1.jpg, photo2.jpg, photo3.jpg, photo4.jpg
   - Formats supported: .jpg, .jpeg, .png, .webp
2. In "config.js", look for Section 5: "photos: [...]"
3. Update the captions and file paths, or add new ones:
   photos: [
     {
       url: "images/photo1.jpg",
       caption: "Our first trip to the beach"
     },
     {
       url: "images/photo2.jpg",
       caption: "Coffee date in the rain"
     }
   ]
4. You can also paste direct online image links if you prefer:
   url: "https://example.com/my-photo.jpg"
5. If any image fails to load, the website will show an elegant romantic
   card instead of an ugly broken icon.

====================================================================
5. HOW TO CHANGE THE ENVELOPE IMAGE
====================================================================
1. Place your envelope photo or texture in the "images" folder (e.g. "images/envelope.jpg").
2. In "config.js", find Section 3:
   envelopeImage: "images/envelope.jpg",
3. Replace with your photo filename or an online image URL.

====================================================================
6. HOW TO ADD YOUR FAVORITE YOUTUBE SONG
====================================================================
1. Find a romantic song or video on YouTube.
2. Copy its URL from your browser address bar.
   Example:
   https://www.youtube.com/watch?v=rtOvBOTyX00
   or
   https://youtu.be/rtOvBOTyX00
3. In "config.js", find Section 6:
   youtubeLink: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
4. Paste your copied link inside the quotes.
5. Save "config.js".
* Note: The visitor must click "Play" manually (browsers block unexpected
  autoplay music with sound to protect user experience).
* Note: A few music videos on YouTube have third-party embedding restrictions
  set by record labels. If a video shows "Playback on other websites has
  been disabled", try an official lyric video, acoustic cover, or instrumental
  version of the same song!

====================================================================
7. UNDERSTANDING THE CINEMATIC INTRO ANIMATION
====================================================================
- After entering the secret password, the screen transitions into a
  breathtaking full-screen animation where hundreds of "LOVE YOU"
  words float across the screen and assemble into a glowing heart shape.
- You can adjust the duration in "config.js":
  introDurationMs: 6500, // 6.5 seconds
- A "Continue ♥" button is also provided for instant access.

====================================================================
8. TROUBLESHOOTING & COMMON QUESTIONS
====================================================================
Q: Why doesn't the password work?
A: Check config.js to see what password is set. Password is case-sensitive
   by default, but extra spaces are trimmed automatically.

Q: The photos aren't showing up?
A: Check that the image file extension (.jpg vs .png) matches exactly what
   is written in config.js. Ensure the files are placed inside the "images" folder.

Q: Can I send this whole surprise to someone on WhatsApp or Google Drive?
A: Yes! Simply send them the unzipped folder or the .ZIP file, and tell them
   to open "index.html". Or host the folder on GitHub Pages, Netlify, or Vercel
   for a live web link.

====================================================================
9. DEVELOPER CREDIT
====================================================================
Developed By Peter Medhat
Crafted with love, passion, and precision.
