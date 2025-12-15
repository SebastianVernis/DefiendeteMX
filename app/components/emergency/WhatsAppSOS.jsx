'use client';

import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';

/**
 * WhatsApp SOS Component
 * Quick emergency button to send SOS message via WhatsApp
 */
export default function WhatsAppSOS({ className = '', compact = false }) {
  const [location, setLocation] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Load emergency contacts from localStorage
    const stored = localStorage.getItem('emergency-contacts');
    if (stored) {
      try {
        const contacts = JSON.parse(stored);
        setEmergencyContacts(contacts);
      } catch (error) {
        console.error('Error loading emergency contacts:', error);
      }
    }
  }, []);

  const getLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setLocation(loc);
          resolve(loc);
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

  const generateSOSMessage = (loc) => {
    let message = '🚨 *EMERGENCIA - SOS* 🚨\n\n';
    message += 'Necesito ayuda urgente!\n\n';

    if (loc) {
      message += `📍 Mi ubicación:\n`;
      message += `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}\n\n`;
      message += `Coordenadas: ${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}\n\n`;
    } else {
      message += '⚠️ No pude obtener mi ubicación automáticamente.\n\n';
    }

    const timestamp = new Date().toLocaleString('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    message += `🕐 Hora: ${timestamp}\n\n`;
    message += '✅ Enviado desde Defiéndete MX\n';
    message += 'https://defiendete-mx.pages.dev';

    return message;
  };

  const sendSOSWhatsApp = async (phoneNumber) => {
    const loc = await getLocation();
    const message = generateSOSMessage(loc);

    // Format phone number (remove non-digits)
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    // Check if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const url = isMobile
      ? `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`
      : `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
  };

  const handleSOSClick = async () => {
    if (emergencyContacts.length === 0) {
      alert('No tienes contactos de emergencia configurados. Ve a tu perfil para agregarlos.');
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmSOS = async () => {
    setSending(true);
    setShowConfirm(false);

    // Send to first emergency contact
    await sendSOSWhatsApp(emergencyContacts[0].phone);

    // Optional: send to all contacts (uncomment if desired)
    // for (const contact of emergencyContacts) {
    //   await sendSOSWhatsApp(contact.phone);
    //   await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between sends
    // }

    setSending(false);
  };

  if (compact) {
    return (
      <>
        <Button
          variant="primary"
          onClick={handleSOSClick}
          disabled={sending}
          className={`bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/50 animate-pulse-glow ${className}`}
        >
          {sending ? (
            <>⏳ Enviando...</>
          ) : (
            <>🚨 SOS WhatsApp</>
          )}
        </Button>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card variant="glass" className="p-6 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 animate-pulse">🚨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  ¿Enviar SOS por WhatsApp?
                </h3>
                <p className="text-gray-600">
                  Se enviará un mensaje de emergencia con tu ubicación a:
                </p>
                <p className="font-bold text-gray-900 mt-2">
                  {emergencyContacts[0]?.name} - {emergencyContacts[0]?.phone}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleConfirmSOS}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Enviar SOS
                </Button>
              </div>
            </Card>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Card variant="gradient" className={`p-6 bg-gradient-to-br from-red-500 to-pink-600 text-white ${className}`}>
        <div className="text-center mb-4">
          <div className="text-5xl mb-3 animate-pulse">🚨</div>
          <h3 className="text-2xl font-bold mb-2">Emergencia SOS</h3>
          <p className="text-white/90 text-sm mb-4">
            Envía tu ubicación por WhatsApp a tus contactos de emergencia
          </p>
        </div>

        {emergencyContacts.length > 0 ? (
          <>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
              <p className="text-sm font-medium mb-2">Contactos configurados:</p>
              <ul className="text-sm space-y-1">
                {emergencyContacts.slice(0, 3).map((contact, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span>✓</span>
                    <span>{contact.name}</span>
                  </li>
                ))}
                {emergencyContacts.length > 3 && (
                  <li className="text-white/70">
                    +{emergencyContacts.length - 3} más
                  </li>
                )}
              </ul>
            </div>

            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={handleSOSClick}
              disabled={sending}
              className="bg-white text-red-600 hover:bg-gray-100 font-bold shadow-lg"
            >
              {sending ? (
                <>⏳ Enviando SOS...</>
              ) : (
                <>🚨 ENVIAR SOS AHORA</>
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4 text-center">
              <p className="text-sm">
                No tienes contactos de emergencia configurados
              </p>
            </div>
            <Button
              variant="primary"
              fullWidth
              onClick={() => window.location.href = '/perfil'}
              className="bg-white text-red-600 hover:bg-gray-100 font-bold"
            >
              Configurar Contactos
            </Button>
          </>
        )}

        <div className="mt-4 text-center text-white/70 text-xs">
          <p>También puedes llamar a emergencias:</p>
          <div className="flex gap-2 justify-center mt-2">
            <button
              onClick={() => window.location.href = 'tel:911'}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs font-medium transition"
            >
              📞 911
            </button>
            <button
              onClick={() => window.location.href = 'tel:8007152000'}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs font-medium transition"
            >
              📞 CNDH
            </button>
          </div>
        </div>
      </Card>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card variant="glass" className="p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-pulse">🚨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ¿Enviar SOS por WhatsApp?
              </h3>
              <p className="text-gray-600">
                Se enviará un mensaje de emergencia con tu ubicación a:
              </p>
              <p className="font-bold text-gray-900 mt-2">
                {emergencyContacts[0]?.name} - {emergencyContacts[0]?.phone}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowConfirm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleConfirmSOS}
                className="bg-red-600 hover:bg-red-700"
              >
                🚨 Enviar SOS
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
