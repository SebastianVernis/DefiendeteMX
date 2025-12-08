'use client';

/**
 * QuickActions Component
 * Predefined action buttons for common scenarios
 * 
 * Features:
 * - Quick access to common legal scenarios
 * - Emergency numbers
 * - Safety planning
 * - Evidence collection guide
 * - Smooth animations
 */
export default function QuickActions({ onActionClick }) {
  const quickActions = [
    {
      key: 'EMERGENCY_NUMBERS',
      icon: '📞',
      label: 'Números de Emergencia',
      color: 'from-red-500 to-red-600'
    },
    {
      key: 'SAFETY_PLAN',
      icon: '🛡️',
      label: 'Plan de Seguridad',
      color: 'from-green-500 to-green-600'
    },
    {
      key: 'EVIDENCE_COLLECTION',
      icon: '📸',
      label: 'Recolectar Evidencia',
      color: 'from-blue-500 to-blue-600'
    },
    {
      key: 'LEGAL_PROCESS',
      icon: '⚖️',
      label: 'Proceso Legal',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <p className="text-xs text-gray-600 mb-3 font-semibold">
        Acciones Rápidas:
      </p>
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map((action, index) => (
          <button
            key={action.key}
            onClick={() => onActionClick(action.key)}
            className={`
              p-3 rounded-xl bg-gradient-to-br ${action.color}
              text-white text-left
              hover:shadow-lg hover:scale-105
              transition-all duration-200
              animate-fadeIn
            `}
            style={{ animationDelay: `${index * 100}ms` }}
            aria-label={action.label}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs font-semibold leading-tight">
                {action.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
