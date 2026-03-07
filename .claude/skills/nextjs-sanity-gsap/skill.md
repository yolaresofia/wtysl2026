---
name: nextjs-sanity-gsap
description: Build websites using a monorepo with Next.js 14+ (App Router) frontend and Sanity v3 studio, plus TypeScript, GSAP animations, and Tailwind CSS. Use this skill whenever the user asks to create pages, components, layouts, Sanity schemas, GROQ queries, or GSAP animations. Also trigger when the user mentions any combination of Next.js, Sanity, GSAP, or asks to build a website, landing page, portfolio, or any web project. Always use this skill for animation questions involving GSAP, ScrollTrigger, or motion.
---

# Next.js + Sanity + GSAP + Tailwind Monorepo

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict)
- **CMS**: Sanity v3 (separate studio project)
- **Animation**: GSAP with `@gsap/react` (useGSAP hook)
- **Styling**: Tailwind CSS
- **Monorepo**: Root package.json with concurrently, each project has its own package manager

---

## Monorepo Structure

This is a monorepo with `frontend/` and `studio/` as sibling projects. The root `package.json` and `package-lock.json` manage shared dependencies (like `concurrently` to run both projects). Each project has its own `package.json` for project-specific dependencies.

```
root/
├── package.json            # Shared deps (concurrently, etc.)
├── package-lock.json
│
├── frontend/
│   ├── package.json        # Next.js, GSAP, Tailwind, next-sanity, etc.
│   ├── app/
│   │   ├── layout.tsx      # Root layout (fonts, metadata, providers)
│   │   ├── page.tsx        # Homepage
│   │   ├── globals.css
│   │   ├── action.ts       # Server actions
│   │   ├── client-utils.ts
│   │   ├── project/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   └── other-project/
│   │       └── [slug]/
│   │           └── page.tsx
│   ├── components/
│   │   ├── ui/             # Button, Card, etc.
│   │   ├── sections/       # Hero, Features, CTA, etc.
│   │   └── layout/         # Header, Footer, Navigation
│   └── lib/
│       └── sanity/
│           ├── client.ts   # Sanity client config
│           ├── queries.ts  # All GROQ queries
│           └── types.ts    # Manually written TS types
│
└── studio/
    ├── package.json        # Sanity dependencies
    ├── sanity.config.ts
    ├── sanity.cli.ts
    ├── sanity.types.ts
    ├── tsconfig.json
    ├── static/
    └── src/
        ├── schemaTypes/
        │   ├── index.ts    # Barrel export for all schemas
        │   ├── documents/  # Document types (project, post, page, etc.)
        │   ├── objects/    # Object types (hero, cta, richText, etc.)
        │   └── singletons/ # Single-instance types (settings, navigation, etc.)
        └── structure/
            └── index.ts    # Desk structure configuration
```

### Key Rule: File Placement

- **GROQ queries, Sanity client, and types** live in `frontend/lib/sanity/` — not in studio.
- **Schemas** live in `studio/src/schemaTypes/` — organized into documents, objects, and singletons.
- **Components** live in `frontend/components/` — organized into ui, sections, and layout.
- When creating a new content type, you'll touch both projects: schema in `studio/`, query + types in `frontend/`.

---

## Next.js Conventions

### Server vs Client Components

- **Default to Server Components.** Pages and layouts are Server Components unless they need interactivity.
- **Add `"use client"` only when needed** — for event handlers, hooks (useState, useEffect, useGSAP), or browser APIs.
- **Data fetching happens in Server Components.** Fetch Sanity data at the page level, pass it down as props.

```tsx
// frontend/app/project/[slug]/page.tsx — Server Component
import { getProjectBySlug } from "@/lib/sanity/queries";
import { ProjectDetail } from "@/components/sections/ProjectDetail";

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) return <div>Not found</div>;
  return <ProjectDetail project={project} />;
}
```

```tsx
// frontend/components/sections/ProjectDetail.tsx — Client Component (needs GSAP)
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Project } from "@/lib/sanity/types";

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Animate heading and content in sequence
    gsap.from(".project-heading", {
      y: 30,           // Start 30px below
      opacity: 0,      // Start invisible
      duration: 0.8,
      ease: "power2.out",
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef}>
      <h1 className="project-heading text-4xl font-bold">{project.title}</h1>
    </section>
  );
}
```

### Key Rules

- Use path aliases: `@/components/...`, `@/lib/...` (relative to `frontend/`).
- Always export `metadata` or `generateMetadata` from page files for SEO.
- Use `loading.tsx` files for page-level loading states.
- Use `next/image` for all images, including Sanity images.
- Use `next/link` for internal navigation.
- Route folders use kebab-case: `other-project/`, not `otherProject/`.

---

## Sanity CMS

### Client Setup

```ts
// frontend/lib/sanity/client.ts
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
});
```

### GROQ Queries

All queries live in `frontend/lib/sanity/queries.ts` as named export functions:

