'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Code } from 'lucide-react';
import { Logo } from './logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex flex-1">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
            <span className="font-bold font-headline hidden sm:inline-block">AI Translation Enhancer</span>
          </Link>
        </div>

        <div className="flex items-center justify-end">
          <Button asChild>
            <Link href="#" target="_blank" rel="noopener noreferrer">
                <Code className="mr-2" />
                Contribute
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
