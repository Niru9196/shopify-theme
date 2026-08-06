# Purelane Homepage — Shopify Dawn Theme Build

Pixel-accurate recreation of `purelane-homepage.html` as a merchant-editable Shopify Online Store 2.0 theme built on Dawn.

---

## Notes on the original HTML

- Single monolithic 1,700-line file with inline CSS, JS, and base64 SVG product images. Not deployable to Shopify as-is.
- Dual colour palette defined (dark then light override) — only light mode is active; dark vars are dead code.
- Product images are placeholder SVGs baked into CSS custom properties. Real images need to come from Shopify CDN.
- Fixed-position underwater background means all page content must layer above it (`z-index: 2+`).

## What I changed and why

- **Split into 16 independent sections** — each has a full schema so merchants can add, remove, reorder, and edit content without touching code.
- **Prefixed all classes with `pl-`** — avoids collisions with Dawn's existing styles.
- **JS as Web Components** (`<purelane-scenes>`, `<purelane-hero-stage>`, `<purelane-rotator>`) — scoped, no globals, graceful no-op if their markup isn't on the page.
- **CSS scoped per section** (inline `<style>` blocks) — only loads what's on the page, better for Core Web Vitals.
- **Signup uses Shopify's native `{% form 'customer' %}`** — real email capture, no third-party scripts.
- **Shop grid accepts a collection handle or manual blocks** — works immediately even without products imported.

## What intentionally doesn't match the HTML

- **No inline base64 product images.** Product art comes from Shopify's CDN via `image_url`. Merchants upload real photos.
- **No custom navigation or footer.** Dawn's existing header/footer sections handle cart, search, menus, payment icons, and locale — no reason to rebuild them.
- **Bundle tier features use pipe-separated text** instead of nested blocks (Shopify doesn't support blocks inside blocks).

## Semantics & Accessibility

- Decorative SVGs → `aria-hidden="true"`
- Interactive controls → `aria-label`
- Marquees pause on hover and `focus-within`
- `prefers-reduced-motion: reduce` → all animations disabled, reveals show instantly
- Keyboard focus ring: 2px solid, 3px offset, visible only on keyboard navigation
- Duplicated marquee cards → `aria-hidden="true"` so screen readers don't repeat content
- Email input → `autocomplete="email"` + `aria-label`

## How it works

1. **Scenes section** renders first — loads shared CSS, fonts, and the fixed underwater background. Its custom element handles scroll-based reveals across the entire page.
2. Each content section has `data-scene="1|2|3|4"`. As the user scrolls, the scenes JS detects the active zone and crossfades the background gradient.
3. Water parallax is driven by mouse position (desktop) + scroll via CSS custom properties.
4. Hero stage auto-advances product slides (1→2→3), pauses on hover or when offscreen.
5. All sections are independent — removing one never breaks another.

## With more time

- Wire product cards to AJAX cart API (add-to-cart without page reload)
- Add the vertical progress rail (dot nav) from the HTML as its own fixed section
- Build a proper drawer for the "Build this box" bundle flow
- Lighthouse audit and tune LCP (preload hero image, inline critical CSS)
- Add JSON-LD structured data for products and reviews

---

## Run locally

```sh
shopify theme dev --store your-store.myshopify.com
```

## Deploy

```sh
shopify theme push --theme-id THEME_ID
```
