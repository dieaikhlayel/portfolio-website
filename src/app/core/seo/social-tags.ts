/**
 * Builds the <head> tags that make a shared link show a proper preview card (title, short text and
 * picture) on LinkedIn, WhatsApp, X and similar, and that tell search engines which address is the
 * main one and where the other-language version lives.
 *
 * The build script (scripts/seo-files.mjs) runs this for every page of the release build.
 * Keep this file plain: no enums or other TypeScript-only features, because Node runs it directly.
 */
export type SocialLang = 'en' | 'ar';

export interface SocialTagsInput {
  /** Full address of the site, ending with a slash, e.g. https://example.github.io/portfolio-website/ */
  readonly site: string;
  readonly lang: SocialLang;
  /** The page inside its language folder: '' for the home page, otherwise 'about', 'projects'... */
  readonly page: string;
  readonly title: string;
  readonly description: string;
}

/** The picture shown in link previews. The file lives in public/images. */
export const PREVIEW_IMAGE = { path: 'images/og-card.png', width: 1200, height: 630 } as const;

const LOCALE: Record<SocialLang, string> = { en: 'en_US', ar: 'ar_AR' };
const OTHER: Record<SocialLang, SocialLang> = { en: 'ar', ar: 'en' };

export function pageUrl(site: string, lang: SocialLang, page: string): string {
  return `${site}${lang}/${page ? `${page}/` : ''}`;
}

export function escapeAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/** The reverse of escapeAttribute, for text read back out of already-built HTML. */
export function decodeEntities(value: string): string {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}

export function socialTags(input: SocialTagsInput): string {
  const { site, lang, page } = input;
  if (!site.startsWith('https://') || !site.endsWith('/')) {
    throw new Error('site must start with https:// and end with /');
  }

  const url = pageUrl(site, lang, page);
  const title = escapeAttribute(input.title);
  const description = escapeAttribute(input.description);
  const image = `${site}${PREVIEW_IMAGE.path}`;

  return [
    `<link rel="canonical" href="${url}">`,
    `<link rel="alternate" hreflang="en" href="${pageUrl(site, 'en', page)}">`,
    `<link rel="alternate" hreflang="ar" href="${pageUrl(site, 'ar', page)}">`,
    `<link rel="alternate" hreflang="x-default" href="${pageUrl(site, 'en', page)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:locale" content="${LOCALE[lang]}">`,
    `<meta property="og:locale:alternate" content="${LOCALE[OTHER[lang]]}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:width" content="${PREVIEW_IMAGE.width}">`,
    `<meta property="og:image:height" content="${PREVIEW_IMAGE.height}">`,
    `<meta property="og:image:alt" content="${title}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${image}">`,
  ].join('\n');
}
