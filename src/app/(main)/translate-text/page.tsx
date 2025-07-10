import { TranslationAssistant } from '@/components/translation-assistant';
import { Languages } from 'lucide-react';

export default function TranslateTextPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <Languages className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Translation Assistant</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Translate wikitext between languages while preserving important markup.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <TranslationAssistant />
      </div>
    </div>
  );
}
