// Interface da demonstração no navegador, seguindo as telas do protótipo no Figma.
// A Página inicial, a seção de Destaque e as páginas de categoria são clientes do Singleton:
// cada uma pede o repositório por getInstancia() e mostra o que estiver publicado nele.

const telas = {
  inicial: new PaginaInicial(4),
  destaques: new SecaoDestaques(),
  categoria: new PaginaCategoria("Esporte"),
};
const redacao = new Redacao();

// Banner e descrição de cada categoria (textos e imagens do Figma)
const INFO_CATEGORIAS = {
  Esporte: {
    banner: "assets/banner-esporte.png",
    posicao: "center 53%",
    descricao: "Acompanhe as principais notícias do mundo dos esportes. Confira resultados, competições, transferências, destaques, análises e tudo o que movimenta atletas, clubes e torcedores no Brasil e no mundo.",
  },
  Cultura: {
    banner: "assets/banner-cultura.png",
    posicao: "center",
    descricao: "Explore as histórias, manifestações e acontecimentos que movimentam a cultura. Aqui você encontra notícias sobre música, cinema, arte, literatura, televisão, eventos e muito mais, acompanhando as tendências e os principais destaques do cenário cultural.",
  },
  Política: {
    banner: "assets/banner-politica.png",
    posicao: "center 70%",
    descricao: "Acompanhe as principais notícias e acontecimentos da política no Brasil e no mundo. Confira decisões, debates, eleições, projetos de lei e os principais acontecimentos que impactam a sociedade.",
  },
  Tecnologia: {
    banner: "assets/banner-tecnologia.png",
    posicao: "center",
    descricao: "Fique por dentro das principais novidades do mundo da tecnologia. Acompanhe lançamentos, inovação, inteligência artificial, ciência, aplicativos, dispositivos e as tendências que estão transformando a sociedade e o nosso dia a dia.",
  },
};

// Cores das bolinhas de autor usadas no protótipo
const CORES_AUTOR = ["#fd8316", "#7a42e6", "#1e6bef", "#3fa535", "#be37bc"];

let versaoEscolhida = "destaque";
let telaAtual = "inicio";

// ---------- auxiliares de renderização ----------

// As imagens dos exemplos e os ícones das categorias ficam na pasta do Builder
const caminhoBuilder = (url) => `../builder/${url}`;

function corDoAutor(nome) {
  const soma = [...nome].reduce((total, letra) => total + letra.charCodeAt(0), 0);
  return CORES_AUTOR[soma % CORES_AUTOR.length];
}

function tempoDesde(data) {
  const minutos = Math.floor((Date.now() - data.getTime()) / 60000);
  if (minutos < 1) return "agora";
  if (minutos < 60) return `${minutos}min`;
  if (minutos < 1440) return `${Math.floor(minutos / 60)}h`;
  return `${Math.floor(minutos / 1440)}d`;
}

function autor(noticia) {
  const nome = noticia.autor ? noticia.autor.getNome() : "Redação Burburinho";
  return `<div class="autor">
    <span class="autor__avatar" style="--cor: ${corDoAutor(nome)}" aria-hidden="true">${escaparHtml(nome.charAt(0))}</span>
    <span class="autor__nome">${escaparHtml(nome)}</span>
    <span class="autor__tempo"><span class="ponto"></span>${tempoDesde(noticia.getDataCriacao())}</span>
  </div>`;
}

function badge(categoria) {
  const estilo = CATEGORIAS[categoria] || { cor: "#f14343" };
  const icone = estilo.icone ? `<img src="${caminhoBuilder(estilo.icone)}" alt="">` : "";
  return `<button type="button" class="badge" style="--cor: ${estilo.cor}" data-categoria="${escaparHtml(categoria)}">${icone}${escaparHtml(categoria)}</button>`;
}

function capa(noticia, classe) {
  return noticia.capa
    ? `<img class="${classe}" src="${escaparHtml(caminhoBuilder(noticia.capa.url))}" alt="">`
    : `<span class="${classe}"></span>`;
}

// ---------- telas ----------

function renderizarInicio() {
  const destaque = telas.destaques.noticias()[0];
  const ultimas = telas.inicial.noticias().filter((n) => n !== destaque).slice(0, 3);

  const cardDestaque = document.getElementById("destaque");
  cardDestaque.classList.toggle("destaque--vazio", !destaque);
  cardDestaque.innerHTML = destaque
    ? `${capa(destaque, "destaque__capa")}
      <div class="destaque__corpo">
        <div class="destaque__topo">
          <span class="etiqueta-destaque">DESTAQUE</span>
          <button type="button" aria-label="Salvar">
            <img src="assets/icone-salvar-grande.svg" width="14.9945" height="21.1761" alt="">
          </button>
        </div>
        <h2 class="destaque__titulo">${escaparHtml(destaque.titulo)}</h2>
        <p class="destaque__resumo">${escaparHtml(destaque.subtitulo)}</p>
        <div class="destaque__rodape">
          ${autor(destaque)}
          <button type="button" class="ler-noticia">Ler Notícia</button>
        </div>
      </div>`
    : `Nenhuma notícia em destaque ainda. Publique uma notícia com o builder "destaque" no painel do Singleton.`;

  document.getElementById("ultimas").innerHTML = ultimas.length
    ? ultimas
        .map(
          (n) => `<li class="post">
            ${capa(n, "post__capa")}
            <img class="post__salvar" src="assets/icone-salvar.svg" width="7.81577" height="11.0379" alt="">
            <div class="post__corpo">
              ${badge(n.categoria)}
              <h3 class="post__titulo">${escaparHtml(n.titulo)}</h3>
              ${autor(n)}
            </div>
          </li>`
        )
        .join("")
    : `<li class="ultimas__vazio">Nenhuma outra notícia publicada ainda.</li>`;
}

