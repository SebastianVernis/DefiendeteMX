"use client";
import { useState } from "react";

export default function ScenarioCard({ scenario }) {
  const [showLegal, setShowLegal] = useState(false);

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-xl mb-4 border border-neonPink">
      <h2 className="text-neonPink text-xl font-bold">{scenario.title}</h2>
      <ul className="mt-2 list-disc list-inside text-neonCyan">
        {scenario.steps.map((step, i) => <li key={i}>{step}</li>)}
      </ul>
      <button 
        className="mt-3 px-3 py-2 bg-neonPurple text-white rounded-lg"
        onClick={() => setShowLegal(!showLegal)}
      >
        {showLegal ? "Ocultar Defensa Legal" : "Mostrar Defensa Legal"}
      </button>
      {showLegal && (
        <ul className="mt-2 list-disc list-inside text-gray-300">
          {scenario.legal.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}
    </div>
  );
}
