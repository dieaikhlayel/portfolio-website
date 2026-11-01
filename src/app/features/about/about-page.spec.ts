import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from '../../app';
import { routes } from '../../app.routes';
import { ar } from '../../i18n/translations/ar';
import { en } from '../../i18n/translations/en';
import { CERTIFICATES, EDUCATION, EXPERIENCE, LANGUAGES } from './about.data';

describe('AboutPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes)] });
  });

  async function render(url: string) {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl(url);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('article.about')!;
  }

  const texts = (el: Element, selector: string) =>
    [...el.querySelectorAll(selector)].map((node) => node.textContent?.trim());

  it('has one h1 and the four section headings in English', async () => {
    const el = await render('/en/about');
    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')?.textContent?.trim()).toBe(en.nav.about);
    expect(texts(el, 'h2')).toEqual([
      en.about.sections.education,
      en.about.sections.experience,
      en.about.sections.certificates,
      en.about.sections.languages,
    ]);
  });

  it('has the section headings and page title in Arabic', async () => {
    const el = await render('/ar/about');
    expect(el.querySelector('h1')?.textContent?.trim()).toBe(ar.nav.about);
    expect(texts(el, 'h2')).toEqual([
      ar.about.sections.education,
      ar.about.sections.experience,
      ar.about.sections.certificates,
      ar.about.sections.languages,
    ]);
  });

  it('lists every education, experience, certificate and language entry in order', async () => {
    const el = await render('/en/about');
    const expected = [
      ...EDUCATION.map((e) => e.title.en),
      ...EXPERIENCE.map((e) => e.title.en),
      ...CERTIFICATES.map((e) => e.title.en),
      ...LANGUAGES.map((l) => l.name.en),
    ];
    expect(texts(el, 'h3')).toEqual(expected);
  });

  it('shows the degree in Arabic on the Arabic page, and keeps official names in English', async () => {
    const el = await render('/ar/about');
    const spans = [...el.querySelectorAll('.entry span')];
    const degree = spans.find((s) => s.textContent?.trim() === EDUCATION[0].title.ar)!;
    expect(degree.getAttribute('lang')).toBe('ar');
    expect(degree.getAttribute('dir')).toBe('rtl');
    const udacity = spans.find((s) => s.textContent?.trim() === 'Udacity')!;
    expect(udacity.getAttribute('lang')).toBe('en');
    expect(udacity.getAttribute('dir')).toBe('ltr');
  });

  it('gives every experience entry and the degree a full Arabic translation', () => {
    for (const entry of [...EXPERIENCE, EDUCATION[0]]) {
      expect(entry.title.ar, entry.title.en).toBeTruthy();
      expect(entry.org.ar, entry.org.en).toBeTruthy();
      expect(entry.period?.ar, entry.title.en).toBeTruthy();
    }
  });

  it('does not publish a phone number', async () => {
    const el = await render('/en/about');
    expect(el.innerHTML).not.toContain('tel:');
    expect(el.textContent).not.toMatch(/\+?\d[\d\s-]{7,}/);
  });
});
