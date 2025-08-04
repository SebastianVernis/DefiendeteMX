export default function Recursos() {
  const files = [
    { name: "Manual de Supervivencia Policial", file: "/manual_supervivencia.pdf" },
    { name: "Guía Express de Declaraciones", file: "/guia_express.pdf" },
    { name: "Tarjeta de Bolsillo", file: "/tarjeta_bolsillo.pdf" }
  ];

  return (
    <main>
      <h1 className="text-3xl text-neonPink mb-4">📚 Recursos Legales</h1>
      <p className="mb-3 text-gray-300">Descarga tus herramientas de defensa legal en PDF.</p>
      <ul className="space-y-3">
        {files.map((f, i) => (
          <li key={i} className="p-3 bg-gray-900 rounded-lg border border-neonCyan">
            <a href={f.file} download className="text-neonCyan hover:text-neonPink">
              ⬇️ Descargar {f.name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}