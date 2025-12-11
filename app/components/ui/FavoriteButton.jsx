'use client';

import { useState, useEffect } from 'react';
import { isFavorite, toggleFavorite } from '../../lib/storage/favorites';

/**
 * Favorite Button Component
 * Toggles favorite status for items (scenarios, resources, issues)
 */
export default function FavoriteButton({ type, item, className = '', size = 'md' }) {
  const [favorited, setFavorited] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(type, item.id));
  }, [type, item.id]);

  const handleToggle = (e) => {
    e.stopPropagation();

    const newStatus = toggleFavorite(type, item);
    setFavorited(newStatus);

    // Animation
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl'
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        ${sizeClasses[size]}
        rounded-full
        flex items-center justify-center
        transition-all duration-200
        ${favorited
          ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
        }
        ${animating ? 'scale-125' : 'scale-100'}
        ${className}
      `}
      title={favorited ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
      aria-label={favorited ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
    >
      {favorited ? '⭐' : '☆'}
    </button>
  );
}
