import { DraftingAssistant } from '@/components/drafting-assistant';
import { FileText } from 'lucide-react';

export default function DraftArticlePage() {
  return (
    <div className="space-y-12" id="draft-article">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-3) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-sky-500/10 text-sky-400 rounded-full mb-4 ring-2 ring-sky-500/20">
            <FileText className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Drafting Assistant</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Provide a topic and let AI generate a short, sourced starter article in wikitext.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <DraftingAssistant />
      </div>
    </div>
  );
}
