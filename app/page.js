"use client";
import { useState } from "react";
import { scenarios } from "./data/scenarios";
import ScenarioCard from "./components/ScenarioCard";
import ModeSelector from "./components/ModeSelector";
import SOSButton from "./components/SOSButton";

export default function HomePage() {
  const [mode, setMode] = useState("Afectado");

  return (
    <main className="bg-background min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-border sticky top-0 z-40 backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accentLight rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">D</span>
              </div>
              <span className="font-display font-bold text-xl text-textPrimary">
                Defiéndete MX
              </span>
            </div>
            <a 
              href="/recursos" 
              className="text-sm font-medium text-textSecondary hover:text-accent transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Recursos</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-accent via-accentLight to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 border border-white/20">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-medium text-sm">Información Legal Verificada</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Defiéndete <span className="text-blue-200">MX</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              Conoce tus derechos legales ante detenciones policiales.
              <br className="hidden sm:block" />
              Información clara, verificada y accesible.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="#scenarios" 
                className="inline-flex items-center px-8 py-4 bg-white text-accent font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-elegant-lg hover:shadow-elegant-xl hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ver Escenarios
              </a>
              <a 
                href="/recursos" 
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar Guías PDF
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Información Gratuita</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Privacidad Garantizada</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Acceso 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* How to Use Section */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl border border-border p-8 shadow-elegant">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-textPrimary mb-3">
                  ¿Cómo usar esta guía?
                </h3>
                <p className="text-textSecondary leading-relaxed mb-4">
                  Esta plataforma te ayuda a conocer tus derechos en situaciones de detención policial en México.
                </p>
                <ol className="space-y-2 text-textSecondary">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-accent/10 text-accent rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    <span>Selecciona si eres la persona afectada o un familiar/persona de confianza</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-accent/10 text-accent rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    <span>Encuentra tu situación específica en los escenarios</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-accent/10 text-accent rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    <span>Sigue los pasos recomendados y conoce tus fundamentos legales</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <ModeSelector mode={mode} setMode={setMode} />

        {/* Familiar Mode Banner */}
        {mode === "Familiar/Confianza" && (
          <div className="mb-12 bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-success rounded-r-2xl p-6 shadow-elegant animate-fade-in">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <svg className="h-7 w-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-textPrimary mb-2">
                  Modo Familiar/Persona de Confianza
                </h3>
                <p className="text-textSecondary leading-relaxed">
                  Aquí encontrarás información sobre cómo ayudar, a quién contactar y qué documentar para apoyar a tu familiar o persona de confianza en una situación de detención.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scenarios Section */}
        <div id="scenarios" className="scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-textPrimary mb-4">
              Escenarios Legales
            </h2>
            <p className="text-lg text-textSecondary max-w-2xl mx-auto">
              Situaciones comunes de detención y cómo actuar en cada caso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((s) => (
              <ScenarioCard key={s.id} scenario={s} />
            ))}
          </div>
        </div>

        {/* Emergency Numbers Section */}
        <div className="mt-20 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-warning/10 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-textPrimary mb-2">
              Números de Emergencia
            </h3>
            <p className="text-textSecondary">
              Mantén estos contactos a la mano
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-elegant hover:shadow-elegant-lg transition-shadow">
              <div className="text-3xl font-bold text-warning mb-2">911</div>
              <div className="text-sm text-textPrimary font-semibold mb-1">Emergencias</div>
              <div className="text-xs text-textMuted">Nacional</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-elegant hover:shadow-elegant-lg transition-shadow">
              <div className="text-2xl font-bold text-accent mb-2">800 715 2000</div>
              <div className="text-sm text-textPrimary font-semibold mb-1">CNDH</div>
              <div className="text-xs text-textMuted">Derechos Humanos</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-elegant hover:shadow-elegant-lg transition-shadow">
              <div className="text-2xl font-bold text-accent mb-2">55 5658 1111</div>
              <div className="text-sm text-textPrimary font-semibold mb-1">Locatel</div>
              <div className="text-xs text-textMuted">Ciudad de México</div>
            </div>
          </div>
        </div>

        {/* Resources CTA */}
        <div className="mt-16 bg-white rounded-2xl border border-border p-8 md:p-12 shadow-elegant text-center">
          <h3 className="font-display text-3xl font-bold text-textPrimary mb-4">
            Descarga los Recursos Completos
          </h3>
          <p className="text-lg text-textSecondary mb-8 max-w-2xl mx-auto">
            Accede a guías en PDF para consultar offline y compartir con tus contactos de confianza
          </p>
          <a 
            href="/recursos" 
            className="inline-flex items-center px-8 py-4 bg-accent hover:bg-accentHover text-white font-semibold rounded-xl transition-all duration-200 shadow-elegant-lg hover:shadow-elegant-xl hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Ir a Recursos
          </a>
        </div>
      </div>

      {/* SOS Button */}
      <SOSButton />
    </main>
  );
}
