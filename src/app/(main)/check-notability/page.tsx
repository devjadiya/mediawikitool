import { NotabilityChecker } from '@/components/notability-checker';
import { BadgeCheck } from 'lucide-react';

export default function CheckNotabilityPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <BadgeCheck className="h-10 w-10 text-primary" />
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
