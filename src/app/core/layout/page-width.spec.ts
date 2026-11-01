import { readFileSync } from 'node:fs';

describe('page width', () => {
  it('lets the .container class set the width of the page body', () => {
    const scss = readFileSync('src/app/app.scss', 'utf-8');
    const mainRule = scss.match(/(?:^|\n)main\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(mainRule).not.toBe('');
    expect(mainRule).not.toMatch(/(inline-size|max-inline-size|width|max-width)\s*:/);
  });

  it('keeps side margins on the container', () => {
    const base = readFileSync('src/styles/_base.scss', 'utf-8');
    expect(base).toMatch(/\.container\s*\{[^}]*margin-inline:\s*auto/);
    expect(base).toMatch(
      /\.container\s*\{[^}]*inline-size:\s*min\(100%\s*-\s*2\s*\*\s*var\(--gutter\)/,
    );
  });
});
