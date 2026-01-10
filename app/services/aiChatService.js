/**
 * AI Chat Service
 * Specialized chatbot for legal and emotional assistance
 * 
 * Features:
 * - Legal knowledge base for Mexican law
 * - Emotional support response templates
 * - Crisis detection and escalation
 * - Context-aware multi-turn conversations
 * - Safety assessment integration
 * - Resource recommendations
 */

import Chat from '../models/Chat';

/**
 * Legal Knowledge Base
 * Comprehensive information about Mexican legal rights and procedures
 */
const LEGAL_KNOWLEDGE_BASE = {
  DETENCION_POLICIAL: {
    title: 'Detención Policial',
    rights: [
      'Derecho a permanecer en silencio',
      'Derecho a un abogado defensor',
      'Derecho a conocer los cargos en tu contra',
      'Derecho a comunicarte con un familiar',
      'Derecho a atención médica si la necesitas',
      'Derecho a ser tratado con dignidad y respeto'
    ],
    steps: [
      'Mantén la calma y no resistas físicamente',
      'Identifícate con tu nombre completo',
      'Solicita hablar con un abogado inmediatamente',
      'No firmes nada sin asesoría legal',
      'Memoriza o anota los nombres y placas de los oficiales',
      'Pide que contacten a un familiar o persona de confianza'
    ],
    legalBasis: 'Artículos 16, 19, 20 y 21 de la Constitución Política de los Estados Unidos Mexicanos',
    resources: [
      'Defensoría Pública: 55-5346-1200',
      'CNDH: 800-715-2000',
      'Fiscalía General: 800-008-5400'
    ]
  },
  VIOLENCIA_DOMESTICA: {
    title: 'Violencia Doméstica',
    rights: [
      'Derecho a vivir libre de violencia',
      'Derecho a la protección de las autoridades',
      'Derecho a recibir atención médica y psicológica',
      'Derecho a denunciar sin represalias',
      'Derecho a órdenes de protección',
      'Derecho a refugio temporal seguro'
    ],
    steps: [
      'Tu seguridad es lo primero - busca un lugar seguro',
      'Llama al 911 si estás en peligro inmediato',
      'Documenta las agresiones (fotos, mensajes, testigos)',
      'Acude al Ministerio Público a presentar denuncia',
      'Solicita una orden de protección',
      'Busca apoyo psicológico especializado'
    ],
    legalBasis: 'Ley General de Acceso de las Mujeres a una Vida Libre de Violencia',
    resources: [
      'Línea Nacional contra la Violencia: 800-108-4053',
      'Red Nacional de Refugios: 800-822-4460',
      'INMUJERES: 800-911-2511'
    ]
  },
  VIOLENCIA_SEXUAL: {
    title: 'Violencia Sexual',
    rights: [
      'Derecho a atención médica inmediata',
      'Derecho a anticoncepción de emergencia',
      'Derecho a profilaxis post-exposición (VIH)',
      'Derecho a denunciar de forma anónima',
      'Derecho a acompañamiento psicológico',
      'Derecho a la confidencialidad'
    ],
    steps: [
      'Busca atención médica inmediata (primeras 72 horas críticas)',
      'No te bañes ni cambies de ropa antes del examen médico',
      'Acude a un hospital o centro de salud',
      'Solicita anticoncepción de emergencia y profilaxis',
      'Presenta denuncia cuando te sientas lista',
      'Busca apoyo psicológico especializado'
    ],
    legalBasis: 'Código Penal Federal, NOM-046-SSA2-2005',
    resources: [
      'Línea de Atención a Víctimas: 800-842-8462',
      'ADIVAC: 55-5682-7969',
      'Fiscalía Especializada: 800-008-5400'
    ]
  },
  ACOSO_LABORAL: {
    title: 'Acoso Laboral',
    rights: [
      'Derecho a un ambiente laboral libre de acoso',
      'Derecho a denunciar sin represalias',
      'Derecho a la confidencialidad',
      'Derecho a investigación imparcial',
      'Derecho a medidas de protección',
      'Derecho a indemnización por daños'
    ],
    steps: [
      'Documenta todos los incidentes (fechas, testigos, evidencias)',
      'Reporta al área de Recursos Humanos',
      'Presenta queja ante PROFEDET o Junta de Conciliación',
      'Solicita medidas de protección',
      'Considera asesoría legal especializada',
      'Busca apoyo psicológico'
    ],
    legalBasis: 'Ley Federal del Trabajo, NOM-035-STPS-2018',
    resources: [
      'PROFEDET: 800-911-7877',
      'STPS: 800-911-7877',
      'CONAPRED: 800-543-0033'
    ]
  },
  DISCRIMINACION: {
    title: 'Discriminación',
    rights: [
      'Derecho a la igualdad y no discriminación',
      'Derecho a presentar queja',
      'Derecho a reparación del daño',
      'Derecho a medidas de no repetición',
      'Derecho a la dignidad humana',
      'Derecho a acceso a servicios sin discriminación'
    ],
    steps: [
      'Identifica el tipo de discriminación',
      'Documenta el incidente con evidencias',
      'Presenta queja ante CONAPRED',
      'Busca asesoría legal si es necesario',
      'Solicita medidas de reparación',
      'Considera denuncia penal si aplica'
    ],
    legalBasis: 'Ley Federal para Prevenir y Eliminar la Discriminación',
    resources: [
      'CONAPRED: 800-543-0033',
      'CNDH: 800-715-2000',
      'Defensoría Pública: 55-5346-1200'
    ]
  },
  ABUSO_AUTORIDAD: {
    title: 'Abuso de Autoridad',
    rights: [
      'Derecho a presentar queja',
      'Derecho a investigación imparcial',
      'Derecho a reparación del daño',
      'Derecho a la verdad',
      'Derecho a no ser torturado',
      'Derecho a la integridad personal'
    ],
    steps: [
      'Documenta el abuso (nombres, placas, testigos)',
      'Presenta queja ante Asuntos Internos',
      'Acude a la CNDH o Comisión Estatal',
      'Solicita atención médica si hay lesiones',
      'Considera denuncia penal',
      'Busca asesoría legal especializada'
    ],
    legalBasis: 'Código Penal Federal, Ley de Responsabilidades Administrativas',
    resources: [
      'CNDH: 800-715-2000',
      'Fiscalía Anticorrupción: 800-008-5400',
      'Defensoría Pública: 55-5346-1200'
    ]
  },
  DERECHOS_CONSUMIDOR: {
    title: 'Derechos del Consumidor',
    rights: [
      'Derecho a la información',
      'Derecho a la protección contra publicidad engañosa',
      'Derecho a elegir libremente',
      'Derecho a la seguridad y calidad',
      'Derecho a no ser discriminado',
      'Derecho a la compensación'
    ],
    steps: [
      'Conserva tickets, contratos y evidencias',
      'Intenta resolver con el proveedor primero',
      'Presenta queja ante PROFECO',
      'Solicita conciliación o arbitraje',
      'Considera demanda civil si es necesario',
      'Documenta todo el proceso'
    ],
    legalBasis: 'Ley Federal de Protección al Consumidor',
    resources: [
      'PROFECO: 800-468-8722',
      'Teléfono del Consumidor: 55-5568-8722',
      'CONDUSEF (servicios financieros): 800-999-8080'
    ]
  }
};

