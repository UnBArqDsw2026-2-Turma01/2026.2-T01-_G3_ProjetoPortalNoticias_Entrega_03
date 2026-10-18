// Cliente da página "Montar notícia".
// O redator preenche o formulário e monta os blocos na ordem que quiser.
// O formulário vira o roteiro (List<ItemRoteiro>) que o Director recebe,
// e o builder escolhido monta a notícia final. A data de criação é gerada pela própria Notícia.

const NOMES_BLOCO = { TEXTO: "Texto", IMAGEM: "Imagem", CARROSSEL: "Carrossel", TOPICOS: "Tópicos" };

// Estado do formulário: o que o usuário já escolheu (os arquivos viram URLs locais)
const estado = {
  capa: null, // { url, legenda }
  fotoAutor: "assets/avatar-padrao.svg",
  blocos: [], // { tipo, texto, legenda, imagens: [{ url, legenda }] }
};

let pedido = null; // dados prontos para o Director, gerados ao clicar em "Revisar"

const formulario = document.getElementById("formulario");
const listaBlocos = document.getElementById("lista-blocos");

// ---------- Formulário -> roteiro (a lista que o Director recebe) ----------

function montarRoteiro() {
  return estado.blocos.map((bloco) => {
    switch (bloco.tipo) {
      case TipoBloco.TEXTO:
        return new ItemRoteiro(TipoBloco.TEXTO, bloco.texto.trim());
      case TipoBloco.IMAGEM:
        return new ItemRoteiro(TipoBloco.IMAGEM, bloco.imagens[0] ? { url: bloco.imagens[0].url, legenda: bloco.legenda.trim() } : null);
      case TipoBloco.CARROSSEL:
        return new ItemRoteiro(TipoBloco.CARROSSEL, bloco.imagens);
      case TipoBloco.TOPICOS:
        return new ItemRoteiro(TipoBloco.TOPICOS, bloco.texto.split("\n").map((linha) => linha.trim()).filter(Boolean));
    }
  });
}

function lerFormulario() {
  const dados = new FormData(formulario);
  return {
    titulo: dados.get("titulo").trim(),
    subtitulo: dados.get("subtitulo").trim(),
    categoria: dados.get("categoria"),
    capa: estado.capa,
    autor: new Autor(dados.get("autor").trim(), estado.fotoAutor),
    roteiro: montarRoteiro(),
    fonte: dados.get("fonte").trim(),
  };
}

// ---------- Passo 3: o Director monta a notícia com o builder escolhido ----------

const posicaoRevisao = document.getElementById("posicao-revisao");
const posicaoResultado = document.getElementById("posicao-titulo");

// O builder misto recebe a posição do título na criação: é configuração de apresentação
const builders = {
  destaque: () => new NoticiaDestaqueBuilder(),
  compacta: () => new NoticiaCompactaBuilder(),
  mista: () => new NoticiaMistaBuilder(posicaoResultado.value),
};

let versaoAtual = "destaque";

