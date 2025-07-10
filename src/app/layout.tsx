import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { CursorFollower } from '@/components/cursor-follower';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { Home } from 'lucide-react';
import { FloatingDock } from '@/components/ui/floating-dock';
import { AnimatePresence } from 'framer-motion';

export const metadata: Metadata = {
  title: 'AI Toolkit for Wikimedians',
  description: 'A suite of AI-powered tools to enhance contributions for Wikimedia editors and developers.',
};

const navItems = [
    { name: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Roboto+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground" suppressHydrationWarning={true}>
        <CursorFollower />
        <FloatingNav navItems={navItems} />
        <main className="flex-grow">
          {children}
        </main>
        <FloatingDock />
        <Toaster />
      </body>
    </html>
  );
}
