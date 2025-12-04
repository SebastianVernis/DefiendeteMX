"use client";
import { useEffect } from "react";

export default function Sidebar({ isOpen, onClose, navLinks, user, isAuthenticated }) {
  // Close sidebar on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accentLight rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-bold">D</span>
              </div>
              <span className="font-display font-bold text-xl text-textPrimary">
                Defiéndete MX
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Cerrar menú"
            >
              <svg className="w-6 h-6 text-textPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info */}
          {isAuthenticated && user && (
            <div className="p-6 bg-gradient-to-r from-accent/5 to-accentLight/5 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-textPrimary truncate">{user.name}</p>
                  <p className="text-xs text-textSecondary truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-textSecondary hover:text-accent hover:bg-secondary/50 transition-all duration-200 font-medium group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
                    <span className="text-base">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="my-6 border-t border-border"></div>

            {/* Additional Links */}
            <div className="space-y-2">
              <a
                href="#about"
                onClick={onClose}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-textSecondary hover:text-accent hover:bg-secondary/50 transition-all duration-200"
              >
                <span className="text-xl">ℹ️</span>
                <span>Acerca de</span>
              </a>
              <a
                href="#settings"
                onClick={onClose}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-textSecondary hover:text-accent hover:bg-secondary/50 transition-all duration-200"
              >
                <span className="text-xl">⚙️</span>
                <span>Configuración</span>
              </a>
              <a
                href="#help"
                onClick={onClose}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-textSecondary hover:text-accent hover:bg-secondary/50 transition-all duration-200"
              >
                <span className="text-xl">❓</span>
                <span>Ayuda</span>
              </a>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-secondary/30">
            <div className="space-y-3">
              <a
                href="tel:911"
                className="flex items-center justify-center space-x-2 w-full py-3 bg-gradient-to-r from-warning to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-xl font-bold transition-all duration-200 shadow-lg"
              >
                <span className="text-xl">🚨</span>
                <span>Emergencia 911</span>
              </a>
              <p className="text-xs text-textSecondary text-center">
                © 2025 Defiéndete MX
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
