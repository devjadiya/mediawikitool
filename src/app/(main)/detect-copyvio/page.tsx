import { CopyvioDetector } from '@/components/copyvio-detector';
import { BookCopy } from 'lucide-react';

export default function DetectCopyvioPage() {
  return (
    <div className="space-y-12">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--destructive) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-red-500/10 text-red-400 rounded-full mb-4 ring-2 ring-red-500/20">
            <BookCopy className="h-10 w-10" />
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