```ts
// frontend/lib/sanity/queries.ts
import { client } from "./client";
import type { Project } from "./types";

export async function getProjects() {
  return client.fetch<Project[]>(
    `*[_type == "project"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      "imageUrl": mainImage.asset->url,
      excerpt,
      publishedAt
    }`
  );
}

export async function getProjectBySlug(slug: string) {
  return client.fetch<Project | null>(
    `*[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      "imageUrl": mainImage.asset->url,
      body,
      publishedAt
    }`,
    { slug }
  );
}
```

### Types (Manually Written)

Types in `frontend/lib/sanity/types.ts` should match your GROQ projections:

```ts
// frontend/lib/sanity/types.ts
export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  imageUrl?: string;
  excerpt?: string;
  body?: any[];
  publishedAt: string;
}
```

### Schema Conventions

Schemas live in `studio/src/schemaTypes/` and are organized by type:

**Documents** — content with multiple entries (projects, posts, pages):
```ts
// studio/src/schemaTypes/documents/project.ts
import { defineType, defineField } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
  ],
});
```

**Singletons** — one-instance types (site settings, navigation, homepage config):
```ts
// studio/src/schemaTypes/singletons/settings.ts
import { defineType, defineField } from "sanity";

export const settings = defineType({
  name: "settings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
    }),
  ],
});
```

**Objects** — reusable field groups embedded in documents:
```ts
// studio/src/schemaTypes/objects/hero.ts
import { defineType, defineField } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "subheading", title: "Subheading", type: "text" }),
    defineField({ name: "image", title: "Image", type: "image" }),
  ],
});
```

All schemas are exported from the barrel file:
```ts
// studio/src/schemaTypes/index.ts
export { project } from "./documents/project";
export { settings } from "./singletons/settings";
export { hero } from "./objects/hero";
```

---

## GSAP Animations

The user is learning GSAP. **Always explain what each animation property does with brief inline comments.** Prefer simple, readable animations over complex timelines unless asked. When suggesting a pattern, reference it by name (e.g., "stagger reveal") so the user builds a vocabulary.

For detailed patterns and examples, read `references/gsap-patterns.md`.

### Core Rules

- **Always use `useGSAP` from `@gsap/react`** — never raw `useEffect` for GSAP.
- **Always scope animations** with `{ scope: containerRef }`.
- **Register plugins once** at the top of the file, outside the component.
- **Use `gsap.from()`** for entrances, `gsap.to()` for exits or state changes.
- **Never set `opacity: 0` in CSS** on elements animated with `gsap.from()`.

### Starter Template

Every animated component follows this structure:

```tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function AnimatedSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Your animation here
  }, { scope: containerRef });

  return <div ref={containerRef}>{/* content */}</div>;
}
```

---

## Tailwind CSS Conventions

**Responsiveness is mandatory.** Every component must work on mobile, tablet, and desktop. No exceptions. For detailed patterns and a testing checklist, read `references/tailwind-responsive.md`.

Core rules:
- **Mobile-first always.** Write base styles for mobile, add `md:` and `lg:` overrides.
- **Never use `h-screen` for full-height sections.** Use `min-h-dvh` or `h-dvh` — these respect the mobile browser chrome. See `references/tailwind-responsive.md` for the full viewport height guide.
- **Always set background-color on `html`/`body`** in globals.css to prevent white bleed on mobile overscroll.
- **Always include `themeColor`** in root layout metadata to color the browser chrome.
- **Never use fixed pixel widths.** Use `w-full`, `max-w-*`, or grid columns instead.
- **Scale typography** across breakpoints (e.g., `text-2xl md:text-4xl lg:text-6xl`).
- **Scale spacing** across breakpoints (e.g., `py-16 md:py-24 lg:py-32`).
- **Always include `sizes`** on `next/image` components for responsive image loading.
- Use Tailwind utility classes directly — no custom CSS unless truly necessary.
- Page containers: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Use `clsx` + `tailwind-merge` for conditional classes:

```ts
// frontend/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Component Guidelines

1. **PascalCase filenames**: `HeroSection.tsx`, `ProjectCard.tsx`
2. **Named exports** for non-page components
3. **TypeScript interfaces** for all props
4. **One responsibility per component**
5. **Sections** go in `frontend/components/sections/`
6. **Always include a `className` prop** on section-level components for flexibility

---

## When Generating Code

- Always specify the full file path (e.g., `frontend/components/sections/Hero.tsx`).
- Always include imports at the top.
- Always specify `"use client"` when the component uses hooks or browser APIs.
- Explain GSAP properties with brief comments — the user is learning.
- When creating a new content type, provide all three pieces: schema (in `studio/`), GROQ query + types (in `frontend/lib/sanity/`), and component (in `frontend/components/`).
- Reference GSAP patterns by name from `references/gsap-patterns.md`.
- **Every component must be responsive.** Always test mentally against 375px, 768px, and 1440px. Reference `references/tailwind-responsive.md` for patterns.
- Never output fixed pixel widths. Always use fluid, responsive Tailwind classes.
