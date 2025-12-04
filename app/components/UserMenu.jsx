"use client";
import { useState, useRef, useEffect } from "react";

export default function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Mi Perfil", icon: "👤", action: () => console.log("Perfil") },
    { label: "Mis Expedientes", icon: "📁", action: () => console.log("Expedientes") },
    { label: "Configuración", icon: "⚙️", action: () => console.log("Config") },
    { label: "Cerrar Sesión", icon: "🚪", action: onLogout, danger: true },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Menú de usuario"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:inline text-textPrimary font-medium">{user.name}</span>
        <svg
          className={`w-4 h-4 text-textSecondary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-primary border border-secondary rounded-lg shadow-xl z-50 overflow-hidden animate-fadeIn">
          <div className="px-4 py-3 border-b border-secondary">
            <p className="text-sm text-textSecondary">Conectado como</p>
            <p className="text-sm font-semibold text-textPrimary truncate">{user.email}</p>
          </div>
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors duration-150 ${
                  item.danger
                    ? "text-red-400 hover:bg-red-900/20"
                    : "text-textPrimary hover:bg-secondary"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
