"use client";
import ToolCard from "./ToolCard";

export default function ToolsGrid() {
  const tools = [
    {
      id: 1,
      icon: "📋",
      title: "Visualizador de Denuncias",
      description: "Consulta y visualiza el estado de tus denuncias en tiempo real con análisis detallado.",
      isNew: true,
      premium: false,
      action: () => console.log("Visualizador de Denuncias"),
    },
    {
      id: 2,
      icon: "📝",
      title: "Generador de Contratos",
      description: "Crea contratos legales personalizados con IA. Plantillas verificadas por abogados.",
      isNew: false,
      premium: false,
      action: () => console.log("Generador de Contratos"),
    },
    {
      id: 3,
      icon: "🔔",
      title: "Panel de Notificaciones",
      description: "Recibe alertas sobre cambios en tus casos, audiencias y plazos legales importantes.",
      isNew: false,
      premium: true,
      action: () => console.log("Panel de Notificaciones"),
    },
    {
      id: 4,
      icon: "🏛️",
      title: "Consulta PROFECO",
      description: "Accede a la base de datos de PROFECO para consultas de derechos del consumidor.",
      isNew: false,
      premium: false,
      action: () => console.log("Consulta PROFECO"),
    },
    {
      id: 5,
      icon: "👨‍⚖️",
      title: "Buscador de Abogados",
      description: "Encuentra abogados especializados cerca de ti con reseñas verificadas.",
      isNew: false,
      premium: false,
      action: () => console.log("Buscador de Abogados"),
    },
    {
      id: 6,
      icon: "🤖",
      title: "Asistente Legal IA",
      description: "Chatbot inteligente que responde tus dudas legales 24/7 con información actualizada.",
      isNew: true,
      premium: true,
      action: () => console.log("Asistente Legal IA"),
    },
  ];

  return (
    <section className="w-full py-12 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-3">
            🛠️ Herramientas Legales Premium
          </h2>
          <p className="text-lg text-textSecondary max-w-2xl mx-auto">
            Accede a nuestro conjunto de herramientas impulsadas por IA para proteger tus derechos
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-10 p-6 bg-accent/10 border border-accent/30 rounded-xl text-center">
          <p className="text-textPrimary font-medium">
            💡 <span className="text-accent font-bold">Tip:</span> Las herramientas marcadas como{" "}
            <span className="text-yellow-400 font-bold">PREMIUM</span> requieren una suscripción activa.
          </p>
        </div>
      </div>
    </section>
  );
}
