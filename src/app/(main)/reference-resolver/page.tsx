import { ReferenceResolver } from '@/components/reference-resolver';
import { BookCheck } from 'lucide-react';

export default function ReferenceResolverPage() {
  return (
    <div className="space-y-12" id="reference-resolver">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-5) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-lime-500/10 text-lime-400 rounded-full mb-4 ring-2 ring-lime-500/20">
            <BookCheck className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Reference Resolver</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Provide a Wikidata Q-ID and a source URL to generate a perfectly formatted `cite web` reference.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <ReferenceResolver />
      </div>
    </div>
  );
}
