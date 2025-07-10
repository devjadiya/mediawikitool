"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from 'next/link';

export function FloatingDock() {
  return (
    <div className="fixed bottom-5 inset-x-0 w-full z-50 flex justify-center">
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay: 1,
            }}
             className="flex items-center gap-2 p-2 rounded-full border border-white/20 bg-background/80 backdrop-blur-sm"
        >
            <span className="text-xs text-muted-foreground px-3">
              Made by <a href="https://github.com/devjadiya" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition-colors">Dev Jadiya</a>
            </span>
        </motion.div>
    </div>
  );
}
