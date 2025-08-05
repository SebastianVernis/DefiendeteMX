"use client";
import { useState } from "react";
import { scenarios } from "./data/scenarios";
import ScenarioCard from "./components/ScenarioCard";
import ModeSelector from "./components/ModeSelector";

export default function HomePage() {
  const [mode, setMode] = useState("Afectado");

  return (
    <main className="bg-background min-h-screen p-4 md:p-8 text-textPrimary">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-accent mb-2">Defiéndete MX</h1>
        <p className="text-lg text-textSecondary">
          Tu guía interactiva de derechos y acciones ante detenciones en México.
        </p>
      </header>

      <ModeSelector mode={mode} setMode={setMode} />

      {mode === "Familiar/Confianza" && (
        <div className="p-4 mb-6 bg-primary rounded-lg border border-secondary text-center">
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
    </main>
  );
}
