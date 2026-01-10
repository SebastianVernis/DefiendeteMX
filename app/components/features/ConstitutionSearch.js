'use client';

import { useState } from 'react';

/**
 * Constitution Search Component
 * Search bar for finding constitution articles by keyword or number
 */
export default function ConstitutionSearch({ onSearch, onCategoryFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onCategoryFilter(category);
  };

  const categories = [
    { id: 'all', name: 'Todos', icon: '📚' },
    { id: 'derechos', name: 'Derechos', icon: '👥' },
    { id: 'libertades', name: 'Libertades', icon: '🕊️' },
    { id: 'garantias', name: 'Garantías', icon: '⚖️' },
    { id: 'procedimientos', name: 'Procedimientos', icon: '📋' }
  ];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="text-2xl">🔍</span>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Busca por palabra clave, número de artículo o tema..."
          className="w-full pl-14 pr-4 py-4 text-lg bg-white border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none shadow-lg"
          aria-label="Buscar en la constitución"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`
              px-6 py-3 rounded-xl font-medium transition-all duration-200
              flex items-center gap-2 text-sm sm:text-base
              ${selectedCategory === category.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
              }
            `}
            aria-label={`Filtrar por ${category.name}`}
            aria-pressed={selectedCategory === category.id}
          >
            <span className="text-xl">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Search Tips */}
      {searchTerm === '' && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm text-gray-700 font-medium mb-1">
                Consejos de búsqueda:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Busca por número: "artículo 20" o simplemente "20"</li>
                <li>• Busca por tema: "detención", "abogado", "derechos"</li>
                <li>• Usa los filtros de categoría para explorar por tema</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
