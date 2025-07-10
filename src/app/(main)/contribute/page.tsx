import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const contributionSteps = [
  { title: 'Find a Subject', description: 'Identify a scientific subject you can photograph. This can be anything from wildlife and plants to lab equipment and astronomical events. Check our categories for inspiration!' },
  { title: 'Take High-Quality Photos', description: 'Use the best camera available to you. Ensure your images are well-lit, in focus, and have a high resolution. Originality is key!' },
  { title: 'Create a Wikimedia Commons Account', description: 'If you don\'t have one already, you\'ll need an account on Wikimedia Commons. This is where all submissions are hosted.' },
  { title: 'Upload Your Images (1 Nov - 15 Dec 2025)', description: 'During the competition period, use the official upload wizard. Make sure to correctly categorize your images and provide a clear, descriptive title and caption.' },
  { title: 'License Your Work', description: 'All submissions must be licensed under a free license, like Creative Commons Attribution-ShareAlike (CC BY-SA), to allow for broad reuse.' },
];

export default function ContributePage() {
  return (
    <div className="container mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-headline font-bold mb-2">How to Contribute</h1>
        <p className="text-xl text-muted-foreground">Join us in making scientific knowledge visible and accessible.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Your Guide to Participating</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-6">
            {contributionSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-foreground mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="text-center">
        <h2 className="text-3xl font-headline font-bold mb-4">Ready to get started?</h2>
        <Button asChild size="lg">
          <Link href="https://commons.wikimedia.org/wiki/Wiki_Science_Competition" target="_blank" rel="noopener noreferrer">
            Visit Wikimedia Commons
          </Link>
        </Button>
      </div>
    </div>
  );
}
