import { FactChecker } from '@/components/fact-checker';
import { ShieldQuestion } from 'lucide-react';

export default function FactCheckerPage() {
  return (
    <div className="space-y-12">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-3) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-teal-500/10 text-teal-400 rounded-full mb-4 ring-2 ring-teal-500/20">
            <ShieldQuestion className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Article Fact Checker</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Paste a section of an article to verify its claims against online sources.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <FactChecker />
      </div>
    </div>
  );
}
