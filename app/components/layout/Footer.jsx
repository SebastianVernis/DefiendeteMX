"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    enlaces: [
      { label: "Inicio", href: "/" },
      { label: "Recursos PDF", href: "/recursos" },
      { label: "CNDH", href: "https://www.cndh.org.mx/", external: true },
      { label: "Acerca de", href: "#about" },
    ],
    legal: [
      { label: "Términos de Uso", href: "#terms" },
      { label: "Privacidad", href: "#privacy" },
      { label: "Aviso Legal", href: "#legal" },
    ],
    emergencias: [
      { label: "911 - Emergencias", phone: "911" },
      { label: "800 715 2000 - CNDH", phone: "8007152000" },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white mt-24 border-t-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-accent to-accentLight rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">D</span>
              </div>
              <span className="font-display font-bold text-2xl">Defiéndete MX</span>
            </div>
            <p className="text-gray-300 leading-relaxed text-base mb-6">
              Información legal verificada para proteger tus derechos en situaciones de detención.
              Conocimiento que salva libertades.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Facebook"
              >
                <span className="text-xl">📘</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Twitter"
              >
                <span className="text-xl">🐦</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Instagram"
              >
                <span className="text-xl">📷</span>
              </a>
            </div>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Enlaces</h4>
            <ul className="space-y-3">
              {footerLinks.enlaces.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
                  >
                    <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
                  >
                    <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Emergencias</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-warning to-red-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-xl">!</span>
                </div>
                <div>
                  <a href="tel:911" className="text-white font-bold text-2xl hover:text-accent transition-colors">
                    911
                  </a>
                  <div className="text-gray-400 text-sm">Emergencias</div>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white text-xl">📞</span>
                </div>
                <div>
                  <a href="tel:8007152000" className="text-white font-bold text-lg hover:text-accent transition-colors">
                    800 715 2000
                  </a>
                  <div className="text-gray-400 text-sm">CNDH</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Defiéndete MX. Información educativa. Consulta a un profesional legal para casos específicos.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Hecho con ❤️ en México</span>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">
                Sebastián Vernis
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
