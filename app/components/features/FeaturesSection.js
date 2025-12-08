'use client';

import Card from '../ui/Card';

/**
 * Features Section Component
 * Highlights key features of the application
 */
export default function FeaturesSection() {
  const features = [
    {
      icon: '⚡',
      title: 'Acceso Rápido',
      description: 'Información legal al instante cuando más la necesitas',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: '🔒',
      title: 'Información Verificada',
      description: 'Contenido revisado por expertos legales certificados',
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: '📱',
      title: 'Funciona Offline',
      description: 'Accede a la información incluso sin conexión a internet',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: '🆓',
      title: 'Completamente Gratis',
      description: 'Sin costos ocultos, sin suscripciones, sin anuncios',
      color: 'from-purple-400 to-pink-500',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full text-purple-700 text-sm font-medium mb-4">
            <span>✨</span>
            Características
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 font-display">
            ¿Por qué usar
            <span className="gradient-text"> Defiéndete MX</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Una herramienta diseñada para proteger tus derechos en cualquier situación
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="default"
              hover={true}
              className={`p-6 text-center animate-fadeIn delay-${index * 100}`}
            >
              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
