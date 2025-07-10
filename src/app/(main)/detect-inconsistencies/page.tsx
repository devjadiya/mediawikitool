import { InconsistencyDetector } from '@/components/inconsistency-detector';
import { GitCompareArrows } from 'lucide-react';

export default function DetectInconsistenciesPage() {
  return (
    <div className="space-y-12" id="detect-inconsistencies">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-4) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-fuchsia-500/10 text-fuchsia-400 rounded-full mb-4 ring-2 ring-fuchsia-500/20">
            <GitCompareArrows className="h-10 w-10" />
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
