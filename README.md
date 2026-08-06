# Purelane Homepage — Shopify Dawn Build

A pixel-accurate translation of `purelane-homepage.html` into a fully merchant-editable Shopify Online Store 2.0 theme, built on Dawn.

---

## Build Notes

### What I flagged in the original HTML

- Single monolithic file (~1,700 lines) with all CSS, SVG, and JS inline. No separation of concerns, not deployable to Shopify as-is.
- Product images are base64 SVG placeholders embedded in CSS custom properties. Works for the reference but needs real image assets in production.
- The HTML uses a dual palette (dark variables defined first, then overridden with light-mode values in a second `<style>` block). Only the light mode is live — the dark vars are dead code.
- Scroll-driven scene crossfade relies on `offsetTop` walking, which can be brittle if DOM structure changes. I preserved the logic but scoped it to a custom element.
- The `position: fixed` underwater background means the entire page content must sit at `z-index: 2+`. This works but requires awareness when adding new sections.

### What I changed and why

| Decision | Reason |
|----------|--------|
| Prefixed all classes with `pl-` | Avoids collision with Dawn's existing base.css and component styles |
| Split into 16 sections with individual schemas | Each section is independently reorderable, removable, and configurable in the theme editor |
| Extracted shared tokens into `purelane-base.css` | Single source of truth for palette, type scale, glass effects — change once, applies everywhere |
| Built JS as Web Components (`<purelane-scenes>`, `<purelane-hero-stage>`, `<purelane-rotator>`) | Scoped lifecycle, no globals, graceful no-op if markup is absent |
| Used scoped `<style>` blocks for most sections instead of one giant CSS file | Only loads CSS for sections actually on the page; better for CWV |
| Signup form uses Shopify's `{% form 'customer' %}` | Real email capture without third-party scripts; works with Klaviyo if synced via Shopify customer tags |
| Shop section accepts a collection handle OR manual blocks | Works on day one even without products in the store |

### What doesn't match the HTML (intentionally)

- **No inline base64 product images.** The HTML bakes product art as CSS custom properties. In the theme, product images come from Shopify's CDN via `image_url` filter. Merchants upload real photos.
- **No hardcoded navigation.** The original HTML has a bespoke nav pill. This build defers to Dawn's existing header section group — keeps cart, search, and mega-menu logic intact.
- **No footer rebuild.** Same reasoning — Dawn's footer handles payment icons, locale selectors, and policies. No value in duplicating that.
- **Bundle tier features use pipe-separated text** (e.g. `"Pick any two|Free shipping"`) instead of nested blocks. Shopify doesn't support blocks-inside-blocks, and this keeps the editor clean.

### Semantics & Accessibility

- All decorative SVGs carry `aria-hidden="true"`
- Interactive controls (dots, buttons) have `aria-label`
- Marquees and auto-advancing elements pause on hover and focus-within
- `prefers-reduced-motion: reduce` disables all animations and reveals instantly
- Focus-visible ring: 2px solid green, 3px offset, 6px radius — visible on keyboard, invisible on click
- Review cards in the duplicated half of the marquee are marked `aria-hidden="true"` to prevent screen readers from reading content twice
- Email input has `autocomplete="email"` and a visible label via placeholder + aria-label

### How it works

1. **Scenes section** renders first. It loads `purelane-base.css`, Google Fonts, and the fixed underwater background. Its custom element (`<purelane-scenes>`) also handles the IntersectionObserver that reveals `.pl-rv` elements site-wide.
2. **Each content section** carries a `data-scene="1|2|3|4"` attribute. As the user scrolls, the scenes JS detects which zone is at the viewport midpoint and crossfades the background gradient.
3. **Parallax** is driven by `mousemove` (desktop) and `scrollY` — CSS custom properties `--px` and `--py` on each water layer.
4. **The hero stage** auto-advances slides (1 product → 2 → 3) via `<purelane-hero-stage>`. It pauses when out of viewport or on hover.
5. **The product rotator** in the proof section cycles images with a caption + dot indicator.
6. **All sections are independent.** Remove one in the theme editor — nothing else breaks.

### With more time I would

- Replace the SVG ingredient illustrations with Lottie or animated SVGs that respond to scroll position
- Add a progress rail (the vertical dot nav from the HTML) as its own section with `position: fixed` and scroll-spy
- Build a proper drawer/modal for the "Build this box" flow rather than linking to a collection
- Wire the product cards to Shopify's AJAX cart API (add-to-cart without page reload)
- Add structured data (JSON-LD) for Product and AggregateRating
- Performance audit with Lighthouse and tune LCP (preload hero image, inline critical CSS above the fold)
- Add theme editor live-preview JS (`Shopify.designMode` listeners) so block reordering reflects instantly

---

## Running locally

```sh
shopify theme dev --store your-store.myshopify.com
```

## Deploying

```sh
shopify theme push --theme-id THEME_ID
```

## License

Based on [Dawn](https://github.com/Shopify/dawn) by Shopify. See [LICENSE.md](/LICENSE.md).
