import { CodeGuardian } from '@/components/code-guardian';
import { ShieldCheck } from 'lucide-react';

export default function CodeGuardianPage() {
  return (
    <div className="space-y-12">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-3) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 text-emerald-400 rounded-full mb-4 ring-2 ring-emerald-500/20">
            <ShieldCheck className="h-10 w-10" />
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
