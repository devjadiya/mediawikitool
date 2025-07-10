import { CitationFinder } from '@/components/citation-finder';
import { FileSearch } from 'lucide-react';

export default function FindCitationsPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <FileSearch className="h-10 w-10 text-primary" />
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
