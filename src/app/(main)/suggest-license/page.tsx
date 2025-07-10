import { LicenseSuggester } from '@/components/license-suggester';
import { ShieldCheck } from 'lucide-react';

export default function SuggestLicensePage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <ShieldCheck className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">License Suggester</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload an image to get suggestions for appropriate Creative Commons licenses.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <LicenseSuggester />
      </div>
    </div>
  );
}