/**
 * Crisis Keywords
 * Keywords that indicate potential crisis situations
 */
const CRISIS_KEYWORDS = [
  // Suicidal ideation
  'suicidio', 'suicidarme', 'matarme', 'quitarme la vida', 'no quiero vivir',
  'mejor muerto', 'acabar con todo', 'terminar con mi vida',
  
  // Self-harm
  'cortarme', 'lastimarme', 'hacerme daño', 'autolesión',
  
  // Immediate danger
  'me va a matar', 'me está golpeando', 'tengo miedo de morir',
  'está aquí', 'me está amenazando', 'peligro inmediato',
  'ayuda urgente', 'emergencia', 'socorro',
  
  // Severe distress
  'no puedo más', 'ya no aguanto', 'estoy desesperado',
  'no veo salida', 'todo está perdido'
];

/**
 * Emotional Support Templates
 * Empathetic responses for different emotional states
 */
const EMOTIONAL_SUPPORT = {
  CRISIS: {
    opening: '🚨 Entiendo que estás pasando por un momento muy difícil. Tu seguridad es lo más importante.',
    validation: 'Lo que sientes es válido y comprensible dada la situación.',
    action: 'Necesito que sepas que hay ayuda disponible inmediatamente:',
    resources: [
      '🚨 Emergencias: 911',
      '📞 Línea de la Vida (prevención del suicidio): 800-273-8255',
      '💬 Chat de Crisis: https://chat.lineadelavida.org',
      '🏥 Acude al hospital más cercano'
    ],
    followUp: '¿Estás en un lugar seguro ahora? ¿Hay alguien contigo que pueda ayudarte?'
  },
  DISTRESSED: {
    opening: 'Puedo ver que estás pasando por un momento muy difícil.',
    validation: 'Es completamente normal sentirse así en tu situación. No estás solo/a.',
    support: 'Estoy aquí para ayudarte. Vamos a trabajar juntos para encontrar opciones.',
    breathing: '¿Te gustaría que te guíe en un ejercicio de respiración para ayudarte a calmarte?'
  },
  ANXIOUS: {
    opening: 'Entiendo que esta situación te genera ansiedad.',
    validation: 'Es normal sentir preocupación cuando enfrentamos problemas legales.',
    reassurance: 'Vamos a revisar tus opciones paso a paso. Hay recursos disponibles para ayudarte.',
    grounding: 'Recuerda: estás tomando el paso correcto al buscar información y ayuda.'
  },
  CALM: {
    opening: 'Me alegra que estés buscando información de manera proactiva.',
    support: 'Estoy aquí para proporcionarte la información legal que necesitas.',
    empowerment: 'Conocer tus derechos es el primer paso para protegerte.'
  }
};

