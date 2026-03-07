# Tailwind Responsive Patterns Reference

Every component must be fully responsive. Mobile-first is not optional — it's the default approach. Always build for the smallest screen first, then layer on styles for larger screens.

---

## Breakpoint System

Tailwind breakpoints are **min-width** — they apply at that size **and above**:

| Prefix | Min-width | Think of it as |
|--------|-----------|----------------|
| (none) | 0px | Mobile (default — always start here) |
| `sm:` | 640px | Large phones / small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

**Golden rule:** Write the mobile style first with no prefix, then add `md:` and `lg:` overrides. Never design desktop-first and try to scale down.

```tsx
// CORRECT — mobile-first
<h1 className="text-2xl md:text-4xl lg:text-6xl">

// WRONG — thinking desktop-first, then trying to override down
// (there's no "below md" prefix in Tailwind)
```

---

## CRITICAL: Mobile Viewport Height & Background Color

This is the #1 source of mobile layout bugs. On mobile browsers (Safari, Chrome), the address bar and bottom navigation bar appear and disappear as the user scrolls. Classic `100vh` does NOT account for this — it uses the tallest possible viewport, which means content gets hidden behind the browser chrome.

### The Problem with `h-screen` and `100vh`

```tsx
// BROKEN on mobile — content will overflow behind the browser bar
<section className="h-screen">

// This is what h-screen compiles to:
// height: 100vh — which is the LARGEST viewport, ignoring browser chrome
```

### The Fix: Dynamic Viewport Height (`dvh`)

Tailwind v3.4+ supports dynamic viewport units. **Always use `min-h-dvh` instead of `h-screen`:**

```tsx
// CORRECT — respects the actual visible area, including browser chrome
<section className="min-h-dvh">

// For a full-screen hero that fits exactly in the visible viewport:
<section className="h-dvh">
```

The three viewport units:
- `dvh` (dynamic) — **use this one.** Updates live as browser chrome appears/disappears.
- `svh` (small) — the smallest possible viewport (browser chrome fully visible). Useful as a safe minimum.
- `lvh` (large) — the largest possible viewport (browser chrome hidden). This is what `vh` behaves like — avoid it.

### Full-Screen Section Pattern

```tsx
// Hero that fills exactly the visible screen on every device
<section className="relative flex min-h-dvh flex-col items-center justify-center px-4">
  <h1 className="text-4xl md:text-6xl font-bold">Welcome</h1>
  <p className="mt-4 text-lg text-gray-600">Subtitle here</p>
</section>
```

Use `min-h-dvh` (not `h-dvh`) in most cases — it allows content to grow beyond one screen if needed, while still guaranteeing at least one full screen of height. Use `h-dvh` only when you need to strictly cap the height (like a hero with no overflow).

### Fallback for Older Tailwind Versions

If for any reason `dvh` classes aren't available, use this CSS fallback in `frontend/app/globals.css`:

```css
/* Fallback for dynamic viewport height */
@supports (height: 100dvh) {
  .h-screen-dynamic { height: 100dvh; }
  .min-h-screen-dynamic { min-height: 100dvh; }
}
@supports not (height: 100dvh) {
  .h-screen-dynamic { height: 100vh; }
  .min-h-screen-dynamic { min-height: 100vh; }
}
```

### CRITICAL: Eliminating White Background Bleed

On mobile, when the browser bar retracts or the page overscrolls (rubber-band effect on iOS), the area behind the page becomes visible. By default this is **white**, causing ugly flashes at the top and bottom of the viewport.

**Fix 1 — Set background on `html` and `body` in globals.css:**

```css
/* frontend/app/globals.css */
html,
body {
  background-color: /* your page's base color, e.g.: */ #000000;
}
```

This ensures the overscroll area matches your page. If your site has a dark background, set this to your dark color. If it's light, set it to your light color.

**Fix 2 — Match the `theme-color` meta tag in your root layout:**

```tsx
// frontend/app/layout.tsx
export const metadata: Metadata = {
  title: "Your Site",
  // This colors the browser chrome (address bar area) on mobile
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};
```

The `themeColor` meta tag tells mobile browsers what color to use for the address bar and the area around it. **This must match your page background.** Without it, the browser defaults to white or gray.

