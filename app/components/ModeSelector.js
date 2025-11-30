"use client";

export default function ModeSelector({ mode, setMode }) {
  const modes = [
    {
      id: "Afectado",
      label: "Soy la persona afectada",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: "Estoy siendo detenido o involucrado en una situación"
    },
    {
      id: "Familiar/Confianza",
      label: "Soy familiar o persona de confianza",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: "Quiero ayudar a alguien que está siendo detenido"
    }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-textPrimary mb-2">
          Selecciona tu situación
        </h3>
        <p className="text-textSecondary">
          La información se adaptará según tu rol
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`group relative p-8 rounded-2xl font-semibold transition-all duration-300 text-left overflow-hidden ${
              mode === m.id
                ? "bg-accent text-white shadow-elegant-xl scale-[1.02] border-2 border-accent"
                : "bg-white hover:bg-secondary/50 text-textPrimary shadow-elegant hover:shadow-elegant-lg border-2 border-border hover:border-accent/20"
            }`}
          >
            {/* Background decoration */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-opacity duration-300 ${
              mode === m.id ? "opacity-20" : "opacity-0 group-hover:opacity-10"
            } ${mode === m.id ? "bg-white" : "bg-accent"}`}></div>

            <div className="relative">
              {/* Icon */}
              <div className={`mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${
                mode === m.id 
                  ? "bg-white/20 text-white" 
                  : "bg-accent/5 text-accent group-hover:bg-accent/10 group-hover:scale-110"
              }`}>
                {m.icon}
              </div>

              {/* Content */}
              <div>
                <div className={`font-bold text-xl mb-2 ${mode === m.id ? "text-white" : "text-textPrimary"}`}>
                  {m.label}
                </div>
                <div className={`text-sm leading-relaxed ${mode === m.id ? "text-white/90" : "text-textSecondary"}`}>
                  {m.description}
                </div>
              </div>

              {/* Check indicator */}
              {mode === m.id && (
                <div className="absolute top-0 right-0">
                  <div className="bg-white text-accent w-8 h-8 rounded-full flex items-center justify-center shadow-elegant">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
