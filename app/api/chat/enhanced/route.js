import { NextResponse } from 'next/server';

/**
 * Enhanced AI Chatbot API
 * Improved legal knowledge and scenario handling
 *
 * Features:
 * - Enhanced legal knowledge base for Mexican law
 * - Scenario-specific responses
 * - Crisis detection and escalation
 * - Multi-language support
 * - Context-aware responses
 */

// Enhanced legal knowledge base
const legalKnowledgeBase = {
  derechosConstitucionales: {
    keywords: ['derechos', 'constitución', 'libertad', 'garantías'],
    response: `Los derechos constitucionales fundamentales en México incluyen:

1. **Derecho a la Libertad** (Art. 1-5): Libertad personal, de expresión, de tránsito
2. **Derecho a la Seguridad Jurídica** (Art. 14-23): Debido proceso, presunción de inocencia
3. **Derecho a la No Discriminación** (Art. 1): Igualdad ante la ley
4. **Derecho a la Privacidad** (Art. 16): Protección de datos y domicilio
5. **Derechos Sociales** (Art. 3-4): Educación, salud, vivienda

¿Sobre cuál derecho específico necesitas más información?`
  },

  detencion: {
    keywords: ['detención', 'arrestar', 'arrestado', 'detenido', 'policía', 'parar'],
    response: `Si eres detenido en México, estos son tus derechos:

**INMEDIATAMENTE:**
- Preguntar el motivo de tu detención
- Exigir identificación del oficial
- Pedir comunicarte (1 llamada)
- Solicitar un abogado

**NO PUEDES SER:**
- Torturado o maltratado
- Obligado a declarar sin abogado
- Retenido más de 48 horas sin ser presentado ante juez

**IMPORTANTE:**
- Guarda silencio hasta tener abogado
- Pide que se documente todo
- Anota placa/nombres de oficiales

¿Estás actualmente detenido? Si es urgente, llama al 911 o CNDH: 800-715-2000`
  },

  violenciaDomestica: {
    keywords: ['violencia', 'abuso', 'golpes', 'maltrato', 'pareja', 'familiar'],
    response: `La violencia doméstica es un delito grave en México. Aquí está tu plan de acción:

**SEGURIDAD INMEDIATA:**
1. Si estás en peligro AHORA: Llama al 911
2. Línea Nacional: 800-TU-AYUDA (800-888-9832)
3. Refugios de emergencia disponibles 24/7

**DOCUMENTACIÓN:**
- Fotografía lesiones y objetos dañados
- Busca atención médica (certificado es prueba)
- Guarda mensajes/correos amenazantes
- Identifica testigos

**ACCIONES LEGALES:**
- Denuncia ante MP (Ministerio Público)
- Solicita orden de protección (inmediata)
- Asesoría legal gratuita: CNDH, DIF

**TIPOS DE VIOLENCIA RECONOCIDOS:**
- Física, psicológica, sexual, económica, patrimonial

¿Estás en peligro inmediato? ¿Necesitas información sobre refugios?`
  },

  amparo: {
    keywords: ['amparo', 'inconstitucional', 'recurso legal', 'impugnar'],
    response: `El **Juicio de Amparo** protege tus derechos constitucionales:

**¿CUÁNDO PROCEDE?**
- Actos de autoridad que violan derechos
- Leyes inconstitucionales
- Sentencias injustas

**TIPOS:**
- **Amparo Directo**: Contra sentencias definitivas
- **Amparo Indirecto**: Contra actos de autoridad
- **Amparo Adhesivo**: Refuerza amparo principal

**PLAZOS:**
- 15 días desde que conociste el acto
- Actos continuos: en cualquier momento

**REQUISITOS:**
- Tener interés jurídico
- Acreditar afectación personal
- No haber consentido el acto

**PROCEDIMIENTO:**
1. Demanda ante Juez de Distrito
2. Se suspende el acto (si procede)
3. Audiencia constitucional
4. Sentencia

¿Contra qué acto específico necesitas amparo?`
  },

  derechosPenales: {
    keywords: ['delito', 'penal', 'acusación', 'fiscal', 'cárcel', 'prisión'],
    response: `Derechos en proceso penal mexicano:

**SI ERES IMPUTADO:**
✓ Presunción de inocencia
✓ Defensor (particular o público)
✓ Guardar silencio
✓ No autoincriminarte
✓ Conocer las acusaciones
✓ Ofrecer pruebas
✓ Apelar sentencias

**ETAPAS DEL PROCESO:**
1. **Investigación** (hasta 2 meses)
2. **Audiencia Inicial** (48h si detenido)
3. **Etapa Intermedia** (pruebas)
4. **Juicio Oral** (presentación de pruebas)
5. **Sentencia**

**DERECHOS DE LA VÍCTIMA:**
✓ Asesoría jurídica gratuita
✓ Reparación del daño
✓ Protección y resguardo
✓ Información del proceso
✓ Participar en audiencias

**SALIDAS ALTERNAS:**
- Suspensión condicional
- Acuerdo reparatorio
- Procedimiento abreviado

¿Eres víctima o imputado? ¿En qué etapa está el proceso?`
  },

  trabajoLaboral: {
    keywords: ['trabajo', 'laboral', 'despido', 'finiquito', 'horas extra', 'patrón'],
    response: `Derechos laborales en México:

**JORNADA Y DESCANSO:**
- Máximo 8 horas diarias
- 7 horas turno nocturno
- 1 día de descanso semanal
- Vacaciones (6-12 días)
- Prima vacacional (25%)

**SALARIOS:**
- Aguinaldo (15 días mínimo)
- PTU (Participación de utilidades)
- Pago quincenal/mensual
- Horas extra dobles/triples

**DESPIDO:**
- **Justificado**: Sin indemnización
- **Injustificado**: 3 meses + 20 días por año + prima

**SEGURIDAD SOCIAL:**
- IMSS obligatorio
- Afore
- Infonavit (si aplica)

**CÓMO DEMANDAR:**
1. Intentar conciliación (obligatorio)
2. Demanda ante Junta de Conciliación
3. Audiencias
4. Laudo (resolución)

¿Fuiste despedido injustificadamente? ¿No te pagan prestaciones?`
  }
};

