import { existsSync, readFileSync } from 'node:fs';

const workflow = readFileSync('.github/workflows/deploy.yml', 'utf-8');
const scripts = (
  JSON.parse(readFileSync('package.json', 'utf-8')) as {
    scripts: Record<string, string>;
  }
).scripts;

describe('release setup', () => {
  it('publishes only when started by hand, never on a push', () => {
    expect(workflow).toMatch(/^on:\s*\n\s+workflow_dispatch:/m);
    expect(workflow).not.toMatch(
      /^\s*(push|pull_request|pull_request_target|schedule|release|workflow_run):/m,
    );
  });

  it('builds with the release script and publishes the browser folder', () => {
    expect(workflow).toContain('npm run build:release');
    expect(workflow).toContain('path: dist/portfolio-v2/browser');
    expect(workflow).toContain('actions/deploy-pages');
  });

  it('asks only for the permissions Pages needs', () => {
    expect(workflow).toMatch(
      /permissions:\s*\n\s+contents: read\s*\n\s+pages: write\s*\n\s+id-token: write/,
    );
  });

  it('refuses to publish a preview build by mistake', () => {
    expect(workflow).toContain('<base href="/portfolio-website/">');
    expect(workflow).toContain('name="robots"');
  });

  it('keeps the preview build and the release build apart', () => {
    expect(scripts['build:preview']).toContain('--base-href /portfolio-v2/');
    expect(scripts['build:preview']).toContain('--noindex');
    expect(scripts['build:release']).toContain('--base-href /portfolio-website/');
    expect(scripts['build:release']).toContain(
      '--site https://dieaikhlayel.github.io/portfolio-website/',
    );
    expect(scripts['build:release']).toContain('--index');
  });

  describe('old addresses from the previous site', () => {
    const redirects: Record<string, string> = {
      'about.html': 'en/about/',
      'contact.html': 'en/contact/',
      'services.html': 'en/',
    };

    for (const [file, target] of Object.entries(redirects)) {
      it(`${file} sends visitors to ${target}`, () => {
        expect(existsSync(`public/${file}`)).toBe(true);
        const html = readFileSync(`public/${file}`, 'utf-8');
        expect(html).toContain(`url=${target}"`);
        expect(html).toContain(`href="${target}"`);
        expect(html).toContain('name="robots" content="noindex"');
      });
    }
  });
});
