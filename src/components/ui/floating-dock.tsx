"use client";
import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Home } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const navItems = [
    { name: "Home", icon: <Home className="h-5 w-5" />, action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { name: "GitHub", icon: <Github className="h-5 w-5" />, link: "https://github.com/devjadiya" },
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, link: "https://www.linkedin.com/in/devjadiya" },
    { name: "Email", icon: <Mail className="h-5 w-5" />, link: "mailto:dev@example.com" },
];

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
            <div className="flex items-center gap-2">
            <TooltipProvider>
                {navItems.map((item) => (
                    <Tooltip key={item.name}>
                        <TooltipTrigger asChild>
                             <button
                                onClick={item.action ? item.action : () => window.open(item.link, '_blank')}
                                className="p-2 rounded-full hover:bg-secondary transition-colors"
                            >
                                {item.icon}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{item.name}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </TooltipProvider>
            </div>
            <div className="h-6 w-px bg-white/20 mx-2" />
            <span className="text-xs text-muted-foreground pr-3">Made by Dev Jadiya</span>
        </motion.div>
    </div>
  );
}
