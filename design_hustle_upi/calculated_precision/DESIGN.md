---
name: Calculated Precision
colors:
  surface: '#f7fafe'
  surface-dim: '#d7dade'
  surface-bright: '#f7fafe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f8'
  surface-container: '#ebeef2'
  surface-container-high: '#e5e8ec'
  surface-container-highest: '#e0e3e7'
  on-surface: '#181c1f'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3134'
  inverse-on-surface: '#eef1f5'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7fafe'
  on-background: '#181c1f'
  surface-variant: '#e0e3e7'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-numeric:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.02em
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style
The design system operates at the intersection of Braun-era functionalism and contemporary Cupertino restraint. Tailored for high-frequency, zero-error financial interactions, the interface rejects decorative indulgence in favor of absolute visual certitude, architectural grid discipline, and silent efficiency.

### Visual Principles
- **Quiet Authority:** Premium feel achieved through proportion, microscopic details, and intentional whitespace rather than saturated colors or dramatic ornamentation.
- **Instrument-Grade Clarity:** Financial telemetry, balances, and transaction states are treated as precision instrumentation. Visual noise is treated as friction.
- **Controlled Density:** Elements breathe comfortably without sprawling. The layout retains a tight, tactile rhythm reminiscent of high-end hardware physical inputs.

## Colors
The system relies on an architectural monochromatic scale biased toward deep oceanic slate, lifted by crisp neutral highlights and structural washes.

### Palette Architecture
- **Canvas Base:** Layered ice-white gradient running from `#FFFFFF` through `#F4F7FB` to `#EBF1F8`. Provides atmospheric depth without breaking neutrality.
- **Surfaces & Plinths:** Solid `#FFFFFF` surfaces layered against the atmospheric wash, creating optical lift through pure luminance contrast.
- **Primary Ink:** `#0F172A` (Slate 900) anchored for primary headings, metric values, and primary action fills.
- **Secondary Ink:** `#334155` (Slate 700) for body narrative, subheadings, and interactive secondary iconography.
- **Tertiary & Muted Ink:** `#64748B` (Slate 500) dedicated to metadata, system labels, timestamps, and input hints.
- **Grid & Structural Hairlines:** `rgba(15, 23, 42, 0.03)` for global coordinate grids; `rgba(15, 23, 42, 0.06)` for element borders and micro-separators.
- **Functional Semantics (Restrained):** 
  - Verification/Success: `#0F766E` (Muted Deep Teal)
  - Friction/Destructive: `#991B1B` (Deep Carmine)
  Both accents are deployed strictly as text or 1px indicator dots, never as full flooded surfaces.

## Typography
Typographic hierarchy emphasizes immediate visual parsing of monetary values and status metadata.

### Typesetting Directives
- **Font Stack Strategy:** The system standardizes on high-x-height neo-grotesque type for textual UI, complemented by an engineered monospaced face for transactional identifiers, VPA addresses, and ledger figures.
- **Tabular Figures:** All monetary values, balance counters, and transaction hashes enforce `font-feature-settings: "tnum" 1, "cv05" 1` to prevent layout shift during state changes.
- **Letter Spacing Discipline:** Display sizes feature optical kerning with aggressive negative tracking (`-0.02em` to `-0.03em`) for a dense, engineered silhouette. Micro-labels employ positive tracking (`0.05em` to `0.06em`) with full uppercase transformation.
- **Vertical Metronome:** Line-heights are locked to tight, proportional boundaries to preserve spatial density without triggering clipping.

## Layout & Spacing
The layout adheres to a strict 4px base coordinate grid overlaid on an ambient 32px blueprint grid pattern rendered in `rgba(15, 23, 42, 0.03)`.

### Grid System
- **Mobile (up to 639px):** 4-column layout, `1rem` outer margins, `1rem` gutters. Primary actions pin to the bottom edge inside floating toolbars.
- **Tablet (640px - 1023px):** 8-column layout, `2rem` outer margins, `1.5rem` gutters. Max-width content boundaries lock at 768px for transactional flows.
- **Desktop (1024px+):** 12-column layout centered within an absolute max-width container of `1120px`. Split-pane balance: 5 columns for persistent telemetric account context, 7 columns for active transaction choreography.

### Layout Principles
- **Mathematical Division:** Spacing scales strictly using mathematical doublings or halves of the base increment (`4px`, `8px`, `12px`, `20px`, `32px`).
- **Edge Alignment:** Zero arbitrary offsets. Card internal padding always matches card-to-card gap tokens (`space-lg` to `space-lg`) to maintain consistent horizontal rhythm across nested viewports.

## Elevation & Depth
Depth is created through physical surface isolation and ambient light dispersion rather than directional drop shadows.

