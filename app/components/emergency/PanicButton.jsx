'use client';

import { useState, useEffect } from 'react';
import Button from '../ui/Button';

/**
 * Botón de Pánico Discreto
 * Permite activar modo de emergencia con gestos discretos
 */
export default function PanicButton() {
  const [isPressed, setIsPressed] = useState(false);
  const [pressCount, setPressCount] = useState(0);
  const [lastPressTime, setLastPressTime] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Detectar triple presión del botón de volumen (simulado con tecla Escape)
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastPressTime < 500) {
          setPressCount(prev => prev + 1);
        } else {
          setPressCount(1);
        }
        setLastPressTime(now);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lastPressTime]);

  useEffect(() => {
    if (pressCount >= 3) {
      activatePanicMode();
      setPressCount(0);
    }
  }, [pressCount]);

  const activatePanicMode = () => {
    // Enviar alertas silenciosas
    sendEmergencyAlerts();

    // Grabar audio/video en segundo plano
    startRecording();

    // Compartir ubicación
    shareLocation();

    // Mostrar interfaz discreta
    setIsPressed(true);

    // Vibración discreta (si está disponible)
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const sendEmergencyAlerts = async () => {
    try {
      // Obtener contactos de emergencia
      const contacts = JSON.parse(localStorage.getItem('emergencyContacts') || '[]');

      // Obtener ubicación
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const message = `🚨 ALERTA DE EMERGENCIA\n\nUbicación: https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}\n\nEsta es una alerta automática de Defiéndete MX.`;

          // Enviar SMS a contactos (en producción usar API)
          console.log('Enviando alertas a:', contacts);

          // Notificar al backend
          await fetch('/api/notifications/emergency', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contacts: contacts.map(c => c.phone),
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              },
              timestamp: new Date().toISOString()
            })
          });
        });
      }
    } catch (error) {
      console.error('Error sending emergency alerts:', error);
    }
  };

  const startRecording = () => {
    // Iniciar grabación de audio/video en segundo plano
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          const chunks = [];

          mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            // Guardar en IndexedDB o enviar al servidor
            console.log('Audio grabado:', blob.size, 'bytes');
          };

          mediaRecorder.start();

          // Detener después de 5 minutos
          setTimeout(() => {
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
          }, 300000);
        })
        .catch(err => console.error('Error al grabar:', err));
    }
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          // Enviar ubicación en tiempo real al servidor
          fetch('/api/tracking/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date().toISOString()
            })
          }).catch(err => console.error('Error tracking location:', err));
        },
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      // Guardar watchId para poder detener más tarde
      sessionStorage.setItem('locationWatchId', watchId);
    }
  };

  const deactivatePanicMode = () => {
    setIsPressed(false);

    // Detener seguimiento de ubicación
    const watchId = sessionStorage.getItem('locationWatchId');
    if (watchId) {
      navigator.geolocation.clearWatch(parseInt(watchId));
      sessionStorage.removeItem('locationWatchId');
    }
  };

  const quickActions = [
    {
      id: 'call-911',
      label: 'Llamar 911',
      icon: '📞',
      action: () => window.location.href = 'tel:911',
      color: 'red'
    },
    {
      id: 'silent-alert',
      label: 'Alerta Silenciosa',
      icon: '🔕',
      action: () => sendEmergencyAlerts(),
      color: 'orange'
    },
    {
      id: 'fake-call',
      label: 'Llamada Falsa',
      icon: '📱',
      action: () => {
        // Simular llamada entrante
        alert('Simulando llamada entrante...');
        window.location.href = '/fake-call';
      },
      color: 'blue'
    },
    {
      id: 'record',
      label: 'Grabar Evidencia',
      icon: '🎙️',
      action: () => window.location.href = '/grabador',
      color: 'purple'
    }
  ];

  if (isPressed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-95 z-[100] flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-pulse">🚨</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Modo Pánico Activo
            </h2>
            <p className="text-gray-300 text-sm">
              Se han enviado alertas a tus contactos de emergencia
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className={`p-6 rounded-xl bg-${action.color}-600 hover:bg-${action.color}-700 text-white transition-all transform hover:scale-105`}
              >
                <div className="text-4xl mb-2">{action.icon}</div>
                <div className="font-semibold text-sm">{action.label}</div>
              </button>
            ))}
          </div>

          <button
            onClick={deactivatePanicMode}
            className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all"
          >
            Desactivar Modo Pánico
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Botón Flotante Discreto */}
      <div className="fixed bottom-24 right-6 z-50">
        <button
          onClick={() => setShowMenu(!showMenu)}
          onDoubleClick={activatePanicMode}
          className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 animate-pulse"
          title="Doble click para activar modo pánico (o presiona ESC 3 veces)"
        >
          <span className="text-2xl">🆘</span>
        </button>

        {showMenu && (
          <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-4 w-64 animate-fadeIn">
            <div className="text-sm text-gray-600 mb-3 font-semibold">
              Acciones de Emergencia
            </div>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => {
                    action.action();
                    setShowMenu(false);
                  }}
                  className="w-full p-3 text-left rounded-lg hover:bg-gray-100 transition-all flex items-center gap-3"
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="font-medium text-gray-800 text-sm">
                    {action.label}
                  </span>
                </button>
              ))}
              <button
                onClick={() => {
                  activatePanicMode();
                  setShowMenu(false);
                }}
                className="w-full p-3 text-left rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all flex items-center gap-3 font-semibold"
              >
                <span className="text-2xl">🚨</span>
                <span className="text-sm">Activar Modo Pánico</span>
              </button>
            </div>
            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
              💡 Tip: Presiona ESC 3 veces rápido para activar discretamente
            </div>
          </div>
        )}
      </div>

      {/* Indicador de Triple Presión */}
      {pressCount > 0 && pressCount < 3 && (
        <div className="fixed top-24 right-6 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fadeIn">
          Presiona {3 - pressCount} vez más
        </div>
      )}
    </>
  );
}
