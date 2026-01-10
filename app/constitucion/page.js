'use client';

import { useState, useMemo } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ConstitutionSearch from '../components/features/ConstitutionSearch';
import ArticleCard from '../components/features/ArticleCard';
import { constitutionArticles, categories, frequentQuestions, practicalTips } from '../data/constitution';

/**
 * Interactive Constitution Page
 * Conversational guide to Mexican Constitution rights
 */
export default function ConstitucionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFAQ, setShowFAQ] = useState(false);

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    let filtered = constitutionArticles;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(article => {
        // Search in article number
        if (article.number.toString().includes(term)) return true;
        
        // Search in title
        if (article.title.toLowerCase().includes(term)) return true;
        
        // Search in summary
        if (article.summary.toLowerCase().includes(term)) return true;
        
        // Search in conversational text
        if (article.conversational.toLowerCase().includes(term)) return true;
        
        // Search in keywords
        if (article.keywords.some(keyword => keyword.toLowerCase().includes(term))) return true;
        
        return false;
      });
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float delay-200" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6 animate-fadeIn">
                <span>📜</span>
                Constitución Interactiva
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 font-display animate-fadeIn delay-100">
                Conoce tus
                <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Derechos Constitucionales
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8 animate-fadeIn delay-200">
                La Constitución explicada en lenguaje claro y conversacional. 
                Descubre qué derechos tienes y cómo ejercerlos en situaciones reales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn delay-300">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })}
                >
                  🔍 Explorar Artículos
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setShowFAQ(!showFAQ)}
                >
                  ❓ Preguntas Frecuentes
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Practical Tips Section */}
        <section className="py-16 bg-gradient-to-b from-white to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 font-display">
                💡 Consejos Prácticos
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tips esenciales que debes memorizar para proteger tus derechos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {practicalTips.map((tip, index) => (
                <Card
                  key={tip.id}
                  variant="gradient"
                  hover={true}
                  className={`p-6 animate-fadeIn delay-${index * 100}`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${tip.color} rounded-xl flex items-center justify-center text-3xl shadow-lg mb-4`}>
                    {tip.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {tip.content}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section (Conditional) */}
        {showFAQ && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 font-display">
                    ❓ Preguntas Frecuentes
                  </h2>
                  <p className="text-lg text-gray-600">
                    Respuestas rápidas a las dudas más comunes sobre tus derechos
                  </p>
                </div>

                <div className="space-y-6">
                  {frequentQuestions.map((faq, index) => (
                    <Card
                      key={faq.id}
                      variant="gradient"
                      className={`p-6 animate-fadeIn delay-${index * 100}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                          {faq.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {faq.question}
                          </h3>
                          <p className="text-gray-700 mb-3 leading-relaxed">
                            {faq.answer}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-gray-600 font-medium">
                              Ver artículos:
                            </span>
                            {faq.relatedArticles.map((artNum) => (
                              <Badge key={artNum} variant="primary" size="sm">
                                Art. {artNum}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Search Section */}
        <section id="search-section" className="py-16 bg-gradient-to-b from-purple-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 font-display">
                  📚 Explora la Constitución
                </h2>
                <p className="text-lg text-gray-600">
                  Busca artículos por tema, número o palabra clave
                </p>
              </div>

              <ConstitutionSearch
                onSearch={setSearchTerm}
                onCategoryFilter={setSelectedCategory}
              />
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Results Count */}
              <div className="mb-8 text-center">
                <p className="text-gray-600">
                  {filteredArticles.length === 0 ? (
                    <span className="text-lg">
                      😕 No se encontraron artículos. Intenta con otros términos de búsqueda.
                    </span>
                  ) : (
                    <span className="text-lg">
                      📋 Mostrando <strong>{filteredArticles.length}</strong> {filteredArticles.length === 1 ? 'artículo' : 'artículos'}
                    </span>
                  )}
                </p>
              </div>

              {/* Articles Grid */}
              {filteredArticles.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredArticles.map((article, index) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      index={index}
                    />
                  ))}
                </div>
              )}

              {/* No Results Message */}
              {filteredArticles.length === 0 && (
                <Card variant="glass" className="p-12 text-center max-w-2xl mx-auto">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    No encontramos resultados
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Intenta buscar con otros términos o explora por categorías
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                  >
                    Limpiar Búsqueda
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Categories Overview */}
        <section className="py-16 bg-gradient-to-b from-white to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 font-display">
                  🗂️ Categorías
                </h2>
                <p className="text-lg text-gray-600">
                  Explora los artículos organizados por tema
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(categories).map(([key, category], index) => (
                  <Card
                    key={key}
                    variant="gradient"
                    hover={true}
                    onClick={() => {
                      setSelectedCategory(key);
                      document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`p-6 cursor-pointer animate-fadeIn delay-${index * 100}`}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center text-purple-600 font-medium text-sm">
                      <span>Explorar</span>
                      <span className="ml-2">→</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card variant="glass" className="p-12 text-center max-w-3xl mx-auto">
              <div className="text-5xl mb-6">🛡️</div>
              <h2 className="text-3xl font-black text-white mb-4 font-display">
                Conocer tus derechos es el primer paso para defenderlos
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Comparte esta información con tu familia y amigos. 
                El conocimiento es la mejor herramienta de protección.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => window.location.href = '/'}
                >
                  ← Volver al Inicio
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => window.location.href = '/recursos'}
                >
                  📚 Ver Recursos
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
