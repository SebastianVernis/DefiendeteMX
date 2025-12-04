"use client";
import { useState } from "react";
import UserMenu from "../UserMenu";
import Sidebar from "./Sidebar";

export default function Header({ user, onLogout, isAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { label: "Inicio", href: "/", icon: "🏠" },
    { label: "Escenarios", href: "#escenarios", icon: "📚" },
    { label: "Herramientas", href: "#herramientas", icon: "🛠️" },
    { label: "Recursos", href: "/recursos", icon: "📄" },
    { label: "Emergencia", href: "#sos", icon: "🚨" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y Brand */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Abrir menú"
              >
                <svg className="w-6 h-6 text-textPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <a href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-accentLight rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <span className="text-white text-xl font-bold">D</span>
                </div>
                <span className="font-display font-bold text-xl text-textPrimary hidden sm:inline group-hover:text-accent transition-colors">
                  Defiéndete MX
                </span>
              </a>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-textSecondary hover:text-accent hover:bg-secondary/50 transition-all duration-200 font-medium"
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </nav>

            {/* User Menu / Auth */}
            <div className="flex items-center space-x-3">
              {isAuthenticated && user ? (
                <UserMenu user={user} onLogout={onLogout} />
              ) : (
                <a
                  href="#auth"
                  className="px-4 py-2 bg-accent hover:bg-accentHover text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Iniciar Sesión
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Mobile */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        navLinks={navLinks}
        user={user}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}
