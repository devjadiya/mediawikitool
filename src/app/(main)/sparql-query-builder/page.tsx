import { SparqlQueryBuilder } from '@/components/sparql-query-builder';
import { Network } from 'lucide-react';

export default function SparqlQueryBuilderPage() {
  return (
    <div className="space-y-12" id="sparql-query-builder">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-1) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-sky-500/10 text-sky-400 rounded-full mb-4 ring-2 ring-sky-500/20">
            <Network className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">SPARQL Query Builder</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Translate a natural language question into a formal SPARQL query to search Wikidata's vast database.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <SparqlQueryBuilder />
      </div>
    </div>
  );
}
