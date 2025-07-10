import { TrustVisualizer } from '@/components/trust-visualizer';
import { BarChartHorizontal } from 'lucide-react';

export default function TrustVisualizerPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <BarChartHorizontal className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Contribution Trust Visualizer</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A contribution-intelligence tool that visualizes the editing behavior and trust signals of Wikimedia users.
        </p>
      </header>
      <div className="max-w-6xl mx-auto">
        <TrustVisualizer />
      </div>
    </div>
  );
}
