# Content still to supply

The site is personalised with SPOCART's real business information: company name, product
categories, brands, contact details and service messaging. **Every placeholder that invented
a fact has been removed** — there are no fake statistics, prices, testimonials, review counts,
partnerships, delivery times or customer numbers anywhere in the build.

What follows is the short list of things that still need a real value, and the things worth
doing before or shortly after launch.

---

## 1. Confirm the live domain — `build.mjs`

`site.SITE_URL` is set to `https://www.spocart.in`. If the live site will be served from a
different host (e.g. `https://spocart.in` without `www`), change it there and re-run the
build — canonical URLs, Open Graph URLs and `sitemap.xml` all follow from it.

## 2. Optional business details

These were deliberately **left out** rather than faked. Add them only when they can be
evidenced from real records:

| Detail | Where it would go | Notes |
|---|---|---|
| Registered office address | `src/partials/header.html` topbar, `src/pages/contact.html` | Add a `PIN`-complete address to `build.mjs` and reintroduce the `#i-pin` row |
| Working hours | topbar / contact channels grid | Add `HOURS` to `build.mjs` and a `#i-clock` contact card |
| GSTIN / legal entity name | `src/pages/about.html`, `contact.html` | Trade buyers often ask; publish only what is registered |
| Social profiles | header / footer | The social icon rows were removed because the URLs were `#`. Add real profile URLs, then re-add the icon list |
| Founding year, milestones, team | `src/pages/about.html` | The old placeholder timeline was removed. A real, dated timeline can be added back |

## 3. Connect the enquiry forms

No backend is wired up. The forms validate in the browser and show a confirmation, but
nothing is sent anywhere. Add an `action` and `method="POST"` to each
`<form data-enquiry>` and the script steps aside so the browser submits normally:

```html
<form class="form" data-enquiry novalidate action="https://formspree.io/f/XXXX" method="POST">
```

Forms appear on `index.html`, `partner.html`, `contact.html`, `app.html` and
`coming-soon.html` (their sources are under `src/pages/`).

Until then, WhatsApp and email are the working enquiry routes — every CTA already points at
a real, pre-filled `wa.me` or `mailto:` link.

## 4. Brands

`src/data/brands.mjs` holds the 31 brand names, rendered as typographic cards.

> **Do not add third-party brand logo files.** They are copyrighted, and using them can imply
> an endorsement or distribution agreement that has not been confirmed. The wording on the
> site ("Brands available", "Our product portfolio includes") is chosen for the same reason —
> do not upgrade it to "authorised distributor" or "official partner" unless that is
> documented in writing.

If a brand later supplies approved artwork under a written agreement, add a `logo` path to
its entry and extend `brandCard()` in `build.mjs`.

## 5. Product categories

`src/data/categories.mjs` is the single source of truth for all 15 categories and their
sub-categories. Editing it updates the homepage preview grid, the filterable grid on
`products.html`, the B2B form's checkbox list, the footer column and the JSON-LD — no page
markup needs touching.

Confirm each sub-category against what SPOCART actually supplies and remove anything that
does not apply.

## 6. Trade terms

`partner.html` FAQs answer honestly and generally (pricing is quoted against the requirement,
availability varies by category). If SPOCART sets firm rules — a minimum order value,
required documents, dispatch windows, a damage-reporting period — add them there; specifics
convert better than generalities.

## 7. Photography

See `PHOTO-CREDITS.md`. All twelve photographs are stock placeholders. Replace them with
SPOCART's own warehouse, product, installation and customer photography when available —
particularly on the infrastructure page, where a real completed court or track would do more
than any stock image.

## 8. Mobile app

- Trim the `app.html` feature list to what will actually ship in v1
- Replace `assets/img/app-mockup.svg` with real app screenshots
- When the listings go live, point the Android/iOS buttons at the Play Store and App Store
  instead of `coming-soon.html` (they appear in `src/partials/footer.html`, `index.html` and
  `app.html`)

## 9. Social preview image

`assets/img/og-image.png` (1200×630) is what WhatsApp, LinkedIn, Facebook and X actually
render — SVG previews are not supported by any of them. It is generated from
`assets/img/og-image.svg`; if you edit the SVG, re-export the PNG at 1200×630 and keep both
in sync.

## 10. After any change

Run `npm run build`, then reload. Never edit the `.html` files at the project root — they are
build output and get overwritten.
