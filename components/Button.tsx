
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-bg';

  const variantClasses = {
    primary: 'bg-brand-purple text-white hover:bg-opacity-90 focus:ring-brand-purple',
    secondary: 'bg-gray-500/20 text-gray-800 dark:text-gray-200 hover:bg-gray-500/30 focus:ring-gray-500',
    ghost: 'bg-transparent text-brand-purple hover:bg-brand-purple/10 focus:ring-brand-purple',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