function montarNoticia(versao) {
  versaoAtual = versao;
  const builder = builders[versao]();
  const director = new NoticiaDirector(builder);
  director.construirPersonalizada(pedido.titulo, pedido.subtitulo, pedido.categoria, pedido.capa, pedido.autor, pedido.roteiro, pedido.fonte);
  const noticia = builder.getResultado();

  const resultado = document.getElementById("resultado");
  resultado.innerHTML = noticia.renderizar();
  iniciarCarrosseis(resultado);
  document.querySelectorAll("[data-versao]").forEach((botao) => {
    botao.setAttribute("aria-pressed", String(botao.dataset.versao === versao));
  });
  document.getElementById("campo-posicao").hidden = versao !== "mista";
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

// ---------- Navegação entre os passos (o "Voltar" do navegador também funciona) ----------

function mostrarPasso(passo) {
  document.getElementById("area-formulario").hidden = passo === 3;
  formulario.hidden = passo !== 1;
  document.getElementById("revisao").hidden = passo !== 2;
  document.getElementById("resultado").hidden = passo !== 3;
  document.getElementById("painel-resultado").hidden = passo !== 3;
  document.querySelectorAll(".linha-passos li").forEach((li) => {
    li.classList.toggle("ativo", Number(li.dataset.passo) <= passo);
  });
  window.scrollTo(0, 0);
}

function irParaPasso(passo) {
  history.pushState({ passo }, "", `#passo-${passo}`);
  mostrarPasso(passo);
}

window.addEventListener("popstate", (evento) => {
  const passo = evento.state?.passo ?? 1;
  mostrarPasso(pedido ? passo : 1);
});

// ---------- Passo 1: validação simples e ida para a revisão ----------

function mostrarErro(id, mensagem) {
  const elemento = document.getElementById(id);
  elemento.textContent = mensagem;
  elemento.hidden = !mensagem;
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const dados = new FormData(formulario);
  const faltando = [];
  if (!dados.get("categoria")) faltando.push("o tipo de conteúdo");
  if (!dados.get("titulo").trim()) faltando.push("o título");
  if (!dados.get("autor").trim()) faltando.push("o seu nome");
  if (!estado.capa) faltando.push("a imagem de capa");
  if (estado.blocos.length === 0) faltando.push("pelo menos um bloco");
  if (!dados.get("confirmo")) faltando.push("a confirmação");

  if (faltando.length) {
    mostrarErro("erro-formulario", `Falta preencher: ${faltando.join(", ")}.`);
    return;
  }
  mostrarErro("erro-formulario", "");
  pedido = lerFormulario();
  renderizarRevisao();
  irParaPasso(2);
});

formulario.addEventListener("reset", () => {
  estado.capa = null;
  estado.fotoAutor = "assets/avatar-padrao.svg";
  estado.blocos = [];
  renderizarCapa();
  renderizarBlocos();
  mostrarErro("erro-formulario", "");
});

// ---------- Passo 2: revisão do roteiro ----------

function resumoDoItem(item) {
  const c = item.conteudo;
  switch (item.tipo) {
    case TipoBloco.TEXTO:
      return `<p>${escaparHtml(c.length > 140 ? c.slice(0, 140) + "…" : c) || "<em>(vazio)</em>"}</p>`;
    case TipoBloco.IMAGEM:
      return c ? `<div class="miniaturas">${miniaturas([c])}</div>` : "<p><em>(sem imagem)</em></p>";
    case TipoBloco.CARROSSEL:
      return c.length ? `<div class="miniaturas">${miniaturas(c)}</div>` : "<p><em>(sem imagens)</em></p>";
    case TipoBloco.TOPICOS:
      return `<ul>${c.map((t) => `<li>${escaparHtml(t)}</li>`).join("")}</ul>`;
  }
}

function renderizarRevisao() {
  document.getElementById("revisao-dados").innerHTML = `
    <dt>Conteúdo</dt><dd>${escaparHtml(pedido.categoria)}</dd>
    <dt>Título</dt><dd>${escaparHtml(pedido.titulo)}</dd>
    ${pedido.subtitulo ? `<dt>Subtítulo</dt><dd>${escaparHtml(pedido.subtitulo)}</dd>` : ""}
    <dt>Autor</dt><dd>${escaparHtml(pedido.autor.getNome())}</dd>
    <dt>Data de criação</dt><dd>gerada automaticamente pela Notícia</dd>
    <dt>Capa</dt><dd>${miniaturas([pedido.capa])}</dd>
    ${pedido.fonte ? `<dt>Fonte</dt><dd>${escaparHtml(pedido.fonte)}</dd>` : ""}`;

  document.getElementById("revisao-roteiro").innerHTML = pedido.roteiro
    .map((item) => `<li><span class="tipo-bloco">TipoBloco.${item.tipo}</span>${resumoDoItem(item)}</li>`)
    .join("");
  mostrarErro("erro-revisao", "");
}

