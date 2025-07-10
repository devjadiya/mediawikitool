import { PrizeGenerator } from '@/components/prize-generator';
import { Trophy } from 'lucide-react';

export default function PrizeIdeasPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <Trophy className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">AI Prize Idea Generator</h1>
        <p className="text-xl text-muted-foreground">
          Let our AI brainstorm some fun, science-themed prize ideas for competition winners!
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <PrizeGenerator />
      </div>
    </div>
  );
}
