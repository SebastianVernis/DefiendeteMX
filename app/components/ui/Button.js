'use client';

/**
 * Modern Button Component
 * Supports multiple variants with gradient effects and animations
 */
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '',
  fullWidth = false,
  icon = null,
  ...props 
}) {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 focus:ring-purple-300',
    secondary: 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50 shadow-md hover:shadow-lg hover:-translate-y-1 focus:ring-purple-300',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 focus:ring-green-300',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 focus:ring-red-300',
    ghost: 'bg-transparent text-purple-600 hover:bg-purple-50 focus:ring-purple-300',
    sos: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-2xl hover:shadow-red-500/50 animate-pulse-glow focus:ring-red-300 font-bold',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </button>
  );
}
