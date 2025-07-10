'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold font-headline text-xl">AI Toolkit for Wikimedians</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
