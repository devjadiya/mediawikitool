import { CitationFinder } from '@/components/citation-finder';
import { FileSearch } from 'lucide-react';

export default function FindCitationsPage() {
  return (
    <div className="space-y-12" id="citation-finder">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-primary/20 text-primary rounded-full mb-4 ring-2 ring-primary/30">
            <FileSearch className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Citation Finder</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Enter a statement and let AI find a reliable source and format the citation for you.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <CitationFinder />
      </div>
    </div>
  );
}
