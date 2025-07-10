import * as React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width="1024"
      height="1024"
      {...props}
    >
      <defs>
        <clipPath id="a">
          <path d="M512 0c282.78 0 512 229.22 512 512s-229.22 512-512 512S0 794.78 0 512 229.22 0 512 0Z" />
        </clipPath>
        <clipPath id="b">
          <path d="M0 0h1024v1024H0Z" />
        </clipPath>
        <clipPath id="c">
          <path d="M512 0c282.78 0 512 229.22 512 512s-229.22 512-512 512S0 794.78 0 512 229.22 0 512 0Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#b)">
        <g clipPath="url(#c)">
          <path
            d="M512 0C229.22 0 0 229.22 0 512c0 282.78 229.22 512 512 512 282.78 0 512-229.22 512-512C1024 229.22 794.78 0 512 0Z"
            fill="currentColor"
            className="text-primary"
          />
          <g fill="#fff" className="text-primary-foreground">
            <path d="m512 522.6-96.16 270.21h42.16l25.5-74.83h109.84l26.04 74.83h41.62L512 522.6Zm-29.32 153.13 29.32-86.43 29.32 86.43H482.68Z" />
            <path d="M421.49 467.57h-42.16l-26.04-74.83h-41.62l96.16-270.21h42.16l25.5 74.83h109.84l26.04-74.83h41.62l-96.16 270.21h-42.16l-25.5-74.83H447Zm29.32-153.14-29.32 86.43-29.32-86.43h58.64Z" />
            <path d="M718.51 467.57h-42.16l-25.5-74.83H541.01l-26.04 74.83h-41.62l96.16-270.21h42.16l25.5 74.83h109.84l26.04-74.83h41.62l-96.16 270.21Zm-29.32-153.14L660 314.43l-29.32-86.43h58.64Z" />
          </g>
        </g>
      </g>
    </svg>
);
