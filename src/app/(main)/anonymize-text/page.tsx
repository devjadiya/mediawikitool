import { TextAnonymizer } from '@/components/text-anonymizer';
import { ShieldCheck } from 'lucide-react';

export default function AnonymizeTextPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <ShieldCheck className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">AI Text Anonymizer</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Paste text to automatically identify and redact common Personally Identifiable Information (PII).
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <TextAnonymizer />
      </div>
    </div>
  );
}
