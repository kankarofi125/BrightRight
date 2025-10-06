
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-light-card dark:bg-dark-card backdrop-blur-lg shadow-glass border border-white/10 rounded-2xl p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
