import * as React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1024 1024" 
        width="1024" 
        height="1024" 
        {...props}>
        <path fill="currentColor" className="text-primary" d="M512 0A512 512 0 1 0 512 1024A512 512 0 1 0 512 0z"/>
        <path fill="currentColor" className="text-primary-foreground" d="m512 522.6l-96.16 270.21h42.16l25.5-74.83h109.84l26.04 74.83h41.62L512 522.6zm-29.32 153.13l29.32-86.43l29.32 86.43H482.68z"/>
        <path fill="currentColor" className="text-primary-foreground" d="M421.49 467.57h-42.16l-26.04-74.83h-41.62l96.16-270.21h42.16l25.5 74.83h109.84l26.04-74.83h41.62l-96.16 270.21h-42.16l-25.5-74.83H447zm29.32-153.14l-29.32 86.43l-29.32-86.43h58.64z"/>
        <path fill="currentColor" className="text-primary-foreground" d="M718.51 467.57h-42.16l-25.5-74.83H541.01l-26.04 74.83h-41.62l96.16-270.21h42.16l25.5 74.83h109.84l26.04-74.83h41.62l-96.16 270.21zm-29.32-153.14l-29.32 86.43-29.32-86.43h58.64z"/>
    </svg>
);