### Atmospheric Hierarchy
1. **Level 0 (Canvas):** Linear gradient from `#FFFFFF` (top 0%) to `#F4F7FB` (middle 60%) to `#EBF1F8` (bottom 100%) with an intersecting faint vector grid pattern.
2. **Level 1 (Card & Module Surfaces):** Pure `#FFFFFF` surface fill. Outlined with a microscopic border: `1px solid rgba(15, 23, 42, 0.06)`. Diffuse ambient shadow: `0 1px 3px rgba(15, 23, 42, 0.02), 0 6px 16px -4px rgba(15, 23, 42, 0.04)`.
3. **Level 2 (Popovers, Keypads & Dropdowns):** `#FFFFFF` surface with micro-border `1px solid rgba(15, 23, 42, 0.08)`. Shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.03), 0 12px 32px -4px rgba(15, 23, 42, 0.07)`.
4. **Level 3 (Modal Modals & PIN Entry Overlays):** `#FFFFFF` surface floating above a backdrop scrim tinted with `rgba(15, 23, 42, 0.2)` accompanied by `backdrop-filter: blur(12px)`. Shadow: `0 24px 48px -12px rgba(15, 23, 42, 0.12)`.

### Border Integrity
Every elevated card utilizes an `inset 0 1px 0 rgba(255, 255, 255, 0.8)` specular hairline along the top border to simulate physical chamfered glass.

## Shapes
The visual signature relies on pill geometries balanced against soft container enclosures.

### Geometry Hierarchy
- **Pill Primitives (`9999px`):** Used strictly for high-priority interactive components: primary buttons, status pills, filter chips, search pills, and balance overview containers.
- **Structural Containers (`rounded-xl` / `1.5rem`):** Applied to content cards, transaction groupings, and modal dialogs.
- **Input Fields & Display Wells (`rounded-lg` / `1rem`):** Applied to input fields, numeric entry wells, and list item hover blocks.
- **Inner Modules (`rounded` / `0.5rem`):** Reserved for QR viewfinders, micro-badges, and avatars.

## Components

### Buttons
- **Primary Button:** Full pill geometry (`rounded-full`), height `48px` (mobile: `44px`), background `#0F172A`, text `#FFFFFF`. Typography: `headline-sm` with tabular character metrics. Inset top highlight: `inset 0 1px 0 rgba(255, 255, 255, 0.15)`. Hover: `#1E293B`. Active: `#020617` with scale `0.98`. Focus ring: `2px solid #0F172A` with `2px` offset.
- **Secondary Button:** Full pill, height `48px`, background `#FFFFFF`, border `1px solid rgba(15, 23, 42, 0.1)`, text `#0F172A`. Hover: background `#F8FAFC`.
- **Tertiary / Ghost:** Full pill, transparent background, text `#334155`. Hover: background `rgba(15, 23, 42, 0.04)`.

### Input Fields
- **UPI ID / VPA Input:** Solid `#FFFFFF` fill, height `52px`, `rounded-lg`, border `1px solid rgba(15, 23, 42, 0.08)`. Placeholder color `#64748B`. Typography: `JetBrains Mono` at `14px`. Focused state transitions border to `#0F172A` with a soft outer ring: `0 0 0 3px rgba(15, 23, 42, 0.05)`.
- **Amount Currency Well:** Borderless display module. Large centered amount in `display-lg` (`Inter`, 600 weight). Prefixed with static `₹` in `#64748B`. Background: `rgba(244, 247, 251, 0.6)` with micro-border `1px solid rgba(15, 23, 42, 0.04)`.

### Cards & Plinths
- **Transaction Card:** `#FFFFFF` background, `rounded-xl`, `1px solid rgba(15, 23, 42, 0.06)`, padding `space-lg`. Contains segmented rows divided by hairlines of `1px solid rgba(15, 23, 42, 0.03)`.
- **Telemetry Tile:** Compact statistics module. Minimal padding (`space-md`), background `#FFFFFF`, featuring a micro mono label (`label-caps`) above a numeric balance (`headline-md`).

### Chips & Badges
- **Status Indicator:** Full pill, padding `4px 10px`. Background `rgba(15, 23, 42, 0.04)`, border `1px solid rgba(15, 23, 42, 0.06)`. Typography: `label-code` in `#334155`. Dynamic dot indicator: 6px circle with a solid fill representing state.

### Lists & Ledger Rows
- **List Items:** Horizontal flex containers, height `64px`, border-bottom `1px solid rgba(15, 23, 42, 0.04)`. Counterparty avatar on the left (`40px`, pill-shaped, neutral wash fill with `#0F172A` initials). Counterparty and timestamp stacked vertically using `body-md` and `body-sm`. Monetary value right-aligned using `label-numeric`.

### Checkboxes & Segmented Controls
- **Radio / Toggle Selection:** Geometric pill shell containing a sliding `#FFFFFF` plinth with elevation `0 1px 2px rgba(15, 23, 42, 0.06)`. Base track background is `#F1F5F9`. Text within inactive states uses `#64748B`; active state shifts to `#0F172A` with weight `600`.
- **Checkbox:** `18px` square with `4px` corner radius. Border `1px solid rgba(15, 23, 42, 0.2)`. Selected state fills with `#0F172A`, rendering a clean 1.5px white checkmark without animation bounce.

### Specialized Utility Components
- **Numeric Keypad Plinth:** Grid of borderless keys, height `56px`, font `display-lg-mobile`. Press feedback triggers a subtle background flash to `rgba(15, 23, 42, 0.04)` without dimensional movement.
- **PIN Verification Pods:** 4 or 6 circular discrete input slots (`12px` diameter). Unfilled state: `1.5px solid rgba(15, 23, 42, 0.15)`. Filled state: solid `#0F172A` dot with an instant snap transition.