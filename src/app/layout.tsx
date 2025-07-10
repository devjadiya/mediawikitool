import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { FloatingDock } from '@/components/ui/floating-dock';
import { CursorFollower } from '@/components/cursor-follower';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { BookOpen, GalleryHorizontal, Info, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'WLS India Archive',
  description: 'An archive and toolkit for the Wiki Loves Science competition in India.',
};

const navItems = [
    { name: "Gallery", href: "/", icon: <GalleryHorizontal className="h-4 w-4" /> },
    { name: "About", href: "/about", icon: <Info className="h-4 w-4" /> },
    { name: "Guide", href: "/contribution-guide", icon: <BookOpen className="h-4 w-4" /> },
    { name: "Contact", href: "/contact", icon: <Mail className="h-4 w-4" /> },
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
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap" rel="stylesheet" />
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

    