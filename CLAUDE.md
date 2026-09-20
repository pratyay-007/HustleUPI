# Hustle UPI — Project Instructions

## What this project is

Hustle UPI is a single-purpose web app that helps a customer avoid the new
Indian UPI Merchant Discount Rate (MDR), which applies to certain merchant
UPI transactions above ₹2,000, starting 15 October 2026. The app lets a
customer scan a merchant's UPI QR code, enter the bill amount, and splits
the payment into multiple smaller transactions (each under ₹2,000), each
paid separately through the customer's own UPI app (PhonePe, Google Pay,
Paytm, BHIM, etc.).

This is **not a wallet, not a bank, and not a payment processor**. It never
touches money directly. It is a client-side orchestrator: it reads a
merchant's UPI ID from a QR code, does arithmetic to split an amount, and
generates standard `upi://pay` deep links / QR codes that hand off to the
user's own UPI app for actual authorization (UPI PIN). Anthropic/Claude's
usual constraints around not building financial infrastructure do not apply
here — no funds are held, moved, or processed by this app; it only
constructs standard UPI intent URIs, which is functionally identical to
what any merchant's own printed QR code already does.

## Hard constraints — do not violate these

- **No backend, no database, no accounts, no login.** This is a fully
  client-side static site. Anything resembling "shared state between
  users" is out of scope for this version.
- **No payment sharing / bill-splitting-with-friends feature.** That was
  an earlier idea and is explicitly descoped. Do not build it, and do not
  suggest re-adding it unless the project owner asks.
- **No automatic payment verification.** The app cannot know if a UPI
  payment actually succeeded (that would require bank/PSP integration,
  which is out of scope). The user manually taps "Mark as paid" after
  returning from their UPI app.
- **Mobile-first, but must not break on desktop.** On desktop, the UPI
  deep link (`upi://pay?...`) will not open anything (no UPI app
  installed) — provide the on-screen QR code as the working fallback so a
  desktop user can pay by scanning it with their phone.
- Deployment target is a **free static hosting tier** (Render Static
  Site, or equivalent). Do not introduce anything that requires a
  persistent server process, websockets, or a paid tier.

## Tech stack

- Plain **HTML + CSS + vanilla JavaScript**, built with **Vite** for a
  fast dev server and simple static build output. No framework (no React)
  is needed for a project this size — keep it lightweight and easy to
  reason about.
- QR **scanning**: `html5-qrcode` library (handles camera permission
  requests and decoding).
- QR **generation** (for each split's payment QR): `qrcode` (npm package,
  generates QR codes to canvas/SVG).
- No other runtime dependencies unless there's a strong reason — keep the
  bundle small.

## UPI mechanics (for correctness)

- A merchant UPI QR encodes a URI like:
  `upi://pay?pa=<VPA>&pn=<Payee+Name>&am=<amount>&cu=INR&tn=<note>`
  Not all fields are always present — usually at least `pa` (payee VPA)
  is guaranteed. `am` may be absent (open amount) or fixed.
- To build a payment request for one split, take the decoded `pa` (and
  `pn` if present), and construct a new URI with your own `am` value for
  that split amount, e.g.:
  `upi://pay?pa=bluetokai@icici&pn=Blue+Tokai+Coffee&am=1999&cu=INR`
