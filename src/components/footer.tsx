import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';
import { Github, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo and About */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="mb-4 flex items-center gap-2">
                <Logo className="h-10 w-auto" />
                <span className="font-headline text-lg font-bold">AI Translation Enhancer</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              An AI-powered tool to enrich Hindi Wikipedia articles.
            </p>
          </div>
          
          {/* Social and Credits */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-semibold mb-3">Get Involved</h3>
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" /></a>
              </Button>
               <Button variant="outline" size="icon" asChild>
                <a href="mailto:wikimedia-toolkit-contact@example.com"><Mail className="h-4 w-4" /></a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center md:text-right">
              Powered by Gemini and open-source contributors.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AI Translation Enhancer. Freely licensed.
        </div>
      </div>
    </footer>
  );
}
