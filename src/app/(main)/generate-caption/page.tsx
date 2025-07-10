import { CaptionGenerator } from '@/components/caption-generator';
import { PenSquare } from 'lucide-react';

export default function GenerateCaptionPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <PenSquare className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">AI Caption & Description Writer</h1>
        <p className="text-xl text-muted-foreground">
          Generate a compelling title and an encyclopedic description for your photo.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <CaptionGenerator />
      </div>
    </div>
  );
}
