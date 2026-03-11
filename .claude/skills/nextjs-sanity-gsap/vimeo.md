---
name: vimeo-nextjs
description: "Implement Vimeo video players in Next.js (App Router) with the @vimeo/player SDK. Use this skill whenever the user wants to embed Vimeo videos, build video overlays/modals, create 'Watch Video' interactions, handle Vimeo playback events (play, pause, ended, loop), integrate Vimeo URLs from Sanity CMS or any CMS, control sound/mute behavior on click-to-play, prevent Vimeo end-screen related videos, or build background-video-to-overlay-player patterns. Also trigger when the user mentions Vimeo iframes, Vimeo player SDK, or video embed issues in a React/Next.js context."
---

# Vimeo Video in Next.js (App Router)

This skill covers implementing Vimeo video players in Next.js using the `@vimeo/player` SDK. It handles the full pattern: background video → "Watch Video" button → overlay player with sound → controlled looping → auto-close.

## Key Principles

1. **Never use raw iframes for interactive Vimeo players.** Always use the `@vimeo/player` SDK for programmatic control (play, pause, volume, loop detection, event listeners).
2. **The iframe `src` URL controls initial embed behavior.** The SDK controls runtime behavior. Both matter.
3. **Browser autoplay policies require user interaction before unmuted playback.** The overlay pattern (user clicks "Watch Video") satisfies this — the click is the user gesture that unlocks unmuted autoplay.
4. **Vimeo's end-screen (related videos) is suppressed by never letting Vimeo "finish" naturally.** Catch the `ended` event and either restart or destroy the player before Vimeo shows suggestions.

## Installation

```bash
npm install @vimeo/player
```

The SDK is ~15KB gzipped. It communicates with the Vimeo iframe via `postMessage` — there is no heavy Vimeo script bundle loaded into your app.

## Architecture Overview

The pattern has three layers:

```
┌─────────────────────────────────────────┐
│  Page (server component or client)      │
│  - Fetches Vimeo URL/ID from CMS        │
│  - Renders background video + button    │
│  - Manages overlay open/close state     │
├─────────────────────────────────────────┤
│  VimeoOverlay (client component)        │
│  - Renders fullscreen/modal overlay     │
│  - Contains close button               │
│  - Mounts/unmounts VimeoPlayer          │
├─────────────────────────────────────────┤
│  VimeoPlayer (client component)         │
│  - Creates iframe via SDK constructor   │
│  - Manages playback, volume, events     │
│  - Handles loop-once-then-close logic   │
└─────────────────────────────────────────┘
```

## Implementation Guide

Read `references/implementation.md` for the full component code, SDK usage patterns, iframe parameter reference, and edge case handling.

## Quick Reference: Vimeo Iframe Parameters

These go in the iframe `src` URL as query params. The SDK constructor also accepts them as options.

| Parameter     | Value   | Effect                                         |
|---------------|---------|------------------------------------------------|
| `controls`    | `0`     | Hides Vimeo's built-in controls                |
| `loop`        | `0`     | **Keep this off** — we handle looping manually  |
| `muted`       | `0`     | Start unmuted (works because user clicked)      |
| `autoplay`    | `1`     | Auto-start when iframe loads                    |
| `background`  | `0`     | Do NOT use — forces mute and hides all UI       |
| `title`       | `0`     | Hides video title                               |
| `byline`      | `0`     | Hides uploader name                             |
| `portrait`    | `0`     | Hides uploader avatar                           |
| `dnt`         | `1`     | Do-not-track — skps analytics cookies           |
| `pip`         | `0`     | Disables picture-in-picture                     |
| `autopause`   | `0`     | Prevents auto-pausing when another video plays  |

### Critical: Why `loop=0` and manual restart

Setting `loop=1` in the iframe params makes Vimeo loop forever with no `ended` event fired. This means:
- You cannot detect when the video finishes
- You cannot implement "play twice then close"
- You lose control of the playback lifecycle

Instead, keep `loop=0`, listen for the `ended` event, and call `player.setCurrentTime(0)` + `player.play()` to restart manually.

### Critical: Why NOT to use `background=1`

The `background` parameter bundles autoplay + loop + mute + no controls into one flag. It forces the video to be muted and you **cannot unmute it programmatically**. It's designed for decorative background videos only. For a "Watch Video" overlay where the user expects sound, never use `background=1`.

## Extracting the Video ID from a Vimeo URL

Vimeo URLs come in several formats. The SDK constructor accepts either a numeric `id` or a full `url`. When storing Vimeo data in Sanity (or any CMS), store the full URL — the SDK handles parsing.

Common URL formats:
- `https://vimeo.com/123456789` (public)
- `https://vimeo.com/123456789/abcdef1234` (unlisted — the hash is required)
- `https://player.vimeo.com/video/123456789?h=abcdef1234` (embed URL, unlisted)

If you need to extract just the numeric ID:

```ts
function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}
```

But prefer passing the full URL to the SDK — it handles unlisted hashes automatically.

## Sanity CMS Schema

When storing Vimeo videos in Sanity, a simple `url` field works best:

```ts
defineField({
  name: 'vimeoUrl',
  title: 'Vimeo URL',
  type: 'url',
  description: 'Paste the full Vimeo URL (e.g. https://vimeo.com/123456789)',
  validation: (Rule) =>
    Rule.uri({ scheme: ['https'] }).custom((url) => {
      if (!url) return true;
      return /vimeo\.com/.test(url) || 'Must be a Vimeo URL';
    }),
})
```

## Cleanup and Memory Leaks

The `@vimeo/player` SDK attaches `postMessage` listeners to `window`. If you don't clean up, you'll get memory leaks and ghost event handlers — especially with Next.js client-side navigation.

**Always call `player.destroy()` in your `useEffect` cleanup.** This removes the iframe and all event listeners. See the implementation reference for the full pattern.

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Video plays but no sound | `muted=1` in URL or `background=1` | Use `muted=0` and remove `background` param |
| Sound doesn't work on mobile | No user gesture before play | Ensure play is triggered by a click handler, not on mount |
| Vimeo shows related videos at end | Video reached natural end | Catch `ended` event, restart or destroy before Vimeo's end screen |
| Player not destroyed on navigation | Missing cleanup in useEffect | Call `player.destroy()` in the cleanup function |
| Video doesn't autoplay in overlay | Missing `allow="autoplay"` on iframe | SDK adds this automatically — make sure you're using the SDK constructor, not a raw iframe |
| Unlisted video won't load | Missing hash parameter | Pass the full URL (including the hash) to the SDK, not just the numeric ID |
| Multiple videos interfere | `autopause` default is on | Set `autopause: false` in player options |

## Common Mistakes

1. **Using `background=1` for a video that needs sound.** This permanently mutes the video.
2. **Setting `loop=1` and expecting an `ended` event.** Vimeo's native loop skips the `ended` event entirely.
3. **Creating the player in a `useEffect` without cleanup.** Always `player.destroy()` on unmount.
4. **Using a raw `<iframe>` instead of the SDK.** You lose all programmatic control and can't prevent the end-screen.
5. **Forgetting `autopause: false` when multiple Vimeo players exist on one page.** Vimeo will auto-pause other players when a new one starts.
6. **Hardcoding video IDs instead of passing the full URL.** Unlisted videos require a hash that's part of the URL — splitting the ID from the URL loses it.
