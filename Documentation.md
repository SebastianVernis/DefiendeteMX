# 📚 Documentación Técnica – Defiéndete MX

## 🔹 Introducción
Esta documentación explica cómo extender y personalizar la app Defiéndete MX agregando nuevos escenarios y recursos legales.

---

## 📂 Estructura de Datos de Escenarios
Los escenarios están en **app/data/scenarios.js** y se definen así:

```js
export const scenarios = [
  {
    id: "nuevo_escenario",
    title: "Nombre del Escenario",
    steps: ["Paso 1", "Paso 2"],
    legal: ["Defensa 1", "Defensa 2"]
  }
];
```

Para agregar uno nuevo, copia y modifica un objeto siguiendo el formato.

---

## 🔹 Agregar Escenarios desde JSON
Para integrar escenarios dinámicos desde un backend o chatbot:
1. Crear un archivo JSON con la estructura de escenarios.
2. Importarlo en `scenarios.js` y mapearlo en `page.js`.

---

## 🔹 Extender el Chatbot Legal
- El chatbot puede consumir un JSON (ejemplo: Detenciones_Mexico_Chatbot_Gemini.json).
- Agregar API o LLM externo para respuestas dinámicas.

---

## 🔹 Agregar Recursos PDF
1. Colocar los PDFs en `/public`.
2. Editar `/app/recursos/page.js` y añadir el nuevo archivo a la lista.

---

## 🔹 Personalización UI
- Los estilos están centralizados en **Tailwind CSS**.
- Modifica `tailwind.config.js` para cambiar colores.

---

## 🔹 PWA y Funcionalidades Offline
- Configuración en `next.config.js` usando `next-pwa`.
- Para actualizar service workers, reconstruir con `npm run build`.

---

## ✅ Recomendaciones
- Mantener datos legales actualizados.
- Probar en móvil para asegurar correcto funcionamiento offline.
- Versionar en GitHub antes de subir cambios.

---

## 🧩 Próximos pasos de integración
- ✅ Conectar API legal (consultas en tiempo real).
- ✅ Añadir autenticación opcional para usuarios registrados.
- ✅ Integrar notificaciones push en emergencias.

---

## 📄 Licencia
MIT – Código abierto para fines educativos y de protección ciudadana.
