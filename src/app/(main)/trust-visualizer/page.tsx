import { TrustVisualizer } from '@/components/trust-visualizer';
import { BarChartHorizontal } from 'lucide-react';

export default function TrustVisualizerPage() {
  return (
    <div className="space-y-12">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-4) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 text-purple-400 rounded-full mb-4 ring-2 ring-purple-500/20">
            <BarChartHorizontal className="h-10 w-10" />
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
