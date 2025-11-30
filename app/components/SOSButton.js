"use client";
import { useState } from "react";

export default function SOSButton() {
  const [sending, setSending] = useState(false);

  const sendSOS = async () => {
    setSending(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
          const msg = `🚨 ALERTA DE EMERGENCIA\n\nEstoy en una situación de riesgo y necesito ayuda inmediata.\n\nMi ubicación: ${location}\n\nEnviado desde Defiéndete MX`;
          
          navigator.clipboard.writeText(msg);
          alert("✅ Mensaje SOS copiado al portapapeles.\n\n¡Pégalo en WhatsApp, SMS o cualquier aplicación de mensajería para enviarlo a tus contactos de confianza!");
          setSending(false);
        },
        () => {
          const msg = "🚨 ALERTA DE EMERGENCIA\n\nEstoy en una situación de riesgo y necesito ayuda inmediata.\n\n(Ubicación GPS no disponible)\n\nEnviado desde Defiéndete MX";
          navigator.clipboard.writeText(msg);
          alert("⚠️ GPS no disponible.\n\nSe copió el mensaje básico al portapapeles. ¡Pégalo en WhatsApp o SMS!");
          setSending(false);
        }
      );
    } else {
      const msg = "🚨 ALERTA DE EMERGENCIA\n\nEstoy en una situación de riesgo y necesito ayuda inmediata.\n\nEnviado desde Defiéndete MX";
      navigator.clipboard.writeText(msg);
      alert("⚠️ GPS no disponible en este dispositivo.\n\nSe copió el mensaje básico al portapapeles.");
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={sendSOS}
        disabled={sending}
        className={`group relative px-6 py-4 bg-warning hover:bg-red-700 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          sending ? "animate-pulse" : "animate-bounce"
        }`}
        style={{ animationDuration: "2s" }}
      >
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-bold text-lg">SOS</span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-4 whitespace-nowrap shadow-xl">
            Enviar alerta de emergencia
            <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
          </div>
        </div>
      </button>
    </div>
  );
}
