export interface Intent {
  id: string;
  keywords: string[];
  responses: string[];
}

export interface AIResponse {
  text: string;
  suggestion?: string;
}

// Función auxiliar para normalizar texto (quitar acentos, puntuación y pasar a minúsculas)
const normalize = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,!?¿¡]/g, " ")
    .trim();
};

// Base de conocimiento masiva simulando información de internet (Terapias, Psicología, Crianza Respetuosa)
const intents: Intent[] = [
  // --- SALUDOS Y CORTESÍA ---
  {
    id: 'saludo',
    keywords: ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos', 'que tal', 'hey', 'holis'],
    responses: [
      "¡Hola! Qué gusto saludarte. Estoy aquí para escucharte y apoyarte con cualquier desafío que estés enfrentando hoy con tus pequeños o contigo misma/o. ¿De qué te gustaría hablar?",
      "¡Hola! Bienvenido/a a tu espacio seguro. Como tu asistente especializado en neurodesarrollo, estoy listo para ayudarte con estrategias para el TDAH, la Parálisis Cerebral, o simplemente para darte apoyo emocional. ¿Cómo ha estado tu día?",
      "¡Hola! Aquí estoy. Ya sea que necesites un consejo práctico para hoy, o solo alguien (virtual) que te lea y entienda lo agotador que puede ser, dime, ¿qué tienes en mente?"
    ]
  },
  {
    id: 'agradecimiento',
    keywords: ['gracias', 'agradezco', 'genial', 'perfecto', 'me sirve', 'muy util', 'excelente', 'mil gracias', 'muchas gracias'],
    responses: [
      "¡De nada! Recuerda que estás haciendo un trabajo increíble. Criar a dos niños con necesidades diferentes es un reto enorme, y el solo hecho de buscar herramientas demuestra el gran amor que les tienes.",
      "¡Con mucho gusto! Estoy aquí siempre que necesites rebotar ideas, buscar estrategias o simplemente desahogarte. ¡Mucho ánimo!",
      "Me alegra mucho poder ser de ayuda. No dudes en escribirme cuando surja cualquier otra duda o situación difícil. ¡Un abrazo virtual!"
    ]
  },

  // --- TDAH: COMPORTAMIENTO Y RUTINAS ---
  {
    id: 'tdah_general',
    keywords: ['tdah', 'hiperactivo', 'hiperactividad', 'inquieto', 'no para', 'energia', 'motorcito', 'mueve mucho', 'salta', 'corre', 'trepa'],
    responses: [
      "El TDAH hiperactivo significa que su cerebro busca constantemente estimulación para regularse. No es que 'no quiera' quedarse quieto, es que neurológicamente le cuesta mucho.\n\nEstrategias rápidas:\n• Crea 'estaciones de movimiento' en casa (un mini trampolín, cojines para saltar).\n• Dale tareas que impliquen esfuerzo físico pesado (llevar la ropa, mover sillas, cargar botellas de agua).\n• Evita decirle 'quédate quieto'; mejor dile 'puedes mover tus manos con este juguete mientras me escuchas'.",
      "Con la hiperactividad, la clave es canalizar la energía, no reprimirla. Su cerebro funciona como un motor de Ferrari con frenos de bicicleta.\n\nIntenta:\n• Intercalar 15 minutos de actividad concentrada con 5 minutos de actividad física intensa.\n• Usar asientos dinámicos (pelotas de pilates o cojines de equilibrio) para cuando deba sentarse a comer o estudiar.\n• Asegurar una rutina de descarga de energía (parque, correr, saltar) antes de momentos que requieran calma."
    ]
  },
  {
    id: 'tdah_desobediencia',
    keywords: ['no hace caso', 'desobedece', 'ignora', 'no escucha', 'rebelde', 'limites', 'castigo', 'regaño', 'no me obedece', 'hace lo que quiere'],
    responses: [
      "Cuando un niño con TDAH 'no hace caso', a menudo no es rebeldía, sino un problema de procesamiento auditivo o memoria de trabajo (se le olvidó lo que le dijiste en 3 segundos).\n\n• Asegura contacto visual antes de dar una instrucción. Tócale el hombro suavemente.\n• Da instrucciones de UNA en UNA. En lugar de 'recoge tu cuarto, lávate los dientes y ven a cenar', di solo 'recoge los juguetes' y espera a que termine.\n• Haz que repita la instrucción: '¿Qué te acabo de pedir que hagas?'.",
      "Los castigos tradicionales rara vez funcionan con el TDAH porque su cerebro no conecta bien la causa a largo plazo con el efecto.\n\n• Usa consecuencias naturales e inmediatas.\n• Implementa un sistema de economía de fichas (puntos por tareas logradas que se canjean por privilegios).\n• Cambia el 'NO corras' por 'Camina despacio'. El cerebro con TDAH procesa mejor las instrucciones en positivo."
    ]
  },
  {
    id: 'tdah_escuela',
    keywords: ['escuela', 'colegio', 'tareas', 'deberes', 'estudiar', 'concentra', 'atencion', 'distrae', 'aprender', 'calificaciones', 'maestra', 'profesora'],
    responses: [
      "Para las tareas escolares con TDAH, el entorno y la estructura lo son todo:\n\n1. Divide y vencerás: No le pongas toda la tarea enfrente. Dale una hoja a la vez. Oculta el resto.\n2. Usa la técnica Pomodoro adaptada: Trabaja 10-15 minutos y descansa 3-5 minutos.\n3. Permite el movimiento: Puede estudiar de pie, caminando o apretando una pelota antiestrés.\n4. Refuerzo inmediato: Celebra cada pequeño avance, no esperes hasta el final para felicitarlo.",
      "La concentración en niños con TDAH es intermitente. Para ayudarle con los deberes:\n\n• Elimina distracciones visuales y auditivas del área de estudio (nada de juguetes a la vista, usa ruido blanco si ayuda).\n• Usa códigos de colores para organizar sus materias y cuadernos.\n• Si se frustra y llora, hagan una 'pausa cerebral' (brain break): cruzar la línea media del cuerpo, tomar agua, o hacer 10 saltos.\n• Habla con sus maestros para asegurar que tenga adaptaciones, como sentarse cerca del pizarrón y lejos de las ventanas."
    ]
  },
  {
    id: 'tdah_impulsividad',
    keywords: ['impulsivo', 'interrumpe', 'no espera', 'pega', 'arrebatado', 'turno', 'habla mucho', 'no se calla', 'impaciencia'],
    responses: [
      "La impulsividad es la falta de 'frenos mentales' antes de actuar. Para trabajarla:\n\n• Enséñale la técnica del 'Semáforo': Rojo (paro), Amarillo (pienso), Verde (actúo). Practíquenlo jugando.\n• Usa objetos tangibles para los turnos de habla (ej. 'solo habla quien tiene el bastón de la palabra').\n• Anticipa las situaciones: Antes de entrar a un lugar, recuérdale las 2 reglas principales de forma positiva (ej. 'caminamos despacio y usamos voz baja').",
      "Manejar la impulsividad requiere mucha repetición y paciencia.\n\n• Cuando interrumpa, en lugar de regañarlo, usa un gesto visual (como levantar un dedo o tocarte la nariz) para indicarle que debe esperar.\n• Jueguen a juegos de control inhibitorio: 'Simón dice', 'Estatuas', 'Luz roja, luz verde', o juegos de mesa que requieran esperar turnos.\n• Elogia exageradamente cuando logre contenerse: '¡Me encantó cómo esperaste tu turno para hablar!'"
    ]
  },
  {
    id: 'tdah_sueno',
    keywords: ['no duerme', 'insomnio', 'despierta', 'dormir', 'noche', 'madrugada', 'cuesta dormir', 'pesadillas', 'rutina de sueño'],
    responses: [
      "Los problemas de sueño son extremadamente comunes en el TDAH. Su cerebro tiene problemas para 'apagar' los pensamientos.\n\n• Establece una rutina de 'desaceleración' 2 horas antes de dormir: cero pantallas (la luz azul inhibe la melatonina).\n• Usa actividades de propiocepción pesada antes de la cama: un masaje firme, abrazos de oso, o una manta con peso (si el terapeuta lo aprueba).\n• Mantén la habitación fresca y oscura. El ruido blanco continuo puede ayudar a bloquear distracciones auditivas.",
      "Para ayudarle a conciliar el sueño:\n\n• Evita el azúcar y el chocolate después de las 4 PM.\n• Crea un 'ritual de cierre del día': leer un cuento, hablar de lo mejor del día, hacer respiraciones profundas juntos.\n• Si se levanta de la cama, regrésalo con calma, sin encender luces y con la menor interacción verbal posible. Sé constante y aburrida/o en la noche."
    ]
  },

  // --- PARÁLISIS CEREBRAL (PC) ---
  {
    id: 'pc_general',
    keywords: ['paralisis', 'cerebral', 'pc', 'motriz', 'motor', 'fisico', 'fisica', 'cuerpo', 'movilidad', 'espasticidad', 'rigidez'],
    responses: [
      "Con la Parálisis Cerebral, el enfoque principal debe ser siempre potenciar sus capacidades y fomentar su autoestima.\n\n• Adapta el entorno para que sea lo más accesible posible para ella.\n• Háblale siempre sobre lo que SÍ puede hacer, enfocándote en sus fortalezas.\n• Integra sus terapias físicas en el juego diario para que no se sientan como una obligación médica, sino como un momento de conexión y diversión contigo.",
      "Acompañar a una niña con PC implica ser su mayor porrista y facilitadora.\n\n• Asegúrate de que tenga formas de comunicarse y expresarse, independientemente de sus retos motores (usa tableros de comunicación si es necesario).\n• Fomenta su participación en las decisiones de la casa (qué ropa usar, qué comer) para darle sentido de control sobre su vida.\n• Mantén una comunicación estrecha con sus terapeutas para alinear los objetivos de casa con los de la clínica."
    ]
  },
  {
    id: 'pc_autonomia',
    keywords: ['autonomia', 'independencia', 'solo', 'sola', 'vestirse', 'comer', 'ayuda', 'depende', 'hacerlo sola', 'motricidad fina'],
    responses: [
      "Fomentar la autonomía en la PC es vital para su desarrollo psicológico y su sentido de valía.\n\n• Usa ropa fácil de poner (velcro en lugar de cordones, pantalones con elástico, camisetas holgadas).\n• Adapta los utensilios (cubiertos con mangos gruesos, platos con bordes altos o ventosas, vasos con asas).\n• Dale tiempo extra. A veces, por la prisa, hacemos las cosas por ellos. Permítele intentarlo, aunque tarde el triple de tiempo. Ese esfuerzo construye su independencia.",
      "La independencia no significa hacer todo sin ayuda, significa tener el control de cómo se hacen las cosas.\n\n• Si físicamente no puede hacer algo, permítele dirigir la acción: '¿Por dónde empezamos a vestirte, por el brazo derecho o el izquierdo?'.\n• Celebra el esfuerzo, no la perfección. Si logró llevarse la cuchara a la boca aunque se haya manchado, es un gran logro.\n• Promueve la 'independencia interdependiente': enseñarle que pedir ayuda también es una habilidad valiosa y no una debilidad."
    ]
  },
  {
    id: 'pc_alimentacion',
    keywords: ['no come', 'comer', 'alimentacion', 'ahoga', 'mastica', 'babea', 'texturas', 'comida', 'rechaza comida'],
    responses: [
      "La alimentación puede ser un reto en la PC debido a la hipotonía o espasticidad oral.\n\n• Asegura una postura correcta: caderas, rodillas y tobillos a 90 grados. Una buena base de soporte en los pies mejora el control de la boca.\n• Si tiene problemas con texturas, introduce cambios gradualmente. Jugar con la comida (tocarla, olerla) sin la presión de comerla ayuda a desensibilizar.\n• Consulta con un terapeuta ocupacional o fonoaudiólogo sobre ejercicios oro-faciales para fortalecer la masticación y deglución.",
      "Para hacer la hora de comer menos estresante:\n\n• Evita distracciones (apaga la TV) para que se concentre en el proceso de masticar y tragar.\n• Usa utensilios adaptados (cucharas recubiertas de silicona si hay reflejo de mordida fuerte).\n• Si se cansa rápido al comer, ofrécele comidas más pequeñas y frecuentes a lo largo del día en lugar de 3 comidas grandes.\n• Nunca fuerces la comida; asocia el momento de comer con un ambiente relajado y positivo."
    ]
  },

  // --- DINÁMICA DE HERMANOS ---
  {
    id: 'hermanos_celos',
    keywords: ['celos', 'envidia', 'pelean', 'discuten', 'hermanos', 'atencion', 'injusto', 'se odian', 'rivalidad'],
    responses: [
      "Es muy común que el hermano con TDAH sienta celos de la atención física que requiere su hermana con PC, y que ella sienta frustración por la libertad de movimiento de él.\n\n• Valida sus emociones: 'Entiendo que te sientas enojado porque tuve que ayudar a tu hermana ahora'.\n• Tiempo exclusivo: Agenda 15-20 minutos diarios a solas con CADA UNO. En ese tiempo, ellos eligen la actividad y tú les das atención al 100%.\n• Evita las comparaciones a toda costa. Celebra los logros de cada uno en su propio contexto.",
      "La dinámica entre hermanos con neurodivergencias y discapacidades es compleja. A menudo el hermano sin discapacidad física asume el rol de 'niño de cristal' (sintiendo que debe ser perfecto para no dar más problemas).\n\n• Fomenta el trabajo en equipo donde las habilidades de uno complementen al otro.\n• Habla abiertamente sobre la equidad vs. igualdad. Explícales que 'justo' no significa darles a ambos exactamente lo mismo, sino darle a cada uno lo que necesita.\n• Permite que expresen sus frustraciones sobre la condición del otro sin juzgarlos. Necesitan un espacio seguro para decir 'a veces es difícil tener un hermano así'."
    ]
  },
  {
    id: 'hermanos_juego',
    keywords: ['jugar juntos', 'compartir', 'no comparten', 'juegos', 'actividades juntos', 'integrar'],
    responses: [
      "Para que jueguen juntos sin frustrarse, busca actividades que nivelen el campo de juego:\n\n• Juegos sensoriales: plastilina, arena cinética, pintar con los dedos. Ambos pueden disfrutarlo a su propio nivel motor y de atención.\n• Juegos cooperativos en lugar de competitivos: armar un rompecabezas gigante juntos, construir un fuerte con mantas.\n• Asigna roles que destaquen sus fortalezas: el niño con TDAH puede ser el 'recolector' de piezas (movimiento), y la niña con PC la 'arquitecta' que decide dónde van.",
      "Fomentar el juego compartido requiere tu mediación al principio.\n\n• Establece reglas claras antes de empezar: 'Jugamos suave y compartimos los turnos'.\n• Si el niño con TDAH se vuelve muy brusco, redirige su energía: 'Tu hermana necesita que juegues más despacio. Si tienes mucha energía, ve a dar 3 vueltas a la mesa y regresa'.\n• Elogia específicamente cuando juegan bien: 'Me encanta ver cómo se ayudan mutuamente a construir esa torre'."
    ]
  },

  // --- PADRES: APOYO EMOCIONAL Y BURNOUT ---
  {
    id: 'padres_agotamiento',
    keywords: ['cansada', 'cansado', 'agotada', 'agotado', 'estres', 'estresada', 'llorar', 'no puedo mas', 'deprimida', 'triste', 'sobrepasada', 'burnout', 'harta', 'me rindo', 'desesperada', 'ya no se que hacer'],
    responses: [
      "Te leo y quiero decirte algo muy importante: Es completamente válido que te sientas así. Estás corriendo un maratón diario con obstáculos. El 'burnout' (síndrome del cuidador) es real y no es señal de debilidad.\n\n• No te sientas culpable por querer huir a veces; es una respuesta humana al estrés extremo.\n• Baja tus estándares hoy. Si hoy cenan cereal y la casa está desordenada, está bien. Sobrevivir es suficiente.\n• Busca micro-descansos: 5 minutos encerrada en el baño respirando, un café caliente, escuchar una canción que te guste. Tu sistema nervioso necesita pausas urgentes.",
      "Siento mucho que estés pasando por este nivel de agotamiento. Cuidar de dos niños con necesidades tan específicas requiere una energía sobrehumana.\n\n• Por favor, pide ayuda. A tu pareja, familia, amigos o instituciones. No tienes que (ni puedes) hacerlo todo sola/o.\n• Llorar es una excelente forma de liberar cortisol (la hormona del estrés). Si necesitas llorar, hazlo sin culpa. Es una válvula de escape necesaria.\n• Recuerda la regla del avión: 'Ponte tu máscara de oxígeno primero antes de ayudar a otros'. Si tú te quiebras, todo se detiene. Cuidarte a ti ES cuidar de ellos."
    ]
  },
  {
    id: 'padres_culpa',
    keywords: ['culpa', 'mala madre', 'mal padre', 'hago mal', 'equivoco', 'paciencia', 'grito', 'enojo', 'perdi el control', 'explote', 'les grite', 'me siento mal'],
    responses: [
      "Perder la paciencia no te hace una mala madre/padre, te hace un ser humano que está al límite de su capacidad.\n\n• La culpa es una mochila muy pesada. Suéltala. Hiciste lo mejor que pudiste con los recursos emocionales que tenías en ese momento.\n• Usa la reparación: Acércate a tus hijos cuando estés calmada/o y diles: 'Me equivoqué al gritar, estaba muy frustrada/o, lo siento. Te amo'. Esto les enseña que los adultos también cometen errores y saben pedir perdón.\n• Sé tan compasiva/o contigo misma/o como lo serías con una amiga que está pasando por lo mismo.",
      "La crianza atípica viene acompañada de mucha 'culpa tóxica'. Sentimos que nunca hacemos suficiente, que no avanzan por nuestra culpa, o que los dañamos al enojarnos.\n\n• Cuando sientas que vas a explotar, usa el 'tiempo fuera para padres'. Diles: 'Mamá/Papá necesita 2 minutos para calmarse', y sal de la habitación.\n• Cambia el diálogo interno. En lugar de 'soy un desastre', di 'estoy aprendiendo a manejar una situación extremadamente difícil'.\n• Tus hijos no necesitan padres perfectos, necesitan padres reales que sepan reconectar después de una desconexión."
    ]
  },
  {
    id: 'padres_pareja',
    keywords: ['pareja', 'esposo', 'esposa', 'matrimonio', 'divorcio', 'peleamos', 'discutimos', 'solos', 'intimidad', 'nos alejamos'],
    responses: [
      "La crianza de niños con necesidades especiales pone una presión inmensa sobre la relación de pareja. La tasa de divorcio es alta porque el estrés consume la energía que antes iba a la relación.\n\n• Dejen de ser solo 'co-gerentes médicos y logísticos'. Intenten tener 15 minutos al día donde esté PROHIBIDO hablar de los niños, terapias o dinero.\n• Dividan las tareas de forma explícita para evitar el resentimiento de 'yo hago más que tú'.\n• Recuerden que están en el mismo equipo. Cuando discutan, no es 'Tú vs. Yo', es 'Nosotros vs. El problema'.",
      "Es normal sentir que se han distanciado. El cansancio crónico mata la intimidad y la paciencia.\n\n• Busquen momentos de micro-conexión: un abrazo de 20 segundos (libera oxitocina), un mensaje de texto lindo durante el día, o ver un capítulo de una serie juntos.\n• Si es posible, busquen a alguien de confianza que cuide a los niños un par de horas al mes para que puedan salir, aunque sea a tomar un café o caminar.\n• Sean indulgentes el uno con el otro. Ambos están lidiando con el duelo y el estrés a su propia manera."
    ]
  },

  // --- CRISIS Y REGULACIÓN EMOCIONAL ---
  {
    id: 'crisis_berrinche',
    keywords: ['berrinche', 'rabieta', 'crisis', 'llora mucho', 'grita', 'descontrol', 'pataleta', 'se tira', 'golpea', 'meltdown', 'colapso'],
    responses: [
      "Durante una crisis o desregulación emocional severa (meltdown), el cerebro racional del niño se 'apaga'. No es momento de enseñar ni de razonar.\n\n1. Mantén la calma: Tu sistema nervioso regula el suyo. Si tú te alteras, la crisis empeora.\n2. Seguridad primero: Asegúrate de que no se lastime ni lastime a otros. Quita objetos peligrosos.\n3. Menos palabras: Usa frases cortas ('Estoy aquí', 'Estás a salvo'). El procesamiento del lenguaje se bloquea en una crisis.\n4. Acompañamiento: Quédate cerca. Cuando la emoción empiece a bajar, ofrécele un abrazo o contención física si lo tolera.",
      "Las crisis (meltdowns) en niños con TDAH o PC suelen ser por sobrecarga sensorial, frustración acumulada o incapacidad de comunicar algo.\n\n• No lo tomes personal. No te está manipulando, su cerebro está en modo 'lucha o huida'.\n• Reduce estímulos: apaga luces fuertes, baja el volumen de la música o la TV.\n• Valida la emoción, no la conducta: 'Veo que estás furioso porque se rompió el juguete, pero no permitiré que pegues'.\n• Una vez que pase la tormenta (y puede tardar), ayúdale a nombrar lo que sintió y busquen juntos qué lo detonó."
    ]
  },

  // --- SOCIEDAD Y ENTORNO ---
  {
    id: 'sociedad_juicio',
    keywords: ['miran', 'juzgan', 'opinan', 'suegra', 'familia', 'calle', 'critican', 'miradas', 'comentarios', 'gente', 'sociedad'],
    responses: [
      "Lidiar con las miradas y opiniones no solicitadas de la sociedad (e incluso de la familia extendida) es una de las partes más duras.\n\n• Recuerda tu mantra: 'Yo soy la experta/el experto en mis hijos. Nadie conoce nuestra realidad a puerta cerrada'.\n• Ten respuestas preparadas. Si alguien critica el comportamiento de tu hijo con TDAH, puedes decir: 'Su cerebro funciona diferente y estamos trabajando en ello con especialistas. Gracias por tu preocupación'.\n• Protege tu energía. No tienes la obligación de educar a todo el mundo sobre la condición de tus hijos si no tienes ganas.",
      "El juicio externo duele, especialmente cuando viene de familiares que creen saber más.\n\n• Establece límites claros: 'Agradezco tu intención, pero las decisiones médicas y de crianza las tomamos nosotros con sus terapeutas'.\n• Si estás en público y hay una crisis, enfócate 100% en tu hijo. Ignora las miradas. Tu hijo necesita tu conexión, los extraños no importan.\n• Busca tu 'tribu'. Conecta con otros padres de niños neurodivergentes o con discapacidad; ellos entenderán exactamente por lo que pasas sin juzgarte."
    ]
  },

  // --- VAGOS E IMPLÍCITOS ---
  {
    id: 'vago_ayuda',
    keywords: ['ayuda', 'auxilio', 'que hago', 'como le hago', 'dame un consejo', 'necesito ayuda', 'orientacion', 'estrategia', 'estrategias', 'manejar', 'solucion', 'tips', 'recomendacion'],
    responses: [
      "Estoy aquí para ayudarte. Para darte la mejor estrategia, cuéntame un poco más: ¿La situación es con la hiperactividad del niño, con los retos físicos de la niña, o es algo relacionado con cómo te sientes tú en este momento?",
      "Claro que sí, respira profundo, no estás sola/o en esto. ¿Qué es lo que más te está costando trabajo justo ahora? ¿Es un tema de comportamiento, de rutinas, o de cansancio emocional?",
      "Tengo varias estrategias que pueden servirte. ¿Te gustaría que hablemos sobre cómo mejorar las rutinas en casa, cómo manejar las crisis, o prefieres enfocarte en tu propio autocuidado hoy?"
    ]
  }
];

