'use client';

import { useState, useRef } from 'react';

/**
 * ChatInput Component
 * Message input field with send button
 * 
 * Features:
 * - Auto-expanding textarea
 * - Enter to send (Shift+Enter for new line)
 * - Character counter
 * - Voice input button (placeholder)
 * - Disabled state handling
 * - Accessibility support
 */
export default function ChatInput({ onSendMessage, disabled = false }) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const maxLength = 5000;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    
    if (value.length <= maxLength) {
      setMessage(value);
      
      // Auto-expand textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      }
    }
  };

  const remainingChars = maxLength - message.length;
  const showCounter = message.length > maxLength * 0.8;

  return (
    <form 
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white p-4"
    >
      <div 
        className={`
          flex items-end gap-2 p-2 rounded-xl border-2 transition-colors
          ${isFocused ? 'border-purple-500 bg-purple-50/50' : 'border-gray-200 bg-gray-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={disabled ? 'Conectando...' : 'Escribe tu mensaje...'}
          className="
            flex-1 resize-none bg-transparent border-none outline-none
            text-gray-800 placeholder-gray-400
            min-h-[40px] max-h-[120px]
            disabled:cursor-not-allowed
          "
          rows={1}
          aria-label="Mensaje"
          aria-describedby={showCounter ? 'char-counter' : undefined}
        />

        {/* Character Counter */}
        {showCounter && (
          <span 
            id="char-counter"
            className={`
              text-xs self-end mb-2 px-2
              ${remainingChars < 100 ? 'text-red-500 font-bold' : 'text-gray-500'}
            `}
            aria-live="polite"
          >
            {remainingChars}
          </span>
        )}

        {/* Voice Input Button (Placeholder) */}
        <button
          type="button"
          disabled={disabled}
          className="
            p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-100
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            self-end
          "
          aria-label="Entrada de voz"
          title="Entrada de voz (próximamente)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="
            p-2 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600
            text-white hover:shadow-lg hover:scale-105
            transition-all disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:scale-100 disabled:hover:shadow-none
            self-end
          "
          aria-label="Enviar mensaje"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 mt-2 px-2">
        Presiona <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Enter</kbd> para enviar, 
        <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs ml-1">Shift+Enter</kbd> para nueva línea
      </p>
    </form>
  );
}
