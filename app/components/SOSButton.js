"use client";
import { useState } from "react";

export default function SOSButton() {
  const [sending, setSending] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const sendSOS = async () => {
    setSending(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
          const msg = `🚨 EMERGENCIA - NECESITO AYUDA\n\nEstoy en una situación de riesgo y requiero asistencia inmediata.\n\nUbicación: ${location}\n\nPor favor, contacta a las autoridades o acude a ayudarme.\n\n— Enviado desde Defiéndete MX`;
          
          navigator.clipboard.writeText(msg).then(() => {
            alert("✅ Mensaje SOS copiado al portapapeles.\n\n📱 Pégalo ahora en WhatsApp, SMS o cualquier app de mensajería para enviarlo a tus contactos de emergencia.");
            setSending(false);
          });
        },
        () => {
          const msg = "🚨 EMERGENCIA - NECESITO AYUDA\n\nEstoy en una situación de riesgo y requiero asistencia inmediata.\n\n(Ubicación GPS no disponible)\n\nPor favor, contacta a las autoridades.\n\n— Enviado desde Defiéndete MX";
          navigator.clipboard.writeText(msg).then(() => {
            alert("⚠️ No se pudo obtener tu ubicación GPS.\n\n✅ Mensaje SOS básico copiado al portapapeles.\n\n📱 Pégalo en WhatsApp o SMS.");
            setSending(false);
          });
        }
      );
    } else {
      const msg = "🚨 EMERGENCIA - NECESITO AYUDA\n\nEstoy en una situación de riesgo.\n\n— Enviado desde Defiéndete MX";
      navigator.clipboard.writeText(msg).then(() => {
        alert("⚠️ GPS no disponible.\n\n✅ Mensaje copiado al portapapeles.");
        setSending(false);
      });
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative">
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-3 animate-fade-in">
            <div className="bg-gray-900 text-white text-sm rounded-xl py-3 px-4 shadow-elegant-xl whitespace-nowrap">
              <div className="font-semibold mb-1">Botón de Emergencia</div>
              <div className="text-gray-300 text-xs">Copia mensaje SOS con ubicación</div>
              <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-gray-900"></div>
            </div>
          </div>
        )}

        {/* Pulsing ring animation */}
        <div className={`absolute inset-0 rounded-full bg-warning ${sending ? 'animate-ping' : ''}`}></div>
        
        {/* Main button */}
        <button
          onClick={sendSOS}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          disabled={sending}
          className={`relative group bg-warning hover:bg-red-700 text-white rounded-full shadow-elegant-xl transition-all duration-300 hover:scale-110 disabled:opacity-70 disabled:cursor-not-allowed ${
            sending ? '' : 'hover:shadow-2xl'
          }`}
        >
          <div className="flex items-center space-x-3 px-6 py-4">
            {sending ? (
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <span className="font-bold text-lg tracking-wide">
              {sending ? 'Enviando...' : 'SOS'}
            </span>
          </div>
        </button>

        {/* Badge notification */}
        <div className="absolute -top-2 -left-2 bg-white text-warning w-7 h-7 rounded-full flex items-center justify-center shadow-elegant font-bold text-xs border-2 border-warning">
          !
        </div>
      </div>
    </div>
  );
}
