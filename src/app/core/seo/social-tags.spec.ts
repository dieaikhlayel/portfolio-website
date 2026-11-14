import { existsSync, readFileSync } from 'node:fs';
import { PREVIEW_IMAGE, decodeEntities, escapeAttribute, pageUrl, socialTags } from './social-tags';

const SITE = 'https://example.github.io/portfolio-website/';

const tags = (
  lang: 'en' | 'ar',
  page: string,
  title = 'About | Diea',
  description = 'A short text.',
) => socialTags({ site: SITE, lang, page, title, description });

describe('socialTags', () => {
  it('builds full addresses, with the home page ending in the language folder', () => {
    expect(pageUrl(SITE, 'en', '')).toBe(`${SITE}en/`);
    expect(pageUrl(SITE, 'ar', 'about')).toBe(`${SITE}ar/about/`);
  });

  it('names the page itself as the main address', () => {
    expect(tags('en', 'about')).toContain(`<link rel="canonical" href="${SITE}en/about/">`);
    expect(tags('ar', 'contact')).toContain(`<link rel="canonical" href="${SITE}ar/contact/">`);
    expect(tags('en', '')).toContain(`<link rel="canonical" href="${SITE}en/">`);
  });

  it('points to both languages of the same page, with English as the default', () => {
    const result = tags('ar', 'projects');
    expect(result).toContain(`hreflang="en" href="${SITE}en/projects/"`);
    expect(result).toContain(`hreflang="ar" href="${SITE}ar/projects/"`);
    expect(result).toContain(`hreflang="x-default" href="${SITE}en/projects/"`);
  });

  it('gives link previews a title, text, address and a large picture', () => {
    const result = tags('en', 'about', 'About | Diea Ikhlayel', 'Portfolio of Diea.');
    expect(result).toContain('<meta property="og:title" content="About | Diea Ikhlayel">');
    expect(result).toContain('<meta property="og:description" content="Portfolio of Diea.">');
    expect(result).toContain(`<meta property="og:url" content="${SITE}en/about/">`);
    expect(result).toContain(`<meta property="og:image" content="${SITE}images/og-card.png">`);
    expect(result).toContain('<meta property="og:image:width" content="1200">');
    expect(result).toContain('<meta property="og:image:height" content="630">');
    expect(result).toContain('<meta name="twitter:card" content="summary_large_image">');
    expect(result).toContain(`<meta name="twitter:image" content="${SITE}images/og-card.png">`);
  });

  it('marks the language of the preview, and the other language as an alternative', () => {
    expect(tags('en', '')).toContain('<meta property="og:locale" content="en_US">');
    expect(tags('en', '')).toContain('<meta property="og:locale:alternate" content="ar_AR">');
    expect(tags('ar', '')).toContain('<meta property="og:locale" content="ar_AR">');
    expect(tags('ar', '')).toContain('<meta property="og:locale:alternate" content="en_US">');
  });

  it('keeps Arabic text as it is', () => {
    const result = tags('ar', '', 'ضياء إخليل | الملف الشخصي', 'الملف الشخصي لضياء إخليل');
    expect(result).toContain('content="ضياء إخليل | الملف الشخصي"');
  });

  it('escapes quotes and angle brackets so the page cannot break', () => {
    const result = tags('en', '', 'A "quoted" <title> & more', 'x');
    expect(result).toContain('content="A &quot;quoted&quot; &lt;title&gt; &amp; more"');
    expect(result).not.toContain('"quoted"');
  });

  it('turns escaped text back into plain text, so it is not escaped twice', () => {
    const original = `Tom & "Jerry" <3`;
    expect(decodeEntities(escapeAttribute(original))).toBe(original);
  });

  it('refuses a site address that is not a full https address ending in a slash', () => {
    expect(() =>
      socialTags({ site: 'http://x.io/', lang: 'en', page: '', title: 't', description: 'd' }),
    ).toThrow();
    expect(() =>
      socialTags({ site: 'https://x.io', lang: 'en', page: '', title: 't', description: 'd' }),
    ).toThrow();
  });
});

describe('preview picture', () => {
  const file = `public/${PREVIEW_IMAGE.path}`;

  it('exists in the public folder', () => {
    expect(existsSync(file)).toBe(true);
  });

  it('is a PNG of exactly the size the tags promise', () => {
    const bytes = readFileSync(file);
    expect(bytes.subarray(1, 4).toString('ascii')).toBe('PNG');
    expect(bytes.readUInt32BE(16)).toBe(PREVIEW_IMAGE.width);
    expect(bytes.readUInt32BE(20)).toBe(PREVIEW_IMAGE.height);
  });

  it('is small enough to load quickly', () => {
    expect(readFileSync(file).length).toBeLessThan(300 * 1024);
  });
});
