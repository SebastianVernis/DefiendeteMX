\"use client\";
export default function ModeSelector({ mode, setMode }) {
  return (
    <div className="flex gap-4 mb-6">
      {["Afectado", "Familiar/Confianza"].map((m) => (
        <button 
          key={m} 
          className={\`px-4 py-2 rounded-xl \${mode === m ? "bg-neonPink" : "bg-gray-700"}\`}
          onClick={() => setMode(m)}
        >
          {m}
        </button>
      ))}
    </div>
  );
}