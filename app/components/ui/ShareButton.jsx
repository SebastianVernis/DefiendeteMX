'use client';

import { useState } from 'react';
import {
  shareOnFacebook,
  shareOnTwitter,
  shareOnWhatsApp,
  shareOnTelegram,
  shareViaEmail,
  copyToClipboard,
  smartShare
} from '../../lib/utils/socialSharing';

/**
 * Share Button Component
 * Provides social media sharing options
 */
export default function ShareButton({ shareContent, className = '', size = 'md' }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const { title, text, url, hashtags = [] } = shareContent;

  const handleCopy = async (e) => {
    e.stopPropagation();
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    }
  };

  const handleShare = async (platform, e) => {
    e.stopPropagation();

    switch (platform) {
      case 'facebook':
        shareOnFacebook(url, text);
        break;
      case 'twitter':
        shareOnTwitter(text, url, hashtags);
        break;
      case 'whatsapp':
        shareOnWhatsApp(text, url);
        break;
      case 'telegram':
        shareOnTelegram(text, url);
        break;
      case 'email':
        shareViaEmail(title, `${text}\n\n${url}`);
        break;
      case 'native':
        await smartShare({ title, text, url });
        break;
      default:
        break;
    }

    setShowMenu(false);
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl'
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className={`
          ${sizeClasses[size]}
          rounded-full
          bg-blue-100 text-blue-600
          hover:bg-blue-200
          flex items-center justify-center
          transition-all duration-200
        `}
        title="Compartir"
        aria-label="Compartir"
      >
        🔗
      </button>

      {/* Share Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-12 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 min-w-[200px] animate-fadeIn">
            <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase">
              Compartir en
            </div>

            {/* WhatsApp */}
            <button
              onClick={(e) => handleShare('whatsapp', e)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors text-left"
            >
              <span className="text-2xl">💬</span>
              <span className="text-sm font-medium text-gray-700">WhatsApp</span>
            </button>

            {/* Facebook */}
            <button
              onClick={(e) => handleShare('facebook', e)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors text-left"
            >
              <span className="text-2xl">📘</span>
              <span className="text-sm font-medium text-gray-700">Facebook</span>
            </button>

            {/* Twitter/X */}
            <button
              onClick={(e) => handleShare('twitter', e)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sky-50 transition-colors text-left"
            >
              <span className="text-2xl">🐦</span>
              <span className="text-sm font-medium text-gray-700">Twitter / X</span>
            </button>

            {/* Telegram */}
            <button
              onClick={(e) => handleShare('telegram', e)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cyan-50 transition-colors text-left"
            >
              <span className="text-2xl">✈️</span>
              <span className="text-sm font-medium text-gray-700">Telegram</span>
            </button>

            {/* Email */}
            <button
              onClick={(e) => handleShare('email', e)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <span className="text-2xl">📧</span>
              <span className="text-sm font-medium text-gray-700">Email</span>
            </button>

            <div className="border-t border-gray-200 my-2" />

            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors text-left"
            >
              <span className="text-2xl">{copied ? '✓' : '📋'}</span>
              <span className="text-sm font-medium text-gray-700">
                {copied ? 'Copiado!' : 'Copiar enlace'}
              </span>
            </button>

            {/* Native Share (if available) */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={(e) => handleShare('native', e)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors text-left"
              >
                <span className="text-2xl">📤</span>
                <span className="text-sm font-medium text-gray-700">Más opciones</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
