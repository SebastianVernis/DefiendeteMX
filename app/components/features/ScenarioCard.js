'use client';

import { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

/**
 * Scenario Card Component
 * Displays legal scenarios with expandable details
 */
export default function ScenarioCard({ scenario, index }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryColors = {
    emergencia: 'danger',
    abuso: 'warning',
    defensa: 'primary',
  };

  const categoryNames = {
    emergencia: 'Emergencia Médica',
    abuso: 'Abuso de Autoridad',
    defensa: 'Defensa Legal',
  };

  return (
    <Card 
      variant="gradient" 
      hover={true}
      className={`p-6 animate-fadeIn delay-${index * 100}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
            {scenario.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {scenario.title}
            </h3>
            <Badge 
              variant={categoryColors[scenario.category]} 
              size="sm"
            >
              {categoryNames[scenario.category]}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Steps Preview */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
          <span>📋</span> Pasos Inmediatos
        </h4>
        <ul className="space-y-2">
          {scenario.steps.slice(0, isExpanded ? undefined : 2).map((step, idx) => (
            <li 
              key={idx}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <span className="text-purple-500 font-bold mt-0.5">•</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-purple-200 animate-fadeIn">
          <h4 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
            <span>⚖️</span> Información Legal
          </h4>
          <ul className="space-y-2 mb-4">
            {scenario.legal.map((info, idx) => (
              <li 
                key={idx}
                className="flex items-start gap-2 text-sm text-gray-700 bg-purple-50 p-3 rounded-lg"
              >
                <span className="text-purple-500 font-bold mt-0.5">✓</span>
                <span>{info}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expand Button */}
      <Button
        variant="ghost"
        size="sm"
        fullWidth
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4"
      >
        {isExpanded ? '▲ Ver menos' : '▼ Ver más detalles'}
      </Button>
    </Card>
  );
}
