import { CodeGuardian } from '@/components/code-guardian';
import { ShieldCheck } from 'lucide-react';

export default function CodeGuardianPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <ShieldCheck className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">MediaWiki Code Guardian</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Analyze JavaScript/Lua snippets for security, performance, and best practices.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <CodeGuardian />
      </div>
    </div>
  );
}
