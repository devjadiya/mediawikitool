
import { headers } from 'next/headers';

const URL = 'https://mediawikitool.vercel.app';

const toolPaths = [
    '/',
    '/about',
    '/generate-caption',
    '/suggest-category',
    '/validate-image',
    '/suggest-depicts',
    '/object-locator',
    '/sparql-query-builder',
    '/item-merger-suggester',
    '/reference-resolver',
    '/cited-in-finder',
    '/property-suggester',
    '/find-citations',
    '/expand-stub',
    '/fact-checker',
    '/draft-article',
    '/enhance-translation',
    '/check-notability',
    '/detect-inconsistencies',
    '/translate-text',
    '/maintenance-task-finder',
    '/api-query-generator',
    '/code-guardian',
    '/explain-code',
    '/debug-regex',
    '/detect-copyvio',
    '/anonymize-text',
    '/trust-visualizer'
];

export async function GET() {
  const headersList = headers();
  const lastModified = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${toolPaths
    .map(
      (path) => `
    <url>
      <loc>${URL}${path}</loc>
      <lastmod>${lastModified}</lastmod>
    </url>
  `
    )
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
