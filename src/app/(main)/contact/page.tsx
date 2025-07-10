import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Mail, Linkedin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-headline font-bold mb-2">Get In Touch</h1>
        <p className="text-xl text-muted-foreground">Connect with the developer, Dev Jadiya.</p>
      </header>

      <div className="max-w-md mx-auto">
        <Card className="bg-secondary/50 border-white/10">
          <CardHeader>
            <CardTitle className="font-headline text-center">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 items-center">
              <Button asChild className="w-full">
                <a href="mailto:dev@example.com" target="_blank" rel="noopener noreferrer">
                  <Mail className="mr-2" /> Email
                </a>
              </Button>
               <Button asChild variant="secondary" className="w-full">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2" /> GitHub
                </a>
              </Button>
               <Button asChild variant="secondary" className="w-full">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2" /> LinkedIn
                </a>
              </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
