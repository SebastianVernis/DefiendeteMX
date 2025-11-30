"use client";
export default function ModeSelector({ mode, setMode }) {
  const modes = [
    {
      id: "Afectado",
      label: "Soy la persona afectada",
      icon: "👤",
      description: "Estoy siendo detenido o involucrado"
    },
    {
      id: "Familiar/Confianza",
      label: "Soy familiar o persona de confianza",
      icon: "👥",
      description: "Quiero ayudar a alguien detenido"
    }
  ];

  return (
    <div className="mb-12">
      <h3 className="text-center font-semibold text-textPrimary mb-6 text-lg">
        Selecciona tu situación:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {modes.map((m) => (
          <button
            key={m.id}
            className={`p-6 rounded-xl font-semibold transition-all duration-200 text-left ${
              mode === m.id
                ? "bg-accent text-white shadow-card-hover border-2 border-accent scale-105"
                : "card hover:shadow-card-hover border-2 border-transparent"
            }`}
            onClick={() => setMode(m.id)}
          >
            <div className="flex items-start">
              <span className={`text-3xl mr-4 ${mode === m.id ? "filter grayscale-0" : "filter grayscale opacity-60"}`}>
                {m.icon}
              </span>
              <div className="flex-grow">
                <div className={`font-bold text-lg mb-1 ${mode === m.id ? "text-white" : "text-textPrimary"}`}>
                  {m.label}
                </div>
                <div className={`text-sm ${mode === m.id ? "text-white/80" : "text-textMuted"}`}>
                  {m.description}
                </div>
              </div>
              {mode === m.id && (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
