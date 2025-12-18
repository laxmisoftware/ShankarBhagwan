
import React from 'react';

export const TrishulaIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v20M12 4c-3 0-5 3-5 7 0 2 2 4 5 4M12 4c3 0 5 3 5 7 0 2-2 4-5 4M7 11H5c-1 0-2 1-2 2v2M17 11h2c1 0 2 1 2 2v2" />
  </svg>
);

export const SendIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export const OmIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10,10-4.47,10-10S17.53,2,12,2Zm0,18c-4.41,0-8-3.59-8-8s3.59-8,8-8,8,3.59,8,8-3.59,8-8,8ZM11,7h2v2h-2V7Zm0,4h2v6h-2v-6Z" opacity="0" />
    <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontFamily="serif">ॐ</text>
  </svg>
);
