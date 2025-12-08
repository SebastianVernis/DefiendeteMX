'use client';

import Link from 'next/link';

/**
 * Modern Footer Component
 * Minimalist design with gradient accents
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Recursos', href: '/recursos' },
    { name: 'Escenarios', href: '#escenarios' },
  ];

  const legalLinks = [
    { name: 'CNDH', href: 'https://www.cndh.org.mx', external: true },
    { name: 'Fiscalía General', href: 'https://www.gob.mx/fgr', external: true },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white mt-20" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">⚖️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">Defiéndete MX</h2>
                <p className="text-sm text-purple-200">Protege tus derechos</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Información legal verificada para proteger tus derechos en situaciones de detención en México.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-200">Navegación</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-200">Recursos Legales</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1"
                  >
                    {link.name}
                    {link.external && <span className="text-xs">↗</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="border-t border-purple-700 pt-8 mb-8">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-center">
            <p className="text-lg font-semibold mb-2">🚨 Emergencias</p>
            <a 
              href="tel:911" 
              className="text-3xl font-bold hover:underline"
              aria-label="Llamar al 911"
            >
              911
            </a>
            <p className="text-sm mt-2 text-red-100">Disponible 24/7</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>
            © {currentYear} Defiéndete MX. Todos los derechos reservados.
          </p>
          <p className="text-center md:text-right">
            Desarrollado con 💜 para proteger tus derechos
          </p>
        </div>
      </div>
    </footer>
  );
}
