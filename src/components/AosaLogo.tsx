import React from 'react';

export const AosaLogo = ({ className = "h-full" }: { className?: string }) => (
  <svg viewBox="0 0 300 100" className={className}>
    <defs>
      <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fef582" />
        <stop offset="50%" stopColor="#d7b453" />
        <stop offset="100%" stopColor="#7f6c40" />
      </linearGradient>
    </defs>
    <text x="0" y="45" fontFamily="Inter" fontWeight="800" fontSize="48" fill="url(#gold-grad)">AOSA</text>
    <text x="135" y="25" fontFamily="Inter" fontWeight="800" fontSize="20" fill="url(#gold-grad)">™</text>
    <rect x="0" y="60" width="160" height="1" fill="#C9A66B" fillOpacity="0.4" />
    <text x="0" y="76" fontFamily="Inter" fontWeight="600" fontSize="7" letterSpacing="4" fill="#C9A66B">THE STANDARD</text>
    <g transform="translate(180, 15) scale(0.8)">
      <path d="M0,0 L30,25 L60,0 L45,0 L30,12 L15,0 Z" fill="#C9A66B" />
      <path d="M-5,15 L30,45 L65,15 L50,15 L30,32 L10,15 Z" fill="#7A5C28" fillOpacity="0.75" />
      <path d="M-10,30 L30,65 L70,30 L55,30 L30,52 L5,30 Z" fill="#3A3028" fillOpacity="0.45" />
    </g>
  </svg>
);
