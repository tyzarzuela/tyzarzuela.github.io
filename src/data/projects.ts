export interface Project {
  id: string;
  title: string;
  tag: string;
  shortDesc: string;
  icon?: string;
  detail: {
    description: string;
    whatIDid: string;
    mediaUrl?: string;
    githubUrl?: string;
    demoUrl?: string;
  };
}

export const PROJECTS: Project[] = [
  {
    id: 'vr-llm',
    title: 'VR LLM Interaction System',
    tag: 'UE5 / C++',
    shortDesc: 'Bachelor thesis project. VR game prototype executing dynamic open-source LLM prompts.',
    detail: {
      description: 'Integración de modelos de lenguaje en tiempo real en VR.',
      whatIDid: 'Diseño de la arquitectura C++ asíncrona en Unreal Engine 5.',
      githubUrl: 'https://github.com/tyzarzuela'
    }
  },
  {
    id: 'eden-engine',
    title: 'EDEN Custom Engine',
    tag: 'C++ / ECS',
    shortDesc: '2D/3D game engine built from scratch in C++. Features modular ECS and custom rendering.',
    detail: {
      description: 'Motor de videojuegos 2D/3D creado desde cero.',
      whatIDid: 'Pipeline de renderizado OpenGL y arquitectura ECS.',
      githubUrl: 'https://github.com/tyzarzuela'
    }
  }
];