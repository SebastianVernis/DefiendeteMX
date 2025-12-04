"use client";
import { useState } from "react";
import { scenarios } from "./data/scenarios";
import ScenarioCard from "./components/ScenarioCard";
import ModeSelector from "./components/ModeSelector";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import InstallPWA from "./components/layout/InstallPWA";
import SOSButton from "./components/SOSButton";
import ToolsGrid from "./components/ToolsGrid";

export default function HomePage() {
  const [mode, setMode] = useState("Afectado");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header Navigation */}
      <Header 
        user={user} 
        onLogout={handleLogout} 
        isAuthenticated={isAuthenticated}
      />

      {/* Main Content */}
      <main className="flex-grow text-textPrimary">
        {/* Hero Header */}
        <section className="relative overflow-hidden bg-gradient-to-br from-accent via-accentLight to-accent py-20 px-4">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-2xl">
              <span className="text-5xl">⚖️</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Defiéndete MX
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Tu guía interactiva de derechos y acciones ante detenciones en México
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#escenarios"
                className="px-8 py-4 bg-white text-accent rounded-xl font-bold text-lg hover:bg-white/90 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Ver Escenarios
              </a>
              <a
                href="#herramientas"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-200"
              >
                Explorar Herramientas
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-white/80">Disponible</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-white/80">Gratuito</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">🇲🇽</div>
                <div className="text-sm text-white/80">México</div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid Section */}
        <div id="herramientas">
          <ToolsGrid />
        </div>

        {/* Scenarios Section */}
        <section id="escenarios" className="py-16 px-4 md:px-8 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-textPrimary mb-4">
                📚 Escenarios de Detención
              </h2>
              <p className="text-lg text-textSecondary max-w-2xl mx-auto">
                Selecciona tu situación para obtener información legal específica y verificada
              </p>
            </div>

            <ModeSelector mode={mode} setMode={setMode} />

            {mode === "Familiar/Confianza" && (
              <div className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-accent/20 text-center max-w-3xl mx-auto shadow-md">
                <p className="text-textPrimary font-semibold text-lg">
                  💙 Modo Familiar: Encuentra aquí cómo ayudar, a quién contactar y qué documentar.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {scenarios.map((s) => (
                <ScenarioCard key={s.id} scenario={s} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-accent to-accentLight">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              ¿Necesitas Ayuda Legal Inmediata?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Contacta a las autoridades competentes o descarga nuestras guías de emergencia
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:911"
                className="px-8 py-4 bg-warning hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center space-x-2"
              >
                <span className="text-2xl">🚨</span>
                <span>Llamar al 911</span>
              </a>
              <a
                href="tel:8007152000"
                className="px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/30 rounded-xl font-bold text-lg transition-all duration-200 flex items-center space-x-2"
              >
                <span className="text-2xl">📞</span>
                <span>CNDH: 800 715 2000</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* SOS Button */}
      <div id="sos">
        <SOSButton />
      </div>

      {/* PWA Install Prompt */}
      <InstallPWA />
    </div>
  );
}
