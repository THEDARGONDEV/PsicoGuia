import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Shield, Brain, Heart, ChevronRight, Quote } from 'lucide-react';

interface Props {
  childId: string;
  onBack: () => void;
}

interface Section {
  subtitle?: string;
  paragraphs: string[];
}

interface Topic {
  id: string;
  title: string;
  icon: React.ReactNode;
  sections: Section[];
  citation: string;
}

const JORGE_CONTENT: Topic[] = [
  {
    id: 'tdah-basics',
    title: '¿Qué es el TDAH?',
    icon: <Brain size={24} className="text-purple-500" />,
    sections: [
      {
        paragraphs: [
          'El Trastorno por Déficit de Atención e Hiperactividad (TDAH) es un trastorno del neurodesarrollo. En el caso de Jorge, presenta específicamente el tipo hiperactivo-impulsivo, lo que significa que tiene una necesidad constante de movimiento y actúa antes de pensar.',
        ]
      },
      {
        subtitle: 'Puntos Clave',
        paragraphs: [
          'No se trata de falta de voluntad, desobediencia intencional o mala crianza.',
          'Su cerebro procesa neurotransmisores como la dopamina de forma diferente, lo que dificulta su capacidad para frenar impulsos.',
          'Requiere un entorno estructurado, rutinas predecibles y refuerzo positivo constante para prosperar.'
        ]
      }
    ],
    citation: 'Asociación Americana de Psiquiatría. (2013). Manual diagnóstico y estadístico de los trastornos mentales (DSM-5).'
  },
  {
    id: 'strategies',
    title: 'Estrategias de Acompañamiento',
    icon: <Heart size={24} className="text-red-500" />,
    sections: [
      {
        subtitle: 'Instrucciones Claras',
        paragraphs: [
          'Brinda una sola instrucción a la vez. Asegúrate de establecer contacto visual directo antes de hablarle para garantizar que su atención esté enfocada en ti.'
        ]
      },
      {
        subtitle: 'Refuerzo Positivo',
        paragraphs: [
          'Elogia su esfuerzo de manera inmediata y específica. Utiliza el sistema de seguimiento de normas de la aplicación para mantener un registro visual de sus logros.'
        ]
      },
      {
        subtitle: 'Regulación Emocional',
        paragraphs: [
          'Cuando notes que se está sobreestimulando, invítalo a usar la técnica de la tortuga. Esto le permite hacer una pausa y regular sus emociones antes de que ocurra un desborde conductual.'
        ]
      }
    ],
    citation: 'Barkley, R. A. (2015). Atención a niños con TDAH: Guía para padres y profesionales.'
  },
  {
    id: 'safety',
    title: 'Consejos de Seguridad',
    icon: <Shield size={24} className="text-green-500" />,
    sections: [
      {
        paragraphs: [
          'Debido a la impulsividad asociada a su tipo de TDAH, es fundamental implementar medidas preventivas en su entorno.'
        ]
      },
      {
        subtitle: 'Anticipación',
        paragraphs: [
          'Avisa a Jorge con 10 y 5 minutos de anticipación antes de cambiar de una actividad a otra, especialmente si debe dejar algo que disfruta.'
        ]
      },
      {
        subtitle: 'Entorno Seguro',
        paragraphs: [
          'Mantén las áreas de juego y estudio libres de objetos peligrosos o frágiles que pueda tomar de forma impulsiva.'
        ]
      },
      {
        subtitle: 'Supervisión Activa',
        paragraphs: [
          'Mantén una vigilancia cercana en lugares públicos o situaciones novedosas, ya que la sobreestimulación puede generar respuestas rápidas e imprevistas.'
        ]
      }
    ],
    citation: 'Fundación CADAH. (2020). Estrategias de seguridad y manejo del entorno en el TDAH.'
  }
];

