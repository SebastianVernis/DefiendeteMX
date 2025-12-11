'use client';

import { useState, useMemo } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import FavoriteButton from '../components/ui/FavoriteButton';
import ShareButton from '../components/ui/ShareButton';
import { scenarios, categories } from '../data/scenarios';
import { generateScenarioShareContent } from '../lib/utils/socialSharing';

/**
 * Scenario Search Page
 * Search and filter legal scenarios with detailed information
 */
export default function EscenariosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedScenario, setExpandedScenario] = useState(null);

  // Filter and search scenarios
  const filteredScenarios = useMemo(() => {
    let filtered = scenarios;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    // Search by query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(query) ||
        s.steps.some(step => step.toLowerCase().includes(query)) ||
        s.legal.some(legal => legal.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const toggleScenario = (id) => {
    setExpandedScenario(expandedScenario === id ? null : id);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float delay-200" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
                <span>🔍</span>
                Búsqueda de Escenarios
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 font-display">
                Encuentra tu
                <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Escenario Legal
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Busca situaciones específicas y encuentra orientación legal verificada
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar escenarios... (ej: policía, droga, detención)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-4 rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
                  🔍
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">📋</span>
                  Todos ({scenarios.length})
                </button>
                {Object.entries(categories).map(([key, cat]) => {
                  const count = scenarios.filter(s => s.category === key).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedCategory === key
                          ? `bg-${cat.color}-600 text-white shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={{
                        backgroundColor: selectedCategory === key ?
                          (cat.color === 'red' ? '#dc2626' :
                           cat.color === 'orange' ? '#ea580c' :
                           '#2563eb') : undefined
                      }}
                    >
                      <span className="mr-2">{cat.icon}</span>
                      {cat.name} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-600">
                Mostrando {filteredScenarios.length} de {scenarios.length} escenarios
                {searchQuery && ` con "${searchQuery}"`}
              </div>
            </div>
          </div>
        </section>

        {/* Scenarios List */}
        <section className="py-12 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {filteredScenarios.length === 0 ? (
                <Card variant="glass" className="p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No se encontraron resultados
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Intenta con otros términos de búsqueda o cambia los filtros
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    Limpiar búsqueda
                  </Button>
                </Card>
              ) : (
                filteredScenarios.map((scenario, index) => {
                  const isExpanded = expandedScenario === scenario.id;
                  const categoryInfo = categories[scenario.category];

                  return (
                    <Card
                      key={scenario.id}
                      variant="gradient"
                      hover={true}
                      className={`p-6 transition-all duration-300 animate-fadeIn`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                          {scenario.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-xl font-bold text-gray-900">
                              {scenario.title}
                            </h3>
                            <Badge
                              variant="primary"
                              size="sm"
                              style={{
                                backgroundColor: categoryInfo.color === 'red' ? '#dc2626' :
                                               categoryInfo.color === 'orange' ? '#ea580c' : '#2563eb'
                              }}
                            >
                              {categoryInfo.icon} {categoryInfo.name}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <FavoriteButton type="scenarios" item={scenario} />
                          <ShareButton shareContent={generateScenarioShareContent(scenario)} />
                        </div>
                      </div>

                      {/* Preview Steps */}
                      {!isExpanded && (
                        <div className="mb-4">
                          <p className="text-gray-600 text-sm">
                            {scenario.steps[0]}
                          </p>
                        </div>
                      )}

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="space-y-6 mb-4">
                          {/* Steps */}
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <span>📝</span>
                              Pasos a Seguir
                            </h4>
                            <ol className="space-y-2">
                              {scenario.steps.map((step, idx) => (
                                <li key={idx} className="flex gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    {idx + 1}
                                  </span>
                                  <span className="text-gray-700">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Legal Information */}
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <span>⚖️</span>
                              Información Legal
                            </h4>
                            <ul className="space-y-2">
                              {scenario.legal.map((legal, idx) => (
                                <li key={idx} className="flex gap-3">
                                  <span className="flex-shrink-0 text-green-600 text-xl">
                                    ✓
                                  </span>
                                  <span className="text-gray-700">{legal}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Emergency Contact */}
                          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">🚨</span>
                              <h5 className="font-bold text-red-900">Emergencia</h5>
                            </div>
                            <p className="text-red-800 text-sm mb-3">
                              Si estás en peligro inmediato, llama ahora:
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => window.location.href = 'tel:911'}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                📞 911 Emergencias
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => window.location.href = 'tel:8007152000'}
                              >
                                📞 CNDH
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Toggle Button */}
                      <Button
                        variant={isExpanded ? 'secondary' : 'primary'}
                        size="sm"
                        fullWidth
                        onClick={() => toggleScenario(scenario.id)}
                      >
                        {isExpanded ? (
                          <>
                            <span className="mr-2">⬆️</span>
                            Ver menos
                          </>
                        ) : (
                          <>
                            <span className="mr-2">⬇️</span>
                            Ver detalles completos
                          </>
                        )}
                      </Button>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Help Section */}
            <div className="mt-12 max-w-4xl mx-auto">
              <Card variant="glass" className="p-8 text-center">
                <div className="text-5xl mb-4">💡</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ¿No encuentras tu situación?
                </h3>
                <p className="text-gray-600 mb-6">
                  Nuestro chatbot legal con IA puede ayudarte con escenarios personalizados
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => window.location.href = '/'}
                  >
                    💬 Chatear con IA Legal
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => window.location.href = '/recursos'}
                  >
                    📚 Ver Recursos
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
