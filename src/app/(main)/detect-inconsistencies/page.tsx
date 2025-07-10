import { InconsistencyDetector } from '@/components/inconsistency-detector';
import { GitCompareArrows } from 'lucide-react';

export default function DetectInconsistenciesPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <GitCompareArrows className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Cross-Wiki Inconsistency Detector</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Compare two Wikipedia articles on the same topic from different languages to find factual discrepancies.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <InconsistencyDetector />
      </div>
    </div>
  );
}
