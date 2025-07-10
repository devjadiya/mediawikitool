import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Mail, Code } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="container mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-headline font-bold mb-2">Contact & Contribute</h1>
        <p className="text-xl text-muted-foreground">We're an open-source project. Get in touch or get involved!</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Get in Touch</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <p className="text-lg">
              Have questions, feedback, or an idea for a new tool? We'd love to hear from you. 
              The best way to reach out or contribute is through our GitHub repository.
            </p>
            <div className="flex flex-col gap-4">
              <a href="mailto:wikimedia-toolkit-contact@example.com" className="flex items-center gap-2 text-primary hover:underline">
                <Mail className="h-5 w-5" />
                <span>wikimedia-toolkit-contact@example.com</span>
              </a>
               <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                <Github className="h-5 w-5" />
                <span>View Project on GitHub</span>
              </a>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Image 
                src="https://placehold.co/400x300.png"
                alt="A computer screen with code"
                width={400}
                height={300}
                className="rounded-lg shadow-md"
                data-ai-hint="computer code screen"
            />
          </div>
        </CardContent>
      </Card>

      <section className="text-center">
        <h2 className="text-4xl font-headline font-bold text-center mb-4">Want to Contribute?</h2>
        <p className="text-lg text-muted-foreground mb-6">
            This toolkit is built by and for the community. If you have an idea for a tool or want to help improve the existing ones, please check out our GitHub repository.
        </p>
        <Button asChild size="lg">
          <Link href="#" target="_blank" rel="noopener noreferrer">
            <Code className="mr-2 h-5 w-5" />
            Contribute on GitHub
          </Link>
        </Button>
      </section>
    </div>
  );
}
