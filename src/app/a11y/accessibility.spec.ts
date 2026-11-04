import axe from 'axe-core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from '../app';
import { routes } from '../app.routes';
import { LANGS, LANG_DIRECTION, Lang } from '../i18n/lang';

const PAGES = ['', '/projects', '/about', '/contact', '/not-a-page'];

/** Short, readable description of one problem, so a failing test says what to fix and where. */
function describeViolation(violation: axe.Result): string {
  const where = violation.nodes.map((node) => node.target.join(' ')).join(' | ');
  return `${violation.id} (${violation.impact}): ${violation.help}. Where: ${where}`;
}

/**
 * In the test environment axe cannot decide the page-level rules (one main heading, one main
 * landmark): it marks them "needs review" even on a good page. So we check the basics ourselves.
 */
function structureProblems(lang: Lang): string[] {
  const problems: string[] = [];
  const count = (selector: string) => document.querySelectorAll(selector).length;

  if (count('main') !== 1) problems.push(`expected exactly one <main>, found ${count('main')}`);
  if (count('h1') !== 1) problems.push(`expected exactly one <h1>, found ${count('h1')}`);
  if (!document.querySelector('main h1')) problems.push('the <h1> is not inside <main>');

  const root = document.documentElement;
  if (root.getAttribute('lang') !== lang) {
    problems.push(`<html lang> is "${root.getAttribute('lang')}", expected "${lang}"`);
  }
  if (root.getAttribute('dir') !== LANG_DIRECTION[lang]) {
    problems.push(
      `<html dir> is "${root.getAttribute('dir')}", expected "${LANG_DIRECTION[lang]}"`,
    );
  }
  if (!document.title.trim()) problems.push('the page has no title');

  const skipLink = document.querySelector('a.skip-link');
  const target = skipLink?.getAttribute('href')?.slice(1);
  if (!target || !document.getElementById(target)) {
    problems.push('the "skip to main content" link does not point to an element on the page');
  }

  for (const image of document.querySelectorAll('img')) {
    if (!image.getAttribute('alt')?.trim()) problems.push('an image has no description');
  }
  return problems;
}

describe('Accessibility (WCAG 2.2 AA checks)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes)] });
  });

  for (const lang of LANGS) {
    for (const page of PAGES) {
      const address = `/${lang}${page}`;

      describe(address, () => {
        async function open() {
          const fixture = TestBed.createComponent(App);
          await TestBed.inject(Router).navigateByUrl(address);
          await fixture.whenStable();
          TestBed.tick();
        }

        it('has no problems that axe-core can detect', async () => {
          await open();
          const results = await axe.run(document, {
            runOnly: {
              type: 'tag',
              values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
            },
            // Colour contrast needs real drawing, which the test environment cannot do.
            // Every theme's colours are checked separately with numbers.
            rules: { 'color-contrast': { enabled: false } },
          });
          expect(results.violations.map(describeViolation)).toEqual([]);
        });

        it('has the basic page structure right', async () => {
          await open();
          expect(structureProblems(lang)).toEqual([]);
        });
      });
    }
  }
});
