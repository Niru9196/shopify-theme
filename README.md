# Purelane Homepage — Shopify Dawn Theme Build

Pixel-accurate recreation of `purelane-homepage.html` as a merchant-editable Shopify Online Store 2.0 theme built on Dawn.

---

## 1. Metafield & Metaobject Definitions

No metaobjects were created. The theme reads from two metafield namespaces — both are industry-standard and auto-populated by common review apps (Shopify Product Reviews, Judge.me, Loox):

| Namespace | Key | Type | Purpose |
|-----------|-----|------|---------|
| `reviews` | `rating` | `rating` | Star rating value (e.g. 4.8) — only displayed if populated |
| `reviews` | `rating_count` | `number_integer` | Total review count — only displayed if populated |
| `custom` | `badge` | `single_line_text_field` | Product badge text ("Best seller", "New", etc.) — optional, no fallback |

To set these up: **Settings → Custom data → Products → Add definition**.

If no review app is installed and these metafields are empty, the rating row simply doesn't render. No fake data appears.

---

## 2. Build Notes

### What I'd flag about the original HTML

- Single 1,700-line monolith — all CSS, JS, base64 SVGs inline. Not deployable.
- Dual palette (dark defined first, then fully overridden to light) — the dark vars are dead weight.
- Product images are base64 SVG placeholders baked into CSS custom properties — works for a mockup but can't serve real product photos.
- The fixed-position underwater background forces all content to `z-index: 2+`. Workable but requires awareness.
- Scroll logic uses `offsetTop` walking (brittle if DOM changes) — kept the approach but scoped it inside a custom element.

### What I changed and why

| Change | Reason |
|--------|--------|
| Split into 16 independent sections with schemas | Merchant can edit, reorder, remove anything in the theme editor |
| Prefixed all classes `pl-` | Avoids collision with Dawn's base.css |
| JS as Web Components | Scoped lifecycle, no globals, graceful no-op if markup isn't present |
| CSS scoped per section (inline `<style>`) | Only loads CSS for sections on the page — better CWV |
| Signup uses `{% form 'customer' %}` | Real Shopify email capture, no third-party scripts |
| Shop section pulls from a real collection | Prices, titles, images, availability all come from Shopify — nothing hardcoded |
| Sold-out state + no-image placeholder added | Original HTML had neither — real stores need both |
| Long titles clamped to 2 lines | Prevents grid misalignment with real product names |

### What intentionally doesn't match the HTML

- **No base64 product images** — images come from Shopify CDN via `image_url`
- **No custom nav or footer** — Dawn's existing header/footer handle cart, search, menus, payment icons
- **Bundle features use pipe-separated text** — Shopify doesn't support blocks-inside-blocks
- **No vertical progress rail (dot nav)** — deprioritised; would add as a separate fixed section with more time

### What I'd do with more time

- Wire product cards to AJAX cart API (add-to-cart without page reload)
- Build a drawer/modal for the "Build this box" bundle flow
- Add the vertical progress rail from the HTML
- Lighthouse audit — preload hero image, inline critical CSS, tune LCP
- Add JSON-LD structured data for Product and AggregateRating
- Animate ingredient SVGs on scroll with Lottie or CSS keyframes

---

## 3. AI Workflow Notes

### What I delegated

- **Entire implementation** was done through Kiro (AI agent in VS Code). I described what each section should do, the constraints (pixel-accurate, editable, accessible, performant), and had it build section by section.
- **Git commit structure** — delegated the splitting of files into logical commits with proper prefix conventions.

### Where it failed me

- **First pass had hardcoded fallback data** — rating defaults like `| default: '4.8'` and auto-assigned "Best seller" badges. Had to explicitly flag that nothing should render without real Shopify data.
- **Collection field was left empty in index.json** — technically correct (no collection selected yet) but meant products didn't appear until I caught it.
- **No sold-out or missing-image states initially** — the HTML mockup didn't have these edge cases, so the AI didn't think to add them unprompted. Real stores hit these immediately.

### What I'd systematise for twenty more of these

1. **Steering file with data rules upfront** — "no fallback data, no hardcoded strings, show nothing if the field is empty" as a project-level rule before any code is written.
2. **Edge-case checklist per section** — sold out, no image, no reviews, title overflow, empty collection, single product in grid. Run through each before marking done.
3. **Template JSON pre-filled with a real collection handle** — avoids the "why isn't it showing" moment on first preview.
4. **Commit hook that greps for `| default:`** — catches fake fallback data before it lands in the repo.

---

## Run locally

```sh
shopify theme dev --store your-store.myshopify.com
```

## Deploy

```sh
shopify theme push --unpublished --store your-store.myshopify.com
```
