# SPOCART — Sports Supply for Business & Institutions

A fast, accessible, SEO-friendly website for **SPOCART**, a complete sports supply partner
serving sports retailers, dealers, academies, schools, colleges, institutions, clubs, gyms
and sports organisations — across sports products, equipment, apparel, accessories,
institutional supplies and **sports infrastructure**.

No e-commerce checkout, payments, authentication or product database — the site is
informational, with enquiry forms and direct WhatsApp / phone / email routes to sales.

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

Pages are assembled from shared parts by one build script, so the header, footer, icon set,
business details, product categories and brand list each exist in exactly one place.

```
src/
  layout.html            page shell: <head>, SEO tags, structured data, script/style links
  data/
    categories.mjs       the 15 product categories + their sub-categories  ← edit this
    brands.mjs           the brand list                                     ← edit this
  partials/
    header.html          topbar + sticky navigation
    footer.html          contact strip + footer columns
    quick.html           floating WhatsApp / Call / Back-to-top buttons
    sprite.html          inline SVG icon sprite (all icons used site-wide)
  pages/
    index.html           page body + a <!--META--> block (see "Page META" below)
    about.html  products.html  brands.html  b2b-sports-supply.html
    contact.html  app.html  coming-soon.html  404.html

build.mjs                assembles src/ into flat .html at the root, writes sitemap + robots
assets/css/style.css     the whole design system, one file
assets/js/main.js        progressive enhancement only
assets/img/              logo, favicon, social image, app mockup
assets/img/photos/       photography, two widths per image (800w / 1600w)
```

**Never edit the `.html` files in the project root** — they are build output and get
overwritten. Edit `src/` and run `npm run build`.

### Three sources of truth

| What | Where | Updates |
|---|---|---|
| Phone, WhatsApp, emails, domain, city, state, region | `site` object in `build.mjs` | every page, every CTA, the JSON-LD, the sitemap |
| The 15 product categories | `src/data/categories.mjs` | homepage grid, `products.html` cards + filters, B2B form checkboxes, footer column, JSON-LD |
| The brand list | `src/data/brands.mjs` | homepage marquee, `brands.html` grid, brand counts in copy |

Adding a sixteenth category is a one-line data change — no page markup is touched.

### Contact links are pre-filled

`build.mjs` derives ready-made deep links so every CTA arrives pre-qualified:

| Token | Goes to |
|---|---|
| `{{WA_GENERAL}}` `{{WA_BULK}}` `{{WA_INSTITUTION}}` `{{WA_INFRA}}` | WhatsApp with a context-specific opening message |
| `{{MAIL_SALES}}` `{{MAIL_SUPPORT}}` `{{MAIL_QUOTE}}` `{{MAIL_INSTITUTION}}` `{{MAIL_INFRA}}` | `mailto:` with a matching subject line |
| `tel:{{PHONE_TEL}}` | the sales line |

### Reusable components

| Component | Where | Notes |
|---|---|---|
| `<x-img src="slug" alt="…" ratio="4/3" sizes="…">` | any page | expands to a responsive `<img>` with `srcset`, width/height and lazy loading |
| `{{TOKEN}}` | any page or partial | replaced from the `site` config and the generated component blocks in `build.mjs` |
| `{{CATEGORY_PREVIEW}}` `{{CATEGORY_CARDS}}` `{{CATEGORY_FILTERS}}` `{{CATEGORY_CHECKS}}` | pages | generated from `src/data/categories.mjs` |
| `{{BRAND_MARQUEE}}` `{{BRAND_CARDS}}` `{{BRAND_COUNT}}` | pages | generated from `src/data/brands.mjs` |
| `.card`, `.cat`, `.cat-card`, `.brand-card`, `.step` | CSS | card families used across pages |
| `.btn`, `.btn--outline`, `.btn--white`, `.btn--ghost-light`, `.btn--wa`, `.store-btn` | CSS | button system |
| `.section--dark`, `.section--paper`, `.cta-band`, `.page-hero`, `.caps`, `.marquee`, `.infra-band` | CSS | section shells with the red diagonal treatments |

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Hero, capability strip, intro, 15 categories, why SPOCART, B2B band, schools & institutions, sports infrastructure, brands, app, contact |
| `about.html` | Who we are, what we provide, operating principles, who we supply |
| `products.html` | Filterable 15-category grid with sub-category expanders, institutional supply, infrastructure teaser |
| `brands.html` | Brand wall, range tiers, category coverage, manufacturer collaboration |
| `b2b-sports-supply.html` | B2B & bulk supply: who we supply, what a bulk order includes, schools & institutions, how it works, enquiry form, FAQs |
| `contact.html` | Contact channels, enquiry form, who to contact |
| `app.html` | Mobile app features and launch notification form |
| `coming-soon.html` | Landing page behind both app-download buttons (noindex) |
| `404.html` | Not-found page (noindex) |

---

## Design system

