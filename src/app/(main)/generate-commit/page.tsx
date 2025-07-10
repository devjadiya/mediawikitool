import { CommitGenerator } from '@/components/commit-generator';
import { GitCommit } from 'lucide-react';

export default function GenerateCommitPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <GitCommit className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Commit Message Generator</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Paste a code diff to generate a conventional commit message.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <CommitGenerator />
      </div>
    </div>
  );
}
