# GSAP Animation Patterns Reference

A library of ready-to-use animation patterns for the frontend. Each pattern has a name, a description of when to use it, and complete code. Always explain properties with inline comments since the user is learning GSAP.

---

## Setup Reminder

Every animated component needs:

```tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
// Add if using scroll animations:
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```

---

## Pattern: Fade Up

**When to use:** Default entrance animation. Good for headings, paragraphs, single elements appearing on page load.

```tsx
useGSAP(() => {
  gsap.from(".fade-up", {
    y: 30,              // Start 30px below its natural position
    opacity: 0,         // Start invisible
    duration: 0.8,      // Animation lasts 0.8 seconds
    ease: "power2.out", // Starts fast, slows at end — natural feel
  });
}, { scope: containerRef });
```

**CSS class to add:** `fade-up` on the target element.

---

## Pattern: Stagger Reveal

**When to use:** Multiple sibling elements appearing one after another. Perfect for card grids, lists, navigation items, feature blocks.

```tsx
useGSAP(() => {
  gsap.from(".stagger-item", {
    y: 40,              // Start 40px below
    opacity: 0,
    duration: 0.6,
    stagger: 0.12,      // Each element starts 0.12s after the previous one
    ease: "power2.out",
  });
}, { scope: containerRef });
```

**Variation — stagger from center outward:**
```tsx
stagger: {
  each: 0.1,
  from: "center",  // Elements in the middle animate first, edges last
},
```

**CSS class to add:** `stagger-item` on each child element.

---

## Pattern: Scroll Reveal

**When to use:** Elements that animate in as the user scrolls down to them. The most common scroll animation — use it for any section that enters the viewport.

```tsx
useGSAP(() => {
  gsap.from(".scroll-reveal", {
    scrollTrigger: {
      trigger: ".scroll-reveal", // Element that triggers the animation
      start: "top 85%",          // Fires when element's top hits 85% down the viewport
      // toggleActions: "play none none none" is the default — plays once
    },
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",  // More dramatic deceleration than power2
  });
}, { scope: containerRef });
```

**CSS class to add:** `scroll-reveal` on the target element.

---

## Pattern: Scroll Stagger

**When to use:** A grid or list of items that stagger in when scrolled into view. Combines scroll trigger with stagger.

```tsx
useGSAP(() => {
  gsap.from(".scroll-stagger-item", {
    scrollTrigger: {
      trigger: containerRef.current,  // Use the container as trigger, not individual items
      start: "top 80%",
    },
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: "power2.out",
  });
}, { scope: containerRef });
```

**CSS class to add:** `scroll-stagger-item` on each child element.

---

## Pattern: Hero Entrance

**When to use:** Hero sections where multiple elements animate in sequence — heading first, then subheading, then CTA button.

```tsx
useGSAP(() => {
  // A timeline lets you sequence multiple animations
  const tl = gsap.timeline({
    defaults: {
      duration: 0.8,
      ease: "power3.out",
    },
  });

  tl.from(".hero-heading", {
    y: 50,
    opacity: 0,
  })
  .from(".hero-subtitle", {
    y: 30,
    opacity: 0,
  }, "-=0.5")             // Start 0.5s before the previous animation ends (overlap)
  .from(".hero-cta", {
    y: 20,
    opacity: 0,
  }, "-=0.4");
}, { scope: containerRef });
```

**CSS classes to add:** `hero-heading`, `hero-subtitle`, `hero-cta`.

**What `-=0.5` means:** Normally each animation waits for the previous to finish. The `-=0.5` makes it start 0.5 seconds *before* the previous ends, creating a nice overlapping cascade instead of a rigid sequence.

---

## Pattern: Scale In

**When to use:** Images, cards, or modals that grow into view. Feels more dynamic than a simple fade.

```tsx
useGSAP(() => {
  gsap.from(".scale-in", {
    scale: 0.9,         // Start at 90% size
    opacity: 0,
    duration: 0.7,
    ease: "back.out(1.4)", // Slightly overshoots then settles — playful bounce
  });
}, { scope: containerRef });
```

**Note on `back.out(1.4)`:** The number controls how much it overshoots. `1.0` is subtle, `1.7` is bouncy, `2.5` is very dramatic. Start with `1.4` and adjust.

---

## Pattern: Slide In From Side

**When to use:** Elements entering from the left or right — good for images paired with text, sidebars, or alternating content layouts.

```tsx
// Slide from left
useGSAP(() => {
  gsap.from(".slide-left", {
    x: -60,             // Start 60px to the left
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });
}, { scope: containerRef });

// Slide from right
useGSAP(() => {
  gsap.from(".slide-right", {
    x: 60,              // Start 60px to the right
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });
}, { scope: containerRef });
```

---

## Pattern: Parallax Scroll

**When to use:** Background images or decorative elements that scroll at a different speed than content. Creates depth.

