import React from 'react';

export const ValentinaAvatar = () => (
  <div className="avatar-container">
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="avatar-image">
      {/* Back hair (long hair flowing down) */}
      <path d="M20 40 C10 60, 10 95, 25 98 C40 98, 60 98, 75 98 C90 95, 90 60, 80 40 Z" fill="currentColor" />
      
      {/* Face Base - Removed stroke from top to prevent line showing through hair */}
      <path d="M25 45 C25 80, 75 80, 75 45 C75 25, 25 25, 25 45 Z" fill="white" />
      {/* Face Outline - Only bottom part (chin/cheeks) */}
      <path d="M25 45 C25 80, 75 80, 75 45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
      
      {/* Ears */}
      <path d="M25 55 C18 55, 18 45, 25 45" stroke="currentColor" strokeWidth="4" fill="white" strokeLinecap="round" />
      <path d="M75 55 C82 55, 82 45, 75 45" stroke="currentColor" strokeWidth="4" fill="white" strokeLinecap="round" />

      {/* Front Hair / Bangs - Adjusted to cover top of head completely */}
      <path d="M20 45 C20 5, 80 5, 80 45 C75 30, 65 25, 50 28 C35 25, 25 30, 20 45 Z" fill="currentColor" />
      
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
  </div>
);

export const JorgeAvatar = () => (
  <div className="avatar-container">
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="avatar-image">
      {/* Face Base */}
      <path d="M25 45 C25 80, 75 80, 75 45 C75 10, 25 10, 25 45 Z" fill="white" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      
      {/* Ears */}
      <path d="M25 50 C18 50, 18 40, 25 40" stroke="currentColor" strokeWidth="4" fill="white" strokeLinecap="round" />
      <path d="M75 50 C82 50, 82 40, 75 40" stroke="currentColor" strokeWidth="4" fill="white" strokeLinecap="round" />

      {/* Boy Hair (Curtains / Book Style - Middle Part) */}
      {/* Left Side Curtain */}
      <path d="M50 15 C40 15, 20 20, 20 50 C20 50, 30 40, 48 25 Z" fill="currentColor" />
      {/* Right Side Curtain */}
      <path d="M50 15 C60 15, 80 20, 80 50 C80 50, 70 40, 52 25 Z" fill="currentColor" />
      {/* Top/Back fill to connect */}
      <path d="M20 50 C20 20, 80 20, 80 50 C80 30, 50 10, 20 50" fill="currentColor" />

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
  </div>
);

export const ParentsAvatar = () => (
  <div className="avatar-container">
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="avatar-image">
      {/* Father Head */}
      <g transform="translate(-10, 5)">
        <path d="M35 45 C35 70, 65 70, 65 45 C65 25, 35 25, 35 45 Z" fill="white" stroke="currentColor" strokeWidth="3" />
        <path d="M35 45 C35 25, 65 25, 65 45 C65 35, 60 20, 35 25" fill="currentColor" />
        <circle cx="43" cy="50" r="2" fill="currentColor" />
        <circle cx="57" cy="50" r="2" fill="currentColor" />
        <path d="M47 60 Q50 63 53 60" stroke="currentColor" strokeWidth="2" fill="none" />
      </g>

      {/* Mother Head */}
      <g transform="translate(15, 10)">
        <path d="M35 45 C35 70, 65 70, 65 45 C65 25, 35 25, 35 45 Z" fill="white" stroke="currentColor" strokeWidth="3" />
        <path d="M30 45 C30 15, 70 15, 70 45 C70 70, 65 80, 60 85" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M35 45 C35 20, 65 20, 65 45" fill="currentColor" opacity="0.8" />
        <circle cx="43" cy="50" r="2" fill="currentColor" />
        <circle cx="57" cy="50" r="2" fill="currentColor" />
        <path d="M47 60 Q50 63 53 60" stroke="currentColor" strokeWidth="2" fill="none" />
      </g>
    </svg>
  </div>
);