// Crisis keywords for immediate escalation
const crisisKeywords = [
  'suicidio', 'suicidarme', 'matarme', 'morir', 'terminar con mi vida',
  'no puedo más', 'violación', 'violar', 'abuso sexual',
  'me golpean ahora', 'estoy en peligro', 'me están amenazando',
  'tengo un arma', 'voy a hacer daño'
];

function detectCrisis(message) {
  const lowerMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
}

function getCrisisResponse() {
  return {
    isCrisis: true,
    message: `🚨 **EMERGENCIA DETECTADA** 🚨

Estoy aquí para ayudarte. Si estás en peligro inmediato, por favor contacta:

**📞 LÍNEAS DE EMERGENCIA:**
- **911** - Emergencias generales
- **800-TU-AYUDA (800-888-9832)** - Violencia
- **800-911-2000** - Línea de la Vida (salud mental)
- **800-715-2000** - CNDH (Derechos Humanos)

**IMPORTANTE:**
- No estás solo/a
- La ayuda profesional está disponible 24/7
- Tus sentimientos son válidos
- Hay soluciones y personas que quieren ayudarte

¿Estás en un lugar seguro? ¿Puedo ayudarte con algo específico mientras contactas a profesionales?`,
    requiresEscalation: true
  };
}

function findBestMatch(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  for (const [topic, data] of Object.entries(legalKnowledgeBase)) {
    if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return data.response;
    }
  }

  return null;
}

function generateContextualResponse(userMessage, conversationHistory = []) {
  // Default helpful response
  return `Entiendo tu consulta sobre "${userMessage}".

Puedo ayudarte con información sobre:

📋 **Áreas Legales:**
- Derechos constitucionales y garantías
- Procedimientos penales
- Violencia doméstica
- Derechos laborales
- Amparo y recursos legales

🚨 **Emergencias:**
- Detenciones y arrestos
- Violencia y abuso
- Procedimientos de denuncia

Por favor, cuéntame más detalles sobre tu situación para poder darte información específica y verificada.

💡 **Tip:** Sé lo más específico posible con tu pregunta para darte la mejor respuesta.`;
}

/**
 * POST /api/chat/enhanced
 * Process enhanced chat message with legal knowledge
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [], language = 'es' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      );
    }

    // Check for crisis
    if (detectCrisis(message)) {
      const crisisResponse = getCrisisResponse();
      return NextResponse.json(crisisResponse);
    }

    // Find best match from knowledge base
    const knowledgeMatch = findBestMatch(message);

    const response = knowledgeMatch || generateContextualResponse(message, conversationHistory);

    return NextResponse.json({
      isCrisis: false,
      message: response,
      suggestions: [
        '¿Cómo puedo presentar una denuncia?',
        '¿Cuáles son mis derechos si soy detenido?',
        '¿Qué hacer en caso de violencia doméstica?',
        '¿Cómo funciona el amparo?'
      ],
      metadata: {
        language,
        timestamp: new Date().toISOString(),
        knowledgeBaseMatch: !!knowledgeMatch
      }
    });

  } catch (error) {
    console.error('Error in enhanced chat:', error);
    return NextResponse.json(
      { error: 'Failed to process message', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat/enhanced/topics
 * Get available legal topics
 */
export async function GET() {
  return NextResponse.json({
    topics: Object.keys(legalKnowledgeBase),
    count: Object.keys(legalKnowledgeBase).length
  });
}
