'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, ChevronDown, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const mainLinks = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/contribute', label: 'Contribute' },
  { href: '/contact', label: 'Contact' },
];

const toolLinks = [
    { href: '/suggest-category', label: 'Category Suggester' },
    { href: '/generate-caption', label: 'Caption Writer' },
    { href: '/validate-image', label: 'Image Validator' },
    { href: '/prize-ideas', label: 'Prize Idea Generator' },
]

export function Header() {
  const pathname = usePathname();

  const NavLink = ({ href, children }: {href: string, children: React.ReactNode}) => (
    <Link
        href={href}
        className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === href ? 'text-foreground' : 'text-foreground/60'
        )}
        >
        {children}
    </Link>
  );
  
  const MobileNavLink = ({ href, children }: {href: string, children: React.ReactNode}) => (
     <SheetClose asChild>
        <Link
            href={href}
            className={cn(
                'text-lg py-2',
                pathname === href ? 'text-foreground font-semibold' : 'text-muted-foreground'
            )}
            >
            {children}
        </Link>
    </SheetClose>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {mainLinks.map(link => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-colors text-foreground/60 hover:text-foreground/80 focus:outline-none">
                    AI Tools <Bot className="h-4 w-4" /> <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {toolLinks.map(link => (
                        <DropdownMenuItem key={link.href} asChild>
                            <Link href={link.href}>{link.label}</Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
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
            <SheetContent side="left" className="pr-0">
                <div className="p-4">
                    <Link href="/" className="mb-8 flex items-center space-x-2">
                        <Logo className="h-8 w-auto" />
                    </Link>
                    <nav className="flex flex-col space-y-2">
                        {mainLinks.map(link => (
                            <MobileNavLink key={link.href} href={link.href}>{link.label}</MobileNavLink>
                        ))}
                         <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1" className="border-b-0">
                                <AccordionTrigger className="text-lg text-muted-foreground py-2 hover:no-underline">AI Tools</AccordionTrigger>
                                <AccordionContent className="pl-4">
                                    <div className="flex flex-col space-y-2">
                                        {toolLinks.map(link => (
                                            <MobileNavLink key={link.href} href={link.href}>{link.label}</MobileNavLink>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </nav>
                </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="flex-1 md:flex-none">
                <Link href="/" className="md:hidden flex items-center space-x-2">
                    <Logo className="h-8 w-auto" />
                </Link>
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
