# Product Guidelines

## Brand: Purelane
Plant-based homecare for Indian homes. Tagline: "Clean, simply."

## Palette (light mode)
- Background: `#f4f0fb` (pale lavender)
- Surface/headings: `#17102b` (near-black indigo)
- Body text: `#241a3d` at 78% opacity
- Accent: `#b8701c` (warm amber, darkened for contrast on light)
- Green (CTAs, icons, badges): `#4f7d10`
- Brand purple: `#4b3a8f`
- Scene gradients: mint-green botanical tones

## Typography
- Headings: Outfit, 800 weight, uppercase, tight tracking
- Body: Inter, 400–600 weight, sentence case
- Scale: clamp()-based fluid sizing from 375px–1440px+

## Visual Language
- Glass morphism cards (frosted white with subtle borders)
- Water/underwater theme (animated caustic SVG lines, bubbles, light shafts)
- 4-scene depth system that darkens/deepens as user scrolls
- Staggered reveal animations on scroll (blur + translateY)
- Product photography with drop shadows on light ground

## Pricing Model
- Single product: ₹200–₹299
- Bundle tiers: 2 for ₹349, 3 for ₹499, 5 for ₹799
- Free shipping on all bundles
- COD available

## Content Sections (homepage order)
1. Scenes (fixed background)
2. Ticker (shipping/trust messages)
3. Hero (headline + product stage)
4. Reviews marquee
5. Ingredients
6. Pillars (how it works)
7. Proof (stats + rotator)
8. Best-selling combos
9. Bundle tiers
10. Shop (product grid)
11. Full range strip
12. Why bundles
13. Categories
14. Trust bar
15. Email signup
16. Sticky CTA (mobile)

## Key UX Behaviours
- Background scenes crossfade as user scrolls through data-scene zones
- Hero product stage auto-advances 1→2→3 products
- Review rail auto-scrolls, pauses on hover
- Product rotator cycles through 6 products in proof section
- Mobile sticky CTA appears below 960px
- All animations disabled when `prefers-reduced-motion: reduce`
