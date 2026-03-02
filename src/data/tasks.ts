export interface TaskData {
  id: number;
  childId: string;
  title: string;
  dayIndex: number;
  completed: boolean;
  description: string;
  steps: string[];
  animationType: string;
  instructions?: string;
  tips?: string;
  keyInfo?: string;
}

export const INITIAL_TASKS: TaskData[] = [
  // Valentina (PCI) - Lunes (0)
  { 
    id: 1, childId: 'valentina', title: 'Movilizaciones', dayIndex: 0, completed: false,
    description: 'Ejercicios suaves para mantener la movilidad de brazos y piernas, evitando deformidades.',
    steps: ['Mano: Mover la muñeca hacia arriba y abajo.', 'Brazos: Acostada boca arriba, llevar el brazo hacia afuera.', 'Piernas: Doblar sus piernas hacia arriba.'],
    animationType: 'stretching',
    instructions: 'Realiza cada movimiento de forma lenta y progresiva, sin forzar la articulación más allá de su límite natural.',
    tips: 'Acompaña los movimientos con música suave o cantándole para que asocie el momento con algo positivo.',
    keyInfo: 'Las movilizaciones diarias previenen contracturas musculares y mejoran la circulación sanguínea.'
  },
  { 
    id: 2, childId: 'valentina', title: 'Estimulación Visual', dayIndex: 0, completed: false,
    description: 'Actividades para despertar su sentido visual y atención.',
    steps: ['Hacer caras graciosas frente a ella.', 'Hacer burbujas de jabón para que las siga con la mirada.'],
    animationType: 'sensory',
    instructions: 'Colócate a una distancia de 30-40 cm de su rostro para asegurar que pueda enfocar correctamente.',
    tips: 'Usa objetos con colores contrastantes (blanco/negro o colores primarios brillantes) para captar mejor su atención.',
    keyInfo: 'El seguimiento visual es fundamental para el desarrollo cognitivo y la interacción con el entorno.'
  },
  // Valentina (PCI) - Martes (1)
  { 
    id: 3, childId: 'valentina', title: 'Reloj Postural', dayIndex: 1, completed: false,
    description: 'Cambios de posición para prevenir úlceras por presión y mejorar su comodidad.',
    steps: ['Cambiar de postura cada 2 horas.', 'Boca arriba: Colocar hombros hacia adelante.', 'De lado: Mantener brazos hacia adelante.'],
    animationType: 'posture',
    instructions: 'Utiliza cojines o almohadas para dar soporte en las zonas de presión (rodillas, tobillos, espalda baja).',
    tips: 'Aprovecha el cambio de postura para darle un ligero masaje en las zonas que estuvieron apoyadas.',
    keyInfo: 'Mantener una misma postura por más de 2 horas aumenta significativamente el riesgo de lesiones en la piel.'
  },
  { 
    id: 4, childId: 'valentina', title: 'Estimulación Auditiva', dayIndex: 1, completed: false,
    description: 'Actividades para despertar su sentido auditivo.',
    steps: ['Crear ritmos con las palmas o golpeando una mesa.', 'Poner música y observar sus reacciones.', 'Usar un juguete con sonido para que lo busque.'],
    animationType: 'sensory',
    instructions: 'Presenta los sonidos desde diferentes ángulos (derecha, izquierda, atrás) para estimular la localización auditiva.',
    tips: 'Observa sus respuestas sutiles: cambios en la respiración, parpadeo o movimiento de los ojos.',
    keyInfo: 'La estimulación auditiva ayuda a procesar la información del entorno y fomenta la alerta.'
  },
  // Valentina (PCI) - Miércoles (2)
  { 
    id: 5, childId: 'valentina', title: 'Comunicación', dayIndex: 2, completed: false,
    description: 'Uso del comunicador visual para expresar emociones.',
    steps: ['Colocar su comunicador visual frente a ella.', 'Preguntarle: ¿Cómo te sientes hoy?', 'Darle tiempo para que responda mirando la imagen.'],
    animationType: 'emotions',
    instructions: 'Asegúrate de que la pantalla esté a la altura y distancia correcta para que el rastreador ocular funcione bien.',
    tips: 'Dale al menos 15-20 segundos para responder. El procesamiento motor puede tomar más tiempo.',
    keyInfo: 'La comunicación alternativa y aumentativa (CAA) es su voz. Validar sus elecciones fortalece su autonomía.'
  },
  { 
    id: 6, childId: 'valentina', title: 'Estimulación Táctil', dayIndex: 2, completed: false,
    description: 'Actividades para despertar su sentido del tacto.',
    steps: ['Tocar suavemente diferentes partes de su cuerpo frente a un espejo.', 'Acercar sus manos a texturas suaves y rugosas (como una esponja o tela).', 'Dar pequeños masajes relajantes.'],
    animationType: 'sensory',
    instructions: 'Introduce las texturas de forma gradual, comenzando por las más suaves y avanzando a las más rugosas.',
    tips: 'Nombra la parte del cuerpo que estás tocando para reforzar el esquema corporal.',
    keyInfo: 'La integración táctil ayuda a disminuir la hipersensibilidad y mejora la propiocepción.'
  },
  // Valentina (PCI) - Jueves (3)
  { 
    id: 7, childId: 'valentina', title: 'Movilizaciones', dayIndex: 3, completed: false,
    description: 'Ejercicios suaves para mantener la movilidad.',
    steps: ['Mano: Abrir y cerrar la mano.', 'Brazos: Sentada, llevar brazos hacia afuera y adentro.', 'Piernas: Mover el pie hacia arriba y abajo.'],
    animationType: 'stretching',
    instructions: 'Si notas resistencia muscular (espasticidad), no fuerces. Mantén una presión suave y constante hasta que el músculo ceda.',
    tips: 'Realiza los ejercicios en un ambiente cálido, ya que el frío aumenta la rigidez muscular.',
    keyInfo: 'La constancia es clave. Es mejor hacer sesiones cortas diarias que sesiones largas esporádicas.'
  },
  { 
    id: 8, childId: 'valentina', title: 'Estimulación Olfativa', dayIndex: 3, completed: false,
    description: 'Actividades para el olfato y la respiración.',
    steps: ['Dar masajes suaves en su pecho.', 'Acercar aromas suaves y agradables para que los huela.', 'Colocar sus manos en tu pecho para que sienta cómo respiras.'],
    animationType: 'sensory',
    instructions: 'Acerca los olores a unos 10 cm de su nariz por breves segundos. Evita olores irritantes como perfumes fuertes o químicos.',
    tips: 'Usa olores familiares (vainilla, canela, café) y observa si hace gestos de agrado o desagrado.',
    keyInfo: 'El olfato está directamente conectado con el sistema límbico, regulando emociones y memoria.'
  },
  // Valentina (PCI) - Viernes (4)
  { 
    id: 9, childId: 'valentina', title: 'Reloj Postural', dayIndex: 4, completed: false,
    description: 'Cambios de posición para prevenir úlceras por presión.',
    steps: ['Cambiarla de posición cada 2 horas.', 'Al sentarla: Asegurar que su espalda esté recta y su cabeza apoyada.'],
    animationType: 'posture',
    instructions: 'Verifica que el cinturón pélvico de la silla esté bien ajustado para evitar que se deslice hacia adelante.',
    tips: 'Usa un espejo frente a ella para que pueda ver su propia postura y ayudar a corregirla si es posible.',
    keyInfo: 'Una buena alineación postural facilita la respiración, la digestión y la interacción social.'
  },
  { 
    id: 10, childId: 'valentina', title: 'Estimulación Gustativa', dayIndex: 4, completed: false,
    description: 'Actividades para despertar su sentido del gusto.',
    steps: ['Darle a probar alimentos en puré o líquidos espesos.', 'Poner un poquito de un sabor dulce en sus labios.', 'Hacer que pruebe algo un poco frío y luego algo a temperatura ambiente.'],
    animationType: 'sensory',
    instructions: 'Aplica pequeñas cantidades de sabor en los labios o encías usando un hisopo o cuchara pequeña.',
    tips: 'Asegúrate de que esté en una postura erguida (mínimo 45 grados) para evitar atragantamientos.',
    keyInfo: 'La estimulación gustativa prepara la musculatura oral para la deglución y reduce la sensibilidad oral.'
  },
  
  // Jorge (TDAH) - Lunes (0)
  { 
    id: 11, childId: 'jorge', title: 'Técnica Stop', dayIndex: 0, completed: false,
    description: 'Estrategia para reducir la impulsividad y mejorar la planificación de acciones.',
    steps: ['Paso 1: Pedirle que se detenga antes de hacer algo.', 'Paso 2: Ayudarle a observar lo que está pasando.', 'Paso 3: Pensar juntos en una buena solución.', 'Paso 4: Animarle a actuar con calma.'],
    animationType: 'stop',
    instructions: 'Practica esta técnica primero en situaciones de juego o de baja tensión para que la interiorice.',
    tips: 'Usa una señal visual (como levantar la mano como un policía) para recordarle hacer "STOP" cuando lo veas acelerado.',
    keyInfo: 'El lóbulo frontal en el TDAH madura más lento; esta técnica actúa como un "freno externo" temporal.'
  },
  // Jorge (TDAH) - Martes (1)
  { 
    id: 12, childId: 'jorge', title: 'Relajación Tortuga', dayIndex: 1, completed: false,
    description: 'Técnica de autocontrol emocional para momentos de frustración o enojo.',
    steps: ['Pedirle que imagine que es una tortuguita.', 'Decirle que se abrace a sí mismo como si entrara en su caparazón.', 'Acompañarlo a respirar profundo y lento.', 'Indicarle que salga de su caparazón cuando se sienta más tranquilo.'],
    animationType: 'turtle',
    instructions: 'Enséñale a cruzar los brazos sobre el pecho y bajar la cabeza ("meterse al caparazón") mientras respira.',
    tips: 'Valida su emoción antes de pedirle que use la técnica: "Veo que estás muy enojado, vamos a hacer la tortuga".',
    keyInfo: 'El aislamiento sensorial breve ayuda a reducir la sobrecarga del sistema nervioso.'
  },
  // Jorge (TDAH) - Miércoles (2)
  { 
    id: 13, childId: 'jorge', title: 'Comunicación', dayIndex: 2, completed: false,
    description: 'Aprender a identificar emociones y comunicarlas asertivamente.',
    steps: ['Ayudarle a nombrar la emoción que siente (enojo, tristeza, alegría).', 'Preguntarle qué pasó para que se sienta así.', 'Escucharlo sin juzgar sus sentimientos.', 'Animarlo a hablar de forma calmada y respirando.'],
    animationType: 'emotions',
    instructions: 'Usa un "termómetro de emociones" visual para que le sea más fácil señalar cómo se siente.',
    tips: 'Sé un modelo a seguir: verbaliza tus propias emociones frente a él ("Me siento frustrado porque...").',
    keyInfo: 'Los niños con TDAH a menudo sienten las emociones con mayor intensidad (desregulación emocional).'
  },
  // Jorge (TDAH) - Jueves (3)
  { 
    id: 14, childId: 'jorge', title: 'Repaso de Normas', dayIndex: 3, completed: false,
    description: 'Recordar las reglas del hogar y del colegio.',
    steps: ['Repasar juntos las reglas de la casa.', 'Explicarle de forma sencilla por qué es importante cumplirlas.', 'Recordarle las recompensas positivas por portarse bien.'],
    animationType: 'rules',
    instructions: 'Las normas deben ser pocas (máximo 5), claras, formuladas en positivo ("Hablar bajo" en vez de "No gritar").',
    tips: 'Revisa las normas diariamente en un momento tranquilo, no cuando se acabe de romper una regla.',
    keyInfo: 'La memoria de trabajo suele estar afectada en el TDAH; necesitan recordatorios visuales y constantes.'
  },
  // Jorge (TDAH) - Viernes (4)
  { 
    id: 15, childId: 'jorge', title: 'Juego de Memoria', dayIndex: 4, completed: false,
    description: 'Actividad para mejorar la atención y flexibilidad cognitiva.',
    steps: ['Poner todas las cartas boca abajo en la mesa.', 'Cada uno voltea dos cartas en su turno.', 'Intentar recordar dónde están las parejas iguales.', 'Celebrar con entusiasmo cada vez que encuentre una pareja.'],
    animationType: 'brain',
    instructions: 'Comienza con pocas parejas (ej. 4 o 5) y aumenta la dificultad progresivamente para evitar la frustración.',
    tips: 'Si pierde el interés rápido, cambia el juego por uno de movimiento que también requiera atención (ej. "Simón dice").',
    keyInfo: 'El juego es la forma natural en que el cerebro infantil desarrolla las funciones ejecutivas.'
  },
];
