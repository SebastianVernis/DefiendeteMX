// Constitución Política de los Estados Unidos Mexicanos
// Artículos fundamentales con explicaciones conversacionales

export const constitutionArticles = [
  {
    id: 1,
    number: 1,
    title: "Derechos Humanos y sus Garantías",
    category: "derechos",
    icon: "👥",
    summary: "Todas las personas gozan de los derechos humanos reconocidos en la Constitución y en los tratados internacionales.",
    conversational: "¿Sabías que tienes derechos solo por ser persona? Este artículo dice que TODOS en México tienen derechos humanos, sin importar quién seas. Nadie puede discriminarte por tu origen, género, edad, religión, o cualquier otra razón.",
    fullText: "En los Estados Unidos Mexicanos todas las personas gozarán de los derechos humanos reconocidos en esta Constitución y en los tratados internacionales de los que el Estado Mexicano sea parte, así como de las garantías para su protección.",
    examples: [
      "Si te discriminan en el trabajo por tu edad, puedes denunciarlo",
      "Tienes derecho a educación, salud y vivienda digna",
      "Nadie puede tratarte diferente por tu apariencia o creencias"
    ],
    relatedScenarios: ["robo-dinero", "siembra"],
    keywords: ["derechos humanos", "discriminación", "igualdad", "garantías"]
  },
  {
    id: 2,
    number: 11,
    title: "Derecho a la Libre Circulación",
    category: "libertades",
    icon: "🚶",
    summary: "Toda persona tiene derecho a entrar, salir y viajar por el territorio nacional sin necesidad de permiso.",
    conversational: "Puedes moverte libremente por todo México. Nadie puede impedirte viajar de un estado a otro, salir del país o regresar. Es tu derecho ir a donde quieras.",
    fullText: "Toda persona tiene derecho para entrar en la República, salir de ella, viajar por su territorio y mudar de residencia, sin necesidad de carta de seguridad, pasaporte, salvoconducto u otros requisitos semejantes.",
    examples: [
      "Puedes mudarte a otro estado sin pedir permiso",
      "Tienes derecho a salir del país cuando quieras",
      "Nadie puede detenerte en un retén sin causa justificada"
    ],
    relatedScenarios: ["robo-dinero"],
    keywords: ["libre tránsito", "circulación", "viaje", "movimiento"]
  },
  {
    id: 3,
    number: 14,
    title: "Garantía de Audiencia y Legalidad",
    category: "garantias",
    icon: "⚖️",
    summary: "Nadie puede ser privado de sus derechos sin un juicio donde se cumplan las formalidades legales.",
    conversational: "Si alguien quiere quitarte algo (tu libertad, tu propiedad, tus derechos), DEBE hacerlo a través de un juicio justo. No pueden simplemente decidir castigarte sin seguir las reglas del juego.",
    fullText: "Nadie podrá ser privado de la libertad o de sus propiedades, posesiones o derechos, sino mediante juicio seguido ante los tribunales previamente establecidos, en el que se cumplan las formalidades esenciales del procedimiento.",
    examples: [
      "Si te acusan de algo, tienes derecho a defenderte en un juicio",
      "No pueden quitarte tu casa sin un proceso legal",
      "Tienes derecho a que te expliquen de qué te acusan"
    ],
    relatedScenarios: ["siembra", "sobredosis"],
    keywords: ["juicio", "audiencia", "debido proceso", "defensa"]
  },
  {
    id: 4,
    number: 16,
    title: "Derecho a la Seguridad Jurídica",
    category: "garantias",
    icon: "🛡️",
    summary: "Nadie puede ser molestado sin una orden escrita de autoridad competente que funde y motive la causa legal.",
    conversational: "La policía NO puede entrar a tu casa, revisar tus cosas o detenerte 'porque sí'. Necesitan una orden por escrito que explique exactamente por qué y para qué. Si no la tienen, están violando tus derechos.",
    fullText: "Nadie puede ser molestado en su persona, familia, domicilio, papeles o posesiones, sino en virtud de mandamiento escrito de la autoridad competente, que funde y motive la causa legal del procedimiento.",
    examples: [
      "Si la policía quiere entrar a tu casa, debe tener una orden de cateo",
      "No pueden revisar tu celular sin tu permiso o una orden judicial",
      "En una detención, deben explicarte el motivo claramente"
    ],
    relatedScenarios: ["robo-dinero", "siembra"],
    keywords: ["cateo", "orden judicial", "privacidad", "domicilio"]
  },
  {
    id: 5,
    number: 19,
    title: "Prisión Preventiva y Detención",
    category: "procedimientos",
    icon: "🔒",
    summary: "Ninguna detención puede exceder 72 horas sin que se justifique con un auto de formal prisión.",
    conversational: "Si te detienen, tienen máximo 72 horas (3 días) para presentarte ante un juez y explicar por qué te tienen arrestado. Si no lo hacen, deben dejarte ir. No pueden tenerte encerrado indefinidamente sin razón.",
    fullText: "Ninguna detención ante autoridad judicial podrá exceder del plazo de setenta y dos horas, a partir de que el indiciado sea puesto a su disposición, sin que se justifique con un auto de formal prisión.",
    examples: [
      "Si te arrestan el lunes, el jueves deben presentarte ante un juez",
      "Puedes exigir saber de qué te acusan dentro de las 72 horas",
      "Si pasan más de 3 días sin explicación, tu detención es ilegal"
    ],
    relatedScenarios: ["sobredosis", "siembra"],
    keywords: ["detención", "prisión preventiva", "72 horas", "auto de formal prisión"]
  },
  {
    id: 6,
    number: 20,
    title: "Derechos del Imputado",
    category: "derechos",
    icon: "👨‍⚖️",
    summary: "Toda persona tiene derecho a una defensa adecuada, a ser considerada inocente y a no declarar contra sí misma.",
    conversational: "Este es SÚPER importante: eres INOCENTE hasta que se demuestre lo contrario. Tienes derecho a un abogado, a guardar silencio, y a que te traten con respeto. Nadie puede obligarte a declarar contra ti mismo.",
    fullText: "En todo proceso de orden penal, el inculpado, la víctima o el ofendido, tendrán las garantías de presunción de inocencia, derecho a una defensa adecuada, derecho a no declarar contra sí mismo.",
    examples: [
      "Puedes decir 'No voy a declarar sin mi abogado' y es tu derecho",
      "Eres inocente aunque te hayan arrestado, hasta que un juez diga lo contrario",
      "Si no tienes dinero para abogado, el Estado debe darte uno gratis"
    ],
    relatedScenarios: ["sobredosis", "siembra", "robo-dinero"],
    keywords: ["presunción de inocencia", "derecho a defensa", "abogado", "no autoincriminación"]
  },
  {
    id: 7,
    number: 21,
    title: "Investigación de Delitos",
    category: "procedimientos",
    icon: "🔍",
    summary: "La investigación de los delitos corresponde al Ministerio Público y a las policías bajo su conducción.",
    conversational: "Solo el Ministerio Público (el fiscal) puede investigar delitos. La policía trabaja bajo sus órdenes. Esto significa que la policía no puede 'inventar' cargos contra ti; todo debe pasar por el MP.",
    fullText: "La investigación de los delitos corresponde al Ministerio Público y a las policías, las cuales actuarán bajo la conducción y mando de aquél en el ejercicio de esta función.",
    examples: [
      "Si la policía te detiene, debe llevarte ante el Ministerio Público",
      "El MP decide si hay suficientes pruebas para acusarte",
      "Puedes pedir hablar directamente con el fiscal, no solo con policías"
    ],
    relatedScenarios: ["robo-dinero", "siembra"],
    keywords: ["ministerio público", "investigación", "fiscalía", "policía"]
  },
  {
    id: 8,
    number: 22,
    title: "Prohibición de Penas Inusitadas",
    category: "garantias",
    icon: "⛔",
    summary: "Quedan prohibidas las penas de muerte, mutilación, azotes, tortura y cualquier pena inusitada.",
    conversational: "Nadie puede torturarte, golpearte o tratarte de forma cruel. Punto. Si alguien lo hace, está cometiendo un delito grave. Tienes derecho a ser tratado con dignidad, siempre.",
    fullText: "Quedan prohibidas las penas de muerte, de mutilación, de infamia, la marca, los azotes, los palos, el tormento de cualquier especie, la multa excesiva, la confiscación de bienes y cualesquiera otras penas inusitadas y trascendentales.",
    examples: [
      "Si te golpean durante un arresto, es tortura y puedes denunciarlo",
      "No pueden amenazarte con hacerte daño para que confieses",
      "Tienes derecho a atención médica si te lastiman"
    ],
    relatedScenarios: ["robo-dinero", "siembra"],
    keywords: ["tortura", "trato cruel", "dignidad", "prohibición"]
  },
  {
    id: 9,
    number: 6,
    title: "Libertad de Expresión",
    category: "libertades",
    icon: "💬",
    summary: "La manifestación de las ideas no será objeto de ninguna inquisición judicial o administrativa.",
    conversational: "Puedes decir lo que piensas. Puedes criticar al gobierno, expresar tus opiniones y compartir ideas. Nadie puede castigarte por lo que dices o piensas, siempre que no ataques los derechos de otros.",
    fullText: "La manifestación de las ideas no será objeto de ninguna inquisición judicial o administrativa, sino en el caso de que ataque a la moral, la vida privada o los derechos de terceros, provoque algún delito, o perturbe el orden público.",
    examples: [
      "Puedes protestar pacíficamente contra decisiones del gobierno",
      "Puedes publicar tus opiniones en redes sociales",
      "Puedes criticar a políticos sin miedo a represalias"
    ],
    relatedScenarios: [],
    keywords: ["libertad de expresión", "opinión", "crítica", "manifestación"]
  },
  {
    id: 10,
    number: 7,
    title: "Libertad de Prensa",
    category: "libertades",
    icon: "📰",
    summary: "Es inviolable la libertad de difundir opiniones, información e ideas a través de cualquier medio.",
    conversational: "Los medios de comunicación pueden publicar noticias e información libremente. No hay censura previa. Esto protege tu derecho a estar informado y a informar a otros.",
    fullText: "Es inviolable la libertad de difundir opiniones, información e ideas, a través de cualquier medio. No se puede restringir este derecho por vías o medios indirectos.",
    examples: [
      "Los periodistas pueden investigar y publicar sin censura",
      "Puedes compartir noticias en redes sociales",
      "El gobierno no puede cerrar medios por publicar críticas"
    ],
    relatedScenarios: [],
    keywords: ["libertad de prensa", "medios", "información", "censura"]
  },
  {
    id: 11,
    number: 8,
    title: "Derecho de Petición",
    category: "derechos",
    icon: "✉️",
    summary: "Los funcionarios públicos tienen obligación de responder por escrito las peticiones que se les formulen.",
    conversational: "Si le escribes al gobierno pidiendo algo o preguntando algo, TIENEN que responderte por escrito. No pueden ignorarte. Es tu derecho recibir una respuesta clara.",
    fullText: "Los funcionarios y empleados públicos respetarán el ejercicio del derecho de petición, siempre que ésta se formule por escrito, de manera pacífica y respetuosa.",
    examples: [
      "Puedes pedir información a cualquier oficina de gobierno",
      "Si solicitas un servicio público, deben responderte",
      "Puedes pedir explicaciones sobre decisiones que te afectan"
    ],
    relatedScenarios: [],
    keywords: ["petición", "respuesta", "gobierno", "solicitud"]
  },
  {
    id: 12,
    number: 9,
    title: "Libertad de Asociación",
    category: "libertades",
    icon: "🤝",
    summary: "No se puede coartar el derecho de asociarse o reunirse pacíficamente con cualquier objeto lícito.",
    conversational: "Puedes formar grupos, asociaciones, clubes o reunirte con quien quieras para cualquier propósito legal. Nadie puede impedirte organizarte con otras personas.",
    fullText: "No se podrá coartar el derecho de asociarse o reunirse pacíficamente con cualquier objeto lícito; pero solamente los ciudadanos de la República podrán hacerlo para tomar parte en los asuntos políticos del país.",
    examples: [
      "Puedes formar un sindicato en tu trabajo",
      "Puedes crear una asociación civil para ayudar a tu comunidad",
      "Puedes reunirte con amigos para organizar eventos"
    ],
    relatedScenarios: [],
    keywords: ["asociación", "reunión", "organización", "sindicato"]
  },
  {
    id: 13,
    number: 4,
    title: "Igualdad de Género",
    category: "derechos",
    icon: "⚖️",
    summary: "El varón y la mujer son iguales ante la ley. Toda persona tiene derecho a decidir sobre su cuerpo.",
    conversational: "Hombres y mujeres tienen exactamente los mismos derechos. Nadie puede discriminarte por tu género. Además, tú decides sobre tu propio cuerpo y tu vida reproductiva.",
    fullText: "El varón y la mujer son iguales ante la ley. Ésta protegerá la organización y el desarrollo de la familia. Toda persona tiene derecho a decidir de manera libre, responsable e informada sobre el número y el espaciamiento de sus hijos.",
    examples: [
      "Hombres y mujeres deben recibir el mismo salario por el mismo trabajo",
      "Tú decides si quieres tener hijos y cuántos",
      "No pueden despedirte por estar embarazada"
    ],
    relatedScenarios: [],
    keywords: ["igualdad", "género", "derechos reproductivos", "familia"]
  },
  {
    id: 14,
    number: 3,
    title: "Derecho a la Educación",
    category: "derechos",
    icon: "📚",
    summary: "Toda persona tiene derecho a la educación. El Estado garantizará educación gratuita, laica y obligatoria.",
    conversational: "Tienes derecho a ir a la escuela. La educación básica (preescolar, primaria y secundaria) es gratis y obligatoria. El gobierno debe garantizar que todos puedan estudiar.",
    fullText: "Toda persona tiene derecho a la educación. El Estado -Federación, Estados, Ciudad de México y Municipios- impartirá y garantizará la educación inicial, preescolar, primaria, secundaria, media superior y superior.",
    examples: [
      "No pueden cobrarte por la educación pública básica",
      "Tienes derecho a estudiar sin importar tu situación económica",
      "La educación debe ser de calidad y sin discriminación"
    ],
    relatedScenarios: [],
    keywords: ["educación", "escuela", "gratuita", "obligatoria"]
  },
  {
    id: 15,
    number: 123,
    title: "Derechos Laborales",
    category: "derechos",
    icon: "👷",
    summary: "Toda persona tiene derecho al trabajo digno y socialmente útil con condiciones justas.",
    conversational: "Tienes derecho a un trabajo con salario justo, jornada de 8 horas, descansos, vacaciones y seguridad social. Tu patrón no puede abusar de ti.",
    fullText: "Toda persona tiene derecho al trabajo digno y socialmente útil; al efecto, se promoverán la creación de empleos y la organización social de trabajo, conforme a la ley.",
    examples: [
      "No pueden hacerte trabajar más de 8 horas sin pagarte extra",
      "Tienes derecho a vacaciones pagadas",
      "Deben darte seguro social (IMSS)",
      "No pueden despedirte sin justificación"
    ],
    relatedScenarios: [],
    keywords: ["trabajo", "salario", "jornada laboral", "derechos laborales", "IMSS"]
  }
];

