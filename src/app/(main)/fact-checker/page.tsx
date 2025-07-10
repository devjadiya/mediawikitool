import { FactChecker } from '@/components/fact-checker';
import { ShieldQuestion } from 'lucide-react';

export default function FactCheckerPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <ShieldQuestion className="h-10 w-10 text-primary" />
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
