import * as React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100"
        {...props}>
        <g fill="currentColor" className="text-primary">
            {/* Main W shape */}
            <path d="M10 20 L30 80 L50 40 L70 80 L90 20 L75 20 L60 60 L50 30 L40 60 L25 20 Z" />
            
            {/* AI Spark/Star in the center */}
            <path d="M45 45 L50 35 L55 45 L65 50 L55 55 L50 65 L45 55 L35 50 Z" fill="currentColor" className="text-primary-foreground" />
        </g>
    </svg>
);