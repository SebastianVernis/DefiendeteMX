"use client";
import { useState } from "react";

export default function ScenarioCard({ scenario }) {
  const [showLegal, setShowLegal] = useState(false);

  return (
    <div className="bg-primary p-6 rounded-lg shadow-md mb-4 border border-secondary transition-shadow duration-300 hover:shadow-lg">
      <h2 className="text-accent text-2xl font-bold mb-4">{scenario.title}</h2>

      <div className="mb-4">
        <h3 className="font-semibold text-textPrimary mb-2">Pasos a seguir:</h3>
        <ul className="space-y-2 list-disc list-inside text-textSecondary">
          {scenario.steps.map((step, i) => <li key={i}>{step}</li>)}
        </ul>
      </div>

      <button
        className="w-full px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors duration-300"
        onClick={() => setShowLegal(!showLegal)}
      >
        {showLegal ? "Ocultar Argumentos Legales" : "Mostrar Argumentos Legales"}
      </button>

      {showLegal && (
        <div className="mt-4 p-4 bg-background rounded-md">
          <h3 className="font-semibold text-accent mb-2">Defensa Legal:</h3>
          <ul className="space-y-2 list-disc list-inside text-textSecondary">
            {scenario.legal.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
