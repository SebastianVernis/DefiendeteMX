import './globals.css';

export const metadata = {
  title: 'Defiéndete MX | Guía Legal de Derechos ante Detenciones',
  description: 'Conoce tus derechos legales ante detenciones policiales en México. Información clara, verificada y accesible para proteger tus garantías constitucionales.',
  keywords: 'derechos humanos, detención policial, México, defensa legal, abogado, CNDH, garantías constitucionales',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#1e40af" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-background text-textPrimary font-sans antialiased">
        {children}
        
        {/* Footer */}
        <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white mt-24 border-t-4 border-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-accent to-accentLight rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-bold">D</span>
                  </div>
                  <span className="font-display font-bold text-3xl">Defiéndete MX</span>
                </div>
                <p className="text-gray-300 leading-relaxed max-w-md text-lg">
                  Información legal verificada para proteger tus derechos en situaciones de detención.
                  Conocimiento que salva libertades.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-bold text-xl mb-6">Enlaces</h4>
                <ul className="space-y-4 text-base">
                  <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-3 group">
                      <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                      <span>Inicio</span>
                    </a>
                  </li>
                  <li>
                    <a href="/recursos" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-3 group">
                      <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                      <span>Recursos PDF</span>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.cndh.org.mx/" target="_blank" rel="noopener" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-3 group">
                      <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                      <span>CNDH</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Emergency */}
              <div>
                <h4 className="font-bold text-xl mb-6">Emergencias</h4>
                <ul className="space-y-5 text-sm">
                  <li className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-warning to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">!</span>
                    </div>
                    <div>
                      <div className="text-white font-bold text-2xl">911</div>
                      <div className="text-gray-400">Emergencias</div>
                    </div>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl">📞</span>
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">800 715 2000</div>
                      <div className="text-gray-400">CNDH</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-10 text-center">
              <p className="text-gray-400 text-base">
                © 2025 Defiéndete MX. Información educativa. Consulta a un profesional legal para casos específicos.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
