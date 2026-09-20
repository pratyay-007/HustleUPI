# Hustle UPI — Progress

Handoff document. Read `CLAUDE.md` first, then this file.

## Phase checklist

- [x] Phase 1 — Scaffolding — **done**
- [x] Phase 2 — QR scanning + manual VPA entry — **done** (present in repo; PROGRESS.md was stale)
- [x] Phase 3 — Amount entry + split algorithm — **done** (present in repo; PROGRESS.md was stale)
- [x] Phase 4 — Split card flow — **done** (present in repo; PROGRESS.md was stale)
- [x] Phase 5 — Completion screen + reset flow — **done** (present in repo; PROGRESS.md was stale)
- [x] Phase 6 — Header, footer, About page — **done** (present in repo; PROGRESS.md was stale)
- [x] Phase 7 — Polish + deploy prep — **done**

## Current state

This session found `PROGRESS.md` claiming Phase 1 in progress, but the source already implements the full client app:

- Vite + `html5-qrcode` + `qrcode`
- Scan (camera / upload / manual VPA), amount + live split preview, split cards with payment QR + `upi://pay` link, completion + reset, header/footer/About (`#about`)
- Pure helpers in `src/split.js` and `src/upi.js` with `node --test` coverage
- `render.yaml` and README deploy notes already drafted

Reconciling that mismatch, then finishing Phase 7 (camera/`upi://` polish, hash routing, static deploy check, browser verification).

## Assumptions

- Header/footer and About were built with the earlier screens rather than waiting for Phase 6; behaviour matches the Phase 6 spec (tagline **0% MDR**, **100% Secure**, About icon, footer **Hustle UI © 2026**).
- No Stitch mockup images in the repo; visuals follow `CLAUDE.md` plus the existing scan-screen CSS.
- Even-ish split (remainder folded into the last tranches), ceiling ₹1,999.
- GitHub profile URL on About is a placeholder (`https://github.com/`) until the owner supplies the real one.
- About uses hash routing (`#about`), so path-based SPA hosting is optional.

## Deviations

- None of scope. Header/footer/About shipped earlier than the phase order; functionality is in spec.

## Known issues / rough edges

- Live camera needs a secure context (HTTPS or localhost) and a user gesture on some mobile browsers; fallbacks: upload QR, manual VPA, Enable camera.
- BharatQR EMVCo payloads that are not `upi://` / `pa=` will fail parse (UPI intent QR and raw VPA work).
- Desktop `upi://pay` will not open an app; on-screen QR is the intended fallback.

## Current state

All 7 phases are complete. The project is fully functional, thoroughly tested, and ready for deployment on static hosting.

Recently applied updates:
- Updated the header tagline to **"Smart Splits. Zero Hassle."** (bolded and upsized).
- Expanded the **About page** with "About the Developer", "Why I Built HustleUPI", "Support My Work" (with Buy Me a Coffee embed), and "Connect With Me" sections. Given its own wider, readable desktop layout.
- Added **Privacy Policy**, **Terms of Service**, and **Cookie Policy** minimal static screens linked from the About page.
- Removed user-editable tranche amounts to ensure the "total paid" summary remains strictly accurate; the app now displays fixed calculated splits.
- Fixed mobile layout edge cases (stretchy About icon, header wrapping, unintended horizontal scroll).
- Added local HTTPS support via `@vitejs/plugin-basic-ssl` for true local device camera testing, plus a clear insecure context warning fallback.
- Rebuilt the mobile header layout with a cleaner CSS Grid approach, ensuring all elements stay on one logical line on desktop and stack cleanly into two balanced lines on narrow screens without wrapping awkwardly.
- Added a swipe-away card transition sequence when marking a tranche as paid, providing clearer visual feedback between splits.
- Created standard deployment and SEO files: `sitemap.xml`, `robots.txt`, and full HTML `<meta>` tags (title, description, Open Graph) for sharing.
- Fixed footer typo to correctly display "Hustle UPI © 2026".
- Implemented an initial skeleton/loading screen to prevent any flash of unstyled content (FOUC) on the first visit.

## Deploy config fix (2026-09-20)

The live site (`hustleupi.netlify.app`, hosted on Netlify) was unreachable
(`ERR_CONNECTION_TIMED_OUT`). The repo had no `netlify.toml`, so Netlify had
to guess the build command and publish directory for this Vite project —
the project had only been prepared for Render (`render.yaml`), not Netlify.
Added `netlify.toml` with the explicit build command (`npm run build`),
publish dir (`dist`), SPA rewrite, and the same Cache-Control headers as
`render.yaml`. Also swapped stale `hustleupi.onrender.com` URLs (in
`index.html` og:url, `public/sitemap.xml`, `public/robots.txt`, `README.md`)
for the real `hustleupi.netlify.app` domain. `render.yaml` is kept as-is for
an optional Render deploy.

Note: a connection timeout can also be a transient DNS/edge issue unrelated
to app code — if the site is still unreachable after this deploys, check
the Netlify deploy log/dashboard for the actual build/deploy status rather
than assuming it's a config problem.

## Next concrete step

The project is fully ready for deployment on static hosting. No further code changes are pending.
