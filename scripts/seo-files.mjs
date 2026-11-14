// Runs after "ng build". Usage:
//   node scripts/seo-files.mjs --site https://example.github.io/portfolio-website/ --index
//   node scripts/seo-files.mjs --site https://example.github.io/portfolio-v2/ --noindex
//
// 1. Makes 404.html, so GitHub Pages shows the site's own "page not found" page.
// 2. --index   : writes sitemap.xml listing every page in English and Arabic.
//    --noindex : adds a "noindex" tag to every page, so a preview copy stays out of search results.
//
// There is no robots.txt on purpose: search engines only read it at the root of a domain
// (github.io/robots.txt), which this project does not control.
import {
  copyFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { decodeEntities, socialTags } from '../src/app/core/seo/social-tags.ts';

const args = process.argv.slice(2);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const outDir = option('--out') ?? 'dist/portfolio-v2/browser';
const site = option('--site');
const wantIndex = args.includes('--index');
const wantNoindex = args.includes('--noindex');
const LANGS = ['en', 'ar'];

function fail(message) {
  console.error('seo-files: ' + message);
  process.exit(1);
}

if (!site || !site.startsWith('https://') || !site.endsWith('/')) {
  fail('--site must be a full address that starts with https:// and ends with /');
}
if (wantIndex === wantNoindex) fail('use exactly one of --index or --noindex');
if (!existsSync(outDir)) fail(`build folder not found: ${outDir} (run ng build first)`);

// 1. 404 page: the client-side shell boots Angular, whose router shows the 404 page.
const shell = join(outDir, 'index.csr.html');
if (!existsSync(shell)) fail('index.csr.html not found in the build folder');
copyFileSync(shell, join(outDir, '404.html'));

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? htmlFiles(path) : name.endsWith('.html') ? [path] : [];
  });
}

// Page paths inside one language folder, e.g. ['', 'about', 'contact'].
function pagesIn(lang) {
  const root = join(outDir, lang);
  if (!existsSync(root)) fail(`no ${lang} folder in the build`);
  return htmlFiles(root)
    .filter((file) => file.endsWith('index.html'))
    .map((file) =>
      file
        .slice(root.length, -'index.html'.length)
        .replaceAll('\\', '/')
        .replace(/^\/|\/$/g, ''),
    )
    .sort();
}

if (wantNoindex) {
  const tag = '<meta name="robots" content="noindex, nofollow">';
  let changed = 0;
  for (const file of htmlFiles(outDir)) {
    const html = readFileSync(file, 'utf8');
    if (html.includes('name="robots"')) continue;
    writeFileSync(file, html.replace(/<head>/i, `<head>${tag}`));
    changed++;
  }
  console.log(`seo-files: 404.html created, noindex added to ${changed} page(s)`);
} else {
  const pages = pagesIn('en');
  const missing = pages.filter((page) => !pagesIn('ar').includes(page));
  if (missing.length) fail(`pages missing in Arabic: ${missing.join(', ')}`);

  const url = (lang, page) => `${site}${lang}/${page ? page + '/' : ''}`;
  const entries = LANGS.flatMap((lang) =>
    pages.map((page) =>
      [
        '  <url>',
        `    <loc>${url(lang, page)}</loc>`,
        ...LANGS.map(
          (other) =>
            `    <xhtml:link rel="alternate" hreflang="${other}" href="${url(other, page)}"/>`,
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${url('en', page)}"/>`,
        '  </url>',
      ].join('\n'),
    ),
  );
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');
  writeFileSync(join(outDir, 'sitemap.xml'), xml);

  // 3. Link previews: the main address, language links, and the Open Graph and Twitter card tags.
  let tagged = 0;
  for (const lang of LANGS) {
    for (const page of pages) {
      const pageFile = join(outDir, lang, page, 'index.html');
      const html = readFileSync(pageFile, 'utf8');
      if (html.includes('property="og:title"')) continue;
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
      const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
      if (!title || !description) fail(`no title or description found in ${pageFile}`);
      const tags = socialTags({
        site,
        lang,
        page,
        title: decodeEntities(title),
        description: decodeEntities(description),
      });
      writeFileSync(pageFile, html.replace('</head>', `${tags}\n</head>`));
      tagged++;
    }
  }
  console.log(
    `seo-files: 404.html and sitemap.xml created (${entries.length} addresses), preview tags added to ${tagged} page(s)`,
  );
}
