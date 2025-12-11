'use client';

import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { getFavorites, removeFavorite, exportFavorites, clearFavorites } from '../lib/storage/favorites';
import { categories } from '../data/scenarios';

/**
 * Favorites Page
 * Display and manage favorited scenarios, resources, and cases
 */
export default function FavoritosPage() {
  const [favorites, setFavorites] = useState({ scenarios: [], resources: [], issues: [] });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favs = getFavorites();
    setFavorites(favs);
  };

  const handleRemove = (type, id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este favorito?')) {
      removeFavorite(type, id);
      loadFavorites();
    }
  };

  const handleClearAll = () => {
    if (confirm('¿Estás seguro de que quieres eliminar TODOS los favoritos?')) {
      clearFavorites();
      loadFavorites();
    }
  };

  const handleExport = () => {
    const json = exportFavorites();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `favoritos-defiendete-mx-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalCount = (favorites.scenarios?.length || 0) +
                     (favorites.resources?.length || 0) +
                     (favorites.issues?.length || 0);

  const getFilteredFavorites = () => {
    if (activeTab === 'all') {
      return {
        scenarios: favorites.scenarios || [],
        resources: favorites.resources || [],
        issues: favorites.issues || []
      };
    }
    return {
      scenarios: activeTab === 'scenarios' ? (favorites.scenarios || []) : [],
      resources: activeTab === 'resources' ? (favorites.resources || []) : [],
      issues: activeTab === 'issues' ? (favorites.issues || []) : []
    };
  };

  const filtered = getFilteredFavorites();
  const filteredCount = (filtered.scenarios?.length || 0) +
                        (filtered.resources?.length || 0) +
                        (filtered.issues?.length || 0);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-500 py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float delay-200" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
                <span>⭐</span>
                Mis Favoritos
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 font-display">
                Tus
                <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Favoritos
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-4">
                Guardados localmente en tu dispositivo
              </p>
              <div className="flex items-center justify-center gap-4 text-white/90">
                <span className="text-3xl font-bold">{totalCount}</span>
                <span className="text-lg">favoritos guardados</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs and Actions */}
        <section className="py-6 bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    activeTab === 'all'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">📋</span>
                  Todos ({totalCount})
                </button>
                <button
                  onClick={() => setActiveTab('scenarios')}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    activeTab === 'scenarios'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">⚖️</span>
                  Escenarios ({favorites.scenarios?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    activeTab === 'resources'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">📚</span>
                  Recursos ({favorites.resources?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('issues')}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    activeTab === 'issues'
                      ? 'bg-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">📁</span>
                  Casos ({favorites.issues?.length || 0})
                </button>
              </div>

              {/* Actions */}
              {totalCount > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleExport}
                  >
                    <span className="mr-1">💾</span>
                    Exportar JSON
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <span className="mr-1">🗑️</span>
                    Eliminar Todos
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
              {totalCount === 0 ? (
                <Card variant="glass" className="p-12 text-center">
                  <div className="text-6xl mb-4">⭐</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Aún no tienes favoritos
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comienza a guardar escenarios y recursos para acceder a ellos rápidamente
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => window.location.href = '/escenarios'}
                    >
                      🔍 Explorar Escenarios
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
              ) : filteredCount === 0 ? (
                <Card variant="glass" className="p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No hay favoritos en esta categoría
                  </h3>
                  <p className="text-gray-600">
                    Prueba con otra pestaña o agrega más favoritos
                  </p>
                </Card>
              ) : (
                <>
                  {/* Scenarios */}
                  {filtered.scenarios?.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>⚖️</span>
                        Escenarios Favoritos
                      </h2>
                      <div className="space-y-4">
                        {filtered.scenarios.map((scenario) => {
                          const categoryInfo = categories[scenario.category];
                          return (
                            <Card key={scenario.id} variant="gradient" hover={true} className="p-6">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                                  {scenario.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <h3 className="text-lg font-bold text-gray-900">
                                      {scenario.title}
                                    </h3>
                                    {categoryInfo && (
                                      <Badge variant="primary" size="sm">
                                        {categoryInfo.icon} {categoryInfo.name}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">
                                    Guardado el {new Date(scenario.favoritedAt).toLocaleDateString('es-MX')}
                                  </p>
                                  <div className="flex gap-2 flex-wrap">
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() => window.location.href = '/escenarios'}
                                    >
                                      Ver detalles
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => handleRemove('scenarios', scenario.id)}
                                      className="text-red-600 hover:bg-red-50"
                                    >
                                      ✕ Eliminar
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {filtered.resources?.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>📚</span>
                        Recursos Favoritos
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.resources.map((resource) => (
                          <Card key={resource.id} variant="gradient" hover={true} className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              <div className={`w-12 h-12 bg-gradient-to-br ${resource.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                                {resource.icon}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                  {resource.title}
                                </h3>
                                <Badge variant="primary" size="sm">
                                  {resource.category}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Guardado el {new Date(resource.favoritedAt).toLocaleDateString('es-MX')}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => window.location.href = '/recursos'}
                              >
                                Ver recurso
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleRemove('resources', resource.id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                ✕ Eliminar
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Issues/Cases */}
                  {filtered.issues?.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>📁</span>
                        Casos Favoritos
                      </h2>
                      <div className="space-y-4">
                        {filtered.issues.map((issue) => (
                          <Card key={issue.id} variant="gradient" hover={true} className="p-6">
                            <div className="mb-4">
                              <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {issue.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Guardado el {new Date(issue.favoritedAt).toLocaleDateString('es-MX')}
                              </p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => window.location.href = '/issues'}
                              >
                                Ver caso
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleRemove('issues', issue.id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                ✕ Eliminar
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
