// Escenarios legales verificados
export const scenarios = [
  {
    id: "sobredosis",
    title: "Muerte por Sobredosis en Reunión",
    icon: "⚕️",
    category: "emergencia",
    steps: [
      "Mantén la calma, coopera con las autoridades",
      "Declara solo con abogado presente",
      "Pide que se registre que solicitaste ayuda (911)",
      "No admitas responsabilidad sin asesoría legal"
    ],
    legal: [
      "No pueden retenerte sin causa justificada",
      "Tienes derecho a un abogado y a guardar silencio",
      "Si no suministraste drogas, tu papel es de testigo",
      "Art. 20 Constitucional: presunción de inocencia"
    ]
  },
  {
    id: "robo-dinero",
    title: "Robo de Dinero por Policía",
    icon: "💰",
    category: "abuso",
    steps: [
      "Anota número de patrulla, nombres de oficiales y hora exacta",
      "Informa a un familiar inmediatamente",
      "Denuncia en Asuntos Internos de la corporación",
      "Presenta denuncia en Fiscalía y Comisión de Derechos Humanos"
    ],
    legal: [
      "El abuso de autoridad es delito denunciable (Art. 215 CPF)",
      "Puedes exigir revisión de cámaras corporales y testigos",
      "Solicita que se documente el incidente con número de folio",
      "Derecho a presentar queja ante CNDH"
    ]
  },
  {
    id: "siembra",
    title: "Siembra de Droga o Dinero Ilícito",
    icon: "⚖️",
    category: "defensa",
    steps: [
      "Exige grabación oficial y presencia de testigos civiles",
      "Niega enfáticamente la propiedad del objeto sembrado",
      "Solicita abogado inmediatamente - NO declares sin él",
      "Exige que se documente la cadena de custodia"
    ],
    legal: [
      "Manipulación de evidencia invalida el proceso legal",
      "Tu defensa puede alegar violación de cadena de custodia",
      "Frase clave: 'Ese objeto no es mío, fue introducido sin testigos'",
      "Art. 20 Const.: derecho a defensa adecuada"
    ]
  }
];

export const categories = {
  emergencia: { name: "Emergencia Médica", color: "red", icon: "⚕️" },
  abuso: { name: "Abuso de Autoridad", color: "orange", icon: "⚠️" },
  defensa: { name: "Defensa Legal", color: "blue", icon: "⚖️" }
};
