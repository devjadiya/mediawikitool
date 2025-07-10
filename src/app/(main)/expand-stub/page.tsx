import { StubExpander } from '@/components/stub-expander';
import { Sparkles } from 'lucide-react';

export default function ExpandStubPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Article Stub Expander</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get AI-powered suggestions for new sections to expand short articles.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <StubExpander />
      </div>
    </div>
  );
}
