# Spokart — B2B Sports Equipment Wholesale Website

A fast, accessible, SEO-friendly informational website for **Spokart**, a wholesale sports
equipment supplier serving retailers, distributors, academies, schools, gyms and institutions.

No e-commerce checkout, payments, authentication or product database — the site is
informational, with enquiry forms and an outbound link to the separate online store.

---

## Quick start

```bash
npm run build      # assemble the static HTML into the project root
npm run dev        # build, then serve on http://localhost:8080
```

`npm run serve` and `npm start` do the same thing as `npm run dev`. There is no watch mode —
after editing anything in `src/`, re-run `npm run build` and refresh the browser.

You can also just open `index.html` in a browser — the built output is plain static files
with no runtime dependencies.

---

## How the site is put together

Pages are assembled from shared parts by a ~150-line build script, so the header, footer,
icon set and business details exist in exactly one place each.

```
src/
  layout.html            page shell: <head>, SEO tags, structured data, script/style links
  partials/
    header.html          topbar + sticky navigation
    footer.html          contact strip + footer columns
    quick.html           floating WhatsApp / Call / Back-to-top buttons
    sprite.html          inline SVG icon sprite (all icons used site-wide)
  pages/
    index.html           page body + a <!--META--> block (title, description, robots)
    about.html  sports.html  brands.html  partner.html
    contact.html  app.html  coming-soon.html  404.html

build.mjs                assembles src/ into flat .html at the root, writes sitemap + robots
tools/fetch-photos.sh    re-downloads the placeholder photography
assets/css/style.css     the whole design system, one file
assets/js/main.js        progressive enhancement only
assets/img/photos/       photography, two widths per image (800w / 1600w)
```

**Never edit the `.html` files in the project root** — they are build output and get
overwritten. Edit `src/` and run `npm run build`.

### Business details live in one place

Phone numbers, email addresses, the shop URL, social links and the office address are set
in the `site` object at the top of `build.mjs`. Change a value there and every page picks it
up on the next build.

### Reusable components

| Component | Where | Notes |
|---|---|---|
| `<x-img src="slug" alt="…" ratio="4/3" sizes="…">` | any page | expands to a responsive `<img>` with `srcset`, width/height and lazy loading |
| `{{TOKEN}}` | any page or partial | replaced from the `site` config in `build.mjs` |
| `.card`, `.tile`, `.cat`, `.step`, `.brand-card` | CSS | card families used across pages |
| `.btn`, `.btn--outline`, `.btn--white`, `.btn--ghost-light`, `.store-btn` | CSS | button system |
| `.section--dark`, `.section--paper`, `.cta-band`, `.page-hero` | CSS | section shells with the red diagonal treatments |

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Hero, intro, stats, categories, brands, why-us, B2B CTA, shop online, app, contact |
| `about.html` | Who we are, what we handle, milestones, principles, who we supply, compliance |
| `sports.html` | Filterable category grid plus six detailed category sections |
| `brands.html` | Brand wall, sourcing policy, range tiers, collaboration pitch for manufacturers |
| `partner.html` | B2B benefits, audiences, how it works, application form, FAQs |
| `contact.html` | Contact channels, enquiry form, departments, offices, map slot |
| `app.html` | Mobile app features and launch notification form |
| `coming-soon.html` | Landing page behind both app-download buttons (noindex) |
| `404.html` | Not-found page (noindex) |

---

## Design system

- **Palette** — black `#0B0B0C` and white with a single red accent `#E4132B`
- **Type** — Archivo (display/headings) + Inter (body), loaded non-blocking from Google Fonts
- **Shape** — rounded cards (8–30px), 1px borders, minimal shadows
- **Motion** — skewed red sweep on button hover, card lift, reveal-on-scroll, animated nav underline
- **Diagonals** — `clip-path` and `skewX(-14deg)` wedges in the hero, page heroes, CTA bands and footer

Design tokens are CSS custom properties at the top of `assets/css/style.css`. Change
`--red` there to re-skin the whole site.

## Responsiveness

Breakpoints at 1180 / 1080 / 960 / 780 / 620 / 420 px. Below 960px the navigation becomes a
slide-in drawer; grids collapse 4 → 2 → 1; the hero wedge rotates to a horizontal band.

## Accessibility

- Skip link, landmarks, one `<h1>` per page and an ordered heading structure
- Visible focus rings, `aria-current` on the active nav item, `aria-expanded` on the menu and FAQ
- Labelled form fields with inline error messaging and `aria-live` status output
- Decorative SVGs marked `aria-hidden`; meaningful icons paired with text
- `prefers-reduced-motion` disables animation
- **Nothing is hidden without JavaScript** — reveal animations are gated behind a `js` class

## Performance

- One CSS file, one JS file (`defer`), no frameworks or third-party scripts
- Icons inlined as a single SVG sprite — no icon font, no extra requests
- Photography served locally at two widths with `srcset`/`sizes`, lazy-loaded below the fold,
  and `width`/`height` on every image to prevent layout shift
- Fonts preconnected and loaded non-blocking with a `<noscript>` fallback

## SEO

Per-page title, meta description, canonical URL, Open Graph and Twitter card tags;
`Organization` + `WebPage` JSON-LD; auto-generated `sitemap.xml` and `robots.txt`.
Set the real domain in `site.SITE_URL` in `build.mjs` before launch.

---

## Before launch

1. Work through **`CONTENT-TODO.md`** — every placeholder is listed there.
2. Replace the placeholder photography (see **`PHOTO-CREDITS.md`**).
3. Point the enquiry forms at a real handler (see below).
4. Set `site.SITE_URL` to the live domain and rebuild.

### Connecting the forms

The forms currently validate in the browser and show a confirmation message; nothing is sent
anywhere. To wire one up, add an `action` (and `method="POST"`) to the `<form>` element — the
script detects the `action` attribute and lets the browser submit normally:

```html
<form class="form" data-enquiry novalidate action="https://formspree.io/f/XXXX" method="POST">
```

Any endpoint works — Formspree, Netlify Forms, a CRM webhook or your own script.

## Deployment

Static hosting: upload everything except `src/`, `tools/`, `build.mjs` and `package.json`
(or upload all of it — `robots.txt` already disallows `/src/`). Works unchanged on Netlify,
Vercel, Cloudflare Pages, GitHub Pages, S3 or any shared host.
