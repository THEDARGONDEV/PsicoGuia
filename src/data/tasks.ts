export interface TaskData {
  id: number;
  childId: string;
  title: string;
  dayIndex: number;
  completed: boolean;
  description: string;
  steps: string[];
  animationType: string;
}

export const INITIAL_TASKS: TaskData[] = [
  // Valentina (PCI) - Lunes (0)
  { 
    id: 1, childId: 'valentina', title: 'Movilizaciones', dayIndex: 0, completed: false,
    description: 'Ejercicios suaves para mantener la movilidad de brazos y piernas, evitando deformidades.',
    steps: ['Mano: Mover la muñeca hacia arriba y abajo.', 'Brazos: Acostada boca arriba, llevar el brazo hacia afuera.', 'Piernas: Doblar sus piernas hacia arriba.'],
    animationType: 'stretching'
  },
  { 
    id: 2, childId: 'valentina', title: 'Estimulación Visual', dayIndex: 0, completed: false,
    description: 'Actividades para despertar su sentido visual y atención.',
    steps: ['Hacer caras graciosas frente a ella.', 'Hacer burbujas de jabón para que las siga con la mirada.'],
    animationType: 'sensory'
  },
  // Valentina (PCI) - Martes (1)
  { 
    id: 3, childId: 'valentina', title: 'Reloj Postural', dayIndex: 1, completed: false,
    description: 'Cambios de posición para prevenir úlceras por presión y mejorar su comodidad.',
    steps: ['Cambiar de postura cada 2 horas.', 'Boca arriba: Colocar hombros hacia adelante.', 'De lado: Mantener brazos hacia adelante.'],
    animationType: 'posture'
  },
  { 
    id: 4, childId: 'valentina', title: 'Estimulación Auditiva', dayIndex: 1, completed: false,
    description: 'Actividades para despertar su sentido auditivo.',
    steps: ['Crear ritmos con las palmas o golpeando una mesa.', 'Poner música y observar sus reacciones.', 'Usar un juguete con sonido para que lo busque.'],
    animationType: 'sensory'
  },
  // Valentina (PCI) - Miércoles (2)
  { 
    id: 5, childId: 'valentina', title: 'Comunicación', dayIndex: 2, completed: false,
    description: 'Uso del comunicador TOBII para expresar emociones.',
    steps: ['Abrir el panel Grid.', 'Preguntar: ¿Cómo te sientes hoy?', 'Esperar su selección con la mirada.'],
    animationType: 'emotions'
  },
  { 
    id: 6, childId: 'valentina', title: 'Estimulación Táctil', dayIndex: 2, completed: false,
    description: 'Actividades para despertar su sentido del tacto.',
    steps: ['Tocar diferentes partes de su cuerpo frente a un espejo.', 'Hacer que toque diversas texturas (lija, esponja).', 'Dar pequeños masajes.'],
    animationType: 'sensory'
  },
  // Valentina (PCI) - Jueves (3)
  { 
    id: 7, childId: 'valentina', title: 'Movilizaciones', dayIndex: 3, completed: false,
    description: 'Ejercicios suaves para mantener la movilidad.',
    steps: ['Mano: Abrir y cerrar la mano.', 'Brazos: Sentada, llevar brazos hacia afuera y adentro.', 'Piernas: Mover el pie hacia arriba y abajo.'],
    animationType: 'stretching'
  },
  { 
    id: 8, childId: 'valentina', title: 'Estimulación Olfativa', dayIndex: 3, completed: false,
    description: 'Actividades para el olfato y la respiración.',
    steps: ['Masajes en la zona torácica.', 'Dar a oler sustancias agradables y no agradables.', 'Poner manos en su tórax para que sienta la respiración.'],
    animationType: 'sensory'
  },
  // Valentina (PCI) - Viernes (4)
  { 
    id: 9, childId: 'valentina', title: 'Reloj Postural', dayIndex: 4, completed: false,
    description: 'Cambios de posición para prevenir úlceras por presión.',
    steps: ['Cambiar de postura cada 2 horas.', 'Silla de ruedas: Cabeza ligeramente hacia atrás, espalda recta.'],
    animationType: 'posture'
  },
  { 
    id: 10, childId: 'valentina', title: 'Estimulación Gustativa', dayIndex: 4, completed: false,
    description: 'Actividades para despertar su sentido del gusto.',
    steps: ['Probar alimentos con diferentes texturas (líquido, puré).', 'Colocar sabores en los labios (dulce de leche).', 'Contraste de alimentos (dulce-salado, frío-caliente).'],
    animationType: 'sensory'
  },
  
  // Jorge (TDAH) - Lunes (0)
  { 
    id: 11, childId: 'jorge', title: 'Técnica Stop', dayIndex: 0, completed: false,
    description: 'Estrategia para reducir la impulsividad y mejorar la planificación de acciones.',
    steps: ['1. PARO: Detenerse antes de actuar.', '2. MIRO: Observar la situación.', '3. DECIDO: Pensar en soluciones.', '4. SIGO: Actuar calmado.'],
    animationType: 'stop'
  },
  // Jorge (TDAH) - Martes (1)
  { 
    id: 12, childId: 'jorge', title: 'Relajación Tortuga', dayIndex: 1, completed: false,
    description: 'Técnica de autocontrol emocional para momentos de frustración o enojo.',
    steps: ['Imagina que eres una tortuga.', 'Métete en tu caparazón.', 'Respira profundamente.', 'Sal cuando te sientas tranquilo.'],
    animationType: 'turtle'
  },
  // Jorge (TDAH) - Miércoles (2)
  { 
    id: 13, childId: 'jorge', title: 'Comunicación', dayIndex: 2, completed: false,
    description: 'Aprender a identificar emociones y comunicarlas asertivamente.',
    steps: ['Identificar cómo te sientes hoy.', 'Describir qué situación te hizo sentir así.', 'Usar la técnica MATEA.', 'Hablar de forma calmada.'],
    animationType: 'emotions'
  },
  // Jorge (TDAH) - Jueves (3)
  { 
    id: 14, childId: 'jorge', title: 'Repaso de Normas', dayIndex: 3, completed: false,
    description: 'Recordar las reglas del hogar y del colegio.',
    steps: ['Leer el cartel de normas.', 'Explicar por qué son importantes.', 'Identificar premios por cumplirlas.'],
    animationType: 'stop'
  },
  // Jorge (TDAH) - Viernes (4)
  { 
    id: 15, childId: 'jorge', title: 'Juego de Memoria', dayIndex: 4, completed: false,
    description: 'Actividad para mejorar la atención y flexibilidad cognitiva.',
    steps: ['Colocar tarjetas boca abajo.', 'Levantar dos tarjetas por turno.', 'Encontrar las parejas.', 'Celebrar los aciertos.'],
    animationType: 'sensory'
  },
];
