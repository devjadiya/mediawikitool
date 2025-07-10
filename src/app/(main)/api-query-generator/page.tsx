import { ApiQueryGenerator } from '@/components/api-query-generator';
import { Terminal } from 'lucide-react';

export default function ApiQueryGeneratorPage() {
  return (
    <div className="space-y-12" id="api-query-generator">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-2) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 text-amber-400 rounded-full mb-4 ring-2 ring-amber-500/20">
            <Terminal className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">API Query Generator</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Translate a natural language description into a ready-to-use MediaWiki Action API query URL.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <ApiQueryGenerator />
      </div>
    </div>
  );
}
