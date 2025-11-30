import SOSButton from "../components/SOSButton";

export default function Recursos() {
  const files = [
    { 
      name: "Manual de Supervivencia Policial", 
      file: "/manual_supervivencia.pdf",
      description: "Guía completa sobre tus derechos durante una detención policial. Incluye frases clave y protocolos recomendados.",
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      pages: "24 páginas",
      color: "blue"
    },
    { 
      name: "Guía Express de Declaraciones", 
      file: "/guia_express.pdf",
      description: "Información esencial sobre qué decir y qué no decir al momento de rendir una declaración.",
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      pages: "8 páginas",
      color: "orange"
    },
    { 
      name: "Tarjeta de Bolsillo", 
      file: "/tarjeta_bolsillo.pdf",
      description: "Resumen compacto de derechos fundamentales. Imprime y lleva siempre contigo.",
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      pages: "1 página",
      color: "green"
    }
  ];

  const colorClasses = {
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", iconBg: "bg-blue-100" },
    orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", iconBg: "bg-orange-100" },
    green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", iconBg: "bg-green-100" }
  };

  return (
    <main className="bg-background min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center space-x-3 group">
              <svg className="w-5 h-5 text-accent group-hover:text-accentLight transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-textSecondary group-hover:text-accent transition-colors font-medium">
                Volver al inicio
              </span>
            </a>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accentLight rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">D</span>
              </div>
              <span className="font-display font-bold text-xl text-textPrimary">
                Defiéndete MX
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-gradient-to-br from-accent via-accentLight to-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl mb-6 border border-white/20">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Recursos Descargables
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
              Descarga gratuitamente nuestras guías legales en PDF.
              <br />Información esencial para situaciones de emergencia.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Info Banner */}
        <div className="mb-12 bg-blue-50 border-l-4 border-accent rounded-r-2xl p-6 shadow-elegant">
          <div className="flex items-start space-x-4">
            <svg className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-bold text-accent mb-2">
                📥 Acceso Offline Disponible
              </h3>
              <p className="text-textSecondary leading-relaxed">
                Descarga estos documentos para consultarlos sin internet. Te recomendamos guardarlos en tu dispositivo 
                y compartirlos con tus contactos de confianza. También puedes imprimirlos para tener una copia física.
              </p>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {files.map((f, i) => {
            const colors = colorClasses[f.color];
            return (
              <div key={i} className="group bg-white rounded-2xl border border-border hover:border-accent/30 shadow-elegant hover:shadow-elegant-xl transition-all duration-300 overflow-hidden">
                {/* Header with icon */}
                <div className={`${colors.bg} border-b ${colors.border} p-6`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.iconBg} rounded-2xl ${colors.text} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {f.icon}
                  </div>
                  <h3 className="font-display font-bold text-xl text-textPrimary mb-2 line-clamp-2">
                    {f.name}
                  </h3>
                  <span className={`inline-block px-3 py-1 ${colors.bg} ${colors.text} text-xs font-semibold rounded-full border ${colors.border}`}>
                    {f.pages}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6">
                  <p className="text-textSecondary text-sm leading-relaxed mb-6">
                    {f.description}
                  </p>
                  
                  <a 
                    href={f.file} 
                    download
                    className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-accent hover:bg-accentHover text-white font-semibold rounded-xl transition-all duration-200 shadow-elegant hover:shadow-elegant-lg group-hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar PDF
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl border border-border p-8 md:p-12 shadow-elegant">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-textPrimary mb-3">
              ¿Necesitas Ayuda Legal Profesional?
            </h2>
            <p className="text-lg text-textSecondary max-w-2xl mx-auto">
              Estos recursos son informativos. Para casos específicos, contacta a las siguientes instituciones:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <a 
              href="https://www.cndh.org.mx/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-100 hover:border-accent transition-all duration-300 hover:shadow-elegant-lg"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-textPrimary mb-2 group-hover:text-accent transition-colors">
                    Comisión Nacional de Derechos Humanos
                  </h4>
                  <p className="text-3xl font-bold text-accent mb-1">800 715 2000</p>
                  <p className="text-sm text-textMuted">Atención 24/7 · Servicio gratuito</p>
                </div>
              </div>
            </a>

            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border-2 border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-textPrimary mb-2">
                    Locatel - Ciudad de México
                  </h4>
                  <p className="text-3xl font-bold text-textPrimary mb-1">55 5658 1111</p>
                  <p className="text-sm text-textMuted">Información y orientación</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-textMuted">
              Para emergencias inmediatas, marca <strong className="text-warning font-bold">911</strong>
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-bold text-yellow-900 mb-1">Aviso Legal</h4>
              <p className="text-sm text-yellow-800 leading-relaxed">
                La información proporcionada tiene fines educativos y no constituye asesoría legal. 
                Para casos específicos, consulta a un abogado profesional. Los datos presentados se basan 
                en la legislación mexicana vigente.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SOSButton />
    </main>
  );
}
