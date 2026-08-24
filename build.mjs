/**
 * SPOCART static site build
 * ---------------------------------------------------------------------------
 * Assembles src/pages/*.html into flat, static HTML at the project root using
 * shared partials (header, footer, icon sprite, quick actions) and one layout.
 *
 * Run:  npm run build      (or: node build.mjs)
 *
 * Two sources of truth feed the whole site:
 *   • the `site` object below      — business details (phone, email, links)
 *   • src/data/*.mjs               — product categories and brands
 * Change a value in either and every page updates on the next build.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories, groups, featuredCategoryIds } from './src/data/categories.mjs';
import { brands } from './src/data/brands.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');

/* ---------------------------------------------------------------------------
   SITE CONFIG — the single source of truth for business details.
   Change a value here and every page picks it up on the next build.
   --------------------------------------------------------------------------- */
const site = {
  BRAND:         'SPOCART',
  SITE_URL:      'https://www.spocart.in',
  PHONE:         '+91 70619 11575',
  PHONE_TEL:     '+917061911575',
  WHATSAPP:      'https://wa.me/917061911575',
  EMAIL:         'sales@spocart.in',
  EMAIL_SUPPORT: 'support@spocart.in',
  REGION:        'India',
  /* Location. Ranchi is the operating base; supply runs across India. These
     feed the page copy, the footer NAP block and the LocalBusiness schema, so
     the address reads identically everywhere Google looks for it. */
  CITY:          'Ranchi',
  STATE:         'Jharkhand',
  COUNTRY:       'India',
  COUNTRY_CODE:  'IN',
  LOCATION:      'Ranchi, Jharkhand'
};

/* Pre-filled WhatsApp deep links. Keeps enquiries pre-qualified before the
   first reply, and keeps the message copy in one place. */
const waMsg = (text) => `${site.WHATSAPP}?text=${encodeURIComponent(text)}`;
site.WA_GENERAL      = waMsg('Hi SPOCART, I would like to know more about your sports supply.');
site.WA_BULK         = waMsg('Hi SPOCART, I would like to discuss a bulk / B2B requirement.');
site.WA_INSTITUTION  = waMsg('Hi SPOCART, I am enquiring on behalf of a school / college / institution.');
site.WA_INFRA        = waMsg('Hi SPOCART, I would like to discuss a sports infrastructure project.');

/* Pre-filled mailto links, same idea. */
const mailto = (to, subject) => `mailto:${to}?subject=${encodeURIComponent(subject)}`;
site.MAIL_SALES       = `mailto:${site.EMAIL}`;
site.MAIL_SUPPORT     = `mailto:${site.EMAIL_SUPPORT}`;
site.MAIL_QUOTE       = mailto(site.EMAIL, 'Bulk / B2B quote request');
site.MAIL_INSTITUTION = mailto(site.EMAIL, 'School / institution sports supply enquiry');
site.MAIL_INFRA       = mailto(site.EMAIL, 'Sports infrastructure project consultation');

/* Structured data ------------------------------------------------------------
   Factual and minimal on purpose. Nothing here asserts a rating, a price, a
   founding date, a partnership or a customer count we cannot evidence.

   Node graph, by page:
     • Organization + LocalBusiness  — one node, stable @id, on every page
     • WebSite                       — on every page, same @id
     • WebPage                       — per page, linked to both of the above
     • BreadcrumbList                — every page below the homepage
     • FAQPage                       — pages that carry a visible FAQ accordion
   --------------------------------------------------------------------------- */
const ID_ORG  = `${site.SITE_URL}/#organization`;
const ID_SITE = `${site.SITE_URL}/#website`;

/* Address: locality, region and country only. No street line or postcode is
   asserted here because none is published on the site — add them to `site`
   and to the footer NAP block together, never one without the other. */
const postalAddress = {
  '@type': 'PostalAddress',
  addressLocality: site.CITY,
  addressRegion: site.STATE,
  addressCountry: site.COUNTRY_CODE
};

