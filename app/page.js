\"use client\";
import { useState } from "react";
import { scenarios } from "./data/scenarios";
import ScenarioCard from "./components/ScenarioCard";
import ModeSelector from "./components/ModeSelector";

export default function HomePage() {
  const [mode, setMode] = useState("Afectado");

  return (
    <main>
      <h1 className="text-3xl font-bold text-neonPink mb-4">Defiéndete MX</h1>
      <p className="mb-4 text-gray-300">
        App interactiva para conocer tus derechos y pasos a seguir en escenarios de abuso policial.
      </p>

      <ModeSelector mode={mode} setMode={setMode} />

      {mode === "Familiar/Confianza" && (
        <div className="p-3 mb-4 bg-gray-800 rounded-lg border border-neonCyan">
          <p className="text-neonCyan font-semibold">
            Modo Familiar: Aquí encontrarás cómo ayudar desde fuera, a quién llamar y cómo documentar todo.
          </p>
        </div>
      )}

      {scenarios.map((s) => (
        <ScenarioCard key={s.id} scenario={s} />
      ))}
    </main>
  );
}