document.getElementById("voltar-editar").addEventListener("click", () => history.back());

// A posição do título só faz sentido para o builder misto
document.querySelectorAll('input[name="versao"]').forEach((opcao) => {
  opcao.addEventListener("change", () => {
    document.getElementById("campo-posicao-revisao").hidden = opcao.value !== "mista";
  });
});

posicaoResultado.addEventListener("change", () => montarNoticia(versaoAtual));

document.getElementById("montar").addEventListener("click", () => {
  const versao = document.querySelector('input[name="versao"]:checked').value;
  posicaoResultado.value = posicaoRevisao.value;
  try {
    montarNoticia(versao);
    irParaPasso(3);
  } catch (erro) {
    // O Director valida o roteiro antes de chamar o builder
    mostrarErro("erro-revisao", `O Director recusou o roteiro: ${erro.message}`);
  }
});

document.querySelectorAll("[data-versao]").forEach((botao) => {
  botao.addEventListener("click", () => montarNoticia(botao.dataset.versao));
});

// ---------- Capa e blocos do formulário ----------

function miniaturas(imagens) {
  return imagens.map((img) => `<img src="${escaparHtml(img.url)}" alt="">`).join("");
}

function renderizarCapa() {
  document.querySelector('[data-preview="capa"]').innerHTML = estado.capa ? miniaturas([estado.capa]) : "";
}

// Fotos do carrossel: cada uma pode ser arrastada para os lados, removida no ✕ e ganhar uma legenda.
// Só a imagem é arrastável, para que o campo de legenda continue aceitando seleção de texto.
function fotosDoCarrossel(bloco) {
  const fotos = bloco.imagens
    .map(
      (img, j) => `<div class="foto" data-foto="${j}">
        <div class="foto__imagem" draggable="true">
          <img src="${escaparHtml(img.url)}" alt="Foto ${j + 1}" draggable="false">
          <button type="button" class="foto__remover" data-remover-foto="${j}" aria-label="Remover foto ${j + 1}">✕</button>
        </div>
        <input class="foto__legenda" type="text" data-legenda-foto="${j}" placeholder="Legenda (opcional)" value="${escaparHtml(img.legenda)}" aria-label="Legenda da foto ${j + 1}">
      </div>`
    )
    .join("");
  const dica = bloco.imagens.length > 1 ? `<p class="dica-fotos">Segure e arraste uma foto para mudar a ordem.</p>` : "";
  return `<div class="miniaturas miniaturas--editaveis">${fotos}</div>${dica}`;
}

function campoDoBloco(bloco, i) {
  const upload = (multiplo) => `
    <label class="upload upload--pequeno" data-upload="${i}">
      <input type="file" accept="image/*" ${multiplo ? "multiple" : ""} hidden>
      <img src="assets/icone-upload.svg" width="30" height="27" alt="">
      <span class="upload__texto">${multiplo ? "Adicione fotos (uma de cada vez ou várias)" : "Envie uma imagem"}</span>
    </label>`;

  switch (bloco.tipo) {
    case TipoBloco.TEXTO:
      return `<textarea data-campo="texto" rows="4" placeholder="Inclua os principais detalhes: o que, onde, quando...">${escaparHtml(bloco.texto)}</textarea>`;
    case TipoBloco.IMAGEM:
      return `${upload(false)}<div class="miniaturas">${miniaturas(bloco.imagens)}</div>
        <input data-campo="legenda" type="text" placeholder="Legenda (opcional)" value="${escaparHtml(bloco.legenda)}">`;
    case TipoBloco.CARROSSEL:
      return upload(true) + fotosDoCarrossel(bloco);
    case TipoBloco.TOPICOS:
      return `<textarea data-campo="texto" rows="4" placeholder="Um tópico por linha">${escaparHtml(bloco.texto)}</textarea>`;
  }
}

