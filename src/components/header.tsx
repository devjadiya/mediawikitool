'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  Menu, 
  FileSearch, 
  Sparkles, 
  ShieldQuestion, 
  FileText,
  ShieldCheck,
  BookCopy,
  GitCompareArrows,
  Wand2,
  Languages,
  BadgeCheck,
  BarChartHorizontal
} from 'lucide-react';
import { Logo } from './logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


const mainNavLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

const contentTools = [
  { name: "Citation Finder", href: "/find-citations", icon: <FileSearch /> },
  { name: "Article Stub Expander", href: "/expand-stub", icon: <Sparkles /> },
  { name: "Fact Checker", href: "/fact-checker", icon: <ShieldQuestion /> },
  { name: "Drafting Assistant", href: "/draft-article", icon: <FileText /> },
  { name: "Notability Checker", href: "/check-notability", icon: <BadgeCheck /> },
  { name: "Cross-Wiki Inconsistency Detector", href: "/detect-inconsistencies", icon: <GitCompareArrows /> },
];

const langTools = [
  { name: "Translation Assistant", href: "/translate-text", icon: <Languages /> },
]

const devTools = [
   { name: "MediaWiki Code Guardian", href: "/code-guardian", icon: <ShieldCheck /> },
   { name: "Code Explainer", href: "/explain-code", icon: <Wand2 /> },
   { name: "Regex Debugger", href: "/debug-regex", icon: <Code /> },
];

const policyTools = [
  { name: "Copyright Violation Detector", href: "/detect-copyvio", icon: <BookCopy /> },
  { name: "Text Anonymizer", href: "/anonymize-text", icon: <ShieldCheck /> },
  { name: "Contribution Trust Visualizer", href: "/trust-visualizer", icon: <BarChartHorizontal /> },
];

function DesktopNav() {
    return (
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {mainNavLinks.map(link => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60">
              {link.name}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-foreground/60">Tools</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Content & Editing</DropdownMenuLabel>
                    {contentTools.map((tool) => (
                        <DropdownMenuItem key={tool.href} asChild>
                        <Link href={tool.href}>
                            {tool.icon}
                            <span>{tool.name}</span>
                        </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                 <DropdownMenuGroup>
                    <DropdownMenuLabel>Translation</DropdownMenuLabel>
                    {langTools.map((tool) => (
                        <DropdownMenuItem key={tool.href} asChild>
                        <Link href={tool.href}>
                            {tool.icon}
                            <span>{tool.name}</span>
                        </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Development & Security</DropdownMenuLabel>
                    {devTools.map((tool) => (
                        <DropdownMenuItem key={tool.href} asChild>
                        <Link href={tool.href}>
                            {tool.icon}
                            <span>{tool.name}</span>
                        </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                 <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Community & Policy</DropdownMenuLabel>
                     {policyTools.map((tool) => (
                        <DropdownMenuItem key={tool.href} asChild>
                        <Link href={tool.href}>
                            {tool.icon}
                            <span>{tool.name}</span>
                        </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
    );
}

function MobileNav() {
     return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm">
                <SheetHeader>
                    <SheetTitle>
                        <Link href="/" className="flex items-center gap-2">
                             <Logo className="h-8 w-auto" />
                             <span className="font-bold font-headline">AI Toolkit</span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    {mainNavLinks.map(link => (
                         <Link key={link.href} href={link.href} className="flex w-full items-center py-2 text-lg font-semibold">
                            {link.name}
                        </Link>
                    ))}
                     <div className="border-t pt-4">
                        <h3 className="font-semibold mb-2 px-2">Tools</h3>
                        {[...contentTools, ...langTools, ...devTools, ...policyTools].map((tool) => (
                             <Link key={tool.href} href={tool.href} className="flex items-center gap-3 rounded-md p-2 text-muted-foreground hover:text-foreground">
                                {tool.icon}
                                {tool.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
     );
}


export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 md:flex md:flex-1">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
            <span className="font-bold font-headline hidden sm:inline-block">Wikimedia AI Toolkit</span>
          </Link>
          <DesktopNav />
        </div>

        <div className="flex items-center justify-end flex-1 md:flex-none">
           <Button asChild className="hidden md:flex">
            <Link href="#" target="_blank" rel="noopener noreferrer">
                <Code className="mr-2" />
                Contribute
            </Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
