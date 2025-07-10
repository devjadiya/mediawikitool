import { RegexDebugger } from '@/components/regex-debugger';
import { Code } from 'lucide-react';

export default function DebugRegexPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <Code className="h-10 w-10 text-primary" />
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
