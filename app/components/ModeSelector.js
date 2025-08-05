"use client";
export default function ModeSelector({ mode, setMode }) {
  return (
    <div className="flex justify-center gap-4 mb-8">
      {["Afectado", "Familiar/Confianza"].map((m) => (
        <button
          key={m}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-300 ${
            mode === m
              ? "bg-accent text-white shadow-lg"
              : "bg-primary text-textSecondary hover:bg-secondary"
          }`}
          onClick={() => setMode(m)}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