const fallbacks = [
  "Entiendo lo que me comentas. Para poder darte una estrategia más precisa, ¿podrías darme un ejemplo de lo que pasó exactamente?",
  "Te leo atentamente. A veces es difícil encontrar la solución a la primera. ¿Te gustaría que exploremos estrategias de comportamiento, o prefieres hablar de cómo te sientes al respecto?",
  "Comprendo. Como tu asistente, mi objetivo es darte herramientas prácticas. ¿Podrías intentar describirlo con otras palabras o decirme qué es lo que más te preocupa de esta situación?",
  "Es una situación compleja. La crianza atípica requiere mucha creatividad. ¿Qué es lo que ya has intentado y sientes que no te ha funcionado?",
  "Estoy aquí contigo. Si te sientes atascada/o, podemos cambiar de enfoque. ¿Te gustaría ver algunas estrategias generales para el TDAH, la Parálisis Cerebral, o para el estrés de los padres?"
];

export async function generateLocalResponse(
  input: string, 
  history: {role: string, content: string}[],
  focus?: 'niño' | 'niña' | 'padres' | null
): Promise<AIResponse> {
  const normalizedInput = normalize(input);
  const words = normalizedInput.split(/\s+/);

  // 1. Extraer respuestas previas del asistente para evitar redundancia
  const usedResponses = new Set(
    history.filter(m => m.role === 'assistant').map(m => m.content)
  );

  // 2. Construir contexto si la entrada es muy corta (ej. "y como hago eso?", "ayuda", "no se")
  let textToAnalyze = normalizedInput;
  if (words.length <= 4 && history.length >= 2) {
    // Tomar el último mensaje del usuario para dar contexto a esta frase corta
    const lastUserMessage = history.filter(m => m.role === 'user').pop();
    if (lastUserMessage) {
      textToAnalyze = normalize(lastUserMessage.content) + " " + normalizedInput;
    }
  }

  let bestIntent: Intent | null = null;
  let maxScore = 0;

  // 3. Algoritmo de puntuación de intenciones mejorado (Fuzzy matching simulado)
  for (const intent of intents) {
    let score = 0;
    for (const keyword of intent.keywords) {
      const normalizedKeyword = normalize(keyword);
      
      // Si la palabra clave tiene espacios (ej. "no hace caso"), buscamos la frase completa
      if (normalizedKeyword.includes(' ')) {
        if (textToAnalyze.includes(normalizedKeyword)) {
          score += 5; // Frases completas exactas valen mucho más
        }
      } else {
        // Búsqueda de palabras individuales
        if (words.includes(normalizedKeyword)) {
          score += 2;
        } else if (words.some(w => w.includes(normalizedKeyword) || (normalizedKeyword.includes(w) && w.length > 4))) {
          // Coincidencia parcial para palabras largas (ej. hiperactividad -> hiperactivo)
          score += 1;
        }
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestIntent = intent;
    }
  }

  let responseText = "";
  let suggestion: string | undefined = undefined;

  // 4. Selección de respuesta evitando redundancia
  if (bestIntent && maxScore > 0) {
    // Filtrar las respuestas que ya se han usado en el historial
    const availableResponses = bestIntent.responses.filter(r => !usedResponses.has(r));
    
    if (availableResponses.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableResponses.length);
      responseText = availableResponses[randomIndex];
    } else {
      // Si ya usamos todas las respuestas de este intent, usamos una de respaldo o repetimos la menos reciente
      responseText = bestIntent.responses[0]; // Fallback al primero si se agotaron
    }
  } else {
    // Fallback aleatorio evitando redundancia
    const availableFallbacks = fallbacks.filter(f => !usedResponses.has(f));
    if (availableFallbacks.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableFallbacks.length);
      responseText = availableFallbacks[randomIndex];
    } else {
      responseText = fallbacks[0];
    }

    // Generar sugerencia dinámica garantizada para romper bucles
    // En lugar de usar las palabras del usuario (que pueden no estar en la base de datos),
    // ofrecemos preguntas directas que SABEMOS que activarán una intención específica.
    
    const suggestionsByFocus = {
      'niño': [
        "¿Cómo manejo su impulsividad y falta de atención?",
        "¿Qué hago si no quiere hacer las tareas de la escuela?",
        "¿Tienes estrategias para que pueda dormir mejor?",
        "¿Cómo actúo cuando hace un berrinche muy fuerte?"
      ],
      'niña': [
        "¿Cómo puedo fomentar su autonomía para vestirse o comer?",
        "¿Qué hago si rechaza ciertas texturas en la comida?",
        "¿Cómo puedo integrar sus terapias físicas en el juego diario?",
        "¿Cómo manejo los celos entre los hermanos?"
      ],
      'padres': [
        "Me siento con burnout y muy agotada/o, ¿qué hago?",
        "Siento mucha culpa cuando pierdo la paciencia y les grito.",
        "¿Cómo mejoro la relación con mi pareja con tanto estrés?",
        "¿Cómo lidio con las miradas y juicios de la gente en la calle?"
      ],
      'default': [
        "¿Me das estrategias para manejar la hiperactividad?",
        "¿Cómo fomento la independencia de mi hija?",
        "Necesito un consejo para manejar mi propio estrés.",
        "¿Cómo hago para que los hermanos jueguen juntos sin pelear?"
      ]
    };

    const focusKey = focus && suggestionsByFocus[focus] ? focus : 'default';
    const possibleSuggestions = suggestionsByFocus[focusKey];
    
    // Elegir una sugerencia aleatoria del pool correspondiente
    suggestion = possibleSuggestions[Math.floor(Math.random() * possibleSuggestions.length)];
  }

  return { text: responseText, suggestion };
}
