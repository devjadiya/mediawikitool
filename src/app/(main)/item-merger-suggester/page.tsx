import { ItemMergerSuggester } from '@/components/item-merger-suggester';
import { GitMerge } from 'lucide-react';

export default function ItemMergerSuggesterPage() {
  return (
    <div className="space-y-12" id="item-merger-suggester">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-2) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-orange-500/10 text-orange-400 rounded-full mb-4 ring-2 ring-orange-500/20">
            <GitMerge className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Item Merger Suggester</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Compare two Wikidata items to get an AI-powered recommendation on whether they are duplicates and should be merged.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <ItemMergerSuggester />
      </div>
    </div>
  );
}