```tsx
useGSAP(() => {
  gsap.to(".parallax-bg", {
    scrollTrigger: {
      trigger: ".parallax-section",
      start: "top bottom",     // Start when section enters viewport
      end: "bottom top",       // End when section leaves viewport
      scrub: true,             // Ties animation progress to scroll position
    },
    y: -100,                   // Moves 100px up as you scroll down
    ease: "none",              // Linear movement — no easing for parallax
  });
}, { scope: containerRef });
```

**Note on `scrub: true`:** Instead of playing once, the animation is directly controlled by scroll position. Scroll down → animation progresses. Scroll up → animation reverses. This is what makes it feel like parallax.

---

## Pattern: Text Line Reveal

**When to use:** A heading or paragraph where lines clip in from below. Wrap each line in a container with `overflow: hidden`.

```tsx
// HTML structure needed:
// <div className="overflow-hidden">
//   <p className="text-reveal">Your text here</p>
// </div>

useGSAP(() => {
  gsap.from(".text-reveal", {
    y: "100%",           // Start fully pushed below the overflow container
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.15,       // If multiple lines
  });
}, { scope: containerRef });
```

**Why `overflow: hidden`:** The parent clips the content. The text starts pushed below the visible area (`y: "100%"`) and slides up into view — creating a "reveal" effect where it looks like the text is being uncovered.

---

## Pattern: Hover Lift

**When to use:** Cards or interactive elements that lift on hover. Note: this uses event listeners, not useGSAP's auto-cleanup.

```tsx
useGSAP(() => {
  const cards = gsap.utils.toArray<HTMLElement>(".hover-card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -8,              // Lift 8px
        scale: 1.02,        // Grow 2%
        duration: 0.3,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,               // Return to original position
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
}, { scope: containerRef });
```

**Alternative:** For simple hover effects, Tailwind's `hover:-translate-y-2 hover:scale-[1.02] transition-transform` might be simpler. Use GSAP hovers when you need more control (timing, complex sequences, spring physics).

---

## Pattern: Counter / Number Roll

**When to use:** Stats sections where numbers count up as they appear.

```tsx
useGSAP(() => {
  const counter = { value: 0 };

  gsap.to(counter, {
    scrollTrigger: {
      trigger: ".stat-number",
      start: "top 85%",
    },
    value: 150,              // Target number
    duration: 2,
    ease: "power1.out",
    snap: { value: 1 },     // Round to whole numbers during animation
    onUpdate: () => {
      // Update the DOM on every frame of the animation
      document.querySelector(".stat-number")!.textContent =
        Math.round(counter.value).toString();
    },
  });
}, { scope: containerRef });
```

---

## Ease Cheat Sheet

| Ease | Feel | Best for |
|------|------|----------|
| `"power2.out"` | Smooth, natural | Default — most animations |
| `"power3.out"` | Dramatic deceleration | Hero entrances, large elements |
| `"back.out(1.4)"` | Slight bounce/overshoot | Cards, buttons, playful UIs |
| `"expo.out"` | Very fast start, gentle end | Modals, dramatic reveals |
| `"elastic.out(1, 0.3)"` | Springy bounce | Attention-grabbing, icons |
| `"none"` | Linear, constant speed | Parallax, looping animations |

**Rule of thumb:** `.out` eases are for entrances (fast start, gentle landing). `.in` eases are for exits. `.inOut` eases are for elements that move between positions.

---

## Common Mistakes

1. **Using `useEffect` instead of `useGSAP`** — useGSAP handles cleanup automatically. useEffect requires manual `gsap.killTweensOf()` cleanup.

2. **Forgetting `{ scope: containerRef }`** — without it, GSAP selects elements globally, which can accidentally animate elements in other components.

3. **Setting `opacity: 0` in CSS on animated elements** — GSAP's `from()` sets the initial state for you. If you also set it in CSS, the element flashes invisible before GSAP takes over.

4. **Not registering plugins** — `gsap.registerPlugin(ScrollTrigger)` must be called before any ScrollTrigger animations. Put it at the top of the file, outside the component.

5. **Animating too many properties at once** — start with `y` + `opacity`, which covers 90% of cases. Add `scale`, `rotation`, or `x` only when needed.

---

## Pattern: Column Stagger Rows (Looping)

**When to use:** Grid listings where items are grouped by category in rows, and each column staggers in from bottom, holds, then exits upward. Loops through content sets. Used in the `RowsListingContent` component for the desktop work/project listing.

**CRITICAL — This is a 3-phase animation. Never implement only the entrance. All three phases are mandatory:**
1. **ENTER** — columns stagger in from `y: "100%"` to `y: "0%"` (bottom to natural position)
2. **HOLD** — content stays visible for a set duration
3. **EXIT** — columns stagger out from `y: "0%"` to `y: "-100%"` (natural position to above, same upward direction as enter)

The enter and exit must use the **same duration, same stagger, and same ease**. The exit direction is **always upward** (continuing the same direction as the entrance, NOT reversing back down). If you only implement the entrance without the hold and exit, the animation is broken and incomplete.

