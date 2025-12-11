'use client';

import Button from '../ui/Button';

/**
 * Hero Section Component
 * Eye-catching hero with gradient background and animations
 */
export default function Hero() {
  const scrollToScenarios = () => {
    const element = document.getElementById('escenarios');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 animate-gradient">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float delay-200" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-red-500/30 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-8 animate-fadeIn border border-red-300/30">
            <span className="w-2 h-2 bg-red-300 rounded-full animate-pulse" />
            Cuando la Autoridad No Es Aliada
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 animate-fadeIn delay-100 font-display leading-tight">
            Defiéndete
            <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
              Conoce tus Derechos
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-2xl mx-auto animate-fadeIn delay-200 leading-relaxed">
            Plataforma de asesoría legal y gestión de emergencias. 
            <strong className="block mt-2">Documenta. Protege. Actúa.</strong>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn delay-300">
            <Button
              variant="sos"
              size="lg"
              icon="🚨"
              onClick={() => window.location.href = 'tel:911'}
              className="shadow-2xl"
            >
              Emergencia 911
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={scrollToScenarios}
              className="bg-white text-purple-600 hover:bg-gray-100 shadow-2xl"
            >
              <span className="text-xl mr-2">🛡️</span>
              Conoce tus Derechos
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.location.href = '/grabador'}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-2xl backdrop-blur-sm"
            >
              <span className="text-xl mr-2">🎙️</span>
              Grabar Evidencia
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto animate-fadeIn delay-400">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-4xl font-bold text-white mb-2">🛡️</div>
              <div className="text-sm text-white/80 font-medium">Protección Legal</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-4xl font-bold text-white mb-2">🎙️</div>
              <div className="text-sm text-white/80 font-medium">Grabación de Evidencia</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-4xl font-bold text-white mb-2">📱</div>
              <div className="text-sm text-white/80 font-medium">Alertas SOS</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm text-white/80 font-medium">Disponible</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={scrollToScenarios}
          className="text-white/80 hover:text-white transition-colors duration-200"
          aria-label="Desplazarse hacia abajo"
        >
          <svg 
            className="w-8 h-8" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
