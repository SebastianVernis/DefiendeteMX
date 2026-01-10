'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '../ui/Button';

/**
 * Modern Header Component
 * Features glassmorphism, smooth animations, and mobile menu
 */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = isScrolled
    ? 'glass shadow-xl'
    : 'bg-transparent';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClasses}`}
      role="banner"
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navegación principal">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
            aria-label="Defiéndete MX - Inicio"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <span className="text-2xl">⚖️</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text font-display">
                Defiéndete MX
              </h1>
              <p className="text-xs text-gray-600">Protege tus derechos</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              Inicio
            </Link>
            <Link 
              href="/constitucion" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              Constitución
            </Link>
            <Link 
              href="/recursos" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              Recursos
            </Link>
            <Link 
              href="#escenarios" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              Escenarios
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              variant="sos" 
              size="md"
              icon="🚨"
              onClick={() => window.location.href = 'tel:911'}
              aria-label="Llamar al 911 en caso de emergencia"
            >
              SOS 911
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span 
                className={`w-full h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span 
                className={`w-full h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span 
                className={`w-full h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 animate-fadeIn">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-purple-600 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href="/constitucion" 
                className="text-gray-700 hover:text-purple-600 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Constitución
              </Link>
              <Link 
                href="/recursos" 
                className="text-gray-700 hover:text-purple-600 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Recursos
              </Link>
              <Link 
                href="#escenarios" 
                className="text-gray-700 hover:text-purple-600 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Escenarios
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <Button 
                  variant="sos" 
                  size="md"
                  icon="🚨"
                  fullWidth
                  onClick={() => window.location.href = 'tel:911'}
                  aria-label="Llamar al 911 en caso de emergencia"
                >
                  SOS 911
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
