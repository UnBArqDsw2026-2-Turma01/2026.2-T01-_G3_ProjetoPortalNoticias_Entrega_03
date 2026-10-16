// Demonstração no terminal do Singleton RepositorioNoticias.
// Carrega os mesmos arquivos usados no navegador (inclusive o Builder, em ../builder) num
// contexto isolado do Node, assim nenhum código do padrão precisa ser duplicado.
//
// Uso:  node demo.js            roda tudo de uma vez
//       node demo.js --pausar   espera ENTER entre as etapas (bom para gravar o vídeo)

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const readline = require("readline");

const ARQUIVOS = [
  "../builder/js/blocos.js",
  "../builder/js/noticia.js",
  "../builder/js/builders.js",
  "../builder/js/director.js",
  "../builder/js/exemplos.js",
  "js/repositorioNoticias.js",
  "js/telas.js",
  "js/redacao.js",
];

const contexto = vm.createContext({ console });
for (const arquivo of ARQUIVOS) {
  const caminho = path.join(__dirname, arquivo);
  vm.runInContext(fs.readFileSync(caminho, "utf8"), contexto, { filename: caminho });
}
const { RepositorioNoticias, PaginaInicial, PaginaCategoria, SecaoDestaques, Redacao, EXEMPLOS } = vm.runInContext(
  "({ RepositorioNoticias, PaginaInicial, PaginaCategoria, SecaoDestaques, Redacao, EXEMPLOS })",
  contexto
);

// ---------- saída no terminal ----------

const comCor = process.stdout.isTTY && !process.env.NO_COLOR;
const cor = (codigo) => (texto) => (comCor ? `\x1b[${codigo}m${texto}\x1b[0m` : String(texto));
const negrito = cor("1");
const vermelho = cor("31");
const verde = cor("32");
const amarelo = cor("33");
const ciano = cor("36");
const cinza = cor("90");

const pausar = process.argv.includes("--pausar");

function esperarEnter() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(cinza("\n   [ENTER para continuar]"), () => {
      rl.close();
      resolve();
    });
  });
}

let numeroEtapa = 0;
async function etapa(titulo) {
  if (pausar && numeroEtapa > 0) await esperarEnter();
  numeroEtapa++;
  console.log(`\n${negrito(vermelho(`${numeroEtapa}.`))} ${negrito(titulo)}\n`);
}

const linha = (texto = "") => console.log(`   ${texto}`);
const resumo = (n) => `${ciano(`[${n.categoria}]`)} ${n.titulo} ${cinza(`· builder ${n.variante}`)}`;

function mostrarTela(tela) {
  const noticias = tela.noticias();
  linha(negrito(tela.nome) + cinza(` (repositório #${tela.repositorio.id}, ${noticias.length} notícia(s))`));
  if (noticias.length === 0) linha(cinza("   nenhuma notícia"));
  noticias.forEach((n) => linha(`   • ${resumo(n)}`));
  linha();
}

// Notícia escrita para a demonstração, publicada depois que as telas já existem
const NOTICIA_NOVA = {
  titulo: "Seleção feminina de vôlei vence na estreia do torneio",
  subtitulo: "Equipe fechou o jogo em três sets e lidera o grupo.",
  categoria: "Esporte",
  capa: { url: "assets/esporte-volei.jpg", legenda: "Jogadoras comemoram ponto no terceiro set" },
  autor: { nome: "Redação Burburinho", foto: "assets/avatar-padrao.svg" },
  fonte: "Confederação de Vôlei",
  blocos: [["TEXTO", "A seleção feminina venceu por 3 sets a 0 e assumiu a liderança do grupo logo na estreia."]],
};

// ---------- roteiro ----------

async function main() {
  console.log(negrito("\n=== Burburinho · Singleton do Repositório de Notícias ==="));

  await etapa("Três telas do portal pedem o repositório");
  const inicial = new PaginaInicial();
  const esporte = new PaginaCategoria("Esporte");
  const destaques = new SecaoDestaques();

  for (const tela of [inicial, esporte, destaques]) {
    const antes = RepositorioNoticias.instanciasCriadas;
    const repo = tela.repositorio;
    const situacao =
      RepositorioNoticias.instanciasCriadas > antes ? amarelo("criou a instância agora") : verde("reaproveitou a mesma");
    linha(`${tela.nome.padEnd(18)} → getInstancia() → repositório #${repo.id}  ${situacao}`);
  }
  linha();
  linha(`inicial.repositorio === esporte.repositorio   → ${verde(inicial.repositorio === esporte.repositorio)}`);
  linha(`esporte.repositorio === destaques.repositorio → ${verde(esporte.repositorio === destaques.repositorio)}`);
  linha(`Instâncias criadas até aqui: ${negrito(RepositorioNoticias.instanciasCriadas)}`);

  await etapa("Alguém tenta criar um segundo repositório com new");
  try {
    new RepositorioNoticias();
    linha(vermelho("Criou outra instância (isso não deveria acontecer!)"));
  } catch (erro) {
    linha(`${vermelho("✖ bloqueado:")} ${erro.message}`);
  }
  linha(`Instâncias criadas: ${negrito(RepositorioNoticias.instanciasCriadas)}`);

  await etapa("A redação monta as notícias com o Builder e publica no repositório");
  const redacao = new Redacao();
  const plano = [
    ["festival", "destaque"],
    ["eleicoes", "compacta"],
    ["remo", "destaque"],
    ["renatech", "mista"],
  ];
  for (const [id, versao] of plano) {
    const { noticia } = redacao.publicar(EXEMPLOS.find((e) => e.id === id), versao);
    linha(`${verde("✔ publicada")}  ${resumo(noticia)}`);
  }

  await etapa("Cada tela lê do mesmo repositório");
  [inicial, esporte, destaques].forEach(mostrarTela);

  await etapa("Uma notícia nova aparece em todas as telas, sem recriar nada");
  const { noticia: nova } = redacao.publicar(NOTICIA_NOVA, "destaque");
  linha(`${verde("✔ publicada")}  ${resumo(nova)}`);
  linha();
  [inicial, esporte, destaques].forEach(mostrarTela);

  await etapa("Publicar a mesma notícia de novo");
  const { publicada } = redacao.publicar(EXEMPLOS.find((e) => e.id === "festival"), "compacta");
  linha(publicada ? vermelho("Duplicou a notícia!") : `${amarelo("✖ recusada:")} essa notícia já está no repositório`);

  console.log(
    negrito(
      `\nResumo: ${RepositorioNoticias.instanciasCriadas} instância do repositório, ` +
        `${RepositorioNoticias.getInstancia().total} notícias publicadas, 3 telas lendo os mesmos dados.\n`
    )
  );
}

main();