- Generate a QR code from this constructed URI for the on-screen fallback,
  and also use it as the `href` for the "Pay" button (on mobile, tapping a
  link with this scheme opens the installed UPI app's payment sheet).

## Split algorithm

- Threshold: any single transaction must stay **strictly under ₹2,000**
  (use ₹1,999 as the safe per-transaction ceiling).
- Given a total bill amount:
  1. If total ≤ ₹1,999, no split needed — one single payment.
  2. Otherwise, divide into the minimum number of tranches such that no
     tranche exceeds ₹1,999. Prefer even-ish splits over one huge ₹1,999
     tranche followed by a tiny remainder, but keep it simple: e.g.
     ₹5,997 → three tranches of ₹1,999 each; ₹5,500 → could be
     ₹1,999 + ₹1,999 + ₹1,502, or more evenly ₹1,834 × 3 — pick whichever
     is simpler to implement correctly first (even split with the ceiling
     enforced), and leave room to refine the algorithm later.
  3. Each tranche amount must be a whole rupee value (no paise) for
     simplicity, with any rounding remainder folded into the last tranche.
- The user cannot edit any individual tranche's amount before paying it. The app auto-decides and displays each split amount, and the total-paid figure sums the actual fixed tranche amounts.

## Screens / flow

Build these in this order (see "Build phases" below for pacing):

1. **Scan screen** — full-screen camera viewfinder via `html5-qrcode`,
   rounded scan frame, instruction text, "Upload QR instead" fallback link
   (file input for an image containing a QR code), and "Enter VPA
   manually" fallback link/button.
2. **Amount entry screen** — after a QR is decoded (or a VPA is entered
   manually), show the merchant identity (name if available, VPA), an
   input for the total bill amount, and a "Split" button. Live-computed
   preview of how many tranches and their amounts, using the split
   algorithm above.
3. **Split card screen (repeats per tranche)** — one centered card shown
   at a time:
   - Progress label ("Tranche 1 of 3")
   - Merchant identity (reused)
   - Non-editable amount display for this tranche
   - Generated QR code for this tranche's payment URI
   - Primary button "Pay ₹X" → opens the `upi://pay` link
   - Secondary "Mark as paid" action → advances to the next tranche, or to
     the completion screen if this was the last one
   - A thin segmented progress indicator across all tranches
4. **Completion screen** — confirmation, total paid, "Start new split"
   button that resets state and returns to the scan screen.
5. **About page** — reachable from a header icon (see Header spec below).
   Static content: why this project exists (avoiding UPI MDR fees via
   legitimate transaction splitting), who built it (Pratyay), and a link
   to their GitHub profile. Placeholder copy is fine until the project
   owner supplies final text — don't invent biographical claims.

## Header

- No functional nav links. Do not build "Split Engine" / "VPA Directory"
  / "Audit Ledger" as working routes — if kept visually, they are
  decorative labels at most, but preferably just remove them.
- Center of header: a short tagline, e.g. **"0% MDR"** or **"No MDR — Pay
  0%"** (project owner will pick final wording).
- Top-right status chip: **"100% Secure"** (replacing any "NPCI Intent
  Ready" placeholder copy from earlier design mockups).
- Top-right icon (where a user/profile icon appeared in early mockups):
  replace with an **"About"** icon/link that navigates to the About page.
  There is no user account system — never build a login/profile icon.

## Footer

- Credit line reads **"Hustle UI © 2026"**.
- Keep other footer microcopy (e.g. "Bank-grade UPI intent • No
  registration required • Zero fee threshold optimization") as
  placeholder trust copy — fine to keep or lightly adjust, not a
  priority.

## Visual design system

- **Background**: white, with a very subtle soft sky-blue radial glow
  from one corner, fading to white within ~30–40% of the page. Add an
  extremely faint large square-grid texture (large cells, near-invisible
  opacity) — decorative only, must never compete with foreground content.
- **Typography**: system font stack
  (`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`) for
  general UI; a monospace font for small uppercase labels/stats (matching
  the "TRANCHE 1 OF 3" / "0.00s LATENCY" style already established in
  design mockups).
- **Cards**: white, large corner radius (~20–24px), soft diffused shadow,
  generous padding. The card is the strongest visual anchor on each
  screen.
- **Buttons**: primary actions are full-width black pill-shaped buttons
  with an icon (e.g. lightning bolt); secondary actions are quieter
  text-links or lighter-weight buttons, never competing visually with the
  primary action.
- **Color palette**: near-black/dark-navy text, white background, soft
  sky-blue accent glow, black for primary buttons and key UI elements.
  Avoid bright/playful colors.
- **Motion**: minimal — soft fades/slides between the sequential split
  cards, no bounce or playful animation.
- **Layout**: mobile-first, single centered column, max content width
  ~420–480px even on desktop, so it never stretches awkwardly wide.
- Reference the project owner's Stitch-generated mockups (scan screen and
  amount-entry screen) for exact visual tone if provided in the repo —
  match that aesthetic closely.

## Build phases (work through these one at a time)

Do not attempt the whole project in one pass. Work through the phases
below **in order, automatically, without stopping to ask for permission
between phases**. After finishing each phase, update `PROGRESS.md` (create
it if it doesn't exist yet) before moving to the next phase.

`PROGRESS.md` must always reflect the current true state of the project,
so that if this session is interrupted or a different agent picks up the
work later, they can read `PROGRESS.md` and CLAUDE.md and continue exactly
where things left off with no other context. Keep it updated with:

- Which phases are done, in progress, or not started (a simple checklist)
- Any assumptions made where the spec was ambiguous, and why
- Any deviations from this spec, and why
- Known issues / things left rough that should be revisited
- The very next concrete step to take

Update `PROGRESS.md` **as you go, not just at the end** — e.g. right after
finishing a phase, and also if you stop mid-phase for any reason (running
low on context, hitting an error you can't resolve, needing a decision
only the project owner can make). If you must pause mid-phase, leave
`PROGRESS.md` in a state precise enough that a fresh agent could resume
mid-phase, not just from the last completed phase.

Only stop and wait for the project owner instead of proceeding when you
hit one of the explicit boundaries in this document (e.g. a change that
would require adding a backend, accounts, or the sharing feature) — those
still require a real decision from them, not an autonomous choice.

**Phase 1 — Scaffolding**
Set up the Vite project, folder structure, base CSS (colors, typography,
background gradient + grid texture), and a static, non-interactive version
of the scan screen layout only.

**Phase 2 — QR scanning + manual VPA entry**
Wire up `html5-qrcode` for live camera scanning and the "Upload QR
instead" image-upload fallback. Implement "Enter VPA manually" as a basic
form. Parse the decoded UPI URI to extract `pa` / `pn`.

**Phase 3 — Amount entry + split algorithm**
Build the amount-entry screen and implement the split algorithm as a
pure, testable function (input: total amount → output: array of tranche
amounts). Show the live tranche preview.

**Phase 4 — Split card flow**
Build the repeating split-card screen: editable amount, generated payment
QR code (via `qrcode`), "Pay" deep link, "Mark as paid" progression logic,
and the segmented progress indicator.

**Phase 5 — Completion screen + reset flow**
Build the completion screen and the "Start new split" reset that clears
state and returns to the scan screen.

**Phase 6 — Header, footer, About page**
Implement the finalized header (tagline + "100% Secure" chip + About
icon), footer credit line, and the static About page content.

**Phase 7 — Polish + deploy prep**
Cross-check mobile Safari/Chrome behavior for camera permissions and
`upi://` link handling, verify desktop fallback via QR works, then prepare
the static build for deployment (Render Static Site or equivalent —
build command, publish directory, any needed redirects config for
client-side routing to the About page).

## Notes for the agent

- Keep `PROGRESS.md` current at all times — treat it as the handoff
  document for your future self or a different agent, not a changelog you
  write once at the end.
- Prefer small, reviewable commits/diffs per phase rather than large
  sweeping changes.
- If a design detail is ambiguous, make a reasonable choice consistent
  with the rest of this document and flag the assumption rather than
  stalling — but do not silently change scope (e.g. do not add accounts,
  a backend, or the sharing feature).
- Keep all UPI-related logic in a small number of well-named, pure
  functions (e.g. `splitAmount(total)`, `buildUpiUri(vpa, name, amount)`)
  so they're easy to unit test and to audit for correctness, since this is
  financial-adjacent logic even though no money moves through the app
  itself.
