import { DraftingAssistant } from '@/components/drafting-assistant';
import { FileText } from 'lucide-react';

export default function DraftArticlePage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <FileText className="h-10 w-10 text-primary" />
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
