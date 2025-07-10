import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';
import { Twitter, Facebook } from 'lucide-react';

const links = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/contribute', label: 'Contribute' },
  { href: '/suggest-category', label: 'Suggest Category' },
  { href: '/contact', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and About */}
          <div className="flex flex-col items-start">
            <Link href="/" className="mb-4">
                <Logo className="h-10 w-auto" />
            </Link>
            <p className="text-muted-foreground text-sm">
              Wiki Science Competition 2025 in India.
              <br />
              Part of the global Wiki Science Competition.
            </p>
          </div>
          
          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Navigate</h3>
              <ul className="space-y-2">
                {links.slice(0, 3).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Participate</h3>
              <ul className="space-y-2">
                {links.slice(3).map((link) => (
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
            <h3 className="font-semibold mb-3">Follow Us</h3>
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="icon" asChild>
                <a href="https://twitter.com/wscindia" target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /></a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="https://facebook.com/wscindia" target="_blank" rel="noopener noreferrer"><Facebook className="h-4 w-4" /></a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-left md:text-right">
              Powered by Wikimedia volunteers.
              <br/>
              This website is a project for the Indian community.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Wiki Science Competition India Team. All content is freely licensed.
        </div>
      </div>
    </footer>
  );
}
