import React from "react";
 
export function GridBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full bg-background bg-grid-white/[0.2] relative flex flex-col items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative z-20 w-full">
        {children}
      </div>
    </div>
  );
}