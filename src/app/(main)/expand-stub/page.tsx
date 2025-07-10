import { StubExpander } from '@/components/stub-expander';
import { Sparkles } from 'lucide-react';

export default function ExpandStubPage() {
  return (
    <div className="space-y-12" id="stub-expander">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-2) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 text-amber-400 rounded-full mb-4 ring-2 ring-amber-500/20">
            <Sparkles className="h-10 w-10" />
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