- **Palette** — black `#0B0B0C` and white with a single red accent `#E4132B`
- **Type** — Archivo (display/headings) + Inter (body), loaded non-blocking from Google Fonts
- **Shape** — rounded cards (8–30px), 1px borders, minimal shadows
- **Motion** — skewed red sweep on button hover, card lift, reveal-on-scroll, brand marquee
- **Diagonals** — `clip-path` and `skewX(-14deg)` wedges in the hero, page heroes, CTA bands,
  capability strip and footer

Design tokens are CSS custom properties at the top of `assets/css/style.css`. Change
`--red` there to re-skin the whole site.

### Brand assets

| File | Used for |
|---|---|
| `assets/img/logo.svg` | the SPOCART lockup on light surfaces (header) |
| `assets/img/logo-light.svg` | the same lockup recoloured for dark surfaces (footer, coming-soon) |
| `assets/img/app-icon.svg` | source artwork for every icon below — the square SPOCART app tile |
| `assets/img/favicon-32.png` | browser-tab icon; browsers scale it down for 16px slots |
| `assets/img/favicon-192.png` | Android / PWA icon |
| `assets/img/apple-touch-icon.png` | 180×180 iOS home-screen icon |
| `assets/img/og-image.svg` / `.png` | social card; **the PNG is what social platforms render** |

## Responsiveness

Breakpoints at 1180 / 1080 / 960 / 780 / 620 / 420 px. Below 960px the navigation becomes a
slide-in drawer; grids collapse 5 → 4 → 3 → 2 → 1; the hero wedge rotates to a horizontal band;
the capability strip goes 4 → 2 → 1.

## Accessibility

- Skip link, landmarks, one `<h1>` per page and an unbroken heading order on every page
- Visible focus rings, `aria-current` on the active nav item, `aria-expanded` on the menu and FAQ
- Sub-category expanders use native `<details>` — keyboard-operable with no JavaScript
- Labelled form fields with inline error messaging and `aria-live` status output
- Decorative SVGs marked `aria-hidden`; meaningful icons paired with text
- `prefers-reduced-motion` stops the brand marquee and all reveal animation; the marquee
  degrades to a plain horizontal scroller rather than hiding content
- **Nothing is hidden without JavaScript** — reveal animations are gated behind a `js` class

## Performance

- One CSS file, one JS file (`defer`), no frameworks or third-party scripts
- Icons inlined as a single SVG sprite — no icon font, no extra requests
- Photography served locally at two widths with `srcset`/`sizes`, lazy-loaded below the fold,
  and `width`/`height` on every image to prevent layout shift
- Fonts preconnected and loaded non-blocking with a `<noscript>` fallback

## SEO

Per-page title, meta description, canonical URL, Open Graph and Twitter card tags, plus one
JSON-LD `@graph` per page containing:

| Node | Where | Notes |
|---|---|---|
| `Organization` + `LocalBusiness` | every page | Ranchi/Jharkhand address, area served, contact points, the category list as `makesOffer` |
| `WebSite` | every page | one stable `@id` the other nodes reference |
| `WebPage` | every page | title, description, canonical URL |
| `BreadcrumbList` | every page below the homepage | built from the page's `crumb`, matching the visible `.crumbs` trail |
| `FAQPage` | pages with `"faq": true` | read back out of the rendered accordion, so it can never contradict what a visitor sees |

`sitemap.xml` and `robots.txt` are written on every build. Only indexable pages reach the
sitemap; the homepage is canonicalised at the bare origin (`/`) and every other page at its
`.html` path, and the canonical tag, `og:url`, JSON-LD and sitemap all read that from one
helper so they cannot disagree.

Titles and descriptions target the terms the business actually sells on — sports equipment
supplier in Ranchi and Jharkhand, sports goods wholesale, B2B and bulk sports supply, sports
equipment for schools and academies, sports infrastructure. Descriptions are kept under 160
characters so they are not truncated in results.

### Page META

Each file in `src/pages/` opens with a `<!--META ... -->` JSON block:

| Key | Required | Purpose |
|---|---|---|
| `title` | yes | `<title>`, `og:title`, `twitter:title` |
| `desc` | yes | meta description and the social equivalents — keep under 160 characters |
| `crumb` | no | second step of the breadcrumb; **must** match the page's visible `.crumbs` text |
| `robots` | no | defaults to `index, follow`; a `noindex` page is left out of the sitemap |
| `chrome` | no | `false` drops the header, footer and quick actions (landing pages) |
| `faq` | no | `true` emits `FAQPage` from the page's `.acc` accordion |
| `preload` | no | photo slug to preload as the LCP image |
| `preloadSizes` | no | the `sizes` attribute that preload should match |
| `priority`, `changefreq` | no | sitemap overrides |

---

## Before launch

1. Work through **`CONTENT-TODO.md`** — it is short.
2. Point the enquiry forms at a real handler (see below).
3. Confirm `site.SITE_URL` in `build.mjs` matches the live domain and rebuild.
4. Replace the placeholder photography (see **`PHOTO-CREDITS.md`**).

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
