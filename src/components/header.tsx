'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Feather } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

const links = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/contribute', label: 'Contribute' },
  { href: '/suggest-category', label: 'Suggest Category' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <div className="p-4">
                    <Link href="/" className="mb-8 flex items-center space-x-2">
                        <Logo className="h-8 w-auto" />
                    </Link>
                    <nav className="flex flex-col space-y-4">
                        {links.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                            'text-lg',
                            pathname === link.href ? 'text-foreground font-semibold' : 'text-muted-foreground'
                            )}
                        >
                            {link.label}
                        </Link>
                        ))}
                    </nav>
                </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Can add search here if needed */}
          </div>
          <Button asChild>
            <Link href="https://commons.wikimedia.org/wiki/Special:UploadWizard?campaign=wsc-in" target="_blank" rel="noopener noreferrer">
                Upload Image
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
