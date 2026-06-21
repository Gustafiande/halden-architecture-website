# HALDEN — Architecture Studio Landing Page

A single-page marketing site for the fictional Nordic architecture studio **HALDEN**,
built from a Claude Design handoff. Dark editorial layout with large display
typography, GSAP scroll animations, and an image-led work grid.

## Stack

Static **HTML / CSS / vanilla JS** — no build step. Open `index.html` in a browser
or serve the folder with any static server.

```bash
# from the project root
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
index.html              # the page
css/styles.css          # design tokens (:root) + all component styles
js/main.js              # GSAP + ScrollTrigger entrance & parallax animations
assets/imagery/         # 12 architectural photographs
```

## Design system

Tokens live as CSS custom properties at the top of `css/styles.css`:

- **Ink** (`--hd-ink-900…600`) — dark surfaces, page background `#10100f`
- **Paper** (`--hd-paper-100…300`) — light sections `#eae7e1`
- **Sage** (`--hd-accent` `#7d8a6f`) — the single accent colour
- **Concrete** — mid neutrals used on paper sections
- Type: **Archivo** (display) + **Space Grotesk** (body), loaded from Google Fonts

## Notes

- GSAP/ScrollTrigger are loaded from a CDN. Animations are disabled and content
  stays fully visible when `prefers-reduced-motion: reduce` is set or JS is off.
- Image parallax uses an inner layer inset by 12% inside an `overflow:hidden` frame.
