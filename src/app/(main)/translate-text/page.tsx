import { TranslationAssistant } from '@/components/translation-assistant';
import { Languages } from 'lucide-react';

export default function TranslateTextPage() {
  return (
    <div className="space-y-12">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-4) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 text-indigo-400 rounded-full mb-4 ring-2 ring-indigo-500/20">
            <Languages className="h-10 w-10" />
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