const organization = {
  '@type': ['Organization', 'LocalBusiness'],
  '@id': ID_ORG,
  name: 'SPOCART',
  alternateName: 'Spocart Sports',
  url: site.SITE_URL,
  logo: `${site.SITE_URL}/assets/img/logo.svg`,
  image: `${site.SITE_URL}/assets/img/og-image.png`,
  description:
    'SPOCART is a wholesale and B2B sports equipment supplier based in Ranchi, Jharkhand, ' +
    'supplying sports goods, equipment, apparel, footwear, accessories, institutional ' +
    'supplies and sports infrastructure to sports shops, retailers, academies, schools, ' +
    'institutions and businesses across India.',
  address: postalAddress,
  areaServed: [
    { '@type': 'City', name: site.CITY },
    { '@type': 'State', name: site.STATE },
    { '@type': 'Country', name: site.COUNTRY }
  ],
  email: site.EMAIL,
  telephone: site.PHONE_TEL,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: site.PHONE_TEL,
      email: site.EMAIL,
      areaServed: site.COUNTRY_CODE,
      availableLanguage: ['en', 'hi']
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: site.EMAIL_SUPPORT,
      areaServed: site.COUNTRY_CODE,
      availableLanguage: ['en', 'hi']
    }
  ],
  makesOffer: categories.map((c) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: strip(c.name), description: strip(c.blurb) }
  }))
};

const website = {
  '@type': 'WebSite',
  '@id': ID_SITE,
  name: 'SPOCART',
  url: site.SITE_URL,
  inLanguage: 'en-IN',
  publisher: { '@id': ID_ORG }
};

/** Home / Section — matches the visible .crumbs trail on every inner page. */
function breadcrumbs(page) {
  if (!page.crumb) return null;
  return {
    '@type': 'BreadcrumbList',
    '@id': `${locFor(page.slug)}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: page.crumb, item: locFor(page.slug) }
    ]
  };
}

/**
 * FAQPage, read back out of the rendered accordion so the markup can never
 * drift from the answers a visitor actually sees — which is the condition
 * Google puts on FAQ rich results. Opt in with "faq": true in a page's META.
 */
function faqPage(page, html) {
  if (!page.faq) return null;
  const items = [];
  const re = /<h3><button class="acc__btn"[^>]*>([\s\S]*?)<span class="acc__ico"[\s\S]*?<div class="acc__panel"[^>]*><div>([\s\S]*?)<\/div><\/div>/g;
  let m;
  while ((m = re.exec(html))) {
    items.push({
      '@type': 'Question',
      name: text(m[1]),
      acceptedAnswer: { '@type': 'Answer', text: text(m[2]) }
    });
  }
  if (!items.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${locFor(page.slug)}#faq`,
    mainEntity: items
  };
}

/** Tags out, entities decoded, whitespace collapsed — safe for a JSON string. */
const text = (html) =>
  applyTokens(String(html))
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    // Stripping an inline <a> leaves a space before the punctuation that followed it.
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim();

