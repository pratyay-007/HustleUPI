# Hustle UPI

Client-side helper that splits a merchant UPI payment into tranches under ₹2,000. It never holds or moves money; it only builds standard `upi://pay` intents and QR codes for the user's own UPI app.

## Local development

```bash
npm install
npm run dev
```

Camera scanning needs a secure context (`https://` or `localhost`). Mobile Safari often requires tapping **Enable camera** after a permission prompt. On desktop, `upi://pay` will not open an app — use the on-screen payment QR.

## Build for production

```bash
npm run build
```
The output will be in the `dist` directory, ready to be served by any static web host.

## Deploy (Render Static Site)

Use the included `render.yaml`, or set these in the Render dashboard:

1. Build command: `npm install && npm run build`
2. Publish directory: `dist`
3. SPA rewrite: `/*` → `/index.html` (harmless; About is `#about` and does not need path routes)

Render serves the static site over HTTPS, which is required for `getUserMedia` camera access.
