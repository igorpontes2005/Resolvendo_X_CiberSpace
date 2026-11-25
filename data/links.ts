export type StatusType = 'online' | 'offline' | 'instavel' | 'manutencao' | 'checando';

export interface AppLink {
  id: string;
  title: string;
  url: string;
  isInternal?: boolean;
  status: StatusType;
  description: string;
  lastChecked?: string;
  customExplanationText?: string;
  howToPlaySteps?: string[];   
  howToCreateSteps?: string[]; 
}

export const appLinks: AppLink[] = [
  {
    id: 'kahoot',
    title: 'Kahoot!',
    url: 'kahoot.com',
    status: 'checando',
    description: 'Plataforma de aprendizado baseada em jogos usada para testes e quizzes em tempo real.',
    customExplanationText: 'O Kahoot! permite que participantes joguem quizzes em tempo real via PIN de acesso e que instrutores criem suas próprias partidas personalizadas.',
    
    
    howToPlaySteps: [
      'Acesse kahoot.it (ou abra o app do Kahoot).',
      'Digite o Game PIN exibido na tela da apresentação.',
      'Escolha um apelido e aguarde o início da partida.',
      'Responda às perguntas o mais rápido possível para acumular mais pontos.'
    ],

    
    howToCreateSteps: [
      'Acesse kahoot.com, faça login e clique em "Create > Kahoot".',
      'Escreva as perguntas, cadastre as alternativas e marque a resposta correta.',
      'Defina o tempo limite por pergunta, o sistema de pontuação e salve na sua biblioteca.',
      'Clique em "Start" no quiz desejado para gerar o PIN e apresentar a partida aos jogadores.'
    ]
  },
  {
    id: 'tuxmath',
    title: 'tuxMath',
    url: 'tuxmath.org',
    status: 'checando',
    description: 'Jogo educativo para treino de matemática.',
    customExplanationText: 'Treino de matemática clássico com operações ágeis.',
    howToPlaySteps: [
      'Selecione a operação desejada (Adição, Subtração, Multiplicação).',
      'Resolva os meteoros numéricos antes que atinjam as cidades.'
    ]
  },
  {
    id: 'meu-jogo',
    title: 'Caverna da Luz',
    url: '/jogos/caverna_da_luz_3_niveis_sons.html',
    isInternal: true,
    status: 'online',
    description: 'Jogo em HTML5/JavaScript hospedado localmente no próprio app.',
    
    customExplanationText: 'Este é um jogo HTML5 desenvolvido em Canvas/JavaScript rodando localmente. O objetivo é superar os obstáculos de fase e alcançar a maior pontuação.',
    howToPlaySteps: [
      'Clique no link "Abrir Jogo Local" para carregar a tela do jogo em HTML.',
      'Use as setas do teclado (← →) ou A/D para movimentar o personagem.',
      'Pressione Barra de Espaço para pular/interagir.',
      'Evite os obstáculos para não reiniciar a fase.'
    ]
  }
];