function renderizarBlocos() {
  listaBlocos.innerHTML = estado.blocos
    .map(
      (bloco, i) => `<li class="bloco-form" data-indice="${i}">
        <div class="bloco-form__topo">
          <span>${i + 1}. ${NOMES_BLOCO[bloco.tipo]}</span>
          <span class="bloco-form__acoes">
            <button type="button" data-acao="subir" aria-label="Mover para cima" ${i === 0 ? "disabled" : ""}>↑</button>
            <button type="button" data-acao="descer" aria-label="Mover para baixo" ${i === estado.blocos.length - 1 ? "disabled" : ""}>↓</button>
            <button type="button" data-acao="remover" aria-label="Remover bloco">✕</button>
          </span>
        </div>
        ${campoDoBloco(bloco, i)}
      </li>`
    )
    .join("");
}

function adicionarBloco(tipo, valores = {}) {
  estado.blocos.push({ tipo, texto: "", legenda: "", imagens: [], ...valores });
}

document.querySelectorAll("[data-adicionar]").forEach((botao) => {
  botao.addEventListener("click", () => {
    adicionarBloco(botao.dataset.adicionar);
    renderizarBlocos();
  });
});

listaBlocos.addEventListener("click", (evento) => {
  const acao = evento.target.dataset.acao;
  if (!acao) return;
  const i = Number(evento.target.closest(".bloco-form").dataset.indice);
  const blocos = estado.blocos;
  if (acao === "remover") blocos.splice(i, 1);
  if (acao === "subir") [blocos[i - 1], blocos[i]] = [blocos[i], blocos[i - 1]];
  if (acao === "descer") [blocos[i + 1], blocos[i]] = [blocos[i], blocos[i + 1]];
  renderizarBlocos();
});

listaBlocos.addEventListener("input", (evento) => {
  const { campo, legendaFoto } = evento.target.dataset;
  if (!campo && legendaFoto === undefined) return;
  const i = Number(evento.target.closest(".bloco-form").dataset.indice);
  if (campo) estado.blocos[i][campo] = evento.target.value;
  // Legenda de uma foto do carrossel: fica junto da foto e acompanha a reordenação
  else estado.blocos[i].imagens[Number(legendaFoto)].legenda = evento.target.value;
});

// Upload por clique ou arrastando arquivos (capa e blocos de imagem)
function receberArquivos(alvo, arquivos) {
  const imagens = [...arquivos]
    .filter((arquivo) => arquivo.type.startsWith("image/"))
    .map((arquivo) => ({ url: URL.createObjectURL(arquivo), legenda: "" }));
  if (!imagens.length) return;

  if (alvo === "capa") {
    estado.capa = imagens[0];
    renderizarCapa();
  } else {
    const bloco = estado.blocos[Number(alvo)];
    // Imagem única é substituída; no carrossel as novas fotos entram no fim da lista
    bloco.imagens = bloco.tipo === TipoBloco.IMAGEM ? imagens.slice(0, 1) : [...bloco.imagens, ...imagens];
    renderizarBlocos();
  }
}

// Remover uma foto do carrossel
listaBlocos.addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-remover-foto]");
  if (!botao) return;
  const i = Number(botao.closest(".bloco-form").dataset.indice);
  estado.blocos[i].imagens.splice(Number(botao.dataset.removerFoto), 1);
  renderizarBlocos();
});

// Reordenar as fotos do carrossel arrastando (só dentro do mesmo bloco)
let fotoArrastada = null; // { bloco, foto }

listaBlocos.addEventListener("dragstart", (evento) => {
  if (!evento.target.closest(".foto__imagem")) return;
  const foto = evento.target.closest(".foto");
  fotoArrastada = { bloco: Number(foto.closest(".bloco-form").dataset.indice), foto: Number(foto.dataset.foto) };
  evento.dataTransfer.effectAllowed = "move";
  foto.classList.add("foto--arrastando");
});

