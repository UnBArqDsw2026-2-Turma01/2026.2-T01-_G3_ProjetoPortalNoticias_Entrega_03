// Dados fictícios: conteúdo editorial para demonstrar a Home, sem API ou notícias reais.
export const noticiaDestaque = {
  id: 'destaque', foto: 'festival', categoria: 'Cultura', autor: 'Redação Centro', tempo: '10min',
  titulo: 'Festival de rua movimenta o Centro neste fim de semana',
  resumo: 'Shows, arte, gastronomia e atividades gratuitas prometem agitar o coração da cidade.',
  texto: [
    'O Centro recebe uma programação que reúne apresentações musicais, intervenções artísticas e uma feira de pequenos produtores. A proposta é ocupar os espaços públicos com atividades para diferentes idades.',
    'Durante a manhã, o circuito oferece oficinas de criação e apresentações de artistas locais. À tarde, o público pode conhecer barracas de gastronomia, conversar com expositores e acompanhar os shows ao ar livre.',
    'A organização prevê pontos de orientação ao público e áreas de descanso. A entrada e as oficinas são gratuitas neste cenário fictício de demonstração do portal.',
  ],
};

export const noticias = [
  {
    id: 'gastronomia', foto: 'espetos', categoria: 'Cultura', cor: 'cultura',
    titulo: 'Circuito gastronômico reúne pequenos negócios no Centro',
    resumo: 'Feira valoriza receitas locais e reúne opções de comida de rua.',
    autor: 'Dedé Espetos', inicial: 'D', tempo: '2h',
    texto: [
      'Pequenos empreendedores se reúnem em um circuito gastronômico dedicado à culinária local. O percurso inclui barracas de espetos, pratos vegetarianos e doces preparados por produtores da região.',
      'Além da degustação, o evento propõe conversas sobre a origem dos ingredientes e a rotina dos negócios de bairro. A iniciativa busca aproximar moradores e comerciantes e ampliar a circulação no Centro.',
    ],
  },
  {
    id: 'tecnologia', foto: 'tecnologia', categoria: 'Tecnologia', cor: 'tecnologia',
    titulo: 'Empresa local abre laboratório de inovação à comunidade',
    resumo: 'Programação inclui demonstrações de projetos e encontros com estudantes.',
    autor: 'Renatech', inicial: 'R', tempo: '4h',
    texto: [
      'Um laboratório de inovação abre suas portas para apresentar projetos de tecnologia desenvolvidos na região. A visita inclui demonstrações de ferramentas digitais e conversas com as equipes responsáveis.',
      'Estudantes podem conhecer diferentes etapas de um projeto, da identificação de um problema à construção de um protótipo. O encontro também aborda acessibilidade e uso responsável da tecnologia.',
    ],
  },
  {
    id: 'flauta', foto: 'flauta', categoria: 'Cultura', cor: 'cultura',
    titulo: 'Oficinas gratuitas aproximam estudantes da música',
    resumo: 'Aulas de flauta apresentam ritmo e prática coletiva para iniciantes.',
    autor: 'Flauta Aulas', inicial: 'F', tempo: '5h',
    texto: [
      'Uma série de oficinas de iniciação musical convida estudantes a experimentar a flauta e desenvolver a percepção de ritmo. As atividades foram pensadas para quem ainda não teve contato com um instrumento.',
      'Os encontros combinam exercícios de escuta, leitura de pequenas melodias e prática em grupo. A participação coletiva é o ponto de partida para explorar repertórios e conhecer outras pessoas interessadas em música.',
    ],
  },
  {
    id: 'artistas', foto: 'festival', categoria: 'Cultura', cor: 'cultura',
    titulo: 'Artistas independentes ocupam o circuito cultural de rua',
    resumo: 'Música e intervenções visuais transformam o passeio pelo bairro.',
    autor: 'Redação Centro', inicial: 'C', tempo: '6h',
    texto: [
      'Artistas independentes apresentam um circuito de pequenas intervenções que conecta praças e ruas do bairro. A programação reúne música, ilustração e performances ao ar livre.',
      'O formato permite que visitantes escolham seu próprio percurso e descubram propostas de diferentes coletivos. A iniciativa valoriza a produção cultural que já acontece na comunidade.',
    ],
  },
  {
    id: 'feira', foto: 'feira', categoria: 'Cultura', cor: 'cultura',
    titulo: 'Feira da Praça conecta produtores e moradores',
    resumo: 'Artesanato, livros e gastronomia dividem a programação do encontro.',
    autor: 'Feira da Praça', inicial: 'P', tempo: '8h',
    texto: [
      'A Feira Cultural da Praça reúne produtores locais em uma programação voltada à convivência. Barracas de artesanato, troca de livros e gastronomia oferecem diferentes motivos para visitar o espaço.',
      'A proposta é incentivar o consumo de pequenos negócios e criar oportunidades de encontro entre moradores. Oficinas e apresentações complementam a visita ao longo do dia.',
    ],
  },
  {
    id: 'oficinas', foto: 'tecnologia', categoria: 'Tecnologia', cor: 'tecnologia',
    titulo: 'Projeto oferece oficinas de segurança digital',
    resumo: 'Encontros explicam como reconhecer golpes e proteger contas pessoais.',
    autor: 'Renatech', inicial: 'R', tempo: '1d',
    texto: [
      'Um projeto comunitário apresenta oficinas de introdução à segurança digital. Os encontros utilizam exemplos simulados para discutir mensagens suspeitas, proteção de contas e cuidados ao compartilhar informações.',
      'A programação prioriza situações do cotidiano e abre espaço para dúvidas dos participantes. O objetivo é desenvolver autonomia para avaliar informações e utilizar serviços digitais.',
    ],
  },
];

export const assuntosEmAlta = [
  'Programação cultural no Centro', 'Tecnologia e comunidade', 'Oficinas de música gratuitas',
  'Pequenos negócios da região', 'Feira Cultural da Praça',
];

export function obterNoticia(id) {
  return [noticiaDestaque, ...noticias].find(noticia => noticia.id === id);
}

export function buscarNoticias(termo) {
  const normalizar = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const consulta = normalizar(termo.trim());
  return noticias.filter(noticia => normalizar(`${noticia.titulo} ${noticia.resumo} ${noticia.categoria}`).includes(consulta));
}
