import { PageviewPredictor } from '@/components/pageview-predictor';
import { Eye } from 'lucide-react';

export default function PageviewPredictorPage() {
  return (
    <div className="space-y-12" id="pageview-predictor">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-1) / 0.1), transparent 70%)' }}>
         <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 text-blue-400 rounded-full mb-4 ring-2 ring-blue-500/20">
            <Eye className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Pageview Predictor</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Enter article titles to get historical pageview data and an AI-powered future trend prediction.
        </p>
      </header>
      <div className="max-w-6xl mx-auto">
        <PageviewPredictor />
      </div>
    </div>
  );
}
