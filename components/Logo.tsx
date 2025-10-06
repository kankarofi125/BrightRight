
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8A2BE2" /> 
        <stop offset="100%" stopColor="#FF69B4" />
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="10" fill="url(#logoGradient)" />
    <path
      d="M12 29V11H21.5C23.9853 11 26 13.0147 26 15.5C26 17.9853 23.9853 20 21.5 20H16.5M16.5 20L22 29M16.5 20H12"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Logo;
