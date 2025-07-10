import { ImageValidator } from '@/components/image-validator';
import { Bot } from 'lucide-react';

export default function ValidateImagePage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
            <Bot className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">AI Image Validator</h1>
        <p className="text-xl text-muted-foreground">
          Check your image for common issues like watermarks and get quality feedback.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <ImageValidator />
      </div>
    </div>
  );
}