function renderizarCategoria() {
  const categoria = telas.categoria.categoria;
  const info = INFO_CATEGORIAS[categoria];
  const estilo = CATEGORIAS[categoria];

  const banner = document.getElementById("banner-imagem");
  banner.src = info.banner;
  banner.style.setProperty("--posicao", info.posicao);
  document.getElementById("banner-titulo").textContent = categoria.toUpperCase();
  document.getElementById("categoria-nome").textContent = categoria;
  document.getElementById("categoria-descricao").textContent = info.descricao;

  const icone = document.getElementById("categoria-icone");
  icone.style.setProperty("--cor", estilo.cor);
  icone.innerHTML = `<img src="${caminhoBuilder(estilo.icone)}" alt="">`;

  const noticias = telas.categoria.noticias();
  document.getElementById("lista-categoria").innerHTML = noticias.length
    ? noticias
        .map(
          (n) => `<li class="post-horizontal">
            ${capa(n, "post-horizontal__capa")}
            <div class="post-horizontal__corpo">
              ${badge(n.categoria)}
              <h3 class="post-horizontal__titulo">${escaparHtml(n.titulo)}</h3>
              <button type="button" class="ler-mais">Ler Mais</button>
            </div>
          </li>`
        )
        .join("")
    : `<li class="lista-categoria__vazia">Nenhuma notícia de ${escaparHtml(categoria)} publicada ainda.</li>`;
}

function renderizar() {
  renderizarInicio();
  renderizarCategoria();

  const repo = RepositorioNoticias.getInstancia();
  document.getElementById("instancia").textContent =
    `${RepositorioNoticias.instanciasCriadas} instância · repositório #${repo.id} · ${repo.total} notícia(s)`;
}

function mostrarTela(destino) {
  telaAtual = destino;
  document.getElementById("tela-inicio").hidden = destino !== "inicio";
  document.getElementById("tela-categoria").hidden = destino === "inicio";

  document.querySelector('[data-ir="inicio"]').toggleAttribute("aria-current", destino === "inicio");
  document.querySelectorAll(".conteudo").forEach((botao) => {
    botao.toggleAttribute("aria-current", destino !== "inicio" && botao.dataset.categoria === destino);
  });
  window.scrollTo(0, 0);
}

function abrirCategoria(categoria) {
  if (!INFO_CATEGORIAS[categoria]) return;
  telas.categoria.categoria = categoria;
  registrar(`${telas.categoria.nome} chamou <code>getInstancia()</code> → repositório #${telas.categoria.repositorio.id}`);
  renderizarCategoria();
  mostrarTela(categoria);
}

// ---------- painel do Singleton ----------

const registro = document.getElementById("registro");

function registrar(texto, tipo = "") {
  const hora = new Date().toLocaleTimeString("pt-BR");
  registro.insertAdjacentHTML("afterbegin", `<li class="${tipo}">${hora} ${texto}</li>`);
}

const seletorExemplo = document.getElementById("exemplo");
seletorExemplo.innerHTML = EXEMPLOS.map((e) => `<option value="${e.id}">${escaparHtml(e.nome)}</option>`).join("");

const versoes = document.getElementById("versoes");
versoes.innerHTML = Redacao.versoes
  .map((v) => `<button type="button" data-versao="${v}" aria-pressed="${v === versaoEscolhida}">${v}</button>`)
  .join("");
versoes.addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-versao]");
  if (!botao) return;
  versaoEscolhida = botao.dataset.versao;
  versoes.querySelectorAll("[data-versao]").forEach((b) => b.setAttribute("aria-pressed", String(b === botao)));
});

document.getElementById("publicar").addEventListener("click", () => {
  const exemplo = EXEMPLOS.find((e) => e.id === seletorExemplo.value);
  try {
    const { noticia, publicada } = redacao.publicar(exemplo, versaoEscolhida);
    if (publicada) {
      registrar(`Publicada (builder ${noticia.variante}): ${escaparHtml(noticia.titulo)}`, "ok");
    } else {
      registrar(`Recusada: "${escaparHtml(noticia.titulo)}" já está no repositório`, "aviso");
    }
  } catch (erro) {
    registrar(`Erro ao montar a notícia: ${escaparHtml(erro.message)}`, "erro");
  }
  renderizar();
});

document.getElementById("forcar-new").addEventListener("click", () => {
  try {
    new RepositorioNoticias();
    registrar("Uma segunda instância foi criada (isso não deveria acontecer)", "erro");
  } catch (erro) {
    registrar(`new bloqueado: ${escaparHtml(erro.message)}`, "erro");
  }
  renderizar();
});

// ---------- navegação ----------

document.querySelector('[data-ir="inicio"]').addEventListener("click", () => mostrarTela("inicio"));

document.addEventListener("click", (evento) => {
  const alvo = evento.target.closest("[data-categoria]");
  if (alvo) abrirCategoria(alvo.dataset.categoria);
});

document.getElementById("ver-todos").addEventListener("click", (evento) => {
  const extra = document.getElementById("conteudo-extra");
  extra.hidden = !extra.hidden;
  evento.currentTarget.textContent = extra.hidden ? "Ver todos" : "Ver menos";
});

// ---------- início ----------

for (const tela of Object.values(telas)) {
  const antes = RepositorioNoticias.instanciasCriadas;
  const repo = tela.repositorio;
  const situacao = RepositorioNoticias.instanciasCriadas > antes ? "criou a instância" : "reaproveitou a mesma";
  registrar(`${tela.nome} chamou <code>getInstancia()</code> → repositório #${repo.id} (${situacao})`);
}
renderizar();
