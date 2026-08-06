# Structure

## File layout
- One section = one file in `sections/`, e.g. `sections/hero.liquid`
- Shared card markup → `snippets/product-card.liquid` (and similar),
  called via `{% render %}`, never `{% include %}`
- Section-specific CSS either scoped `<style>` block inside the
  section file, or a dedicated asset (`assets/component-hero.css`)
  loaded via `{{ 'x.css' | asset_url | stylesheet_tag }}`
- JS: small, scoped custom elements per interactive piece (rotator,
  sticky CTA, scene crossfade), each guarded to no-op gracefully if
  its markup isn't present on the page

## Commit conventions
- One logical change per commit, not batched unrelated changes
- Prefix style: `feat: hero schema + markup`,
  `fix: hero reduced-motion not disabling water animation`,
  `style: scope hero CSS to section`