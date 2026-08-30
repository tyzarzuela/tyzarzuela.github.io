export interface Project {
  id: string;
  title: string;
  tag: string;
  shortDesc: string;
  detail: {
    description: string;
    whatIDid: string;
    mediaUrl?: string;
    githubUrl?: string;
  };
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  projects: Project[];
}

export const CATEGORIZED_PROJECTS: Folder[] = [
  {
    id: 'vr-folder',
    name: 'Realidad Virtual',
    icon: '🥽',
    projects: [
      {
        id: 'vr-llm',
        title: 'VR LLM Interaction System',
        tag: 'UE5 / C++',
        shortDesc: 'Bachelor thesis project. VR game prototype executing dynamic open-source LLM prompts.',
        detail: {
          description: 'Integración de modelos de lenguaje en tiempo real dentro de entornos inmersivos de Realidad Virtual.',
          whatIDid: 'Desarrollo del plugin C++ en UE5 para gestionar llamadas asíncronas a APIs de LLM.',
          githubUrl: 'https://github.com/tyzarzuela'
        }
      }
    ]
  },
  {
    id: 'engines-folder',
    name: 'Custom Engines & Tools',
    icon: '⚙️',
    projects: [
      {
        id: 'eden-engine',
        title: 'EDEN Custom Engine',
        tag: 'C++ / ECS',
        shortDesc: '2D/3D game engine built from scratch in C++. Features modular ECS and custom rendering.',
        detail: {
          description: 'Motor de videojuegos 2D/3D desarrollado desde cero.',
          whatIDid: 'Arquitectura ECS, renderizador OpenGL 3.3+ y sistema de física.',
          githubUrl: 'https://github.com/tyzarzuela'
        }
      }
    ]
  },
  {
    id: 'jams-folder',
    name: 'Game Jams & Prototypes',
    icon: '🕹️',
    projects: [
      {
        id: 'jam-project-1',
        title: 'Chrono Rift',
        tag: 'Unity / C#',
        shortDesc: '72-hour game jam submission focusing on time manipulation mechanics.',
        detail: {
          description: 'Juego desarrollado durante una Game Jam de 3 días.',
          whatIDid: 'Programación de mecánicas de rebobinado temporal y diseño de niveles.',
          githubUrl: 'https://github.com/tyzarzuela'
        }
      }
    ]
  }
];