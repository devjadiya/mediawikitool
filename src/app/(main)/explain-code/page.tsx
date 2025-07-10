import { CodeExplainer } from '@/components/code-explainer';
import { Wand2 } from 'lucide-react';

export default function ExplainCodePage() {
  return (
    <div className="space-y-12">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-3) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-cyan-500/10 text-cyan-400 rounded-full mb-4 ring-2 ring-cyan-500/20">
            <Wand2 className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Code Explainer</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get a detailed explanation for a snippet of Lua or JavaScript code.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <CodeExplainer />
      </div>
    </div>
  );
}