**Where it lives:** `frontend/components/RowsListingContent.tsx` — the desktop `<div ref={containerRef}>` section that renders `orderedCategories.map(...)`.

**How it works:** Inside the existing `useGSAP` hook (or a new one), target each `<section>` group's grid children. Each column staggers in from `y: "100%"`, holds visible, then exits to `y: "-100%"`. After exit completes, swap to the next content set and repeat.

### Implementation in RowsListingContent

Add a looping entrance/exit animation to the desktop category grid. The animation targets the `<Link>` items inside each category's grid. All items across all rows animate together, staggered by their column position (left to right).

```tsx
// Inside RowsListingContent, add this ref and state
const desktopGridRef = useRef<HTMLDivElement>(null);

// Add this useGSAP hook for the stagger animation
useGSAP(() => {
  if (!desktopGridRef.current) return;

  // Select all link items across all category rows
  const allItems = desktopGridRef.current.querySelectorAll(".grid-item");
  if (!allItems.length) return;

  // Group items by their column index (0-4 in a 5-col grid)
  // Items in the same column get the same delay
  const tl = gsap.timeline({ repeat: -1 }); // repeat: -1 = loop forever

  // ENTER — stagger columns from bottom
  tl.from(allItems, {
    y: "100%",              // Start below the overflow container
    opacity: 0,
    duration: 0.8,          // Each column takes 0.8s to enter
    stagger: {
      each: 0.15,           // 0.15s delay between each item
      grid: "auto",         // GSAP auto-detects the grid layout
      from: "start",        // Left to right
    },
    ease: "power3.out",
  })
  // HOLD — content stays visible
  .to({}, { duration: 2.5 })
  // EXIT — stagger columns upward (same direction as enter)
  .to(allItems, {
    y: "-100%",             // Slide up and out
    opacity: 0,
    duration: 0.8,
    stagger: {
      each: 0.15,
      grid: "auto",
      from: "start",
    },
    ease: "power3.out",
  });
}, { scope: desktopGridRef });
```

### Required markup changes

Wrap the category sections in a ref'd container, add `overflow-hidden` to each grid, and add `grid-item` class to each Link:

```tsx
{/* Wrap in ref container */}
<div ref={desktopGridRef} className="relative z-10 w-full flex flex-col-reverse gap-20">
  {orderedCategories.map((category) => (
    <section className="flex w-full text-[13px]" key={category}>
      <p className="w-1/12 text-white opacity-80">
        {categoryLabels[category] ?? category}
      </p>
      {/* Add overflow-hidden to clip the animation */}
      <div
        className="grid grid-cols-5 gap-18 w-11/12 pl-8 overflow-hidden"
        onMouseLeave={() => {
          if (firstItem) crossfadeTo(firstItem._id);
          setHoveredId(null);
        }}
      >
        {grouped[category].map((item) => (
          <Link
            href={item.slug ? `/${basePath}/${item.slug}` : '#'}
            key={item._id}
            className={`grid-item ${hoveredId === item._id ? 'text-white' : 'text-white/60'}`}
            onMouseEnter={() => {
              crossfadeTo(item._id);
              setHoveredId(item._id);
            }}
          >
            <p className="text-xl">{item.name}</p>
            <p className="text-[13px]">{item.client}</p>
          </Link>
        ))}
      </div>
    </section>
  ))}
</div>
```

### Tunable values

| Property | Value | Effect |
|----------|-------|--------|
| `duration` | `0.8` | How long each column takes to enter/exit |
| `stagger.each` | `0.15` | Delay between columns (smaller = faster wave) |
| Hold `.to({}, { duration })` | `2.5` | How long content stays visible |
| `ease` | `"power3.out"` | Smooth deceleration. Try `"expo.out"` for dramatic |

### Presets tested in playground

- **Doity-style**: duration 0.8, stagger 0.15, ease power3.out, hold 2.5s
- **Cinematic**: duration 1.2, stagger 0.25, ease expo.out, hold 3.0s
- **Snappy**: duration 0.45, stagger 0.07, ease circ.out, hold 1.5s
- **Bouncy**: duration 0.9, stagger 0.12, ease back.out(1.7), hold 2.0s

### Notes

- **The timeline MUST have three `.to()` calls: enter, hold, exit.** If you only write the enter, the animation is incomplete. The exit slides items to `y: "-100%"` (upward), never back to `y: "100%"` (downward).
- The animation only applies to the **desktop** layout (`hidden lg:flex`). Mobile uses snap scrolling with video crossfade instead.
- `overflow-hidden` on the grid container is critical — without it the sliding text is visible outside its bounds.
- The `repeat: -1` on the timeline makes it loop. Remove it for a one-shot entrance-hold-exit.
- If content sets change (different items per cycle), manage `setIndex` state and swap items in `onComplete` callback instead of `repeat: -1`. See the GSAP code output from the playground for that pattern.
- The video crossfade (`crossfadeTo`) should stay independent of this animation — it's driven by hover, not by the stagger timeline.
