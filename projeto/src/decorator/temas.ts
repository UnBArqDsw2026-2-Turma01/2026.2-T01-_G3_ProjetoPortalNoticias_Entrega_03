export type Tema = 'natal' | 'halloween' | 'estudante';

// Dados visuais compartilhados; cada responsabilidade é aplicada por seu decorador.
export const temas = {
  natal: {
    nome: 'Natal', data: '25 de dezembro', simbolo: '🎄',
    mensagem: 'Boas histórias para compartilhar neste Natal.',
    saudacao: 'Feliz Natal', secao: 'Notícias para compartilhar', selo: '🎁 NATAL',
    enfeites: ['🎄', '🎁', '🔔', '⭐'], particulas: ['❄', '✧', '❄', '✦'],
  },
  halloween: {
    nome: 'Halloween', data: '31 de outubro', simbolo: '🎃',
    mensagem: 'Uma noite de histórias de arrepiar.',
    saudacao: 'Bom Halloween', secao: 'Notícias de arrepiar', selo: '🎃 HALLOWEEN',
    enfeites: ['🕸️', '🎃', '🕷️', '🕸️'], particulas: ['🦇', '✧', '🦇', '✦'],
  },
  estudante: {
    nome: 'Dia do Estudante', data: '11 de agosto', simbolo: '🎓',
    mensagem: 'Novas ideias começam com curiosidade.',
    saudacao: 'Bons estudos', secao: 'Notícias para descobrir', selo: '🎓 ESTUDANTE',
    enfeites: ['📚', '✏️', '🎓', '💡'], particulas: ['▰', '●', '▱', '◆'],
  },
} as const;
