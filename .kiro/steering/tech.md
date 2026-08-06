# Tech Guidelines

## Stack
- Shopify Dawn theme (Online Store 2.0)
- Liquid templates + JSON schemas
- CSS: scoped `<style>` blocks per section OR dedicated asset files for larger sections
- JS: Web Components (custom elements), one per interactive behaviour
- Fonts: Outfit (headings, 500–800) + Inter (body, 400–700) via Google Fonts

## Naming
- All CSS classes prefixed `pl-` (Purelane) to avoid collision with Dawn's base styles
- Section files: `sections/purelane-{name}.liquid`
- Assets: `assets/purelane-{name}.css` or `assets/purelane-{name}.js`
- Custom elements: `<purelane-{name}>` (lowercase, hyphenated)

## Performance
- Fonts loaded once in `purelane-scenes.liquid` (first section rendered)
- `purelane-base.css` loaded once via the scenes section
- JS deferred with `defer="defer"`, never render-blocking
- Images use `loading="lazy"` (except first hero slide which uses `loading="eager"`)
- Backdrop-filter blur reduced on mobile for GPU perf
- CSS animations respect `prefers-reduced-motion: reduce`
- No jQuery, no third-party libraries

## Accessibility
- Focus-visible outline: 2px solid `--pl-green`, 3px offset
- All decorative SVGs have `aria-hidden="true"`
- Interactive elements have `aria-label` or visible text
- Marquees pause on hover and focus-within
- Reduced motion: all animations collapse to instant, reveals show immediately

## Theme Editor Safety
- Every section has a full `{% schema %}` with presets
- Blocks can be added, removed, reordered without breaking layout
- `data-scene` attributes drive background crossfade — removing a section doesn't break the scenes system (it gracefully falls back)
- No section depends on another section existing on the page

## CSS Architecture
- Design tokens in `:root` via `purelane-base.css`
- Glass effect classes: `.pl-glass` (primary) and `.pl-glass-2` (lighter)
- Reveal utility: `.pl-rv` + `.pl-in` (added by IntersectionObserver in scenes.js)
- Button system: `.pl-btn` base + `.pl-btn-primary` / `.pl-btn-ghost` + `.pl-btn-sm`
