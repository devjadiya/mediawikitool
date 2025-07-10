import { TranslationEnhancer } from '@/components/translation-enhancer';
import { Languages } from 'lucide-react';

export default function EnhanceTranslationPage() {
  return (
    <div className="space-y-12" id="translation-enhancer">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-4) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 text-indigo-400 rounded-full mb-4 ring-2 ring-indigo-500/20">
            <Languages className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Translation Enhancer</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Compare two articles and let AI find and translate the missing content.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <TranslationEnhancer />
      </div>
    </div>
  );
}
