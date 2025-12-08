'use client';

/**
 * Modern Badge Component
 * For categories, tags, and status indicators
 */
export default function Badge({ 
  children, 
  variant = 'default',
  size = 'md',
  icon = null,
  className = '',
  ...props 
}) {
  const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200';
  
  const variants = {
    default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    primary: 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 hover:from-purple-200 hover:to-indigo-200',
    success: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200',
    warning: 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 hover:from-orange-200 hover:to-red-200',
    danger: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 hover:from-red-200 hover:to-pink-200',
    info: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 hover:from-blue-200 hover:to-cyan-200',
  };
  
  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  
  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </span>
  );
}
