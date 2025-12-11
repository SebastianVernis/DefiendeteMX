'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/features/Hero';
import FeaturesSection from './components/features/FeaturesSection';
import ScenariosSection from './components/features/ScenariosSection';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Link from 'next/link';

/**
 * Home Page
 * Main landing page with hero and quick access to platform
 */
export default function HomePage() {
  const router = useRouter();

  const quickFeatures = [
    {
      title: 'Dashboard Central',
      description: 'Centro de control de todos tus casos y recursos',
      icon: '🏠',
      href: '/dashboard',
      color: 'blue'
    },
    {
      title: 'Reportar Emergencia',
      description: 'Documenta situaciones de peligro inmediato',
      icon: '🚨',
      href: '/casos/nuevo?type=emergency',
      color: 'red'
    },
    {
      title: 'Asesoría Legal IA',
      description: 'Consulta con asistente legal inteligente 24/7',
      icon: '💬',
      href: '/dashboard',
      color: 'purple',
      action: 'chat'
    },
    {
      title: 'Red de Contactos',
      description: 'Mantén a mano contactos de emergencia',
      icon: '👥',
      href: '/contactos',
      color: 'green'
    },
    {
      title: 'Evidencia Digital',
      description: 'Almacena pruebas de forma segura',
      icon: '📸',
      href: '/evidencia/nueva',
      color: 'indigo'
    },
    {
      title: 'Recursos Legales',
      description: 'Guías, formularios y documentos útiles',
      icon: '📚',
      href: '/recursos',
      color: 'orange'
    }
  ];

  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* Quick Access Section */}
        <section className="py-16 bg-gradient-to-b from-white to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                Acceso Rápido a la Plataforma
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Tu centro de asesoría y gestión legal para emergencias donde la autoridad no es aliada
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {quickFeatures.map((feature) => (
                <Link key={feature.title} href={feature.href}>
                  <Card hover className="h-full">
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 bg-${feature.color}-100 rounded-2xl flex items-center justify-center text-3xl`}>
                        {feature.icon}
                      </div>
                      <h3 className="font-bold text-xl text-gray-800 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link href="/dashboard">
                <Button variant="primary" size="lg" icon="🚀">
                  Ir al Dashboard Principal
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <FeaturesSection />
        <ScenariosSection />

        {/* Emergency Banner */}
        <section className="py-12 bg-gradient-to-r from-red-600 to-red-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">
                  ¿Estás en una situación de emergencia?
                </h3>
                <p className="text-red-100">
                  Obtén ayuda inmediata y documenta tu caso de forma segura
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  icon="📞"
                  onClick={() => window.location.href = 'tel:911'}
                >
                  Llamar 911
                </Button>
                <Link href="/casos/nuevo?type=emergency">
                  <Button variant="light" size="lg" icon="🚨">
                    Reportar Ahora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
