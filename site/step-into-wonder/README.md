# Step Into Wonder

A single-page immersive parallax landing page built with React + TypeScript + Tailwind CSS on Vite.

Two scroll-driven scenes play out inside a sticky full-viewport stage within a 480vh scroll
container:

1. **Scene 1 — the portal.** Theatre curtains part on load, revealing a world seen through a
   portal frame. Scrolling zooms through the portal (world, clouds, portal and curtains each
   scale/translate at their own rate) while the hero UI fades away.
2. **Scene 2 — the arc slider.** Past the portal, a second heading fades in and nine pastel
   cards sweep along a wheel-like arc, rotation driven directly by scroll progress.

Mouse movement adds a smoothed, per-layer parallax drift on top of the scroll-driven transforms.
The entire page lives in `src/App.tsx`; Tailwind is used only for responsive breakpoints
(`md`, and `xl` overridden to 1100px), with all other styling inline.

## Develop

```sh
npm install
npm run dev      # dev server
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## Note on assets

The five scene background images (portal frame, curtains, world, clouds) are loaded from a
Cloudinary account that currently answers `401 cloud_name dy5er7kv5 is disabled`, so those
layers render empty until the account is re-enabled or the URLs are swapped. The three photo
card images and Google Fonts load normally.
