import { NotabilityChecker } from '@/components/notability-checker';
import { BadgeCheck } from 'lucide-react';

export default function CheckNotabilityPage() {
  return (
    <div className="space-y-12" id="check-notability">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-5) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-lime-500/10 text-lime-400 rounded-full mb-4 ring-2 ring-lime-500/20">
            <BadgeCheck className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Notability Checker</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Enter a topic to assess if it meets Wikipedia's General Notability Guideline.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <NotabilityChecker />
      </div>
    </div>
  );
}
