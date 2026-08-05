# Baby Play

An interactive sensory app for babies and toddlers. Three modes: a colour-splash canvas that reacts to touch, a one-octave piano, and an animals soundboard.

---

## Project Structure

```
baby-app/
├── index.html          # Entire app — HTML, CSS, and JS in one file
├── sounds/             # Animal audio clips (MP3)
│   ├── cow.mp3
│   ├── dog.mp3
│   └── ...
└── DEVELOPMENT_STANDARDS.md
```

---

## Dependencies

None. No build step, no package manager, no frameworks.

The only requirement is a browser that supports:
- Canvas API
- Web Audio API
- Pointer Events

All modern browsers (Safari 15+, Chrome 90+, Firefox 90+) qualify.

---

## Running Locally

Opening `index.html` directly as a `file://` URL works for the canvas and piano, but **animal sounds will be blocked** by the browser's same-origin policy.

Use any static file server instead:

### Option A — Python (no install needed)

```bash
cd baby-app
python3 -m http.server 8080
```

Then open: [http://localhost:8080](http://localhost:8080)

### Option B — Node `serve`

```bash
npx serve .
```

Runs on port **3000** by default (or the next available port — check the terminal output).

### Option C — VS Code Live Server

Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, right-click `index.html`, and choose **Open with Live Server**.

Runs on port **5500** by default.

---

## Installing as a PWA on iPhone

Safari on iOS can save any website to the home screen as a standalone app. Once installed it launches full-screen with no browser chrome, behaves like a native app, and works offline (the app is a single HTML file with no external requests).

### Steps

1. **Serve the app over HTTPS or use a tunnel**

   iOS Safari requires a secure origin for some PWA features. The easiest approach for local testing is [ngrok](https://ngrok.com):

   ```bash
   # In one terminal — start the local server
   python3 -m http.server 8080

   # In another terminal — expose it publicly over HTTPS
   ngrok http 8080
   ```

   Copy the `https://` URL from the ngrok output (e.g. `https://abc123.ngrok-free.app`).

   > Alternatively, deploy to any static host with HTTPS — GitHub Pages, Netlify, or Vercel all work and are free.

2. **Open the URL in Safari on your iPhone**

   Paste the `https://` URL into Safari. Do not use Chrome or Firefox on iOS — only Safari can add to the home screen.

3. **Tap the Share button**

   Tap the share icon (box with an arrow pointing up) in the Safari toolbar at the bottom of the screen.

4. **Tap "Add to Home Screen"**

   Scroll down in the share sheet and tap **Add to Home Screen**. Give it a name (default: "Baby Play") and tap **Add**.

5. **Launch from the home screen**

   The app icon appears on your home screen. Tapping it opens the app full-screen, without any Safari UI.

### If the icon or content looks stale after an update

iOS aggressively caches home-screen apps. If you redeploy and the old version persists:

1. Delete the app icon from the home screen (long-press → Remove App)
2. Re-add it using the steps above

---

## Contributing

See [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) for code style, branching, and commit message conventions.
