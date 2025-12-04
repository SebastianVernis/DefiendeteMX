"use client";
import { useEffect, useState } from "react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      window.location.href = "/";
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.href = "/";
    } else {
      alert("Aún no hay conexión a internet. Por favor, verifica tu conexión.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-accentLight flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-pulse">
            <span className="text-7xl">📡</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Sin Conexión a Internet
          </h1>

          {/* Description */}
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            No hay conexión disponible en este momento. Por favor, verifica tu conexión a internet e intenta nuevamente.
          </p>

          {/* Retry Button */}
          <button
            onClick={handleRetry}
            className="px-8 py-4 bg-white text-accent rounded-xl font-bold text-lg hover:bg-white/90 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center space-x-3 mx-auto mb-8"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reintentar Conexión</span>
          </button>

          {/* Info Box */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-center space-x-2">
              <span>📚</span>
              <span>Información Disponible Offline</span>
            </h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-start space-x-3 text-white/90">
                <svg className="w-5 h-5 text-white mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Escenarios legales guardados en caché</span>
              </li>
              <li className="flex items-start space-x-3 text-white/90">
                <svg className="w-5 h-5 text-white mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Guías de derechos básicos</span>
              </li>
              <li className="flex items-start space-x-3 text-white/90">
                <svg className="w-5 h-5 text-white mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Números de emergencia: 911, 800 715 2000</span>
              </li>
              <li className="flex items-start space-x-3 text-white/90">
                <svg className="w-5 h-5 text-white mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Recursos descargados previamente</span>
              </li>
            </ul>
          </div>

          {/* Status Indicator */}
          <div className="mt-8 flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
            <span className="text-sm text-white/80">
              {isOnline ? 'Conectado' : 'Sin conexión'}
            </span>
          </div>

          {/* Footer */}
          <div className="mt-8 text-white/70 text-sm">
            <p>🛡️ Defiéndete MX - Protegiendo tus derechos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
