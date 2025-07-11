import { CitedInFinder } from '@/components/cited-in-finder';
import { BookText } from 'lucide-react';

export default function CitedInFinderPage() {
  return (
    <div className="space-y-12" id="cited-in-finder">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-4) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-rose-500/10 text-rose-400 rounded-full mb-4 ring-2 ring-rose-500/20">
            <BookText className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">"Cited In" Finder</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover where a specific source (URL, DOI, or book title) is cited across Wikipedia to track its impact.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <CitedInFinder />
      </div>
    </div>
  );
}
