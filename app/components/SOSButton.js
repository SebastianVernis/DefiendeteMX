\"use client\";
export default function SOSButton() {
  const sendSOS = async () => {
    let location = "Ubicación no disponible";
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        location = \`https://maps.google.com/?q=\${pos.coords.latitude},\${pos.coords.longitude}\`;
        const msg = \`🚨 Estoy en riesgo, envíen ayuda. Ubicación: \${location}\`;
        navigator.clipboard.writeText(msg);
        alert("✅ Mensaje SOS copiado al portapapeles. ¡Pégalo en WhatsApp o SMS!");
      });
    } else {
      alert("⚠️ GPS no disponible. Solo se copiará el mensaje básico.");
      navigator.clipboard.writeText("🚨 Estoy en riesgo, envíen ayuda.");
    }
  };

  return (
    <button
      onClick={sendSOS}
      className="fixed bottom-4 right-4 px-4 py-3 bg-red-600 text-white rounded-full shadow-lg animate-pulse"
    >
      🚨 SOS
    </button>
  );
}