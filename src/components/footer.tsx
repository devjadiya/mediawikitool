import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';
import { Github, Mail } from 'lucide-react';
import { tools } from '@/lib/data';

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact & Contribute' },
];

const toolLinks = tools.map(tool => ({ href: tool.href, label: tool.title }));

export function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and About */}
          <div className="flex flex-col items-start">
            <Link href="/" className="mb-4 flex items-center gap-2">
                <Logo className="h-10 w-auto" />
                <span className="font-headline text-lg font-bold">Wikimedia AI Toolkit</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              An open-source project to empower the Wikimedia community with modern tools.
            </p>
          </div>
          
          {/* Links */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-3">Navigate</h3>
              <ul className="space-y-2">
                {mainLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Tools</h3>
              <ul className="space-y-2">
                {toolLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Social and Credits */}
          <div className="flex flex-col items-start md:items-end">
            <h3 className="font-semibold mb-3">Get Involved</h3>
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" /></a>
              </Button>
               <Button variant="outline" size="icon" asChild>
                <a href="mailto:wikimedia-toolkit-contact@example.com"><Mail className="h-4 w-4" /></a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-left md:text-right">
              Powered by Gemini and open-source contributors.
              <br/>
              This is a community-driven project.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Wikimedia AI Toolkit Project. Freely licensed.
        </div>
      </div>
    </footer>
  );
}
