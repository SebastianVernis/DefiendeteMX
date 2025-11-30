import './globals.css';

export const metadata = {
  title: 'Defiéndete MX | Guía Legal Interactiva',
  description: 'Tu guía interactiva de derechos y acciones legales ante detenciones en México. Información legal verificada y accesible.',
  keywords: 'derechos humanos, detención, México, legal, abogado, defensa legal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#0c4a6e" />
      </head>
      <body className="bg-background text-textPrimary font-sans antialiased">
        {children}
        
        {/* Footer */}
        <footer className="bg-accent text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* About */}
              <div>
                <h3 className="font-display font-bold text-xl mb-4">Defiéndete MX</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Información legal verificada para proteger tus derechos en situaciones de detención en México.
                </p>
              </div>
              
              {/* Links */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Enlaces Útiles</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/" className="text-white/80 hover:text-white transition-colors">
                      Inicio
                    </a>
                  </li>
                  <li>
                    <a href="/recursos" className="text-white/80 hover:text-white transition-colors">
                      Recursos Descargables
                    </a>
                  </li>
                  <li>
                    <a href="https://www.cndh.org.mx/" target="_blank" rel="noopener" className="text-white/80 hover:text-white transition-colors">
                      CNDH - Comisión Nacional de Derechos Humanos
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Emergency */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Contactos de Emergencia</h4>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>📞 Emergencias: <span className="font-bold text-white">911</span></li>
                  <li>📞 CNDH: <span className="font-bold text-white">800 715 2000</span></li>
                  <li>📞 Locatel: <span className="font-bold text-white">55 5658 1111</span></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-8 text-center text-sm text-white/60">
              <p>© 2025 Defiéndete MX. Información con fines educativos. Consulta a un profesional legal para casos específicos.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}