/**
 * Quick Action Templates
 * Predefined responses for common scenarios
 */
const QUICK_ACTIONS = {
  EMERGENCY_NUMBERS: {
    title: '📞 Números de Emergencia',
    content: `**Números de Emergencia en México:**

🚨 **Emergencias Generales:** 911
👮 **Denuncia Anónima:** 089
📞 **CNDH:** 800-715-2000
⚖️ **Fiscalía General:** 800-008-5400
💬 **Línea de la Vida:** 800-273-8255
👩 **Violencia contra Mujeres:** 800-108-4053
🏠 **Red Nacional de Refugios:** 800-822-4460

Guarda estos números en tu teléfono. Pueden salvarte la vida.`
  },
  SAFETY_PLAN: {
    title: '🛡️ Plan de Seguridad',
    content: `**Crea tu Plan de Seguridad Personal:**

1. **Identifica lugares seguros** donde puedas ir en emergencia
2. **Contactos de confianza** que puedan ayudarte (mínimo 3)
3. **Documentos importantes** guardados en lugar seguro o con alguien de confianza
4. **Dinero de emergencia** guardado en lugar accesible
5. **Ruta de escape** planificada desde tu casa/trabajo
6. **Código de emergencia** con personas de confianza
7. **Bolsa de emergencia** lista con lo esencial

¿Te gustaría que te ayude a desarrollar alguno de estos puntos?`
  },
  EVIDENCE_COLLECTION: {
    title: '📸 Recolección de Evidencia',
    content: `**Cómo Documentar Evidencia:**

📸 **Fotografías:**
- Lesiones físicas (con fecha y hora)
- Daños a propiedad
- Mensajes amenazantes

📝 **Documentos:**
- Reportes médicos
- Denuncias previas
- Mensajes de texto/WhatsApp
- Correos electrónicos

👥 **Testigos:**
- Nombres y contactos
- Declaraciones escritas si es posible

⏰ **Bitácora:**
- Fecha y hora de cada incidente
- Descripción detallada
- Personas presentes

💾 **Respaldos:**
- Guarda copias en la nube
- Comparte con persona de confianza
- No borres originales`
  },
  LEGAL_PROCESS: {
    title: '⚖️ Proceso Legal',
    content: `**Pasos del Proceso Legal:**

1️⃣ **Denuncia:**
   - Acude al Ministerio Público
   - Lleva identificación y evidencias
   - Solicita copia de la denuncia

2️⃣ **Investigación:**
   - Colabora con autoridades
   - Proporciona evidencias
   - Mantén comunicación con tu abogado

3️⃣ **Medidas de Protección:**
   - Solicítalas inmediatamente
   - Son gratuitas y rápidas
   - Pueden incluir orden de alejamiento

4️⃣ **Proceso Judicial:**
   - Asiste a todas las audiencias
   - Mantén evidencias organizadas
   - Sigue consejos de tu abogado

5️⃣ **Seguimiento:**
   - Verifica cumplimiento de sentencia
   - Reporta violaciones a medidas
   - Busca reparación del daño`
  }
};

