'use client';

import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import FavoriteButton from '../components/ui/FavoriteButton';
import { downloadPDF } from '../lib/pdf/pdfGenerator';

/**
 * Resources Page
 * Visual gallery of downloadable legal resources
 */
export default function RecursosPage() {
  const [downloading, setDownloading] = useState(null);

  const handleDownload = (resourceId, title) => {
    setDownloading(resourceId);
    try {
      const filename = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      const success = downloadPDF(resourceId, filename);
      if (success) {
        // Show success message (optional)
        setTimeout(() => setDownloading(null), 1000);
      } else {
        alert('Error al generar el PDF. Por favor, intenta nuevamente.');
        setDownloading(null);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error al descargar el archivo. Por favor, intenta nuevamente.');
      setDownloading(null);
    }
  };

  const resources = [
    {
      id: 1,
      title: 'Guía de Derechos Fundamentales',
      description: 'Conoce tus derechos constitucionales en situaciones de detención',
      icon: '📖',
      category: 'Guía',
      size: '2.5 MB',
      pages: '12 páginas',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      title: 'Contactos de Emergencia',
      description: 'Lista completa de números de emergencia y organizaciones de ayuda',
      icon: '📞',
      category: 'Directorio',
      size: '1.2 MB',
      pages: '8 páginas',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 3,
      title: 'Procedimientos Legales',
      description: 'Paso a paso de los procedimientos legales en México',
      icon: '⚖️',
      category: 'Procedimientos',
      size: '3.8 MB',
      pages: '20 páginas',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      id: 4,
      title: 'Formulario de Denuncia',
      description: 'Plantilla para presentar denuncias ante autoridades',
      icon: '📝',
      category: 'Formulario',
      size: '800 KB',
      pages: '4 páginas',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 5,
      title: 'Derechos del Detenido',
      description: 'Información detallada sobre los derechos durante una detención',
      icon: '🛡️',
      category: 'Guía',
      size: '2.1 MB',
      pages: '10 páginas',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 6,
      title: 'Recursos de la CNDH',
      description: 'Compilación de recursos oficiales de la Comisión Nacional de Derechos Humanos',
      icon: '🏛️',
      category: 'Oficial',
      size: '4.2 MB',
      pages: '25 páginas',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float delay-200" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
                <span>📚</span>
                Recursos Legales
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 font-display">
                Recursos
                <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Descargables
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Documentos verificados y guías prácticas para proteger tus derechos
              </p>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-20 bg-gradient-to-b from-white to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {resources.map((resource, index) => (
                <Card 
                  key={resource.id}
                  variant="gradient"
                  hover={true}
                  className={`p-6 animate-fadeIn delay-${index * 100}`}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${resource.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg mb-4`}>
                    {resource.icon}
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {resource.title}
                      </h3>
                      <FavoriteButton type="resources" item={resource} size="sm" />
                    </div>
                    <Badge variant="primary" size="sm" className="mb-3">
                      {resource.category}
                    </Badge>
                    <p className="text-gray-600 text-sm mb-4">
                      {resource.description}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <span>📄</span>
                      {resource.pages}
                    </span>
                    <span className="flex items-center gap-1">
                      <span>💾</span>
                      {resource.size}
                    </span>
                  </div>

                  {/* Download Button */}
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => handleDownload(resource.id, resource.title)}
                    disabled={downloading === resource.id}
                  >
                    {downloading === resource.id ? (
                      <>
                        <span className="text-lg mr-1">⏳</span>
                        Generando...
                      </>
                    ) : (
                      <>
                        <span className="text-lg mr-1">⬇️</span>
                        Descargar PDF
                      </>
                    )}
                  </Button>
                </Card>
              ))}
            </div>

            {/* Info Section */}
            <div className="mt-16 max-w-3xl mx-auto">
              <Card variant="glass" className="p-8 text-center">
                <div className="text-5xl mb-4">ℹ️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Información Importante
                </h3>
                <p className="text-gray-600 mb-6">
                  Todos los recursos están verificados por expertos legales y se actualizan regularmente 
                  para reflejar las leyes vigentes en México.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => window.location.href = '/'}
                  >
                    ← Volver al Inicio
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => window.location.href = 'tel:911'}
                  >
                    🚨 Emergencia 911
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
