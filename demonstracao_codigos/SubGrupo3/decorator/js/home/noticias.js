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
    id: 'flauta', foto: 'flauta', categoria: 'Cultura', cor: 'cultura', tags: ['musica', 'educacao'],
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


export const noticiasComemorativas = [
    {
        id: 'coral-natal',
        foto: 'coralNatal',
        categoria: 'Cultura',
        cor: 'cultura',
        titulo: 'Coral de Natal reúne moradores na praça central',
        resumo: 'Apresentação gratuita celebra o Natal com músicas tradicionais e participação da comunidade.',
        autor: 'Redação Centro',
        inicial: 'C',
        tempo: '2h',
        tema: 'natal',
        tags: ['cultura', 'musica', 'eventos'],
        texto: [
            'A praça central recebe uma apresentação especial de Natal, reunindo músicos e moradores em uma programação gratuita.',
            'O evento contará com canções tradicionais e apresentações coletivas, incentivando a participação da comunidade nas celebrações de fim de ano.'
        ]
    },
    {
        id: 'feira-doacao-natal',
        foto: 'feiraDoacaoNatal',
        categoria: 'Cultura',
        cor: 'cultura',
        titulo: 'Feira solidária de Natal arrecada brinquedos e alimentos',
        resumo: 'Iniciativa reúne voluntários e pequenos produtores em uma programação beneficente.',
        autor: 'Feira da Praça',
        inicial: 'F',
        tempo: '4h',
        tema: 'natal',
        tags: ['cultura', 'comunidade', 'solidariedade'],
        texto: [
            'Uma feira solidária movimenta a região com arrecadação de brinquedos e alimentos destinados a famílias da comunidade.',
            'Além das doações, a programação contará com barracas de artesanato e atividades culturais para incentivar a participação dos moradores.'
        ]
    },
    {
        id: 'oficinas-natal',
        foto: 'OficinasNatal',
        categoria: 'Cultura',
        cor: 'cultura',
        titulo: 'Oficinas natalinas oferecem atividades gratuitas para crianças',
        resumo: 'Programação inclui produção de enfeites, artesanato e atividades em família.',
        autor: 'Redação Centro',
        inicial: 'C',
        tempo: '6h',
        tema: 'natal',
        tags: ['cultura', 'educacao', 'artesanato'],
        texto: [
            'Um espaço comunitário promove oficinas de decoração natalina voltadas para crianças e familiares.',
            'Durante as atividades, os participantes poderão produzir enfeites e conhecer técnicas simples de artesanato, estimulando a criatividade e a convivência.'
        ]
    },

    
    {
        id: 'cinema-halloween',
        foto: 'cinemaHalloween',
        categoria: 'Cultura',
        cor: 'cultura',
        titulo: 'Cinema de terror promove sessão especial de Halloween',
        resumo: 'Programação gratuita reúne clássicos do suspense em uma noite temática.',
        autor: 'Redação Centro',
        inicial: 'C',
        tempo: '1h',
        tema: 'halloween',
        tags: ['cultura', 'cinema', 'eventos'],
        texto: [
            'O centro cultural da região prepara uma sessão especial de cinema em comemoração ao Halloween, com exibição de filmes de suspense e terror.',
            'O público poderá participar gratuitamente da programação, que também contará com atividades temáticas e espaços para interação entre os visitantes.'
        ]
    },
    {
        id: 'concurso-halloween',
        foto: 'ConcursoFantasiaHalloween',
        categoria: 'Cultura',
        cor: 'cultura',
        titulo: 'Concurso de fantasias movimenta celebração de Halloween',
        resumo: 'Evento reúne criatividade, apresentações e premiações para participantes.',
        autor: 'Redação Centro',
        inicial: 'C',
        tempo: '3h',
        tema: 'halloween',
        tags: ['cultura', 'entretenimento', 'eventos'],
        texto: [
            'Um concurso de fantasias promete movimentar o centro comunitário durante as comemorações de Halloween, reunindo participantes de diferentes idades.',
            'A programação inclui desfile de fantasias, apresentações artísticas e premiações simbólicas para as produções mais criativas.'
        ]
    },
    {
        id: 'feira-halloween',
        foto: 'feiraHalloen',
        categoria: 'Cultura',
        cor: 'cultura',
        titulo: 'Feira temática de Halloween reúne atrações e gastronomia',
        resumo: 'Barracas decoradas, produtos artesanais e atividades especiais movimentam a praça.',
        autor: 'Feira da Praça',
        inicial: 'F',
        tempo: '5h',
        tema: 'halloween',
        tags: ['cultura', 'gastronomia', 'eventos'],
        texto: [
            'A praça central recebe uma feira temática de Halloween com barracas decoradas, comidas especiais e produtos artesanais.',
            'Além da gastronomia, os visitantes poderão participar de atividades recreativas e conhecer pequenos produtores da comunidade.'
        ]
    },

    
    {
        id: 'curso-estudante',
        foto: 'cursoEstudante',
        categoria: 'Educação',
        cor: 'educacao',
        titulo: 'Projeto oferece bolsas para cursos preparatórios',
        resumo: 'Iniciativa amplia o acesso de estudantes a oportunidades de formação gratuita.',
        autor: 'Redação Centro',
        inicial: 'C',
        tempo: '2h',
        tema: 'estudante',
        tags: ['educacao', 'cursos', 'oportunidades'],
        texto: [
            'Um projeto educacional anuncia a oferta de bolsas para cursos preparatórios destinados a estudantes da comunidade.',
            'A iniciativa busca ampliar o acesso à formação e oferecer apoio para jovens que desejam ingressar no ensino superior.'
        ]
    },
    {
        id: 'feira-estudante',
        foto: 'feiraEstudante',
        categoria: 'Educação',
        cor: 'educacao',
        titulo: 'Feira de profissões apresenta oportunidades aos estudantes',
        resumo: 'Evento reúne instituições e profissionais para orientar escolhas de carreira.',
        autor: 'Redação Centro',
        inicial: 'C',
        tempo: '4h',
        tema: 'estudante',
        tags: ['educacao', 'profissoes', 'tecnologia'],
        texto: [
            'Uma feira de profissões reúne estudantes, instituições de ensino e profissionais de diferentes áreas em uma programação especial.',
            'Os participantes poderão conhecer possibilidades de carreira, conversar com especialistas e participar de atividades de orientação profissional.'
        ]
    },
    {
        id: 'oficina-estudante',
        foto: 'oficinaTecEstudante',
        categoria: 'Educação',
        cor: 'educacao',
        titulo: 'Oficinas gratuitas aproximam estudantes da tecnologia',
        resumo: 'Atividades práticas apresentam programação, robótica e inovação digital.',
        autor: 'Renatech',
        inicial: 'R',
        tempo: '6h',
        tema: 'estudante',
        tags: ['educacao', 'tecnologia', 'inovacao'],
        texto: [
            'Estudantes da região poderão participar de oficinas gratuitas de introdução à programação, robótica e outras tecnologias.',
            'As atividades incentivam o aprendizado prático e apresentam possibilidades de atuação profissional na área de tecnologia.'
        ]
    }


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
