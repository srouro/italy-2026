# Italy Trip 2026 — Travel Companion (PWA)

Hebrew (RTL) offline-capable travel app for the Sror family trip to Italy, 2026.

## Features
- 🗓️ Per-day itinerary: map, schedule, transport, bookings, food, gelato, attractions, packing list.
- 🇮🇹 Italian learning: phrases, text-to-speech, flashcards, quiz, sentence builder, music.
- 🌙 Light/dark theme (auto + manual toggle, remembered).
- 📍 "Today" jump + prev/next day navigation.
- ✅ Persistent checklists with progress bars, and auto-saved family notes.
- 📶 Works offline via a cache-first Service Worker; installable to home screen.

## Structure
| File | Purpose |
|------|---------|
| `index.html` | Markup + PWA meta |
| `styles.css` | All styling incl. dark mode |
| `app.js` | App logic, data loading, learning tools |
| `itinerary.json` | Trip data (`days`, `italian.sections`, `music.artists`) |
| `sw.js` | Cache-first offline service worker |
| `manifest.webmanifest` | Install metadata + icon |
| `icon.svg` | Scalable app icon |

## Run locally
Service workers require a server (not `file://`). From this folder:

```powershell
python -m http.server 8080
```

Then open http://localhost:8080

## Editing the trip
Edit `itinerary.json`. The app fetches it fresh and the Service Worker keeps a
fallback copy for offline use. Bump the `CACHE` version in `sw.js` when you change
`styles.css` or `app.js` to force clients to update.
