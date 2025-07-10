import { CopyvioDetector } from '@/components/copyvio-detector';
import { BookCopy } from 'lucide-react';

export default function DetectCopyvioPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <BookCopy className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Copyright Violation Detector</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Paste text to check for potential copyright violations against public sources.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <CopyvioDetector />
      </div>
    </div>
  );
}
