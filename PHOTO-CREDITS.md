# Photography

All twelve photographs in `assets/img/photos/` are **placeholders**. They are free-to-use
stock images from [Unsplash](https://unsplash.com), downloaded at two widths (800w and
1600w) so the site ships self-contained rather than hot-linking a third-party CDN.

## Replace them

Swap in Spokart's own photography before launch — warehouse and dispatch, product close-ups,
staff at work, and customers' shops or academies. Real photography is the single biggest
difference between a site that looks like a template and one that looks like an established
business.

Keep the same file names and no markup changes are needed:

```
assets/img/photos/<slug>-800.jpg     # used up to ~800px wide
assets/img/photos/<slug>-1600.jpg    # used above that
```

Export at roughly 4:3, sRGB, quality ~60–70. Then run `npm run build`.

## Current placeholders

| Slug | Subject | Used on |
|---|---|---|
| `tennis-clay` | Player serving on a clay court, seen from above | Home hero, Sports (racket) |
| `hero-badminton` | Badminton smash on an indoor court | Home (shop tile) |
| `warehouse-aisle` | Stocked distribution warehouse aisle | Home, About, Brands |
| `football-match` | Players challenging for the ball | Home, Sports (team) |
| `cricket-ball` | Red leather cricket ball on grass | Home, Sports (cricket) |
| `footballs-stack` | Stack of match footballs | Home (shop tile) |
| `fitness-accessories` | Dumbbells and a resistance band | Home (shop tile) |
| `gym-dumbbells` | Dumbbell rack on a gym floor | Sports (fitness) |
| `gym-studio` | Fitted-out fitness studio | Brands |
| `runners-group` | Group training run | About, Sports (athletics) |
| `swimmer` | Swimmer mid-stroke | Sports (swimming) |

Source ids are recorded in `tools/fetch-photos.sh`; run `npm run photos` to re-download them.

## Licensing note

Unsplash images are covered by the [Unsplash License](https://unsplash.com/license), which
permits commercial use without attribution. Attribution is still good practice, and these
should be replaced with owned photography for a commercial site regardless.

## Original artwork (not stock)

These were drawn for this project and contain no third-party marks — no replacement needed:

- `assets/img/logo.svg` — wordmark
- `assets/img/favicon.svg` — browser-tab icon
- `assets/img/og-image.svg` — social share card
- `assets/img/app-mockup.svg` — the phone mockup in the app sections, showing a Spokart-branded
  interface. Swap it for real screenshots once the app exists.
- The icon sprite in `src/partials/sprite.html` — every icon on the site
