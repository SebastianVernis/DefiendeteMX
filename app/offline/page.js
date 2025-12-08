'use client';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

/**
 * Offline Page
 * Displayed when the user is offline
 */
export default function OfflinePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl mx-auto">
            <Card variant="glass" className="p-8 sm:p-12 text-center">
              {/* Icon */}
              <div className="mb-8 animate-float">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-6xl shadow-2xl">
                  📡
                </div>
              </div>

              {/* Content */}
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 font-display">
                Sin Conexión
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                No hay conexión a internet en este momento
              </p>

              {/* Info Cards */}
              <div className="space-y-4 mb-8 text-left">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Contenido en Caché
                      </h3>
                      <p className="text-sm text-gray-600">
                        Algunas páginas que visitaste anteriormente pueden estar disponibles sin conexión
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📞</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Llamadas de Emergencia
                      </h3>
                      <p className="text-sm text-gray-600">
                        Puedes realizar llamadas de emergencia incluso sin conexión a internet
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Reconexión Automática
                      </h3>
                      <p className="text-sm text-gray-600">
                        La aplicación se reconectará automáticamente cuando vuelvas a tener internet
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => window.location.reload()}
                >
                  <span className="text-xl mr-2">🔄</span>
                  Reintentar
                </Button>
                <Button
                  variant="sos"
                  size="lg"
                  icon="🚨"
                  onClick={() => window.location.href = 'tel:911'}
                >
                  Emergencia 911
                </Button>
              </div>

              {/* Emergency Numbers */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Números de Emergencia
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <a 
                    href="tel:911" 
                    className="flex items-center justify-center gap-2 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                  >
                    <span className="text-xl">🚨</span>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Emergencias</div>
                      <div className="text-red-600 font-bold">911</div>
                    </div>
                  </a>
                  <a 
                    href="tel:089" 
                    className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <span className="text-xl">👮</span>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Denuncia Anónima</div>
                      <div className="text-blue-600 font-bold">089</div>
                    </div>
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