/**
 * AI Chat Service Class
 */
class AIChatService {
  /**
   * Generate AI response based on user message and context
   */
  static async generateResponse(userMessage, context = {}) {
    const startTime = Date.now();
    
    try {
      // Detect sentiment and crisis
      const sentiment = this.detectSentiment(userMessage);
      const crisisDetected = this.detectCrisis(userMessage);
      const intent = this.detectIntent(userMessage, context);

      // Build response based on context and intent
      let response = '';
      let suggestedActions = [];

      // Handle crisis situations first
      if (crisisDetected.isCrisis) {
        response = this.generateCrisisResponse(crisisDetected);
        suggestedActions = ['CALL_911', 'EMERGENCY_CONTACTS', 'SAFETY_PLAN'];
      }
      // Handle specific intents
      else if (intent.type === 'LEGAL_QUESTION') {
        response = this.generateLegalResponse(intent, context);
        suggestedActions = ['VIEW_RIGHTS', 'FIND_LAWYER', 'FILE_COMPLAINT'];
      }
      else if (intent.type === 'EMOTIONAL_SUPPORT') {
        response = this.generateEmotionalResponse(sentiment, userMessage);
        suggestedActions = ['SAFETY_RESOURCES', 'SUPPORT_GROUPS', 'CRISIS_LINE'];
      }
      else if (intent.type === 'PROCEDURAL_QUESTION') {
        response = this.generateProceduralResponse(intent, context);
        suggestedActions = ['LEGAL_PROCESS', 'EVIDENCE_GUIDE', 'FIND_LAWYER'];
      }
      else if (intent.type === 'GREETING') {
        response = this.generateGreeting(context);
        suggestedActions = ['LEGAL_SCENARIOS', 'EMERGENCY_NUMBERS', 'SAFETY_PLAN'];
      }
      else {
        response = this.generateGeneralResponse(userMessage, context);
        suggestedActions = ['LEGAL_SCENARIOS', 'TALK_TO_HUMAN', 'RESOURCES'];
      }

      const processingTime = Date.now() - startTime;

      return {
        content: response,
        sentiment,
        crisisDetected: crisisDetected.isCrisis,
        crisisKeywords: crisisDetected.keywords,
        metadata: {
          processingTime,
          confidence: intent.confidence || 0.8,
          detectedIntent: intent.type,
          suggestedActions
        }
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        content: 'Disculpa, tuve un problema al procesar tu mensaje. ¿Podrías reformular tu pregunta?',
        sentiment: 'NEUTRAL',
        crisisDetected: false,
        metadata: {
          processingTime: Date.now() - startTime,
          confidence: 0,
          detectedIntent: 'ERROR',
          suggestedActions: ['TRY_AGAIN', 'TALK_TO_HUMAN']
        }
      };
    }
  }

  /**
   * Detect sentiment from message
   */
  static detectSentiment(message) {
    const lowerMessage = message.toLowerCase();

    // Crisis indicators
    const crisisWords = ['suicidio', 'matarme', 'morir', 'acabar', 'no puedo más'];
    if (crisisWords.some(word => lowerMessage.includes(word))) {
      return 'CRISIS';
    }

    // Distress indicators
    const distressWords = ['desesperado', 'miedo', 'terror', 'pánico', 'ayuda urgente'];
    if (distressWords.some(word => lowerMessage.includes(word))) {
      return 'DISTRESSED';
    }

    // Negative indicators
    const negativeWords = ['triste', 'deprimido', 'angustiado', 'preocupado', 'asustado'];
    if (negativeWords.some(word => lowerMessage.includes(word))) {
      return 'NEGATIVE';
    }

    // Positive indicators
    const positiveWords = ['gracias', 'bien', 'mejor', 'ayuda', 'entiendo'];
    if (positiveWords.some(word => lowerMessage.includes(word))) {
      return 'POSITIVE';
    }

    return 'NEUTRAL';
  }