export const categories = {
  derechos: {
    name: "Derechos Fundamentales",
    description: "Tus derechos básicos como persona",
    icon: "👥",
    color: "from-blue-500 to-cyan-500"
  },
  libertades: {
    name: "Libertades",
    description: "Libertades de expresión, movimiento y asociación",
    icon: "🕊️",
    color: "from-green-500 to-emerald-500"
  },
  garantias: {
    name: "Garantías Legales",
    description: "Protecciones en procesos legales",
    icon: "⚖️",
    color: "from-purple-500 to-indigo-500"
  },
  procedimientos: {
    name: "Procedimientos",
    description: "Cómo funcionan los procesos legales",
    icon: "📋",
    color: "from-orange-500 to-red-500"
  }
};

export const frequentQuestions = [
  {
    id: 1,
    question: "¿Qué hago si me detienen?",
    answer: "Tienes derecho a guardar silencio y pedir un abogado. No declares sin abogado presente. La policía debe explicarte de qué te acusan y llevarte ante el Ministerio Público en máximo 48 horas.",
    relatedArticles: [6, 5, 4],
    icon: "🚔"
  },
  {
    id: 2,
    question: "¿Pueden revisar mi celular?",
    answer: "NO. Tu celular es privado. Solo pueden revisarlo con tu permiso o con una orden judicial. Si te obligan a desbloquearlo, están violando tu derecho a la privacidad (Artículo 16).",
    relatedArticles: [4],
    icon: "📱"
  },
  {
    id: 3,
    question: "¿Puedo negarme a declarar?",
    answer: "SÍ. Tienes derecho constitucional a guardar silencio. No estás obligado a declarar contra ti mismo. Simplemente di: 'Ejerceré mi derecho a guardar silencio hasta hablar con mi abogado'.",
    relatedArticles: [6],
    icon: "🤐"
  },
  {
    id: 4,
    question: "¿Qué es la presunción de inocencia?",
    answer: "Significa que eres INOCENTE hasta que un juez diga lo contrario. Aunque te arresten, sigues siendo inocente. El gobierno debe PROBAR tu culpabilidad, tú no tienes que probar tu inocencia.",
    relatedArticles: [6],
    icon: "⚖️"
  },
  {
    id: 5,
    question: "¿Pueden entrar a mi casa sin permiso?",
    answer: "NO. Tu casa es inviolable. Solo pueden entrar con tu permiso, con una orden de cateo firmada por un juez, o en caso de emergencia (incendio, grito de auxilio). Si entran sin orden, es ilegal.",
    relatedArticles: [4],
    icon: "🏠"
  },
  {
    id: 6,
    question: "¿Cuánto tiempo pueden detenerme?",
    answer: "Máximo 72 horas (3 días) sin presentarte ante un juez. Si pasa ese tiempo sin que te presenten ante un juez con cargos formales, deben liberarte. Es tu derecho.",
    relatedArticles: [5],
    icon: "⏰"
  }
];

export const practicalTips = [
  {
    id: 1,
    title: "Frase Clave en Detenciones",
    content: "Memoriza esto: 'Ejerceré mi derecho a guardar silencio. Quiero hablar con un abogado.' No digas nada más hasta que llegue tu abogado.",
    icon: "💬",
    color: "from-red-500 to-pink-500"
  },
  {
    id: 2,
    title: "Documenta Todo",
    content: "Si puedes, graba o toma fotos. Anota nombres, números de placa, hora exacta. Pide a testigos sus datos. La evidencia es tu mejor defensa.",
    icon: "📸",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "Contacto de Emergencia",
    content: "Siempre ten un contacto de confianza que sepa dónde estás. Si te detienen, tienes derecho a una llamada telefónica. Úsala sabiamente.",
    icon: "📞",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    title: "Conoce tus Derechos",
    content: "La ignorancia no te protege, pero el conocimiento sí. Lee estos artículos, compártelos con tu familia. El conocimiento es poder.",
    icon: "📚",
    color: "from-purple-500 to-indigo-500"
  }
];
