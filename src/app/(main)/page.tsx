import { TranslationEnhancer } from '@/components/translation-enhancer';
import { Languages } from 'lucide-react';

export default function TranslationEnhancerPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <Languages className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">AI Translation Enhancer</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Compare an English Wikipedia article with its Hindi counterpart to find and translate missing content.
        </p>
      </header>
      <div className="max-w-5xl mx-auto">
        <TranslationEnhancer />
      </div>
    </div>
  );
}
