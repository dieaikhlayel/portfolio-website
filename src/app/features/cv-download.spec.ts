import { existsSync, readFileSync } from 'node:fs';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from '../app';
import { routes } from '../app.routes';
import { ar } from '../i18n/translations/ar';
import { en } from '../i18n/translations/en';

const CV_PATH = 'cv/Diea_Ikhlayel_CV.pdf';

describe('Download CV', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes)] });
  });

  async function downloadLinks(url: string) {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl(url);
    await fixture.whenStable();
    const main = (fixture.nativeElement as HTMLElement).querySelector('main')!;
    return [...main.querySelectorAll('a[download]')];
  }

  for (const [url, label] of [
    ['/en', en.cv.download],
    ['/ar', ar.cv.download],
    ['/en/about', en.cv.download],
    ['/ar/about', ar.cv.download],
  ] as const) {
    it(`${url} has one download button for the CV, with the right label`, async () => {
      const links = await downloadLinks(url);
      expect(links.length).toBe(1);
      expect(links[0].getAttribute('href')).toBe(CV_PATH);
      expect(links[0].getAttribute('download')).toBe('Diea_Ikhlayel_CV.pdf');
      expect(links[0].getAttribute('hreflang')).toBe('en');
      expect(links[0].textContent?.trim()).toBe(label);
    });
  }

  it('tells Arabic visitors that the CV is in English', () => {
    expect(ar.cv.download).toContain('بالإنجليزية');
    expect(en.cv.download).toContain('English');
  });

  it('points at a real PDF file of a sensible size', () => {
    const file = `public/${CV_PATH}`;
    expect(existsSync(file)).toBe(true);
    const bytes = readFileSync(file);
    expect(bytes.subarray(0, 5).toString('ascii')).toBe('%PDF-');
    expect(bytes.subarray(-1024).toString('latin1')).toContain('%%EOF');
    expect(bytes.length).toBeGreaterThan(10 * 1024);
    expect(bytes.length).toBeLessThan(500 * 1024);
  });
});
