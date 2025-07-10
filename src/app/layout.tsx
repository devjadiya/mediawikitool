import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { FloatingDock } from '@/components/ui/floating-dock';
import { CursorFollower } from '@/components/cursor-follower';
import { FloatingNav } from '@/components/ui/floating-navbar';

export const metadata: Metadata = {
  title: 'Wikimedia AI Toolkit',
  description: 'A personal suite of AI-powered tools for Wikimedians, developed by Dev Jadiya.',
};

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
        <FloatingNav />
        <main className="flex-grow">
          {children}
        </main>
        <FloatingDock />
        <Toaster />
      </body>
    </html>
  );
}