  /**
   * Detect crisis situations
   */
  static detectCrisis(message) {
    const lowerMessage = message.toLowerCase();
    const detectedKeywords = [];

    for (const keyword of CRISIS_KEYWORDS) {
      if (lowerMessage.includes(keyword)) {
        detectedKeywords.push(keyword);
      }
    }

    return {
      isCrisis: detectedKeywords.length > 0,
      keywords: detectedKeywords,
      severity: detectedKeywords.length >= 2 ? 'HIGH' : 'MEDIUM'
    };
  }

  /**
   * Detect user intent
   */
  static detectIntent(message, context) {
    const lowerMessage = message.toLowerCase();

    // Greeting
    if (/^(hola|buenos|buenas|hey|hi|hello)/i.test(message)) {
      return { type: 'GREETING', confidence: 0.95 };
    }

    // Legal question
    const legalKeywords = ['derecho', 'ley', 'legal', 'abogado', 'denuncia', 'demanda'];
    if (legalKeywords.some(word => lowerMessage.includes(word))) {
      return { type: 'LEGAL_QUESTION', confidence: 0.85, keywords: legalKeywords };
    }

    // Procedural question
    const proceduralKeywords = ['cómo', 'qué hago', 'pasos', 'proceso', 'dónde acudo'];
    if (proceduralKeywords.some(word => lowerMessage.includes(word))) {
      return { type: 'PROCEDURAL_QUESTION', confidence: 0.8 };
    }

    // Emotional support
    const emotionalKeywords = ['siento', 'miedo', 'ayuda', 'solo', 'triste', 'angustia'];
    if (emotionalKeywords.some(word => lowerMessage.includes(word))) {
      return { type: 'EMOTIONAL_SUPPORT', confidence: 0.75 };
    }

    return { type: 'GENERAL', confidence: 0.6 };
  }

  /**
   * Generate crisis response
   */
  static generateCrisisResponse(crisisInfo) {
    const template = EMOTIONAL_SUPPORT.CRISIS;
    
    let response = `${template.opening}\n\n`;
    response += `${template.validation}\n\n`;
    response += `${template.action}\n\n`;
    
    template.resources.forEach(resource => {
      response += `${resource}\n`;
    });
    
    response += `\n${template.followUp}\n\n`;
    response += `**Por favor, considera contactar a uno de estos servicios ahora mismo. Tu vida es valiosa y hay personas que quieren ayudarte.**`;

    return response;
  }

  /**
   * Generate legal response
   */
  static generateLegalResponse(intent, context) {
    const scenario = context.legalScenario || 'GENERAL';
    const knowledge = LEGAL_KNOWLEDGE_BASE[scenario];

    if (!knowledge) {
      return this.generateGeneralLegalResponse();
    }

    let response = `**${knowledge.title}**\n\n`;
    response += `**Tus Derechos:**\n`;
    knowledge.rights.forEach((right, index) => {
      response += `${index + 1}. ${right}\n`;
    });

    response += `\n**Pasos Recomendados:**\n`;
    knowledge.steps.forEach((step, index) => {
      response += `${index + 1}. ${step}\n`;
    });

    response += `\n**Base Legal:** ${knowledge.legalBasis}\n`;
    
    response += `\n**Recursos de Ayuda:**\n`;
    knowledge.resources.forEach(resource => {
      response += `• ${resource}\n`;
    });

    response += `\n¿Necesitas información más específica sobre algún punto?`;

    return response;
  }

  /**
   * Generate emotional support response
   */
  static generateEmotionalResponse(sentiment, message) {
    let template;

    switch (sentiment) {
      case 'DISTRESSED':
        template = EMOTIONAL_SUPPORT.DISTRESSED;
        break;
      case 'ANXIOUS':
      case 'NEGATIVE':
        template = EMOTIONAL_SUPPORT.ANXIOUS;
        break;
      default:
        template = EMOTIONAL_SUPPORT.CALM;
    }

    let response = `${template.opening}\n\n`;
    response += `${template.validation || template.support}\n\n`;
    
    if (template.reassurance) {
      response += `${template.reassurance}\n\n`;
    }
    
    if (template.breathing || template.grounding) {
      response += `${template.breathing || template.grounding}\n\n`;
    }

    response += `Recuerda que no estás solo/a. Hay recursos y personas dispuestas a ayudarte.`;

    return response;
  }

