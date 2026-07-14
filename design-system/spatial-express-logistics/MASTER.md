# Design System Master File - Spatial Express Logistics

> **PORTAL ROUTER LOGIC:** 
> Users can toggle between:
> - **Public portal** (Landing, Calculator, Results, Checkout, Tracking, Services, About, Contact)
> - **Customer dashboard** (Overview, History, Pickup Booking, Invoices, Support)
> - **Admin dashboard** (Overview, Partners, Zones, Price Matrix Editor, Price Generator, Reports, Customer Management, Shipment Operations, Settings)
>
> Navigation and sidebar links will dynamically render depending on the active portal. A portal segue switcher is present in the main header and sidebar.

---

**Project:** Spatial Express Logistics  
**Tagline:** Fast. Reliable. Everywhere.  
**Style:** Enterprise, Minimal, Premium, Dark, Elegant, Modern, Glassmorphism, 20px Rounded Corners  
**Color Scheme:** Strictly Dark Mode Only  

---

## Global Design Tokens

### Color Palette

| Token | Hex / Value | CSS Custom Class | Usage |
|------|-----|--------------|------|
| **Primary** | `#39FF14` | `bg-primary` / `text-primary` | Neon Green highlight, active links, primary buttons |
| **Secondary** | `#1DB954` | `bg-secondary` / `text-secondary` | Medium Green for secondary elements |
| **Background** | `#050608` | `bg-background` | Global layout canvas backplate |
| **Card BG** | `#0D1117` | `bg-card` | Standard glass cards, sidebars |
| **Secondary Card** | `#111827` | `bg-secondary-card` | Nested forms, item listings |
| **Borders** | `rgba(255,255,255,.06)`| `border-border` | Thin dividers and glass bounds |
| **Primary Text** | `#FFFFFF` | `text-white` | Headings, readouts |
| **Secondary Text**| `#B7BDC8` | `text-text-secondary` | Descriptions, list titles |
| **Muted Text** | `#9CA3AF` | `text-muted` | Time labels, labels |
| **Danger** | `#EF4444` | `text-danger` | Alerts, cancel buttons, error stats |
| **Warning** | `#FACC15` | `text-warning` | Pending, customs check status |
| **Success** | `#39FF14` | `text-success` | Completed, verified checkout |

### Typography

- **Heading Font:** Satoshi (Fallback: Inter)
- **Body Font:** Inter
- **Mood:** enterprise, elegant, high-precision, premium, minimal, tech-forward
- **Font import (Plus Jakarta Sans as Satoshi):**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
```

### Spacing Variables (8-Point Grid)

- `xs`: `4px` (Tight labels, micro-gaps)
- `sm`: `8px` (Icon gaps, border-padding)
- `md`: `16px` (Standard inner card padding)
- `lg`: `24px` (Grid columns gaps, section headers)
- `xl`: `32px` (Hero margins, portal gaps)
- `2xl`: `48px` (Section paddings)
- `3xl`: `64px` (Large layout separators)

### Radius Bounds

- **Card Radius:** `20px` (`rounded-lg` overridden as `20px` in config)
- **Form Input Radius:** `12px` (`rounded-md`)
- **Button Radius:** `12px` (`rounded-md`)
- **Badge Radius:** `9999px` (`rounded-full`)

### Box Shadows & Glows

- **Glow Shadow:** `0 0 20px rgba(57, 255, 20, 0.15)`
- **Strong Glow:** `0 0 30px rgba(57, 255, 20, 0.3)`
- **Glass Panel Shadow:** `0 8px 32px 0 rgba(0, 0, 0, 0.5)`

---

## Component Guidelines

### Custom Neon Truck Cursor
- Custom cursor follows mouse viewport on desktop screens.
- Vector shape: Neon green transport truck outline.
- Interactive response: Scale cursor slightly on hover. Rotating wheels keyframe activated when mouse is in motion. Smooth trail particles fade behind path.

### Reusable UI elements

1. **Buttons:**
   - **Primary:** Neon Green background, solid black text. Bold weight. Hover state adds `shadow-glow-strong` and transforms `scale-102`.
   - **Secondary:** Transparent background, neon green border, white text. Hover state adds white/5 background.
   - **Glass:** Glass panel style background, white text. Hover state adds white/10 background.

2. **Cards:**
   - Background `#0D1117`, border `rgba(255,255,255,0.06)`, radius `20px`.
   - Hover state increases border brightness (`border-primary/20`) and adds a soft green ambient shadow.

3. **Tables:**
   - Clean spacing, border dividers, custom headers. Hover rows flash or highlight slightly.

4. **Pricing Matrix Sheet:**
   - Grid layout resembling Excel/Google Sheets.
   - Inline cell click triggers input text edit mode.
   - On change, cell flashes neon green (`@keyframes flashSuccess`) to signify auto-save.
   - Undo/Redo caches store previous matrices.

---

## Remotion Motion Specs

- **Page Transitions:** Slide up & fade in (`500ms` cubic-bezier).
- **Sidebar slide:** Animate width on desktop toggle.
- **Card Hover:** Subtle `3px` vertical translation + neon glow.
- **World Tracking Map:** Glowing green paths draw themselves from origin to destination. Animated pulse node follows route.
- **Success Check:** SVG circle draws itself with a scale spring.
- **Counters:** Numerical stats count up on render.
- **Loading Skeleton:** Pulsing wave of gray-dark opacity.
