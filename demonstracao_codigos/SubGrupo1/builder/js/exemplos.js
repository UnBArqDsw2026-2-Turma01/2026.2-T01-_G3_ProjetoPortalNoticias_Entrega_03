// Notícias de exemplo para testar os builders.
// Títulos, categorias e imagens vêm do protótipo no Figma; os textos foram escritos para a demonstração.
// Cada exemplo é só dado: o Cliente transforma os "blocos" em ItemRoteiro e entrega ao Director.
// "posicaoTitulo" é só uma sugestão de posição para quando o builder misto for escolhido.

const EXEMPLOS = [
  {
    id: "festival",
    nome: "Cultura · Festival de rua",
    titulo: "Festival de rua movimenta o Centro neste fim de semana",
    subtitulo: "Shows, arte, gastronomia e atividades gratuitas prometem agitar o coração da cidade.",
    categoria: "Cultura",
    capa: { url: "assets/capa-festival.png", legenda: "Público curte o Festival de Cultura Urbana no Centro" },
    autor: { nome: "João Pedro Lopes", foto: "assets/avatar-autor.png" },
    fonte: "Secretaria Municipal de Cultura",
    posicaoTitulo: "inferior-esquerda",
    blocos: [
      ["TEXTO", "Neste final de semana, o Centro da cidade ganha novas cores, sons e aromas. A partir das 10h deste sábado, o tradicional Festival de Cultura Urbana toma conta da Avenida Central e de suas travessas históricas, transformando o asfalto em um grande corredor de lazer ao ar livre."],
      ["TEXTO", "O evento, que já faz parte do calendário oficial do município, espera atrair mais de 20 mil visitantes ao longo dos dois dias com uma programação totalmente gratuita. Com dois palcos principais montados nas praças da Matriz e dos Pracinhas, a maratona cultural contará com mais de 15 atrações musicais, variando entre samba, rap, MPB e rock independente."],
      ["CARROSSEL", [
        { url: "assets/festival-feira.jpg", legenda: "Feira de artesanato na Avenida Central" },
        { url: "assets/festival-comida.jpg", legenda: "Food trucks e restaurantes do Centro" },
        { url: "assets/festival-flauta.jpg", legenda: "Oficina aberta de flauta transversal" },
      ]],
      ["TEXTO", "Além dos shows, as travessas recebem uma feira de artesanato local, food trucks e oficinas abertas ao público. A organização recomenda que os visitantes usem o transporte público, já que parte das ruas do Centro ficará fechada para carros durante todo o evento."],
      ["TOPICOS", [
        "Quando: sábado e domingo, a partir das 10h",
        "Onde: Avenida Central, praça da Matriz e praça dos Pracinhas",
        "Entrada: gratuita, com classificação livre",
        "Acesso: linhas de ônibus 102, 210 e metrô estação Centro",
      ]],
      ["IMAGEM", { url: "assets/festival-cortejo.jpg", legenda: "Cortejo de blocos e fanfarras pelas ruas do Centro" }],
      ["TEXTO", "No domingo, o encerramento fica por conta de um cortejo de blocos e fanfarras que sai da praça da Matriz às 17h e segue até o palco principal, onde acontece o último show do festival."],
    ],
  },
  {
    id: "eleicoes",
    nome: "Política · Eleições",
    titulo: "Dia das eleições chegando! Hora de definir o Brasil que queremos",
    subtitulo: "Veja o que levar no dia, como conferir o seu local de votação e por que vale acompanhar os debates.",
    categoria: "Política",
    capa: { url: "assets/politica-catedral.jpg", legenda: "Catedral de Brasília ao entardecer" },
    autor: { nome: "Redação Burburinho", foto: "assets/avatar-padrao.svg" },
    fonte: "Redação Burburinho",
    posicaoTitulo: "centro",
    blocos: [
      ["TEXTO", "A contagem regressiva começou. Em poucas semanas, milhões de eleitores vão às urnas escolher quem vai ocupar os cargos do Executivo e do Legislativo pelos próximos quatro anos. Para evitar filas e imprevistos, vale se organizar com antecedência."],
      ["IMAGEM", { url: "assets/politica-urna.jpg", legenda: "Cada voto conta: confira seus dados antes do dia da eleição" }],
      ["TEXTO", "O primeiro passo é confirmar o seu local de votação, que pode ter mudado desde a última eleição. A consulta pode ser feita pelos canais oficiais da Justiça Eleitoral, informando nome completo e data de nascimento."],
      ["TOPICOS", [
        "Leve um documento oficial com foto ou use o aplicativo do título eletrônico",
        "Anote os números dos seus candidatos para agilizar na cabine",
        "Celulares não podem entrar ligados na cabine de votação",
        "A votação acontece das 8h às 17h, no horário de Brasília",
      ]],
      ["TEXTO", "Antes de decidir, especialistas recomendam acompanhar os debates e comparar as propostas. Os encontros entre candidatos colocam diferentes opiniões em confronto sobre os rumos do país e ajudam a perceber quem tem planos concretos para cada área."],
      ["CARROSSEL", [
        { url: "assets/politica-debate.jpg", legenda: "Debates colocam propostas lado a lado" },
        { url: "assets/politica-urna.jpg", legenda: "No dia, o voto é secreto e rápido" },
      ]],
    ],
  },
  {
    id: "remo",
    nome: "Esporte · Remo x Fluminense",
    titulo: "Remo contra o Fluminense já está marcado para a próxima quinta",
    subtitulo: "Duelo promete casa cheia em Belém; venda de ingressos começa nesta segunda-feira.",
    categoria: "Esporte",
    capa: { url: "assets/esporte-futebol.jpg", legenda: "Treino da equipe durante a semana" },
    autor: { nome: "Redação Burburinho", foto: "assets/avatar-padrao.svg" },
    fonte: "Redação Burburinho",
    posicaoTitulo: "inferior-direita",
    blocos: [
      ["TEXTO", "Está confirmado: Remo e Fluminense se enfrentam na próxima quinta-feira, às 21h30, em Belém. A partida é uma das mais aguardadas da rodada e deve levar um bom público ao estádio."],
      ["TOPICOS", [
        "Quando: quinta-feira, às 21h30",
        "Onde: Belém (PA)",
        "Ingressos: venda on-line a partir de segunda-feira",
        "Sócio-torcedor tem prioridade nas primeiras 48 horas",
      ]],
      ["TEXTO", "Até lá, as duas equipes terão a semana inteira de treinos para se preparar para o confronto, que vale pontos importantes na tabela."],
      ["IMAGEM", { url: "assets/esporte-volei.jpg", legenda: "No fim de semana, a areia recebe o torneio de vôlei de praia da cidade" }],
      ["TEXTO", "Fora dos gramados, o fim de semana também promete movimento: o torneio municipal de vôlei de praia reúne duplas amadoras de toda a região, com inscrições gratuitas e jogos abertos ao público."],
    ],
  },
  {
    id: "renatech",
    nome: "Tecnologia · Nova empresa",
    titulo: "Nova empresa de tecnologia muda o mercado",
    subtitulo: "Startup local aposta em realidade virtual e inteligência artificial para pequenos negócios.",
    categoria: "Tecnologia",
    capa: { url: "assets/tecnologia-vr.jpg", legenda: "Testes com óculos de realidade virtual" },
    autor: { nome: "Redação Burburinho", foto: "assets/avatar-padrao.svg" },
    fonte: "Redação Burburinho",
    posicaoTitulo: "superior-esquerda",
    blocos: [
      ["TEXTO", "Uma startup criada por um grupo de amigos recém-formados está chamando a atenção do mercado de tecnologia da cidade. A Renatech desenvolve ferramentas de realidade virtual e inteligência artificial pensadas para pequenos comércios, que normalmente não têm acesso a esse tipo de solução."],
      ["IMAGEM", { url: "assets/tecnologia-escritorio.jpg", legenda: "Equipe da Renatech no escritório" }],
      ["TEXTO", "Entre os produtos estão vitrines virtuais, em que o cliente experimenta móveis e roupas antes de comprar, e um assistente que responde dúvidas de clientes pelo celular a qualquer hora do dia."],
      ["TOPICOS", [
        "Fundada há dois anos, com seis pessoas na equipe",
        "Foco em pequenos comércios e prestadores de serviço",
        "Produtos: vitrine em realidade virtual e atendimento automático",
      ]],
      ["CARROSSEL", [
        { url: "assets/tecnologia-vr.jpg", legenda: "Demonstração da vitrine virtual" },
        { url: "assets/tecnologia-escritorio.jpg", legenda: "Desenvolvimento dos produtos" },
      ]],
      ["TEXTO", "Segundo os fundadores, o próximo passo é abrir um programa de estágio para estudantes da região e levar as ferramentas para feiras de negócios ainda este ano."],
    ],
  },
];
