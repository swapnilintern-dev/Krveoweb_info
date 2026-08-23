# Content to replace before launch

Everything the client still needs to supply. Placeholders are written in `[square brackets]`
and rendered with a dashed underline (the `.ph` CSS class) so they are impossible to miss on
the page. Search the project for `[` or for `class="ph"` to find them all.

**Nothing on this site claims a fact we could not verify.** No statistics, brand
partnerships, certifications, delivery times or customer counts have been invented — every
one of those is left as a slot for the client to fill from their own records.

---

## 1. Business details — `build.mjs` (`site` object)

One edit here updates every page.

| Key | Currently | Needs |
|---|---|---|
| `SITE_URL` | `https://www.spokart.example` | live domain (also fixes canonical/OG/sitemap URLs) |
| `PHONE` / `PHONE_TEL` | `[+91 XXXXX XXXXX]` / `+910000000000` | display number, and digits-only version for `tel:` |
| `PHONE_ALT` | placeholder | secondary/landline number, or delete the row on `contact.html` |
| `WHATSAPP` | `https://wa.me/910000000000` | `https://wa.me/<country code><number>` |
| `EMAIL` / `EMAIL_SUPPORT` | `…@spokart.example` | real sales and support addresses |
| `ADDRESS_SHORT` / `ADDRESS_FULL` | placeholders | registered office address |
| `HOURS` | `[Mon–Sat, 10:00–19:00]` | actual working hours |
| `REGION` | `[your service region]` | e.g. the states/cities served |
| `SHOP_URL` | `https://shop.spokart.example` | the live online store |
| `GST` | `[GSTIN to be added]` | tax registration number |
| `SOCIAL_LI/IG/FB/YT` | `#` | social profile URLs (delete unused icons from the partials) |

Also update `accounts@spokart.example` and `careers@spokart.example` on `contact.html`.

## 2. Statistics — `src/pages/index.html`

The stats band shows `[XXX]+`, `[XX]+`, `[XXX]+`, `[XX]+` for business partners, cities
served, products supplied and years in the trade. **These are deliberately blank** — fill
them in only with figures the business can evidence, then delete the grey note beneath the
band (`.build-note--dark`). The hero badge (`since [YYYY]`) and the hero chip (`[XXX]+
products in catalogue`) need the same treatment.

## 3. Brands — `src/pages/brands.html` and `src/pages/index.html`

Twelve `[Brand NN]` slots on the brands page and ten on the homepage, plus a `Logo` plate on
each brand card.

> Add **only** manufacturers Spokart is genuinely authorised to stock and display. Use logo
> files supplied by the brand, and follow each brand's rules on how their mark and any
> relationship may be described. Where there is no formal agreement, describe products as
> available "through authorised channels" rather than implying a partnership.

Delete the red `.notice` block on `brands.html` and the `.build-note` on `index.html` once
real brands are in.

## 4. Company story — `src/pages/about.html`

- "Who we are" — two or three paragraphs of real company history
- Milestones — five entries, each with a real year and event (the last one, "Now", can stay)
- Registration & compliance — legal entity name, tax registration, registered office,
  trade references. Publish nothing that cannot be evidenced.

## 5. Trade terms — `src/pages/partner.html`

The FAQ answers contain bracketed gaps for:
- minimum order value per category
- whether unregistered buyers, schools or societies can be onboarded
- typical dispatch and transit times
- the damage/shortage reporting window and resolution process
- the exact document list required to open an account

Also confirm the "What to keep ready" note in the *How it works* section.

## 6. Product lists — `src/pages/sports.html`

Six category sections list typical wholesale lines. Check each against the live stock list
and delete anything Spokart does not actually supply. Remove the `.build-note` afterwards.

## 7. Contact page — `src/pages/contact.html`

- Head office and warehouse addresses
- Replace the map placeholder with a Google Maps `<iframe>` (keep `loading="lazy"` and add a
  descriptive `title` attribute)
- Real Privacy Policy, Terms of Supply and Returns pages — the footer links currently all
  point at `contact.html`

## 8. Mobile app — `src/pages/app.html`, `src/pages/coming-soon.html`

- Trim the feature list to what will actually ship in v1
- Replace the phone photograph with real app screenshots
- When the listings go live, point the Android/iOS buttons at the Play Store and App Store
  instead of `coming-soon.html` (they appear in `src/partials/footer.html`, `index.html` and
  `app.html`)
- Set a real value on the coming-soon progress bar, or delete `.soon__progress`

## 9. Forms

No backend is connected. Add an `action` and `method="POST"` to each `<form data-enquiry>`
and the browser will submit normally — see the README. Forms appear on `index.html`,
`partner.html`, `contact.html`, `app.html` and `coming-soon.html`.

## 10. Photography

See `PHOTO-CREDITS.md`. All twelve images are stock placeholders and should be swapped for
Spokart's own warehouse, product and customer photography.

## 11. Housekeeping

- Delete every `.build-note` and `.notice` block once its content is resolved
- Remove the `.ph` class from any element whose bracketed text you replace
- Run `npm run build` after each change
