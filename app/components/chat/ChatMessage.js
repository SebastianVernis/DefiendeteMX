'use client';

/**
 * ChatMessage Component
 * Individual message bubble with styling based on role
 * 
 * Features:
 * - Different styles for user/assistant messages
 * - Timestamp display
 * - Markdown-like formatting support
 * - Accessibility labels
 * - Smooth animations
 */
export default function ChatMessage({ message, isLatest }) {
  const { role, content, timestamp, sentiment } = message;
  const isUser = role === 'user';

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format content with basic markdown support
  const formatContent = (text) => {
    if (!text) return '';

    // Split by lines
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Bold text **text**
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return `<li class="ml-4">${line.trim().substring(1).trim()}</li>`;
      }
      
      // Numbered lists
      if (/^\d+\./.test(line.trim())) {
        return `<li class="ml-4">${line.trim().replace(/^\d+\.\s*/, '')}</li>`;
      }
      
      // Headers (lines ending with :)
      if (line.trim().endsWith(':') && line.trim().length < 50) {
        return `<p class="font-bold mt-2 mb-1">${line}</p>`;
      }
      
      return line ? `<p class="mb-2">${line}</p>` : '<br/>';
    }).join('');
  };

  // Get sentiment emoji
  const getSentimentEmoji = () => {
    switch (sentiment) {
      case 'POSITIVE': return '😊';
      case 'NEGATIVE': return '😔';
      case 'DISTRESSED': return '😰';
      case 'CRISIS': return '🚨';
      default: return '';
    }
  };

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
      role="article"
      aria-label={`Mensaje de ${isUser ? 'usuario' : 'asistente'}`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Message Bubble */}
        <div
          className={`
            rounded-2xl px-4 py-3 shadow-sm
            ${isUser 
              ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-none' 
              : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
            }
            ${isLatest ? 'animate-slideIn' : ''}
          `}
        >
          {/* Assistant Avatar */}
          {!isUser && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🤖</span>
              <span className="text-xs font-semibold text-gray-600">Asistente Legal</span>
              {sentiment && sentiment !== 'NEUTRAL' && (
                <span className="text-sm" title={sentiment}>
                  {getSentimentEmoji()}
                </span>
              )}
            </div>
          )}

          {/* Message Content */}
          <div 
            className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-gray-800'}`}
            dangerouslySetInnerHTML={{ __html: formatContent(content) }}
          />
        </div>

        {/* Timestamp */}
        <div 
          className={`text-xs text-gray-500 mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}
        >
          {formatTime(timestamp)}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
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

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