**Fix 3 — If different pages have different background colors:**

Set the background on the outermost wrapper of each page, AND extend it to cover overscroll:

```tsx
// For a dark page
<main className="min-h-dvh bg-black">
  {/* content */}
</main>

// In globals.css, also add:
html { background-color: #000000; }
```

If your site mixes dark and light pages, you have two options:
1. Use a CSS variable that changes per page and apply it to `html`.
2. Set `html` background to the most common page color and override per-page using a `useEffect` or a layout-level wrapper.

**Fix 4 — Prevent iOS rubber-band overscroll showing white:**

```css
/* frontend/app/globals.css */
html {
  background-color: /* your base color */;
  /* This ensures the overscroll area is colored on iOS Safari */
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
```

### Full Setup Checklist (do this once per project)

1. Set `background-color` on `html` and `body` in `globals.css` to your base page color
2. Add `themeColor` to your root layout metadata — match it to your page background
3. Use `min-h-dvh` instead of `h-screen` for full-height sections
4. Never leave `<body>` or `<html>` without an explicit background color
5. Test on a real phone (simulators don't always show the browser chrome behavior)

---

## Page Container Pattern

Use this wrapper for all page-level content. It centers content, adds horizontal padding, and caps the max width:

```tsx
<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* page content */}
</div>
```

- `px-4` on mobile gives breathing room from screen edges
- `sm:px-6` adds more padding on tablets
- `lg:px-8` comfortable padding on desktop
- `max-w-7xl` (1280px) prevents content from stretching too wide on large monitors

**Extract this as a reusable component:**

```tsx
// frontend/components/ui/Container.tsx
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
```

---

## Responsive Typography

Always scale typography across breakpoints. Text that looks good on desktop is usually too large for mobile.

### Headings

```tsx
// Page title / Hero
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">

// Section title
<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">

// Subsection title
<h3 className="text-xl sm:text-2xl font-semibold">
```

### Body Text

```tsx
// Standard body
<p className="text-base md:text-lg">

// Large intro / subtitle
<p className="text-lg md:text-xl lg:text-2xl text-gray-600">

// Small / caption
<p className="text-sm md:text-base text-gray-500">
```

### Line Length

Long lines are hard to read. Cap paragraph width even inside a wide container:

```tsx
<p className="max-w-prose">  {/* ~65 characters per line — ideal readability */}
<p className="max-w-2xl">    {/* Slightly wider, good for intros */}
```

---

## Responsive Grid Patterns

### Card Grid (most common)

```tsx
// 1 column on mobile → 2 on tablet → 3 on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
  {items.map((item) => (
    <Card key={item._id} {...item} />
  ))}
</div>
```

### Two-Column Layout (text + image)

```tsx
// Stacked on mobile → side by side on tablet+
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
  <div>
    <h2 className="text-2xl md:text-4xl font-bold">Title</h2>
    <p className="mt-4 text-base md:text-lg text-gray-600">Description</p>
  </div>
  <div className="order-first md:order-last">
    {/* Image — "order-first" puts it above text on mobile */}
    <Image src={imageUrl} alt="" fill className="object-cover rounded-lg" />
  </div>
</div>
```

### Asymmetric Grid

```tsx
// Stacked on mobile → 2/3 + 1/3 split on desktop
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2">
    {/* Main content */}
  </div>
  <div>
    {/* Sidebar */}
  </div>
</div>
```

---

## Responsive Spacing

### Section Padding

Every section should have vertical padding that scales:

```tsx
<section className="py-16 md:py-24 lg:py-32">
```

### Gaps Between Elements

```tsx
// Stack of elements
<div className="space-y-6 md:space-y-8 lg:space-y-12">

// Grid gaps
<div className="gap-4 md:gap-6 lg:gap-8">
```

### Margins

```tsx
// Spacing between sections
<div className="mt-12 md:mt-16 lg:mt-24">
```

**Consistency rule:** Pick a spacing rhythm and stick to it. Recommended scale: `4 → 6 → 8 → 12 → 16 → 24 → 32` (in Tailwind units). Don't jump from `py-4` to `py-20` arbitrarily.

---

## Responsive Images

### Full-Width Image

```tsx
<div className="relative aspect-video w-full overflow-hidden rounded-lg">
  <Image
    src={imageUrl}
    alt="Description"
    fill                        // Fills the parent container
    className="object-cover"    // Crops to fit without stretching
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
  />
</div>
```

**Always include `sizes`** — it tells the browser which image size to download at each breakpoint, preventing mobile users from downloading desktop-sized images.

### Image in a Grid

```tsx
<div className="relative aspect-square overflow-hidden rounded-lg">
  <Image
    src={imageUrl}
    alt="Description"
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  />
</div>
```

The `sizes` here match a 1→2→3 column grid: full width on mobile, half on tablet, third on desktop.

### Aspect Ratios

```tsx
aspect-video     // 16:9 — videos, hero banners
aspect-square    // 1:1 — thumbnails, avatars, card images
aspect-[4/3]     // 4:3 — photos
aspect-[3/4]     // 3:4 — portrait photos, tall cards
```

---

## Responsive Navigation

### Pattern: Visible on Desktop, Hamburger on Mobile

```tsx
// Desktop links — hidden on mobile
<nav className="hidden md:flex items-center gap-6">
  <Link href="/about">About</Link>
  <Link href="/projects">Projects</Link>
  <Link href="/contact">Contact</Link>
</nav>

// Hamburger button — visible only on mobile
<button className="md:hidden" onClick={() => setMenuOpen(true)}>
  <MenuIcon className="h-6 w-6" />
</button>
```

### Mobile Menu (Full-Screen Overlay)

```tsx
{menuOpen && (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-white md:hidden">
    <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4">
      <XIcon className="h-6 w-6" />
    </button>
    <Link href="/about" className="text-2xl" onClick={() => setMenuOpen(false)}>About</Link>
    <Link href="/projects" className="text-2xl" onClick={() => setMenuOpen(false)}>Projects</Link>
    <Link href="/contact" className="text-2xl" onClick={() => setMenuOpen(false)}>Contact</Link>
  </div>
)}
```

---

## Responsive Visibility

Show/hide elements at different breakpoints:

```tsx
// Show only on mobile
<div className="block md:hidden">Mobile only</div>

// Show only on desktop
<div className="hidden md:block">Desktop only</div>

// Show only on tablet and up
<div className="hidden sm:block">Tablet+</div>
```

**Use sparingly.** Hiding content means some users never see it. Prefer reorganizing layout (with grid/flex) over hiding content entirely.

---

## Responsive Flexbox Patterns

### Stack on Mobile → Row on Desktop

```tsx
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  <h2 className="text-2xl font-bold">Section Title</h2>
  <Link href="/all" className="text-blue-600">View all →</Link>
</div>
```

### Centered Content Block

```tsx
<div className="flex flex-col items-center text-center max-w-2xl mx-auto">
  <h2 className="text-3xl md:text-5xl font-bold">Title</h2>
  <p className="mt-4 text-lg text-gray-600">Subtitle goes here</p>
</div>
```

---

## Testing Checklist

When generating any component, mentally verify it works at these widths:

1. **375px** — iPhone SE / small phones
2. **390px** — iPhone 14 / modern phones
3. **768px** — iPad / tablets
4. **1024px** — small laptops
5. **1440px** — desktop

Common things that break on mobile:
- `h-screen` or `100vh` not fitting the visible viewport — use `min-h-dvh` or `h-dvh`
- White background flash on overscroll — set `background-color` on `html` in globals.css
- Browser chrome color mismatch — add `themeColor` to root layout metadata
- Text too large, overflows horizontally
- Fixed widths (`w-[500px]`) instead of fluid (`w-full max-w-lg`)
- Horizontal padding too small — content touching screen edges
- Images without `aspect-*` classes causing layout shifts
- Flex rows that should stack (`flex-row` without `flex-col` mobile default)
- Grid with too many columns on small screens (`grid-cols-3` without `grid-cols-1` base)

**Rule: Never use fixed pixel widths** (`w-[600px]`). Always use responsive alternatives: `w-full`, `max-w-lg`, `max-w-2xl`, percentages, or grid columns.
