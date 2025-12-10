'use client';

import { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';

/**
 * ChatWidget Component
 * Floating chat button that opens the chat window
 * 
 * Features:
 * - Floating button with pulse animation
 * - Notification badge for unread messages
 * - Smooth open/close transitions
 * - Accessible keyboard navigation
 * - Mobile-responsive positioning
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Check for unread messages on mount
  useEffect(() => {
    // This could be enhanced to check actual unread status from API
    const checkUnread = () => {
      // Placeholder for unread check logic
      setHasUnread(false);
    };

    checkUnread();
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <ChatWindow 
          onClose={() => setIsOpen(false)}
          onNewMessage={() => {
            if (!isOpen) {
              setHasUnread(true);
            }
          }}
        />
      )}

      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className={`
          fixed bottom-6 right-6 z-50
          w-16 h-16 rounded-full
          bg-gradient-to-br from-purple-600 to-indigo-600
          text-white shadow-2xl
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          hover:scale-110 hover:shadow-purple-500/50
          focus:outline-none focus:ring-4 focus:ring-purple-500/50
          ${isOpen ? 'rotate-90' : 'animate-pulse-slow'}
        `}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat de asistencia legal'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          // Close icon
          <svg 
            className="w-8 h-8" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        ) : (
          // Chat icon
          <svg 
            className="w-8 h-8" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
            />
          </svg>
        )}

        {/* Notification Badge */}
        {hasUnread && !isOpen && (
          <span 
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold animate-bounce"
            aria-label="Mensajes sin leer"
          >
            !
          </span>
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="fixed bottom-24 right-6 z-40 pointer-events-none">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap animate-fadeIn">
            💬 ¿Necesitas ayuda legal?
            <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

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
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
