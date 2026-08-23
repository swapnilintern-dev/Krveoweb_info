/**
 * Spokart static site build
 * ---------------------------------------------------------------------------
 * Assembles src/pages/*.html into flat, static HTML at the project root using
 * shared partials (header, footer, icon sprite, quick actions) and one layout.
 *
 * Run:  npm run build      (or: node build.mjs)
 *
 * Business details live in ONE place — the `site` object below. Change a phone
 * number or address here and every page updates on the next build.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');

/* ---------------------------------------------------------------------------
   SITE CONFIG — replace every [bracketed] placeholder with real details.
   --------------------------------------------------------------------------- */
const site = {
  SITE_URL:      'https://www.spokart.example',      // [REPLACE] live domain
  PHONE:         '[+91 XXXXX XXXXX]',                // [REPLACE]
  PHONE_TEL:     '+910000000000',                    // [REPLACE] digits only
  PHONE_ALT:     '[+91 XXXXX XXXXX]',                // [REPLACE]
  WHATSAPP:      'https://wa.me/910000000000',       // [REPLACE] wa.me/<number>
  EMAIL:         'sales@spokart.example',            // [REPLACE]
  EMAIL_SUPPORT: 'support@spokart.example',          // [REPLACE]
  ADDRESS_SHORT: '[Street Address, City, State]',    // [REPLACE]
  ADDRESS_FULL:  '[Unit No., Building / Warehouse Name]<br>[Street Address, Area]<br>[City, State — PIN]', // [REPLACE]
  HOURS:         '[Mon–Sat, 10:00–19:00]',           // [REPLACE]
  REGION:        '[your service region]',            // [REPLACE]
  SHOP_URL:      'https://shop.spokart.example',     // [REPLACE] online store URL
  GST:           '[GSTIN to be added]',              // [REPLACE]
  SOCIAL_LI:     '#',                                // [REPLACE] LinkedIn URL
  SOCIAL_IG:     '#',                                // [REPLACE] Instagram URL
  SOCIAL_FB:     '#',                                // [REPLACE] Facebook URL
  SOCIAL_YT:     '#'                                 // [REPLACE] YouTube URL
};

/* Structured data — kept factual and minimal on purpose. */
const jsonld = (page) => {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Spokart',
    url: site.SITE_URL,
    logo: `${site.SITE_URL}/assets/img/logo.svg`,
    description: 'Spokart supplies sports equipment, apparel and accessories on wholesale terms to retailers, academies, schools and institutions.',
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: site.PHONE_TEL,
      email: site.EMAIL,
      availableLanguage: ['en']
    }]
  };
  const web = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.desc,
    url: `${site.SITE_URL}/${page.slug}.html`,
    isPartOf: { '@type': 'WebSite', name: 'Spokart', url: site.SITE_URL }
  };
  const blocks = page.slug === 'index' ? [org, web] : [web];
  return blocks
    .map((b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`)
    .join('\n');
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

const layout = read('src/layout.html');
const sprite = read('src/partials/sprite.html');
const header = read('src/partials/header.html');
const footer = read('src/partials/footer.html');
const quick  = read('src/partials/quick.html');

/** Replace {{TOKEN}} placeholders from the site config. */
function applyTokens(html) {
  return html.replace(/\{\{([A-Z0-9_]+)\}\}/g, (m, key) =>
    Object.prototype.hasOwnProperty.call(site, key) ? site[key] : m
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
  const page = { slug, title: meta.title, desc: meta.desc };

  let out = layout
    .replace('{{SPRITE}}', sprite)
    .replace('{{HEADER}}', meta.chrome === false ? '' : markActive(header, slug))
    .replace('{{FOOTER}}', meta.chrome === false ? '' : footer)
    .replace('{{QUICK}}', meta.chrome === false ? '' : quick)
    .replace('{{CONTENT}}', content)
    .replace('{{JSONLD}}', jsonld(page))
    .replace(/\{\{TITLE\}\}/g, meta.title)
    .replace(/\{\{DESC\}\}/g, meta.desc)
    .replace(/\{\{SLUG\}\}/g, slug)
    .replace(/\{\{ROBOTS\}\}/g, meta.robots || 'index, follow');

  out = applyTokens(out);
  writeFileSync(join(root, `${slug}.html`), out);
  built.push({ slug, bytes: out.length, indexable: (meta.robots || 'index').includes('noindex') === false });
}

/* sitemap.xml + robots.txt ---------------------------------------------------- */
const today = new Date().toISOString().slice(0, 10);
const urls = built
  .filter((p) => p.indexable)
  .sort((a, b) => (a.slug === 'index' ? -1 : b.slug === 'index' ? 1 : a.slug.localeCompare(b.slug)))
  .map((p) => `  <url>
    <loc>${site.SITE_URL}/${p.slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p.slug === 'index' ? '1.0' : '0.8'}</priority>
  </url>`)
  .join('\n');

writeFileSync(join(root, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);

writeFileSync(join(root, 'robots.txt'),
`User-agent: *
Allow: /
Disallow: /src/

Sitemap: ${site.SITE_URL}/sitemap.xml
`);

console.log(`Built ${built.length} pages:`);
built.forEach((p) => console.log(`  ${p.slug}.html  ${(p.bytes / 1024).toFixed(1)} KB`));
console.log('Wrote sitemap.xml, robots.txt');
