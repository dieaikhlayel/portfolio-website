import { existsSync } from 'node:fs';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from '../../app';
import { routes } from '../../app.routes';
import { ar } from '../../i18n/translations/ar';
import { en } from '../../i18n/translations/en';

describe('HomePage hero', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes)] });
  });

  async function render(url: string) {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl(url);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('main')!;
  }

  it('shows the name, role and intro in English', async () => {
    const main = await render('/en');
    expect(main.querySelector('h1')?.textContent?.trim()).toBe(en.site.name);
    expect(main.querySelector('.hero__role')?.textContent?.trim()).toBe(en.home.hero.role);
    expect(main.querySelector('.hero__intro')?.textContent?.trim()).toBe(en.home.hero.intro);
  });

  it('shows the name, role and intro in Arabic', async () => {
    const main = await render('/ar');
    expect(main.querySelector('h1')?.textContent?.trim()).toBe(ar.site.name);
    expect(main.querySelector('.hero__role')?.textContent?.trim()).toBe(ar.home.hero.role);
    expect(main.querySelector('.hero__intro')?.textContent?.trim()).toBe(ar.home.hero.intro);
  });

  it('has a primary button to Projects and a secondary button to Contact', async () => {
    const main = await render('/en');
    const primary = main.querySelector('a.btn--primary');
    const secondary = main.querySelector('a.btn--secondary');
    expect(primary?.getAttribute('href')).toBe('/en/projects');
    expect(primary?.textContent?.trim()).toBe(en.home.hero.viewProjects);
    expect(secondary?.getAttribute('href')).toBe('/en/contact');
    expect(secondary?.textContent?.trim()).toBe(en.home.hero.contactMe);
  });

  it('keeps the buttons inside the Arabic site on the Arabic page', async () => {
    const main = await render('/ar');
    expect(main.querySelector('a.btn--primary')?.getAttribute('href')).toBe('/ar/projects');
    expect(main.querySelector('a.btn--secondary')?.getAttribute('href')).toBe('/ar/contact');
  });

  it('has exactly one h1', async () => {
    const main = await render('/en');
    expect(main.querySelectorAll('h1').length).toBe(1);
  });

  describe('photo', () => {
    it('has a description that says the image is AI-generated, in English and in Arabic', async () => {
      const english = await render('/en');
      expect(english.querySelector('.hero__photo')?.getAttribute('alt')).toBe(en.home.photo.alt);
      expect(en.home.photo.alt.toLowerCase()).toContain('ai-generated');
      const arabic = await render('/ar');
      expect(arabic.querySelector('.hero__photo')?.getAttribute('alt')).toBe(ar.home.photo.alt);
    });

    it('has no visible caption under it', async () => {
      const main = await render('/en');
      expect(main.querySelector('.hero__figure figcaption')).toBeNull();
    });

    it('points only at image files that exist, and gives the browser the size to avoid page jumps', async () => {
      const main = await render('/en');
      const img = main.querySelector('.hero__photo')!;
      expect(img.getAttribute('width')).toBe('960');
      expect(img.getAttribute('height')).toBe('960');
      const srcset = main.querySelector('.hero__figure source')!.getAttribute('srcset')!;
      const files = [
        img.getAttribute('src')!,
        ...srcset.split(',').map((s) => s.trim().split(' ')[0]),
      ];
      expect(files.length).toBe(3);
      for (const file of files) {
        expect(existsSync(`public/${file}`), file).toBe(true);
      }
    });
  });
});