  /**
   * Generate procedural response
   */
  static generateProceduralResponse(intent, context) {
    const scenario = context.legalScenario;
    
    if (scenario && LEGAL_KNOWLEDGE_BASE[scenario]) {
      const knowledge = LEGAL_KNOWLEDGE_BASE[scenario];
      
      let response = `**Proceso para ${knowledge.title}:**\n\n`;
      knowledge.steps.forEach((step, index) => {
        response += `**Paso ${index + 1}:** ${step}\n\n`;
      });

      response += `**Recursos que pueden ayudarte:**\n`;
      knowledge.resources.forEach(resource => {
        response += `• ${resource}\n`;
      });

      return response;
    }

    return QUICK_ACTIONS.LEGAL_PROCESS.content;
  }

  /**
   * Generate greeting response
   */
  static generateGreeting(context) {
    const greetings = [
      '¡Hola! Soy tu asistente legal especializado. Estoy aquí para ayudarte con información legal y apoyo emocional.',
      'Hola, bienvenido/a. Puedo ayudarte con información sobre tus derechos legales y brindarte apoyo.',
      '¡Hola! Estoy aquí para asistirte. Puedo proporcionarte información legal y apoyo emocional.'
    ];

    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    let response = `${greeting}\n\n`;
    response += `**Puedo ayudarte con:**\n`;
    response += `• Información sobre tus derechos legales\n`;
    response += `• Orientación en procesos legales\n`;
    response += `• Apoyo emocional y recursos\n`;
    response += `• Números de emergencia y contactos útiles\n`;
    response += `• Planes de seguridad personal\n\n`;
    response += `¿En qué puedo ayudarte hoy?`;

    return response;
  }

  /**
   * Generate general response
   */
  static generateGeneralResponse(message, context) {
    return `Entiendo tu consulta. Para poder ayudarte mejor, ¿podrías darme más detalles sobre tu situación?\n\n` +
           `Puedo ayudarte con:\n` +
           `• Información sobre derechos legales\n` +
           `• Orientación en procesos legales\n` +
           `• Apoyo emocional\n` +
           `• Recursos y contactos de ayuda\n\n` +
           `¿Qué aspecto te gustaría explorar?`;
  }

  /**
   * Generate general legal response
   */
  static generateGeneralLegalResponse() {
    return `**Áreas Legales en las que puedo ayudarte:**\n\n` +
           `1. **Detención Policial** - Tus derechos durante una detención\n` +
           `2. **Violencia Doméstica** - Protección y recursos\n` +
           `3. **Violencia Sexual** - Atención y proceso legal\n` +
           `4. **Acoso Laboral** - Derechos laborales y denuncia\n` +
           `5. **Discriminación** - Protección contra discriminación\n` +
           `6. **Abuso de Autoridad** - Cómo denunciar\n` +
           `7. **Derechos del Consumidor** - Protección PROFECO\n\n` +
           `¿Sobre cuál de estos temas necesitas información?`;
  }

  /**
   * Get quick action content
   */
  static getQuickAction(actionKey) {
    return QUICK_ACTIONS[actionKey] || null;
  }

  /**
   * Get all available quick actions
   */
  static getQuickActions() {
    return Object.keys(QUICK_ACTIONS).map(key => ({
      key,
      title: QUICK_ACTIONS[key].title
    }));
  }

  /**
   * Get legal scenarios
   */
  static getLegalScenarios() {
    return Object.keys(LEGAL_KNOWLEDGE_BASE).map(key => ({
      key,
      title: LEGAL_KNOWLEDGE_BASE[key].title
    }));
  }

  /**
   * Validate message
   */
  static validateMessage(message) {
    if (!message || typeof message !== 'string') {
      return { valid: false, error: 'Message must be a non-empty string' };
    }

    const trimmed = message.trim();
    
    if (trimmed.length === 0) {
      return { valid: false, error: 'Message cannot be empty' };
    }

    if (trimmed.length > 5000) {
      return { valid: false, error: 'Message too long (max 5000 characters)' };
    }

    return { valid: true, message: trimmed };
  }
}

export default AIChatService;
export { LEGAL_KNOWLEDGE_BASE, CRISIS_KEYWORDS, EMOTIONAL_SUPPORT, QUICK_ACTIONS };
