import { PageviewsAnalyzer } from '@/components/pageviews-analyzer';
import { AreaChart } from 'lucide-react';

export default function PageviewsAnalysisPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <AreaChart className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Pageviews Analyzer</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Visualize daily pageview statistics for any article on a Wikimedia project.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <PageviewsAnalyzer />
      </div>
    </div>
  );
}
