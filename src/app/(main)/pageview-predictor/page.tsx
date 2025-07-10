import { PageviewPredictor } from '@/components/pageview-predictor';
import { TrendingUp } from 'lucide-react';

export default function PageviewPredictorPage() {
  return (
    <div className="container mx-auto" id="pageview-predictor">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <TrendingUp className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Pageview Predictor</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find out which Wikipedia article your image will have the most impact on.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <PageviewPredictor />
      </div>
    </div>
  );
}
