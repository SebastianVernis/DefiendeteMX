'use client';

import { useEffect } from 'react';
import Button from './components/ui/Button';
import Card from './components/ui/Card';

/**
 * Error Component
 * Displayed when an error occurs
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 px-4">
      <Card variant="glass" className="p-8 sm:p-12 max-w-2xl text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-5xl shadow-2xl">
            ⚠️
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 font-display">
          Algo salió mal
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta nuevamente.
        </p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm text-red-800 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={reset}
          >
            <span className="text-xl mr-2">🔄</span>
            Intentar nuevamente
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.location.href = '/'}
          >
            <span className="text-xl mr-2">🏠</span>
            Volver al inicio
          </Button>
        </div>

        {/* Emergency Contact */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            ¿Necesitas ayuda inmediata?
          </p>
          <Button
            variant="sos"
            size="md"
            icon="🚨"
            onClick={() => window.location.href = 'tel:911'}
          >
            Llamar al 911
          </Button>
        </div>
      </Card>
    </div>
  );
}
