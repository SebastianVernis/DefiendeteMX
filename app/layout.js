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
        <footer className="bg-slate-900 text-white mt-24 border-t-4 border-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-accentLight rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl font-bold">D</span>
                  </div>
                  <span className="font-display font-bold text-2xl">Defiéndete MX</span>
                </div>
                <p className="text-gray-400 leading-relaxed max-w-md">
                  Información legal verificada para proteger tus derechos en situaciones de detención. 
                  Conocimiento que salva libertades.
                </p>
              </div>
              
              {/* Links */}
              <div>
                <h4 className="font-bold text-lg mb-4">Enlaces</h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <a href="/" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                      <span>→</span>
                      <span>Inicio</span>
                    </a>
                  </li>
                  <li>
                    <a href="/recursos" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                      <span>→</span>
                      <span>Recursos PDF</span>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.cndh.org.mx/" target="_blank" rel="noopener" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                      <span>→</span>
                      <span>CNDH</span>
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Emergency */}
              <div>
                <h4 className="font-bold text-lg mb-4">Emergencias</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                      <span className="text-warning font-bold">!</span>
                    </div>
                    <div>
                      <div className="text-white font-bold">911</div>
                      <div className="text-gray-500 text-xs">Emergencias</div>
                    </div>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400">📞</span>
                    </div>
                    <div>
                      <div className="text-white font-bold text-xs">800 715 2000</div>
                      <div className="text-gray-500 text-xs">CNDH</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-500 text-sm">
                © 2025 Defiéndete MX. Información educativa. Consulta a un profesional legal para casos específicos.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
