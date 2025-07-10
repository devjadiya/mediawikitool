'use client';

import { Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from 'next/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className="relative min-h-screen">
      {!isHomePage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <Link href="/" passHref>
            <Button variant="secondary">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      )}
      <div className="pt-24 pb-24">{children}</div>
    </div>
  );
}
