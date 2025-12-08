'use client';

/**
 * Modern Card Component
 * Features glassmorphism, hover effects, and gradient borders
 */
export default function Card({ 
  children, 
  variant = 'default',
  hover = true,
  className = '',
  onClick,
  ...props 
}) {
  const baseStyles = 'rounded-2xl transition-all duration-300';
  
  const variants = {
    default: 'bg-white shadow-lg border border-gray-100',
    glass: 'glass shadow-xl',
    gradient: 'bg-gradient-to-br from-white to-purple-50 shadow-xl border border-purple-100',
    dark: 'bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl',
  };
  
  const hoverStyles = hover ? 'card-hover cursor-pointer' : '';
  const clickable = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${clickable} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
