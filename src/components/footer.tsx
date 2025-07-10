import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';
import { Github, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from 'lucide-react';


const mainNavLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

const toolLinks = [
  { name: "Citation Finder", href: "/find-citations" },
  { name: "Article Stub Expander", href: "/expand-stub" },
  { name: "Fact Checker", href: "/fact-checker" },
  { name: "Drafting Assistant", href: "/draft-article" },
];

export function Footer() {
  return (
    <footer className="bg-secondary border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="flex flex-col">
            <Link href="/" className="mb-4 flex items-center gap-2">
                <Logo className="h-10 w-auto" />
                <span className="font-headline text-lg font-bold">Wikimedia AI Toolkit</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              An open-source project to empower the Wikimedia community with modern tools.
            </p>
             <div className="flex gap-2 mt-4">
              <Button variant="outline" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" /></a>
              </Button>
               <Button variant="outline" size="icon" asChild>
                <a href="mailto:wikimedia-toolkit-contact@example.com"><Mail className="h-4 w-4" /></a>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Navigate</h3>
            <ul className="space-y-2">
              {mainNavLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

           <div>
            <h3 className="font-semibold mb-3">Tools</h3>
            <ul className="space-y-2">
               {toolLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
             <h3 className="font-semibold mb-3">Get Involved</h3>
             <p className="text-sm text-muted-foreground mb-4">This is a community-driven project. Contributions are welcome!</p>
             <Button asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">Contribute on GitHub</a>
             </Button>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
            <p>Powered by Gemini and open-source contributors.</p>
            <p>© {new Date().getFullYear()} Wikimedia AI Toolkit Project. Freely licensed.</p>
        </div>
      </div>
    </footer>
  );
}
