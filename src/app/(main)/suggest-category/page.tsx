import { CategorySuggester } from '@/components/suggest-category';
import { Lightbulb } from 'lucide-react';

export default function SuggestCategoryPage() {
  return (
    <div className="container mx-auto" id="suggest-category">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <Lightbulb className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">AI-Powered Category Suggestion</h1>
        <p className="text-xl text-muted-foreground">
          Not sure where your photo fits? Upload it and let our AI suggest the best categories.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <CategorySuggester />
      </div>
    </div>
  );
}
