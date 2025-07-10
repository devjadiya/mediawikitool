import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';
import { Github, Mail } from 'lucide-react';

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

const toolSections = [
  { 
    title: "Editing",
    links: [
      { name: "Citation Finder", href: "/find-citations" },
      { name: "Article Stub Expander", href: "/expand-stub" },
      { name: "Fact Checker", href: "/fact-checker" },
      { name: "Drafting Assistant", href: "/draft-article" },
      { name: "Notability Checker", href: "/check-notability" },
    ]
  },
  {
    title: "Development",
    links: [
      { name: "MediaWiki Code Guardian", href: "/code-guardian" },
      { name: "Code Explainer", href: "/explain-code" },
      { name: "Regex Debugger", href: "/debug-regex" },
    ]
  },
  {
    title: "Community",
    links: [
      { name: "Copyright Violation Detector", href: "/detect-copyvio" },
      { name: "Text Anonymizer", href: "/anonymize-text" },
      { name: "Contribution Visualizer", href: "/trust-visualizer" },
    ]
  }
];

export function Footer() {
  return (
    <footer className="bg-secondary border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo and About */}
          <div className="col-span-2 flex flex-col">
            <Link href="/" className="mb-4 flex items-center gap-2">
                <Logo className="h-10 w-auto" />
                <span className="font-headline text-lg font-bold">Wikimedia AI Toolkit</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              An open-source project to empower the Wikimedia community with modern, AI-powered tools.
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
          
          {toolSections.map(section => (
             <div key={section.title}>
              <h3 className="font-semibold mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
            <p>Powered by Google Gemini and open-source contributors.</p>
            <p>© {new Date().getFullYear()} Wikimedia AI Toolkit Project. Freely licensed.</p>
        </div>
      </div>
    </footer>
  );
}
