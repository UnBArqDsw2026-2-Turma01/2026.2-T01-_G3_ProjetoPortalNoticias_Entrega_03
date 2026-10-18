// Cliente: escolhe uma notícia de exemplo, monta o roteiro (a ordem dos blocos),
// informa o autor e escolhe qual builder concreto vai montar a página. A data de criação
// não é informada: a própria Notícia gera a data no momento em que é criada.

const seletorExemplo = document.getElementById("exemplo");
const seletorPosicao = document.getElementById("posicao-titulo");

// O builder misto recebe a posição do título na criação: é configuração de apresentação
const builders = {
  destaque: () => new NoticiaDestaqueBuilder(),
  compacta: () => new NoticiaCompactaBuilder(),
  mista: () => new NoticiaMistaBuilder(seletorPosicao.value),
};

let versaoAtual = "destaque";

// Converte os blocos do exemplo na lista que o Director recebe
function roteiroDoExemplo(exemplo) {
  return exemplo.blocos.map(([tipo, conteudo]) => new ItemRoteiro(TipoBloco[tipo], conteudo));
}

// Embrulha o builder para registrar cada passo chamado pelo Director (só para a demonstração)
function registrarPassos(builder, passos) {
  return new Proxy(builder, {
    get(alvo, prop) {
      const valor = alvo[prop];
      if (typeof valor !== "function") return valor;
      return (...args) => {
        passos.push(prop);
        return valor.apply(alvo, args);
      };
    },
  });
}

function iniciarCarrosseis(raiz) {
  raiz.querySelectorAll("[data-carrossel]").forEach((carrossel) => {
    const trilho = carrossel.querySelector(".carrossel__trilho");
    const mover = (direcao) => {
      const passo = trilho.firstElementChild.getBoundingClientRect().width;
      trilho.scrollBy({ left: direcao * passo, behavior: "smooth" });
    };
    carrossel.querySelector(".carrossel__seta--anterior")?.addEventListener("click", () => mover(-1));
    carrossel.querySelector(".carrossel__seta--proxima")?.addEventListener("click", () => mover(1));
  });
}

function montarNoticia(versao) {
  versaoAtual = versao;
  const exemplo = EXEMPLOS.find((e) => e.id === seletorExemplo.value);
  const passos = [];
  const builder = registrarPassos(builders[versao](), passos);
  const director = new NoticiaDirector(builder);

  const conteudo = document.getElementById("conteudo");
  try {
    director.construirPersonalizada(
      exemplo.titulo,
      exemplo.subtitulo,
      exemplo.categoria,
      exemplo.capa,
      new Autor(exemplo.autor.nome, exemplo.autor.foto),
      roteiroDoExemplo(exemplo),
      exemplo.fonte
    );
    const noticia = builder.getResultado();
    conteudo.innerHTML = noticia.renderizar();
    iniciarCarrosseis(conteudo);
  } catch (erro) {
    conteudo.innerHTML = `<p class="erro">Não foi possível montar a notícia: ${escaparHtml(erro.message)}</p>`;
  }

  document.getElementById("passos").innerHTML = passos.map((p) => `<li>${p}()</li>`).join("");
  document.querySelectorAll("[data-versao]").forEach((botao) => {
    botao.setAttribute("aria-pressed", String(botao.dataset.versao === versao));
  });
  document.getElementById("campo-posicao").hidden = versao !== "mista";
}

seletorExemplo.innerHTML = EXEMPLOS.map((e) => `<option value="${e.id}">${escaparHtml(e.nome)}</option>`).join("");

seletorExemplo.addEventListener("change", () => {
  // Cada exemplo sugere uma posição para o título no builder misto
  const exemplo = EXEMPLOS.find((e) => e.id === seletorExemplo.value);
  seletorPosicao.value = exemplo.posicaoTitulo;
  montarNoticia(versaoAtual);
  window.scrollTo(0, 0);
});

document.querySelectorAll("[data-versao]").forEach((botao) => {
  botao.addEventListener("click", () => montarNoticia(botao.dataset.versao));
});

seletorPosicao.addEventListener("change", () => montarNoticia(versaoAtual));

// index.html#compacta ou index.html#mista abrem direto na versão escolhida
const versaoInicial = location.hash.slice(1);
montarNoticia(builders[versaoInicial] ? versaoInicial : "destaque");
