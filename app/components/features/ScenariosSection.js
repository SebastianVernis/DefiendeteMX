'use client';

import { scenarios } from '../../data/scenarios';
import ScenarioCard from './ScenarioCard';

/**
 * Scenarios Section Component
 * Displays all legal scenarios in a grid
 */
export default function ScenariosSection() {
  return (
    <section id="escenarios" className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full text-purple-700 text-sm font-medium mb-4">
            <span>⚖️</span>
            Escenarios Legales
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 font-display">
            Conoce tus
            <span className="gradient-text"> Derechos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Información verificada para actuar correctamente en situaciones legales complejas
          </p>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {scenarios.map((scenario, index) => (
            <ScenarioCard 
              key={scenario.id} 
              scenario={scenario} 
              index={index}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="glass rounded-3xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Necesitas ayuda inmediata?
            </h3>
            <p className="text-gray-600 mb-6">
              En caso de emergencia, no dudes en contactar a las autoridades
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:911"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-xl">🚨</span>
                Llamar al 911
              </a>
              <a
                href="https://www.cndh.org.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-purple-600"
              >
                <span className="text-xl">📞</span>
                Contactar CNDH
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