listaBlocos.addEventListener("dragover", (evento) => {
  const foto = evento.target.closest(".foto");
  if (!foto || !fotoArrastada) return;
  if (Number(foto.closest(".bloco-form").dataset.indice) !== fotoArrastada.bloco) return;
  evento.preventDefault();
  listaBlocos.querySelectorAll(".foto--alvo").forEach((el) => el.classList.remove("foto--alvo"));
  foto.classList.add("foto--alvo");
});

listaBlocos.addEventListener("drop", (evento) => {
  const foto = evento.target.closest(".foto");
  if (!foto || !fotoArrastada) return;
  evento.preventDefault();
  const imagens = estado.blocos[fotoArrastada.bloco].imagens;
  const [movida] = imagens.splice(fotoArrastada.foto, 1);
  imagens.splice(Number(foto.dataset.foto), 0, movida);
  fotoArrastada = null;
  renderizarBlocos();
});

listaBlocos.addEventListener("dragend", () => {
  fotoArrastada = null;
  listaBlocos.querySelectorAll(".foto--arrastando, .foto--alvo").forEach((el) => el.classList.remove("foto--arrastando", "foto--alvo"));
});

document.addEventListener("change", (evento) => {
  const zona = evento.target.closest("[data-upload]");
  if (zona && evento.target.files) receberArquivos(zona.dataset.upload, evento.target.files);
});

document.addEventListener("dragover", (evento) => {
  if (evento.target.closest("[data-upload]")) evento.preventDefault();
});

document.addEventListener("drop", (evento) => {
  const zona = evento.target.closest("[data-upload]");
  if (!zona) return;
  evento.preventDefault();
  receberArquivos(zona.dataset.upload, evento.dataTransfer.files);
});

// ---------- Exemplos prontos para a demonstração (js/exemplos.js) ----------

// Converte um bloco do exemplo para o formato do formulário (o inverso de montarRoteiro)
function blocoDoExemplo([tipo, conteudo]) {
  switch (tipo) {
    case TipoBloco.TEXTO:
      return { tipo, texto: conteudo, legenda: "", imagens: [] };
    case TipoBloco.TOPICOS:
      return { tipo, texto: conteudo.join("\n"), legenda: "", imagens: [] };
    case TipoBloco.IMAGEM:
      return { tipo, texto: "", legenda: conteudo.legenda, imagens: [{ url: conteudo.url, legenda: "" }] };
    case TipoBloco.CARROSSEL:
      return { tipo, texto: "", legenda: "", imagens: conteudo.map((img) => ({ ...img })) };
  }
}

const seletorExemplo = document.getElementById("exemplo");
seletorExemplo.innerHTML += EXEMPLOS.map((e) => `<option value="${e.id}">${escaparHtml(e.nome)}</option>`).join("");

seletorExemplo.addEventListener("change", () => {
  const exemplo = EXEMPLOS.find((e) => e.id === seletorExemplo.value);
  if (!exemplo) return;
  formulario.categoria.value = exemplo.categoria;
  formulario.titulo.value = exemplo.titulo;
  formulario.subtitulo.value = exemplo.subtitulo;
  formulario.autor.value = exemplo.autor.nome;
  formulario.fonte.value = exemplo.fonte;
  formulario.confirmo.checked = true;
  estado.fotoAutor = exemplo.autor.foto;
  estado.capa = { ...exemplo.capa };
  estado.blocos = exemplo.blocos.map(blocoDoExemplo);
  posicaoRevisao.value = exemplo.posicaoTitulo;
  renderizarCapa();
  renderizarBlocos();
  mostrarErro("erro-formulario", "");
  seletorExemplo.value = "";
});

history.replaceState({ passo: 1 }, "", location.pathname);
mostrarPasso(1);
