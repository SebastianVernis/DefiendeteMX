"use client";
import { useState, useEffect } from "react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt after 10 seconds
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 10000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setShowUpdateNotification(true);
            }
          });
        });
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installation accepted');
      setShowInstallPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      });
      window.location.reload();
    }
  };

  // Don't show if dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setShowInstallPrompt(false);
      }
    }
  }, []);

  // Update notification
  if (showUpdateNotification) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
        <div className="bg-gradient-to-r from-accent to-accentLight text-white rounded-2xl shadow-2xl p-5 border-2 border-white/20">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔄</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Nueva Actualización Disponible</h3>
              <p className="text-sm text-white/90 mb-3">
                Hay una nueva versión de Defiéndete MX disponible.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-white text-accent rounded-lg font-semibold text-sm hover:bg-white/90 transition-all duration-200"
                >
                  Actualizar Ahora
                </button>
                <button
                  onClick={() => setShowUpdateNotification(false)}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg font-semibold text-sm hover:bg-white/30 transition-all duration-200"
                >
                  Más Tarde
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowUpdateNotification(false)}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Install prompt
  if (!showInstallPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl p-5 border border-border">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-accent to-accentLight rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white text-2xl font-bold">D</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-textPrimary mb-1">
              Instalar Defiéndete MX
            </h3>
            <p className="text-sm text-textSecondary mb-3">
              Instala la app para acceso rápido y funcionalidad offline.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-accent hover:bg-accentHover text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-secondary hover:bg-border text-textPrimary rounded-lg font-semibold text-sm transition-all duration-200"
              >
                Ahora No
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-textSecondary hover:text-textPrimary transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Features */}
        <div className="mt-4 pt-4 border-t border-border">
          <ul className="space-y-2 text-xs text-textSecondary">
            <li className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Funciona sin conexión</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Acceso rápido desde tu pantalla de inicio</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Notificaciones de actualizaciones legales</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
