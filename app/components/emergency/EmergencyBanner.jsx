'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import WhatsAppSOS from './WhatsAppSOS';

/**
 * Emergency Banner Component
 * Displays critical emergency information and quick actions
 * Theme: "When authorities are not allies"
 */
export default function EmergencyBanner({ variant = 'warning' }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const variants = {
    warning: {
      bg: 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500',
      text: 'text-white',
      icon: '⚠️',
      title: '¿En una situación de riesgo?',
    },
    danger: {
      bg: 'bg-gradient-to-r from-red-600 via-red-700 to-red-800',
      text: 'text-white',
      icon: '🚨',
      title: 'EMERGENCIA - Actúa Ahora',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600',
      text: 'text-white',
      icon: '🛡️',
      title: 'Protege tus Derechos',
    },
  };

  const config = variants[variant] || variants.warning;

  return (
    <div className={`${config.bg} ${config.text} shadow-2xl`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Compact View */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-3xl animate-pulse">{config.icon}</span>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{config.title}</h3>
              <p className="text-sm opacity-90">
                Conoce tus derechos. Documenta todo. No estás solo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              {isExpanded ? 'Ocultar' : 'Ver Acciones'}
            </Button>
          </div>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-white/20 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Quick Action 1: Emergency Call */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-200">
                <div className="text-2xl mb-2">📞</div>
                <h4 className="font-bold mb-1">Llamar 911</h4>
                <p className="text-sm opacity-90 mb-3">
                  Emergencia inmediata
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => window.location.href = 'tel:911'}
                  className="bg-white text-red-600 hover:bg-gray-100"
                >
                  Llamar Ahora
                </Button>
              </div>

              {/* Quick Action 2: CNDH */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-200">
                <div className="text-2xl mb-2">🛡️</div>
                <h4 className="font-bold mb-1">CNDH</h4>
                <p className="text-sm opacity-90 mb-3">
                  Derechos Humanos
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => window.location.href = 'tel:5556818125'}
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  (55) 5681-8125
                </Button>
              </div>

              {/* Quick Action 3: Voice Recorder */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-200">
                <div className="text-2xl mb-2">🎙️</div>
                <h4 className="font-bold mb-1">Grabar Evidencia</h4>
                <p className="text-sm opacity-90 mb-3">
                  Documenta todo
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => window.location.href = '/grabador'}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  Abrir Grabador
                </Button>
              </div>

              {/* Quick Action 4: WhatsApp SOS */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-200">
                <div className="text-2xl mb-2">💬</div>
                <h4 className="font-bold mb-1">Alertar Contactos</h4>
                <p className="text-sm opacity-90 mb-3">
                  Envía tu ubicación
                </p>
                <WhatsAppSOS compact />
              </div>
            </div>

            {/* Critical Rights Reminder */}
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <span>⚖️</span>
                <span>Recuerda tus Derechos Fundamentales:</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>1. Derecho a guardar silencio</strong>
                  <p className="opacity-90 mt-1">
                    "Deseo ejercer mi derecho a guardar silencio hasta hablar con mi abogado"
                  </p>
                </div>
                <div>
                  <strong>2. Derecho a un abogado</strong>
                  <p className="opacity-90 mt-1">
                    Exige la presencia de un defensor público o privado
                  </p>
                </div>
                <div>
                  <strong>3. Derecho a no ser torturado</strong>
                  <p className="opacity-90 mt-1">
                    Cualquier maltrato es ilegal. Documenta y denuncia
                  </p>
                </div>
              </div>
            </div>

            {/* Authority Warning */}
            <div className="mt-4 bg-red-900/30 backdrop-blur-sm rounded-lg p-4 border border-red-400/30">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h4 className="font-bold mb-1">Importante: Cuando la autoridad no es aliada</h4>
                  <p className="text-sm opacity-90">
                    <strong>No confíes ciegamente.</strong> Documenta todo, graba si es posible (es legal), 
                    pide nombres y placas, busca testigos, y contacta a organizaciones de derechos humanos. 
                    Tu seguridad y tus derechos son prioridad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
