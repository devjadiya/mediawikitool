"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    href: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollY } = useScroll();
  const pathname = usePathname();

  // Set visible to false initially so it's not visible on page load
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    // If the user is on a tool page (not the homepage), show the nav immediately
    if (pathname !== '/') {
        setVisible(true);
        return;
    }

    if (typeof current === "number") {
      const previous = scrollY.getPrevious() ?? 0;
      const direction = current - previous;

      // When at the top of the page, hide the nav
      if (current < 100) {
         setVisible(false);
      } else {
        // When scrolling up, show the nav
        if (direction < 0) {
          setVisible(true);
        } else {
        // When scrolling down, hide the nav
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 0,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-4 inset-x-0 mx-auto border border-white/10 rounded-full bg-background/80 backdrop-blur-sm z-50 px-3 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.href}
            className={cn(
              "relative text-neutral-50 items-center flex space-x-2 px-3 py-1 hover:text-neutral-300 rounded-full transition-colors",
               "hover:bg-accent"
            )}
          >
            {navItem.icon}
            <span className="hidden sm:block text-sm font-medium">{navItem.name}</span>
          </Link>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
