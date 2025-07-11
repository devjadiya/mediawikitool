import { PropertySuggester } from '@/components/property-suggester';
import { ListPlus } from 'lucide-react';

export default function PropertySuggesterPage() {
  return (
    <div className="space-y-12" id="property-suggester">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-3) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-teal-500/10 text-teal-400 rounded-full mb-4 ring-2 ring-teal-500/20">
            <ListPlus className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Property Suggester</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Enter a Wikidata item ID to get AI-powered suggestions for relevant new properties to add.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <PropertySuggester />
      </div>
    </div>
  );
}
