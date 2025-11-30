"use client";
import { useState } from "react";

export default function ScenarioCard({ scenario }) {
  const [showLegal, setShowLegal] = useState(false);

  return (
    <div className="card p-6 h-full flex flex-col group">
      {/* Icon and Title */}
      <div className="mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
          <span className="text-2xl">⚖️</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-textPrimary mb-2 group-hover:text-accent transition-colors">
          {scenario.title}
        </h2>
      </div>

      {/* Steps */}
      <div className="mb-6 flex-grow">
        <h3 className="font-semibold text-accent text-sm uppercase tracking-wide mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Pasos a seguir
        </h3>
        <ul className="space-y-3">
          {scenario.steps.map((step, i) => (
            <li key={i} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-semibold mr-3 mt-0.5">
                {i + 1}
              </span>
              <span className="text-textSecondary leading-relaxed">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Legal Arguments Button */}
      <button
        className={`w-full px-5 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
          showLegal
            ? "bg-accent/10 text-accent border-2 border-accent"
            : "bg-accent hover:bg-accentHover text-white shadow-md hover:shadow-lg"
        }`}
        onClick={() => setShowLegal(!showLegal)}
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showLegal ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
        </svg>
        {showLegal ? "Ocultar Argumentos Legales" : "Ver Argumentos Legales"}
      </button>

      {/* Legal Arguments */}
      {showLegal && (
        <div className="mt-4 p-5 bg-accent/5 rounded-lg border-l-4 border-accent animate-fadeIn">
          <h3 className="font-semibold text-accent mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            Fundamentos Legales
          </h3>
          <ul className="space-y-2">
            {scenario.legal.map((item, i) => (
              <li key={i} className="flex items-start">
                <svg className="w-4 h-4 text-accent mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-textSecondary text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
