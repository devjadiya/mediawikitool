
"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, MotionValue } from "framer-motion";
import {  useState } from "react";


export const GoogleGeminiEffect = ({
  pathLengths,
  title,
  description,
  className,
}: {
  pathLengths: MotionValue<number>[];
  title?: string;
  description?: React.ReactNode;
  className?: string;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={cn(
        "w-full rounded-md flex items-center justify-center",
        className
      )}
    >
      <div className="w-full h-full">
        <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold mx-auto mb-4 font-headline tracking-tighter">
                {title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                {description}
            </p>
        </div>
        <div className="w-full h-full" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
          <AnimatePresence>
            {hovered ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="absolute inset-0 h-full w-full  bg-transparent [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <svg
            className="absolute h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <motion.path
                d="M451.226 21.3281L451.226 500"
                strokeWidth="2"
                stroke="url(#gradient)"
                strokeLinecap="round"
                style={{
                  pathLength: pathLengths[0],
                }}
              />
              <motion.path
                d="M451.226 21.3281L670 21.3281"
                strokeWidth="2"
                stroke="url(#gradient)"
                strokeLinecap="round"
                style={{
                  pathLength: pathLengths[1],
                }}
              />
              <motion.path
                d="M451.226 21.3281L557.226 244.328"
                strokeWidth="2"
                stroke="url(#gradient)"
                strokeLinecap="round"
                style={{
                  pathLength: pathLengths[2],
                }}
              />
              <motion.path
                d="M451.226 21.3281L345.226 244.328"
                strokeWidth="2"
                stroke="url(#gradient)"
                strokeLinecap="round"
                style={{
                  pathLength: pathLengths[3],
                }}
              />
              <motion.path
                d="M451.226 21.3281L232.226 21.3281"
                strokeWidth="2"
                stroke="url(#gradient)"
                strokeLinecap="round"
                style={{
                  pathLength: pathLengths[4],
                }}
              />
            </g>
            <defs>
              <motion.linearGradient
                id="gradient"
                gradientUnits={"userSpaceOnUse"}
                x1={"500"}
                x2={"500"}
                y1={"0"}
                y2={"1000"}
              >
                <stop stopColor="hsl(var(--primary))"></stop>
                <stop offset="1" stopColor="hsl(var(--background))"></stop>
              </motion.linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};
