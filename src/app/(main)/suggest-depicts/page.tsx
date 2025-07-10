import { DepictsSuggester } from '@/components/depicts-suggester';
import { Database } from 'lucide-react';

export default function SuggestDepictsPage() {
  return (
    <div className="container mx-auto" id="suggest-depicts">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <Database className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">AI "Depicts" Suggester</h1>
        <p className="text-xl text-muted-foreground">
          Analyze an image to generate structured data statements for Wikimedia Commons.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <DepictsSuggester />
      </div>
    </div>
  );
}
