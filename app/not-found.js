import Link from 'next/link';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Card from './components/ui/Card';
import Button from './components/ui/Button';

/**
 * 404 Not Found Page
 * Displayed when a page is not found
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 px-4">
        <Card variant="glass" className="p-8 sm:p-12 max-w-2xl text-center">
          {/* Icon */}
          <div className="mb-8 animate-float">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-5xl shadow-2xl">
              🔍
            </div>
          </div>

          {/* Content */}
          <h1 className="text-6xl font-black text-gray-900 mb-4 font-display">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Página no encontrada
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>

          {/* Suggestions */}
          <div className="mb-8 space-y-3 text-left">
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">💡 Sugerencia:</span> Verifica que la URL esté escrita correctamente
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">🏠 Inicio:</span> Regresa a la página principal para explorar
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary" size="lg">
                <span className="text-xl mr-2">🏠</span>
                Ir al inicio
              </Button>
            </Link>
            <Link href="/recursos">
              <Button variant="secondary" size="lg">
                <span className="text-xl mr-2">📚</span>
                Ver recursos
              </Button>
            </Link>
          </div>

          {/* Emergency Contact */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              ¿Necesitas ayuda inmediata?
            </p>
            <a href="tel:911">
              <Button variant="sos" size="md" icon="🚨">
                Llamar al 911
              </Button>
            </a>
          </div>
        </Card>
      </main>
      <Footer />
    </>
  );
}
