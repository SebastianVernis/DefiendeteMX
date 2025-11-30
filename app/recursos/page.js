import SOSButton from "../components/SOSButton";

export default function Recursos() {
  const files = [
    { 
      name: "Manual de Supervivencia Policial", 
      file: "/manual_supervivencia.pdf",
      description: "Guía completa sobre tus derechos durante una detención policial",
      icon: "📖",
      size: "PDF"
    },
    { 
      name: "Guía Express de Declaraciones", 
      file: "/guia_express.pdf",
      description: "Qué decir y qué no decir al momento de declarar",
      icon: "⚡",
      size: "PDF"
    },
    { 
      name: "Tarjeta de Bolsillo", 
      file: "/tarjeta_bolsillo.pdf",
      description: "Resumen de derechos para llevar siempre contigo",
      icon: "🎫",
      size: "PDF"
    }
  ];

  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-br from-accent via-accentLight to-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <a href="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio
            </a>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              📚 Recursos Descargables
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Descarga gratuitamente nuestras guías legales en PDF para tener acceso offline a información crucial
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Banner */}
        <div className="mb-10 bg-blue-50 border-l-4 border-accent rounded-r-xl p-6 shadow-soft">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-accent mb-1">
                Acceso Offline Disponible
              </h3>
              <p className="text-textSecondary leading-relaxed">
                Estos documentos están diseñados para ser descargados y consultados sin conexión a internet. 
                Te recomendamos guardarlos en tu dispositivo y compartirlos con personas de confianza.
              </p>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {files.map((f, i) => (
            <div key={i} className="card p-6 hover:scale-105 transition-transform duration-200">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-4xl mb-4">
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-xl text-textPrimary mb-2">
                  {f.name}
                </h3>
                <p className="text-textSecondary text-sm mb-4 leading-relaxed">
                  {f.description}
                </p>
                <span className="inline-block px-3 py-1 bg-secondary text-textMuted text-xs font-semibold rounded-full">
                  {f.size}
                </span>
              </div>
              
              <a 
                href={f.file} 
                download
                className="w-full inline-flex items-center justify-center btn-primary mt-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar
              </a>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-br from-accent to-accentLight text-white rounded-2xl p-8 md:p-10 shadow-card">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold mb-4">
              ¿Necesitas Ayuda Legal Profesional?
            </h2>
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Estos recursos son informativos. Para asesoría legal específica, contacta a un abogado profesional.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h4 className="font-semibold mb-2">📞 CNDH</h4>
                <p className="text-white/80 text-sm">800 715 2000</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h4 className="font-semibold mb-2">📞 Locatel CDMX</h4>
                <p className="text-white/80 text-sm">55 5658 1111</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SOSButton />
    </main>
  );
}