const VALENTINA_CONTENT: Topic[] = [
  {
    id: 'pci-basics',
    title: 'Entendiendo la Parálisis Cerebral',
    icon: <Brain size={24} className="text-purple-500" />,
    sections: [
      {
        paragraphs: [
          'La Parálisis Cerebral Infantil (PCI) comprende un grupo de trastornos que afectan la capacidad de una persona para moverse, mantener el equilibrio y controlar su postura.'
        ]
      },
      {
        subtitle: 'Puntos Clave',
        paragraphs: [
          'Es la causa más frecuente de discapacidad motora en la etapa infantil.',
          'No es una condición progresiva; la lesión neurológica inicial no empeora, aunque los síntomas físicos pueden evolucionar con el crecimiento.',
          'Valentina requiere apoyo constante y terapias regulares para mantener su movilidad articular y prevenir contracturas musculares.'
        ]
      }
    ],
    citation: 'Confederación ASPACE. (2021). Guía de orientación sobre la Parálisis Cerebral.'
  },
  {
    id: 'strategies',
    title: 'Estrategias de Acompañamiento',
    icon: <Heart size={24} className="text-red-500" />,
    sections: [
      {
        subtitle: 'Fomento de la Autonomía',
        paragraphs: [
          'Permite y anima a Valentina a realizar por sí misma todas las acciones posibles, aunque le tome más tiempo. Esto es vital para fortalecer su autoestima y sentido de capacidad.'
        ]
      },
      {
        subtitle: 'Rutinas de Estiramiento',
        paragraphs: [
          'Las movilizaciones son fundamentales para evitar el acortamiento muscular. Utiliza las alarmas de la aplicación para mantener la constancia en sus sesiones diarias.'
        ]
      },
      {
        subtitle: 'Comunicación Asertiva',
        paragraphs: [
          'Asegúrate de brindarle el tiempo necesario para responder y expresarse mediante su comunicador. Valida siempre sus emociones y decisiones respecto a sus terapias.'
        ]
      }
    ],
    citation: 'Bobath, K. (2007). Desarrollo motor en distintos tipos de parálisis cerebral.'
  },
  {
    id: 'safety',
    title: 'Consejos de Seguridad y Postura',
    icon: <Shield size={24} className="text-green-500" />,
    sections: [
      {
        paragraphs: [
          'La seguridad física y el cuidado postural son elementos primordiales en el día a día de Valentina para garantizar su bienestar y evitar complicaciones.'
        ]
      },
      {
        subtitle: 'Higiene Postural',
        paragraphs: [
          'Revisa constantemente que mantenga una postura alineada y simétrica cuando esté sentada en su silla o acostada.'
        ]
      },
      {
        subtitle: 'Prevención de Úlceras',
        paragraphs: [
          'Realiza cambios de posición frecuentes, especialmente si pasa períodos prolongados en una misma postura, para aliviar la presión sobre la piel.'
        ]
      },
      {
        subtitle: 'Manejo Seguro',
        paragraphs: [
          'Al levantarla o trasladarla, utiliza siempre técnicas ergonómicas adecuadas (mantener la espalda recta y flexionar las rodillas) para proteger su cuerpo y el tuyo.'
        ]
      }
    ],
    citation: 'Organización Mundial de la Salud. (2019). Recomendaciones sobre movilidad y cuidado postural.'
  }
];

export default function PsychoeducationScreen({ childId, onBack }: Props) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const content = childId === 'jorge' ? JORGE_CONTENT : VALENTINA_CONTENT;
  const childName = childId === 'jorge' ? 'Jorge' : 'Valentina';

  const activeTopic = content.find(t => t.id === selectedTopic);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full relative">
      <header className="flex items-center p-6 bg-white border-b-2 border-black sticky top-0 z-10">
        <button 
          onClick={() => selectedTopic ? setSelectedTopic(null) : onBack()} 
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={28} />
        </button>
        <div className="ml-4 flex-1">
          <h1 className="text-xl font-bold tracking-tight line-clamp-1">
            {selectedTopic ? activeTopic?.title : `Módulo Teórico: ${childName}`}
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {!selectedTopic ? (
          <>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 mb-8">
              <BookOpen size={40} className="text-blue-500 mb-4" />
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Taller de Psicoeducación</h2>
              <p className="text-blue-800 leading-relaxed">
                Aprende estrategias basadas en evidencia científica para acompañar el desarrollo de {childName}.
              </p>
            </div>

            <div className="space-y-4">
              {content.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className="w-full bg-white border-2 border-gray-200 p-5 rounded-2xl flex items-center text-left hover:border-black hover:shadow-md transition-all group"
                >
                  <div className="bg-gray-50 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                    {topic.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{topic.title}</h3>
                  </div>
                  <ChevronRight size={24} className="text-gray-400 group-hover:text-black transition-colors" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-sm animate-fade-in">
            <div className="flex items-center mb-8 pb-6 border-b border-gray-100">
              <div className="bg-gray-50 p-3 rounded-xl mr-4">
                {activeTopic?.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{activeTopic?.title}</h2>
            </div>
            
            <div className="space-y-8">
              {activeTopic?.sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  {section.subtitle && (
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                      {section.subtitle}
                    </h3>
                  )}
                  <div className="space-y-3">
                    {section.paragraphs.map((paragraph, pIdx) => (
                      <p key={pIdx} className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex items-start gap-3 text-gray-400">
                <Quote size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm italic leading-relaxed">
                  Fuente: {activeTopic?.citation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
