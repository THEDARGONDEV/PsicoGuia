import React from 'react';

export const ValentinaAvatar = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Back hair (long hair) */}
    <path d="M25 40 C15 60, 15 90, 30 95 C40 95, 60 95, 70 95 C85 90, 85 60, 75 40 Z" fill="currentColor" />
    
    {/* Face Base (Full head shape to remove the horizontal line) */}
    <path d="M25 45 C25 80, 75 80, 75 45 C75 10, 25 10, 25 45 Z" fill="white" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    
    {/* Ears */}
    <path d="M25 55 C18 55, 18 45, 25 45" stroke="currentColor" strokeWidth="4" fill="white" strokeLinecap="round" />
    <path d="M75 55 C82 55, 82 45, 75 45" stroke="currentColor" strokeWidth="4" fill="white" strokeLinecap="round" />

    {/* Front Hair / Bangs */}
    <path d="M23 45 C23 10, 77 10, 77 45 C70 30, 60 25, 50 28 C40 25, 30 30, 23 45 Z" fill="currentColor" />
    
    {/* Eyes */}
    <g className="animate-blink" style={{ transformOrigin: '50% 55px' }}>
      <circle cx="38" cy="55" r="3.5" fill="currentColor" />
      <circle cx="62" cy="55" r="3.5" fill="currentColor" />
    </g>
    
    {/* Nose */}
    <path d="M50 62 Q52 65 49 66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    
    {/* Mouth */}
    <path d="M44 74 Q50 80 56 74" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

export const JorgeAvatar = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Face Base (Full head shape to remove the horizontal line) */}
    <path d="M25 45 C25 80, 75 80, 75 45 C75 10, 25 10, 25 45 Z" fill="white" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    
    {/* Ears */}
    <path d="M25 50 C18 50, 18 40, 25 40" stroke="currentColor" strokeWidth="4" fill="white" strokeLinecap="round" />
    <path d="M75 50 C82 50, 82 40, 75 40" stroke="currentColor" strokeWidth="4" fill="white" strokeLinecap="round" />

    {/* Boy Hair (Short, textured top) */}
    <path d="M23 45 C23 15, 77 15, 77 45 C75 30, 65 25, 50 28 C35 25, 25 30, 23 45 Z" fill="currentColor" />
    <path d="M35 22 Q42 5 50 15 Q58 5 65 22" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    
    {/* Eyes */}
    <g className="animate-blink" style={{ transformOrigin: '50% 50px' }}>
      <circle cx="38" cy="50" r="3.5" fill="currentColor" />
      <circle cx="62" cy="50" r="3.5" fill="currentColor" />
    </g>
    
    {/* Nose */}
    <path d="M50 57 Q52 60 49 61" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    
    {/* Mouth */}
    <path d="M44 69 Q50 75 56 69" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);
