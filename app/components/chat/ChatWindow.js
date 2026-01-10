'use client';

import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';

/**
 * ChatWindow Component
 * Main chat interface with message history and input
 * 
 * Features:
 * - Full message history display
 * - Real-time typing indicators
 * - Quick action buttons
 * - Crisis detection alerts
 * - Auto-scroll to latest message
 * - Session management
 * - Export conversation
 */
export default function ChatWindow({ onClose, onNewMessage }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [context, setContext] = useState({});
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Initialize chat session
  useEffect(() => {
    initializeSession();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = async () => {
    try {
      setIsLoading(true);

      // Get userId from localStorage or context (placeholder)
      const userId = localStorage.getItem('userId') || 'demo_user';

      const response = await fetch('/api/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          language: 'es',
          deviceInfo: {
            type: window.innerWidth < 768 ? 'mobile' : 'desktop',
            userAgent: navigator.userAgent
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setSessionId(data.data.sessionId);
        setMessages([data.data.welcomeMessage]);
      } else {
        console.error('Failed to create session:', data.error);
        // Add error message
        setMessages([{
          role: 'assistant',
          content: 'Lo siento, hubo un problema al iniciar la sesión. Por favor, intenta de nuevo.',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      setMessages([{
        role: 'assistant',
        content: 'Error de conexión. Por favor, verifica tu conexión a internet.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message) => {
    if (!sessionId || !message.trim()) return;

    // Add user message immediately
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setShowQuickActions(false);

    try {
      const userId = localStorage.getItem('userId') || 'demo_user';

      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          message,
          context
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add assistant response
        setMessages(prev => [...prev, data.data.message]);

        // Update context
        if (data.data.context) {
          setContext(data.data.context);
        }

        // Handle crisis detection
        if (data.data.crisisDetected) {
          setCrisisDetected(true);
          // Trigger emergency notification
          if (onNewMessage) {
            onNewMessage();
          }
        }
      } else {
        // Add error message
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error de conexión. Por favor, verifica tu conexión a internet.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (actionKey) => {
    try {
      const response = await fetch('/api/chat/quick-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionKey })
      });

      const data = await response.json();

      if (data.success) {
        // Add quick action response as assistant message
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.data.content,
          timestamp: new Date()
        }]);
        setShowQuickActions(false);
      }
    } catch (error) {
      console.error('Error getting quick action:', error);
    }
  };

  const handleExportChat = () => {
    const chatText = messages.map(msg => {
      const role = msg.role === 'user' ? 'Tú' : 'Asistente';
      const time = new Date(msg.timestamp).toLocaleTimeString('es-MX');
      return `[${time}] ${role}: ${msg.content}`;
    }).join('\n\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-legal-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed bottom-24 right-6 z-40 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp"
      role="dialog"
      aria-label="Chat de asistencia legal"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">Asistente Legal</h3>
            <p className="text-xs text-purple-100">
              {isLoading ? 'Escribiendo...' : 'En línea'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Export button */}
          <button
            onClick={handleExportChat}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Exportar conversación"
            title="Exportar conversación"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Cerrar chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Crisis Alert */}
      {crisisDetected && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 flex items-start gap-2">
          <span className="text-red-500 text-xl">🚨</span>
          <div className="flex-1 text-sm">
            <p className="font-bold text-red-800">Situación de Crisis Detectada</p>
            <p className="text-red-700">Si estás en peligro inmediato, llama al 911</p>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            message={message}
            isLatest={index === messages.length - 1}
          />
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span className="text-sm">Escribiendo...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {showQuickActions && messages.length <= 2 && (
        <QuickActions onActionClick={handleQuickAction} />
      )}

      {/* Input */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading || !sessionId}
      />

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
