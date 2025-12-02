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
      <header className="relative bg-gradient-to-br from-accent via-accentLight to-blue-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-3 bg-white/15 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/25 shadow-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white font-semibold text-base">Información Legal Verificada</span>
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
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="#scenarios"
                className="inline-flex items-center px-10 py-5 bg-white text-accent font-bold rounded-2xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-transform duration-300 group"
              >
                <svg className="w-6 h-6 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ver Escenarios
              </a>
              <a
                href="/recursos"
                className="inline-flex items-center px-10 py-5 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-transform duration-300 group"
              >
                <svg className="w-6 h-6 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar Guías PDF
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Información Gratuita</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Privacidad Garantizada</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Acceso 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* How to Use Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-white to-secondary/50 rounded-3xl border border-border p-10 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accentLight rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-textPrimary mb-4">
                  ¿Cómo usar esta guía?
                </h3>
                <p className="text-lg text-textSecondary leading-relaxed mb-6">
                  Esta plataforma te ayuda a conocer tus derechos en situaciones de detención policial en México.
                </p>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm mr-4 mt-0.5 shadow-md">
                      1
                    </div>
                    <span className="text-textSecondary text-lg">Selecciona si eres la persona afectada o un familiar/persona de confianza</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm mr-4 mt-0.5 shadow-md">
                      2
                    </div>
                    <span className="text-textSecondary text-lg">Encuentra tu situación específica en los escenarios</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm mr-4 mt-0.5 shadow-md">
                      3
                    </div>
                    <span className="text-textSecondary text-lg">Sigue los pasos recomendados y conoce tus fundamentos legales</span>
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
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-accent to-accentLight p-1 rounded-full mb-6">
              <div className="bg-white rounded-full px-6 py-2">
                <span className="text-sm font-bold text-accent">SITUACIONES LEGALES</span>
              </div>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-textPrimary mb-5">
              Escenarios Legales
            </h2>
            <p className="text-xl text-textSecondary max-w-2xl mx-auto leading-relaxed">
              Situaciones comunes de detención y cómo actuar en cada caso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scenarios.map((s) => (
              <ScenarioCard key={s.id} scenario={s} />
            ))}
          </div>
        </div>

        {/* Emergency Numbers Section */}
        <div className="mt-20 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl border border-red-200 p-10 md:p-14 shadow-xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-warning to-red-600 rounded-2xl mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-textPrimary mb-3">
              Números de Emergencia
            </h3>
            <p className="text-lg text-textSecondary">
              Mantén estos contactos a la mano
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-warning/20 group">
              <div className="text-4xl font-bold text-warning mb-3 group-hover:scale-110 transition-transform duration-300">911</div>
              <div className="text-lg text-textPrimary font-bold mb-2">Emergencias</div>
              <div className="text-sm text-textMuted font-medium">Nacional</div>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-accent/20 group">
              <div className="text-3xl font-bold text-accent mb-3 group-hover:scale-110 transition-transform duration-300">800 715 2000</div>
              <div className="text-lg text-textPrimary font-bold mb-2">CNDH</div>
              <div className="text-sm text-textMuted font-medium">Derechos Humanos</div>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-accent/20 group">
              <div className="text-3xl font-bold text-accent mb-3 group-hover:scale-110 transition-transform duration-300">55 5658 1111</div>
              <div className="text-lg text-textPrimary font-bold mb-2">Locatel</div>
              <div className="text-sm text-textMuted font-medium">Ciudad de México</div>
            </div>
          </div>
        </div>

        {/* Resources CTA */}
        <div className="mt-20 bg-gradient-to-br from-accent to-accentLight rounded-3xl p-12 text-center shadow-2xl border border-accent/20">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-5">
              Descarga los Recursos Completos
            </h3>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Accede a guías en PDF para consultar offline y compartir con tus contactos de confianza
            </p>
            <a
              href="/recursos"
              className="inline-flex items-center px-10 py-5 bg-white text-accent font-bold rounded-2xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-transform duration-300 group"
            >
              <svg className="w-6 h-6 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Ir a Recursos
            </a>
          </div>
        </div>
      </div>

      {/* SOS Button */}
      <SOSButton />
    </main>
  );
}
