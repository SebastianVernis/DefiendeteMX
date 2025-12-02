"use client";
import { useState } from "react";

export default function ScenarioCard({ scenario }) {
  const [showLegal, setShowLegal] = useState(false);

  const categoryColors = {
    emergencia: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: "bg-red-100" },
    abuso: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: "bg-orange-100" },
    defensa: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "bg-blue-100" }
  };

  const colors = categoryColors[scenario.category] || categoryColors.defensa;

  return (
    <div className="group bg-gradient-to-br from-white to-secondary/30 rounded-3xl border border-border hover:border-accent/30 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col transform hover:-translate-y-1">
      {/* Header with icon */}
      <div className="p-7 border-b border-border bg-gradient-to-r from-white to-secondary/20">
        <div className="flex items-start space-x-5">
          <div className={`flex-shrink-0 w-16 h-16 ${colors.icon} rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 shadow-md`}>
            {scenario.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-2xl font-bold text-textPrimary mb-2 group-hover:text-accent transition-colors line-clamp-2">
              {scenario.title}
            </h3>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${colors.bg} ${colors.text} border ${colors.border} shadow-sm`}>
              {scenario.category === 'emergencia' && 'Emergencia'}
              {scenario.category === 'abuso' && 'Abuso de Autoridad'}
              {scenario.category === 'defensa' && 'Defensa Legal'}
            </span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="p-7 flex-grow">
        <div className="mb-3 flex items-center text-base font-bold text-accent uppercase tracking-wide">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Pasos a Seguir
        </div>
        <ul className="space-y-4">
          {scenario.steps.map((step, i) => (
            <li key={i} className="flex items-start group/item">
              <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accentLight text-white text-base font-bold mr-4 mt-0.5 group-hover/item:scale-110 transition-all">
                {i + 1}
              </span>
              <span className="text-textSecondary text-base leading-relaxed flex-1 mt-1">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Legal Toggle Button */}
      <div className="p-7 pt-0">
        <button
          onClick={() => setShowLegal(!showLegal)}
          className={`w-full px-6 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
            showLegal
              ? "bg-gradient-to-r from-accent/10 to-accentLight/10 text-accent border-2 border-accent/30 hover:border-accent/50"
              : "bg-gradient-to-r from-accent to-accentLight hover:from-accentHover hover:to-accentLight text-white shadow-lg hover:shadow-xl"
          }`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <span className="text-lg">{showLegal ? "Ocultar" : "Ver"} Fundamentos Legales</span>
          <svg className={`w-6 h-6 transition-transform duration-300 ${showLegal ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Legal Arguments - Expandable */}
      {showLegal && (
        <div className="px-7 pb-7 animate-slide-up">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-accent/20 shadow-sm">
            <div className="flex items-center text-accent font-bold mb-4 text-base uppercase tracking-wide">
              <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Fundamentos Legales
            </div>
            <ul className="space-y-3">
              {scenario.legal.map((item, i) => (
                <li key={i} className="flex items-start">
                  <svg className="w-6 h-6 text-accent mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-textPrimary text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
