"use client";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Github, Linkedin, Mail, Home } from "lucide-react";

export function FloatingDock() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const scrollHeight = document.body.scrollHeight;
    if (current > scrollHeight - window.innerHeight - 100) {
        setVisible(true);
    } else {
        setVisible(false);
    }
  });
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  return (
    <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0 }}
        transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
        }}
        className="fixed bottom-5 inset-x-0 w-full z-50 flex justify-center"
    >
        <div className="flex items-center gap-2 p-2 rounded-full border border-white/20 bg-background/80 backdrop-blur-sm">
             <span className="text-xs text-muted-foreground px-3">
              Made by <a href="https://github.com/devjadiya" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition-colors">Dev Jadiya</a>
            </span>
        </div>
    </motion.div>
  );
}
