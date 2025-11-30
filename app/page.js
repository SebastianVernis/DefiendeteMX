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
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-accent via-accentLight to-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm">
                🛡️ Información Legal Verificada
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Defiéndete MX
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Tu guía interactiva de derechos y acciones legales ante detenciones en México
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#scenarios" className="btn-primary bg-white text-accent hover:bg-gray-100">
                📚 Ver Escenarios
              </a>
              <a href="/recursos" className="btn-secondary border-white text-white hover:bg-white/10">
                📄 Recursos Descargables
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Banner */}
        <div className="mb-12 bg-blue-50 border-l-4 border-accent rounded-r-xl p-6 shadow-soft">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-accent mb-2">
                ¿Cómo usar esta guía?
              </h3>
              <p className="text-textSecondary leading-relaxed">
                Selecciona si eres la persona afectada o un familiar/persona de confianza. 
                Luego, encuentra tu situación específica en los escenarios a continuación para 
                conocer tus derechos y los pasos recomendados a seguir.
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <ModeSelector mode={mode} setMode={setMode} />

        {mode === "Familiar/Confianza" && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-success/20 rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-success mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-lg text-textPrimary mb-1">
                  Modo Familiar/Confianza
                </h3>
                <p className="text-textSecondary">
                  Encuentra aquí cómo ayudar, a quién contactar y qué documentar para apoyar a tu familiar o persona de confianza.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scenarios Grid */}
        <div id="scenarios" className="scroll-mt-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-10 text-textPrimary">
            Escenarios y Situaciones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {scenarios.map((s) => (
              <ScenarioCard key={s.id} scenario={s} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-br from-accent to-accentLight text-white rounded-2xl p-8 md:p-12 shadow-card text-center">
          <h3 className="font-display text-3xl font-bold mb-4">
            ¿Necesitas más información?
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Descarga nuestras guías completas en PDF para tener acceso offline a toda la información legal.
          </p>
          <a href="/recursos" className="inline-flex items-center btn-primary bg-white text-accent hover:bg-gray-100">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar Recursos
          </a>
        </div>
      </div>

      {/* SOS Button */}
      <SOSButton />
    </main>
  );
}