const jsonld = (page, html) => {
  const webpage = {
    '@type': 'WebPage',
    '@id': `${locFor(page.slug)}#webpage`,
    name: page.title,
    description: page.desc,
    url: locFor(page.slug),
    inLanguage: 'en-IN',
    isPartOf: { '@id': ID_SITE },
    about: { '@id': ID_ORG },
    publisher: { '@id': ID_ORG }
  };
  const crumbs = breadcrumbs(page);
  if (crumbs) webpage.breadcrumb = { '@id': crumbs['@id'] };

  const graph = [organization, website, webpage, crumbs, faqPage(page, html)].filter(Boolean);
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph
  })}</script>`;
};

/* ---------------------------------------------------------------------------
   <x-img> — responsive image component.
   Usage in a page:
     <x-img src="photo-1234" alt="…" ratio="4/3" sizes="(max-width:780px) 100vw, 50vw">
   `src` may be an Unsplash photo id (served responsively via their CDN) or a
   local path under assets/img/. Swap the ids for client photography at launch.
   --------------------------------------------------------------------------- */
const IMG_WIDTHS = [800, 1600];

function attrs(str) {
  const out = {};
  const re = /([a-zA-Z-]+)(?:="([^"]*)")?/g;
  let m;
  while ((m = re.exec(str))) out[m[1]] = m[2] === undefined ? '' : m[2];
  return out;
}

function xImg(html) {
  return html.replace(/<x-img\s+([^>]*?)\/?>/g, (_, raw) => {
    const a = attrs(raw);
    const ratio = (a.ratio || '4/3').split('/').map(Number);
    const base = Number(a.w || 1200);
    const height = Math.round((base * ratio[1]) / ratio[0]);

    // A bare slug resolves to the local two-width photo set; anything with a
    // slash or dot is used verbatim.
    const literal = /[\/.]/.test(a.src);
    const src = literal ? a.src : `assets/img/photos/${a.src}-1600.jpg`;
    const srcset = literal
      ? ''
      : IMG_WIDTHS.map((w) => `assets/img/photos/${a.src}-${w}.jpg ${w}w`).join(', ');
    const priority = 'priority' in a;

    return [
      '<img',
      `src="${src}"`,
      srcset ? `srcset="${srcset}"` : '',
      srcset ? `sizes="${a.sizes || '100vw'}"` : '',
      `alt="${a.alt || ''}"`,
      `width="${base}" height="${height}"`,
      priority ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"',
      a.class ? `class="${a.class}"` : '',
      '>'
    ].filter(Boolean).join(' ');
  });
}

/**
 * Per-page <head> additions.
 * "preload": "<photo-slug>" in a page's META preloads that photo at the same
 * two widths <x-img> renders, so the largest-contentful-paint image starts
 * downloading with the stylesheet instead of after it.
 */
function headExtra(meta) {
  if (!meta.preload) return '';
  const srcset = IMG_WIDTHS.map((w) => `assets/img/photos/${meta.preload}-${w}.jpg ${w}w`).join(', ');
  return `<link rel="preload" as="image" href="assets/img/photos/${meta.preload}-1600.jpg" ` +
         `imagesrcset="${srcset}" imagesizes="${meta.preloadSizes || '100vw'}" fetchpriority="high">`;
}

/* ---------------------------------------------------------------------------
   Content components — generated from src/data/*.mjs
   ---------------------------------------------------------------------------
   Pages drop a {{TOKEN}} where a block of category or brand markup belongs, so
   adding a fifteenth-plus category or a new brand is a one-line data change.
   --------------------------------------------------------------------------- */

/** Strip the HTML entities used in the data files (for alt/aria/JSON contexts).
    A function declaration, not a const: the JSON-LD block above is evaluated at
    module load and calls it while building the Organization node. */
function strip(str) {
  return String(str).replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
}

const byId = (id) => categories.find((c) => c.id === id);

/** Compact tile — homepage category preview. */
function catTile(c) {
  return `        <a class="cat" href="products.html#${c.id}" data-reveal>
          <span class="cat__icon" aria-hidden="true"><svg><use href="#${c.icon}"></use></svg></span>
          <span class="cat__name">${c.name}</span>
          <span class="cat__count">${c.items.length} sub-categories</span>
        </a>`;
}

/** Full card with an expander listing every subcategory — products.html. */
function catCard(c, index) {
  const pills = c.items.map((i) => `<span class="pill">${i}</span>`).join('');
  const n = String(index + 1).padStart(2, '0');
  return `        <article class="card cat-card${c.feature ? ' cat-card--feature' : ''}" id="${c.id}" data-tags="${c.group}" data-reveal>
          <span class="cat-card__no" aria-hidden="true">${n}</span>
          <span class="card__icon" aria-hidden="true"><svg><use href="#${c.icon}"></use></svg></span>
          <h3>${c.name}</h3>
          <p>${c.blurb}</p>
          <details class="cat-more">
            <summary><span>View ${c.items.length} sub-categories</span><span class="cat-more__ico" aria-hidden="true"><svg><use href="#i-chevron-down"></use></svg></span></summary>
            <p class="pill-row">${pills}</p>
          </details>
          <p class="cat-card__cta">
            <a class="link-arrow" href="contact.html#enquiry">Enquire about ${strip(c.name)} <svg aria-hidden="true"><use href="#i-arrow-right"></use></svg></a>
          </p>
        </article>`;
}

/** Filter buttons, driven by the same group list the cards are tagged with. */
function catFilterBar() {
  return groups
    .map((g, i) =>
      `        <button class="btn btn--sm ${i === 0 ? 'btn--dark' : 'btn--outline'}" type="button" data-filter="${g.key}" aria-pressed="${i === 0}">${g.label}</button>`)
    .join('\n');
}

/** Checkbox set on the partner application — stays in step with the catalogue. */
function catChecks() {
  return categories
    .map((c) => `              <label class="check"><input type="checkbox" name="category" value="${c.id}"><span>${c.name}</span></label>`)
    .join('\n');
}

/** Curated footer column. */
function footerCats() {
  return featuredCategoryIds
    .map((id) => byId(id))
    .filter(Boolean)
    .map((c) => `          <li><a href="products.html#${c.id}">${c.name}</a></li>`)
    .join('\n');
}

/** Typographic brand card — see the note in src/data/brands.mjs. */
const brandPlate = (b) => `<span class="brand-plate">${b}</span>`;

function brandCards() {
  return brands
    .map((b) => `      <div class="brand-card" data-reveal><span class="brand-card__mark" aria-hidden="true">${b.charAt(0)}</span><b>${b}</b></div>`)
    .join('\n');
}

/**
 * Marquee — one track, the list rendered twice so the loop is seamless. The
 * duplicate is hidden from assistive tech and the whole thing freezes under
 * prefers-reduced-motion (see the CSS), where it degrades to a plain scroller.
 */
function brandMarquee(rows = 2) {
  const per = Math.ceil(brands.length / rows);
  return Array.from({ length: rows }, (_, r) => {
    const slice = brands.slice(r * per, (r + 1) * per);
    const plates = slice.map(brandPlate).join('');
    return `      <div class="marquee__row" data-dir="${r % 2 ? 'reverse' : 'forward'}">
        <div class="marquee__track">
          <div class="marquee__group">${plates}</div>
          <div class="marquee__group" aria-hidden="true">${plates}</div>
        </div>
      </div>`;
  }).join('\n');
}

/** Registered as {{TOKEN}}s and expanded in every page and partial. */
const components = {
  CATEGORY_PREVIEW: categories.map(catTile).join('\n'),
  CATEGORY_CARDS:   categories.map(catCard).join('\n'),
  CATEGORY_FILTERS: catFilterBar(),
  CATEGORY_CHECKS:  catChecks(),
  // Shown as "15+" rather than a hard "15" — reads better in marketing copy
  // and stays honest as sub-categories grow. The "+" lives here so every page
  // picks it up from the one place.
  CATEGORY_COUNT:   `${categories.length}+`,
  FOOTER_CATEGORIES: footerCats(),
  // Same "+" treatment as CATEGORY_COUNT — reads as a portfolio, not a ceiling.
  BRAND_COUNT:      `${brands.length}+`,
  BRAND_MARQUEE:    brandMarquee(2),
  BRAND_CARDS:      brandCards(),
  INFRA_ITEMS:      (byId('infrastructure') || { items: [] }).items
                      .map((i) => `<span class="pill">${i}</span>`).join(''),
  INSTITUTION_ITEMS: (byId('institutional') || { items: [] }).items
                      .map((i) => `<span class="pill">${i}</span>`).join('')
};

/* Asset fingerprints.
   The CSS and JS filenames never change, so browsers (and the VS Code preview,
   and any CDN) happily serve a stale copy after a rebuild. Appending a content
   hash to the query string makes every rebuild a new URL, so what you reload is
   always what you just built. */
const fingerprint = (path) =>
  createHash('sha1').update(read(path)).digest('hex').slice(0, 8);

const assetVersions = {
  CSS_V: fingerprint('assets/css/style.css'),
  JS_V:  fingerprint('assets/js/main.js')
};

/* Canonical URL for a page. The homepage lives at the bare origin, every other
   page at its .html path — the canonical tag, og:url, the JSON-LD and the
   sitemap all read from here so the four can never disagree. */
const locFor = (slug) => (slug === 'index' ? `${site.SITE_URL}/` : `${site.SITE_URL}/${slug}.html`);

const layout = read('src/layout.html');
const sprite = read('src/partials/sprite.html');
const header = read('src/partials/header.html');
const footer = read('src/partials/footer.html');
const quick  = read('src/partials/quick.html');

/** Replace {{TOKEN}} placeholders from the site config and the components. */
function applyTokens(html) {
  const bag = { ...site, ...components, ...assetVersions };
  return html.replace(/\{\{([A-Z0-9_]+)\}\}/g, (m, key) =>
    Object.prototype.hasOwnProperty.call(bag, key) ? bag[key] : m
  );
}

/** Mark the current page in the nav for a11y + styling. */
function markActive(html, slug) {
  return html.replace(
    new RegExp(`(<a[^>]*data-nav="${slug}")`, 'g'),
    '$1 aria-current="page"'
  );
}

const pageFiles = readdirSync(join(root, 'src/pages')).filter((f) => f.endsWith('.html'));
const built = [];

for (const file of pageFiles) {
  const raw = read(join('src/pages', file));
  const fm = raw.match(/^<!--META\s*([\s\S]*?)-->\s*/);
  if (!fm) throw new Error(`Missing <!--META ... --> block in src/pages/${file}`);

  const meta = JSON.parse(fm[1]);
  const content = xImg(raw.slice(fm[0].length));
  const slug = file.replace(/\.html$/, '');
  const page = {
    slug,
    title: meta.title,
    desc: meta.desc,
    // Second step of the breadcrumb trail — must match the visible .crumbs nav.
    crumb: slug === 'index' ? null : (meta.crumb || null),
    faq: meta.faq === true
  };

  let out = layout
    .replace('{{SPRITE}}', sprite)
    .replace('{{HEADER}}', meta.chrome === false ? '' : markActive(header, slug))
    .replace('{{FOOTER}}', meta.chrome === false ? '' : footer)
    .replace('{{QUICK}}', meta.chrome === false ? '' : quick)
    .replace('{{CONTENT}}', content)
    .replace('{{JSONLD}}', jsonld(page, content))
    .replace('{{HEAD_EXTRA}}', headExtra(meta))
    .replace(/\{\{TITLE\}\}/g, meta.title)
    .replace(/\{\{DESC\}\}/g, meta.desc)
    .replace(/\{\{SLUG\}\}/g, slug)
    .replace(/\{\{CANONICAL\}\}/g, locFor(slug))
    .replace(/\{\{ROBOTS\}\}/g, meta.robots || 'index, follow');

  out = applyTokens(out);
  writeFileSync(join(root, `${slug}.html`), out);
  built.push({
    slug,
    bytes: out.length,
    indexable: (meta.robots || 'index').includes('noindex') === false,
    priority: meta.priority,
    changefreq: meta.changefreq
  });
}

/* sitemap.xml + robots.txt ----------------------------------------------------
   Only indexable pages reach the sitemap — a noindex page listed in a sitemap
   is a contradiction Search Console reports as an error. Priority and
   changefreq default sensibly and can be overridden per page in its META. */
const today = new Date().toISOString().slice(0, 10);

const defaultPriority = (slug) => (slug === 'index' ? '1.0' : '0.8');
const defaultChangefreq = (slug) => (slug === 'index' ? 'weekly' : 'monthly');

const urls = built
  .filter((p) => p.indexable)
  .sort((a, b) => (a.slug === 'index' ? -1 : b.slug === 'index' ? 1 : a.slug.localeCompare(b.slug)))
  .map((p) => `  <url>
    <loc>${locFor(p.slug)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq || defaultChangefreq(p.slug)}</changefreq>
    <priority>${p.priority || defaultPriority(p.slug)}</priority>
  </url>`)
  .join('\n');

writeFileSync(join(root, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);

/* robots.txt — the source directory is the only thing worth hiding. CSS, JS
   and images stay crawlable: blocking them stops Google rendering the page as
   a visitor sees it, which costs more than it saves. */
writeFileSync(join(root, 'robots.txt'),
`# robots.txt for ${site.SITE_URL}
User-agent: *
Allow: /
Disallow: /src/
Disallow: /tools/
Allow: /assets/

Sitemap: ${site.SITE_URL}/sitemap.xml
`);

console.log(`Assets: style.css?v=${assetVersions.CSS_V}  main.js?v=${assetVersions.JS_V}`);
console.log(`Built ${built.length} pages:`);
built.forEach((p) => console.log(`  ${p.slug}.html  ${(p.bytes / 1024).toFixed(1)} KB`));
console.log('Wrote sitemap.xml, robots.txt');
