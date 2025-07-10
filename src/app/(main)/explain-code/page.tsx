import { CodeExplainer } from '@/components/code-explainer';
import { Wand2 } from 'lucide-react';

export default function ExplainCodePage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <Wand2 className="h-10 w-10 text-primary" />
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
