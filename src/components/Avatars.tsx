import React from 'react';

export const ValentinaAvatar = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Bun */}
    <circle cx="50" cy="20" r="16" fill="currentColor" />
    {/* Ears */}
    <path d="M22 60 C15 60, 15 50, 22 50" stroke="currentColor" strokeWidth="4" fill="white" strokeLinecap="round" />
    <path d="M78 60 C85 60, 85 50, 78 50" stroke="currentColor" strokeWidth="4" fill="white" strokeLinecap="round" />
    {/* Face */}
    <path d="M25 50 C25 85, 75 85, 75 50 Z" fill="white" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    {/* Hair top */}
    <path d="M23 50 C25 15, 75 15, 77 50 C60 35, 40 35, 23 50 Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    {/* Eyes */}
    <g className="animate-blink" style={{ transformOrigin: '50% 55px' }}>
      <line x1="38" y1="55" x2="42" y2="55" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="58" y1="55" x2="62" y2="55" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </g>
    {/* Nose */}
    <circle cx="50" cy="64" r="1.5" fill="currentColor" />
    {/* Mouth */}
    <path d="M45 74 Q50 80 55 74" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

export const JorgeAvatar = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Ears */}
    <path d="M22 55 C15 55, 15 45, 22 45" stroke="currentColor" strokeWidth="4" fill="white" strokeLinecap="round" />
    <path d="M78 55 C85 55, 85 45, 78 45" stroke="currentColor" strokeWidth="4" fill="white" strokeLinecap="round" />
    {/* Face */}
    <path d="M25 45 C25 80, 75 80, 75 45 Z" fill="white" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    {/* Hair top */}
    <path d="M23 45 C23 10, 77 10, 77 45 C77 45, 60 35, 50 35 C40 35, 23 45, 23 45 Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    {/* Eyes */}
    <g className="animate-blink" style={{ transformOrigin: '50% 50px' }}>
      <line x1="38" y1="50" x2="42" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="58" y1="50" x2="62" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </g>
    {/* Nose */}
    <circle cx="50" cy="59" r="1.5" fill="currentColor" />
    {/* Mouth */}
    <path d="M45 69 Q50 75 55 69" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);
