import { SvgGenerator } from '@/components/svg-generator';
import { FileType } from 'lucide-react';

export default function GenerateSvgPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <FileType className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">SVG Generator</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Describe an icon and get a simple, clean SVG in return.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <SvgGenerator />
      </div>
    </div>
  );
}
