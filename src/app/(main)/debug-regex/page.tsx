import { RegexDebugger } from '@/components/regex-debugger';
import { Code } from 'lucide-react';

export default function DebugRegexPage() {
  return (
    <div className="space-y-12">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--foreground) / 0.05), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-slate-500/10 text-slate-400 rounded-full mb-4 ring-2 ring-slate-500/20">
            <Code className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Regex Debugger</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get a natural language explanation for complex regular expressions.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <RegexDebugger />
      </div>
    </div>
  );
}
