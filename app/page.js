"use client";
import { useState } from "react";
import { scenarios } from "./data/scenarios";
import ScenarioCard from "./components/ScenarioCard";
import ModeSelector from "./components/ModeSelector";
import AuthSection from "./components/AuthSection";
import ToolsGrid from "./components/ToolsGrid";

export default function HomePage() {
  const [mode, setMode] = useState("Afectado");

  return (
    <div className="bg-background min-h-screen">
      {/* Authentication Section */}
      <AuthSection />

      {/* Main Content */}
      <main className="text-textPrimary">
        {/* Hero Header */}
        <header className="text-center py-10 px-4 bg-gradient-to-b from-primary to-background">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent mb-3">
            Defiéndete MX
          </h1>
          <p className="text-base sm:text-lg text-textSecondary max-w-3xl mx-auto">
            Tu guía interactiva de derechos y acciones ante detenciones en México.
          </p>
        </header>

        {/* Tools Grid Section */}
        <ToolsGrid />

        {/* Scenarios Section */}
        <section className="py-12 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-textPrimary mb-3">
                📚 Escenarios de Detención
              </h2>
              <p className="text-textSecondary">
                Selecciona tu situación para obtener información legal específica
              </p>
            </div>

            <ModeSelector mode={mode} setMode={setMode} />

            {mode === "Familiar/Confianza" && (
              <div className="p-4 mb-6 bg-primary rounded-lg border border-secondary text-center max-w-3xl mx-auto">
                <p className="text-textSecondary font-semibold">
                  Modo Familiar: Encuentra aquí cómo ayudar, a quién contactar y qué documentar.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenarios.map((s) => (
                <ScenarioCard key={s.id} scenario={s} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
