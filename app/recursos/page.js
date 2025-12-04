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
      <header className="bg-gradient-to-br from-accent via-accentLight to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl mb-8 border border-white/30 shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-5">
              Recursos Descargables
            </h1>
            <p className="text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
              Descarga gratuitamente nuestras guías legales en PDF.
              <br />Información esencial para situaciones de emergencia.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Info Banner */}
        <div className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border-l-4 border-accent p-8 shadow-xl">
          <div className="flex items-start space-x-5">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-accent mb-3">
                📥 Acceso Offline Disponible
              </h3>
              <p className="text-lg text-textSecondary leading-relaxed">
                Descarga estos documentos para consultarlos sin internet. Te recomendamos guardarlos en tu dispositivo
                y compartirlos con tus contactos de confianza. También puedes imprimirlos para tener una copia física.
              </p>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {files.map((f, i) => {
            const colors = colorClasses[f.color];
            return (
              <div key={i} className="group bg-gradient-to-br from-white to-secondary/30 rounded-3xl border border-border hover:border-accent/30 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                {/* Header with icon */}
                <div className={`${colors.bg} border-b ${colors.border} p-8`}>
                  <div className={`inline-flex items-center justify-center w-20 h-20 ${colors.iconBg} rounded-2xl ${colors.text} mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {f.icon}
                  </div>
                  <h3 className="font-display font-bold text-2xl text-textPrimary mb-3 line-clamp-2">
                    {f.name}
                  </h3>
                  <span className={`inline-block px-4 py-2 ${colors.bg} ${colors.text} text-sm font-bold rounded-full border ${colors.border} shadow-sm`}>
                    {f.pages}
                  </span>
                </div>

                {/* Body */}
                <div className="p-8">
                  <p className="text-lg text-textSecondary leading-relaxed mb-8">
                    {f.description}
                  </p>

                  <a
                    href={f.file}
                    download
                    className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-accent to-accentLight hover:from-accentHover hover:to-accentLight text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl group-hover:scale-105"
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="text-center mb-14">
            <div className="inline-block bg-gradient-to-r from-accent to-accentLight p-1 rounded-full mb-6">
              <div className="bg-white rounded-full px-6 py-2">
                <span className="text-sm font-bold text-accent">AYUDA LEGAL</span>
              </div>
            </div>
            <h2 className="font-display text-4xl font-bold text-textPrimary mb-4">
              ¿Necesitas Ayuda Legal Profesional?
            </h2>
            <p className="text-xl text-textSecondary max-w-2xl mx-auto">
              Estos recursos son informativos. Para casos específicos, contacta a las siguientes instituciones:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <a
              href="https://www.cndh.org.mx/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-100 hover:border-accent transition-all duration-300 hover:shadow-2xl shadow-lg"
            >
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accentLight rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-textPrimary mb-3 group-hover:text-accent transition-colors">
                    Comisión Nacional de Derechos Humanos
                  </h4>
                  <p className="text-4xl font-bold text-accent mb-2">800 715 2000</p>
                  <p className="text-base text-textMuted font-medium">Atención 24/7 · Servicio gratuito</p>
                </div>
              </div>
            </a>

            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-3xl p-8 border-2 border-gray-200 shadow-lg">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-textPrimary mb-3">
                    Locatel - Ciudad de México
                  </h4>
                  <p className="text-4xl font-bold text-textPrimary mb-2">55 5658 1111</p>
                  <p className="text-base text-textMuted font-medium">Información y orientación</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional note */}
          <div className="mt-12 text-center">
            <p className="text-lg text-textMuted">
              Para emergencias inmediatas, marca <strong className="text-warning font-bold text-2xl">911</strong>
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-20 bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-3xl p-8 shadow-lg">
          <div className="flex items-start space-x-5">
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-bold text-yellow-900 mb-2">Aviso Legal</h4>
              <p className="text-base text-yellow-800 leading-relaxed">
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
