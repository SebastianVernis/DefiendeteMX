'use client';

import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

/**
 * Article Card Component
 * Displays a constitution article with expandable details
 */
export default function ArticleCard({ article, index = 0 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryColors = {
    derechos: 'from-blue-500 to-cyan-500',
    libertades: 'from-green-500 to-emerald-500',
    garantias: 'from-purple-500 to-indigo-500',
    procedimientos: 'from-orange-500 to-red-500'
  };

  const categoryNames = {
    derechos: 'Derechos',
    libertades: 'Libertades',
    garantias: 'Garantías',
    procedimientos: 'Procedimientos'
  };

  return (
    <Card
      variant="gradient"
      hover={true}
      className={`p-6 animate-fadeIn delay-${Math.min(index * 100, 500)}`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-16 h-16 bg-gradient-to-br ${categoryColors[article.category]} rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0`}>
          {article.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="primary" size="sm">
              Art. {article.number}
            </Badge>
            <Badge variant="info" size="sm">
              {categoryNames[article.category]}
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {article.title}
          </h3>
        </div>
      </div>

      {/* Summary */}
      <p className="text-gray-700 font-medium mb-3">
        {article.summary}
      </p>

      {/* Conversational Explanation */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mb-4 border border-purple-100">
        <div className="flex items-start gap-2">
          <span className="text-xl">💬</span>
          <p className="text-sm text-gray-700 leading-relaxed">
            {article.conversational}
          </p>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="space-y-4 animate-fadeIn">
          {/* Full Text */}
          <div className="bg-white rounded-xl p-4 border-2 border-gray-100">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>📜</span>
              Texto Constitucional:
            </h4>
            <p className="text-sm text-gray-600 italic leading-relaxed">
              "{article.fullText}"
            </p>
          </div>

          {/* Examples */}
          {article.examples && article.examples.length > 0 && (
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>✅</span>
                Ejemplos Prácticos:
              </h4>
              <ul className="space-y-2">
                {article.examples.map((example, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600 font-bold mt-0.5">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Scenarios */}
          {article.relatedScenarios && article.relatedScenarios.length > 0 && (
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>🔗</span>
                Relacionado con escenarios:
              </h4>
              <div className="flex flex-wrap gap-2">
                {article.relatedScenarios.map((scenario, idx) => (
                  <Badge key={idx} variant="warning" size="sm">
                    {scenario}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <Button
        variant="secondary"
        size="sm"
        fullWidth
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4"
      >
        {isExpanded ? (
          <>
            <span className="mr-2">▲</span>
            Ver Menos
          </>
        ) : (
          <>
            <span className="mr-2">▼</span>
            Ver Detalles Completos
          </>
        )}
      </Button>
    </Card>
  );
}
