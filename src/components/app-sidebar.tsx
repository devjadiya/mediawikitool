'use client';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GalleryHorizontal,
  Info,
  LineChart,
  HandHelping,
  Lightbulb,
  Mail,
  Feather,
} from 'lucide-react';

const links = [
  { href: '/', label: 'Gallery', icon: GalleryHorizontal },
  { href: '/about', label: 'About WLS', icon: Info },
  { href: '/timeline', label: 'Timeline', icon: LineChart },
  { href: '/contribute', label: 'Contribute', icon: HandHelping },
  { href: '/suggest-category', label: 'Suggest Category', icon: Lightbulb },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Feather className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-headline font-semibold">WLS India Archive</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === link.href}
                  tooltip={link.label}
                >
                  <link.icon />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <p className="text-xs text-muted-foreground p-4 text-center">
            Wiki Loves Science India
        </p>
      </SidebarFooter>
    </>
  );
}
