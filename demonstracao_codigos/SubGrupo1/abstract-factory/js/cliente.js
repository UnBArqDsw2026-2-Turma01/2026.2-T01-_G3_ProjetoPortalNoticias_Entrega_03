// Interface da demonstração: escolhe a comunidade de exemplo e a fábrica, monta a página e lista os passos.

const CATEGORIAS = {
  tecnologia: "Tecnologia",
  esportes: "Esportes",
  cultura: "Cultura",
  politica: "Política",
};

const EXEMPLOS = [
  { id: "dev", nome: "Dev de Plantão", descricao: "Discussões sobre código, arquitetura e IA.", familia: "tecnologia" },
  { id: "festival", nome: "Festival de Rua", descricao: "Shows, feiras e oficinas no Centro.", familia: "cultura" },
  { id: "debate", nome: "Debate Político", descricao: "Análises sobre eleições e projetos de lei.", familia: "politica" },
  { id: "arquibancada", nome: "Arquibancada", descricao: "Resultados, campeonatos e bastidores do esporte local.", familia: "esportes" },
];

let familiaAtual = "tecnologia";
let exemploAtual = EXEMPLOS[0];

const seletorExemplo = document.getElementById("exemplo");
const grupoFamilias = document.getElementById("familias");
const conteudo = document.getElementById("conteudo");

seletorExemplo.innerHTML = EXEMPLOS.map((e) => `<option value="${e.id}">${e.nome}</option>`).join("");

grupoFamilias.innerHTML = Object.entries(CATEGORIAS)
  .map(([chave, rotulo]) => `<button type="button" data-familia="${chave}">${rotulo}</button>`)
  .join("");

const NOTICIAS_POR_FAMILIA = {
  tecnologia: [
    { titulo: "Nova empresa de tecnologia muda o mercado", selo: "Tecnologia", imagem: "img/noticia-tecnologia-empresa.jpg" },
    { titulo: "Gatinhos injetam bugs nos servidores da amazon", selo: "Tecnologia", imagem: "img/noticia-tecnologia-gatinhos.jpg" },
  ],
  esportes: [
    { titulo: "Remo contra o Fluminense já está marcado para a próxima quinta", selo: "Esportes", imagem: "img/noticia-esportes-remo.jpg" },
    { titulo: "Nas olimpíadas a pergunta é: qual o verdadeiro poder das bolas?", selo: "Esportes", imagem: "img/noticia-esportes-tenis.jpg" },
  ],
  cultura: [
    { titulo: "Festival de rua movimenta o Centro neste fim de semana", selo: "Cultura", imagem: "img/noticia-cultura-festival.jpg" },
    { titulo: "Quem faz aula de flauta terça-feira?", selo: "Cultura", imagem: "img/noticia-cultura-flauta.jpg" },
  ],
  politica: [
    { titulo: "Debate coloca diferentes opiniões em confronto", selo: "Política", imagem: "img/noticia-politica-debate.jpg" },
    { titulo: "Dia das eleições chegando: o Brasil que queremos", selo: "Política", imagem: "img/noticia-politica-eleicoes.jpg" },
  ],
};

function renderizarComunidade(config, familia) {
  const noticias = NOTICIAS_POR_FAMILIA[familia].map((n) => `
        <article class="noticia-card">
          <img class="noticia-card__imagem" src="${escaparHtml(n.imagem)}" alt="">
          <div class="noticia-card__corpo">
            <span class="noticia-card__selo">${escaparHtml(n.selo)}</span>
            <h4>${escaparHtml(n.titulo)}</h4>
            <button type="button" class="noticia-card__botao">Ler Mais</button>
          </div>
        </article>`).join("");
  return `
    <header class="banner">
      <h1 class="banner__titulo">${escaparHtml(config.nome.toUpperCase())}</h1>
    </header>

    <div class="comunidade">
      <div class="comunidade__cabecalho">
        <span class="comunidade__icone"><img src="${escaparHtml(config.tema.icone)}" alt=""></span>
        <h2>${escaparHtml(config.nome)}</h2>
        <button type="button" class="botao-seguir" aria-pressed="false">+ Seguir</button>
      </div>

      <p class="comunidade__descricao">${escaparHtml(config.descricao)}</p>

      <div class="comunidade__corpo comunidade__corpo--${config.widget.posicao}">
        ${config.widget.renderizar()}
        <section class="comunidade__noticias">
          <h3>Últimas notícias</h3>
          <div class="noticias">${noticias}
          </div>
        </section>
      </div>

      <form class="moderacao" id="form-moderacao">
        <h3>Publicar na comunidade</h3>
        <p class="moderacao__regra">Regra (${escaparHtml(config.moderacao.nivelRigor)}): ${escaparHtml(config.moderacao.regra)}</p>
        <textarea id="texto-publicacao" rows="3" placeholder="Escreva sua publicação..."></textarea>
        <button type="submit">Enviar para moderação</button>
        <p class="moderacao__resultado" id="resultado-moderacao" role="status"></p>
      </form>
    </div>`;
}

function montarComunidade() {
  let criador;
  try {
    criador = new CriadorDeComunidade(ComunidadeFactory.definirFactory(familiaAtual));
    const config = criador.montarConfiguracao(exemploAtual.nome, exemploAtual.descricao);
    conteudo.innerHTML = renderizarComunidade(config, familiaAtual);
    config.tema.aplicar(conteudo);
    conteudo.querySelector("#form-moderacao").addEventListener("submit", (evento) => {
      evento.preventDefault();
      const texto = conteudo.querySelector("#texto-publicacao").value.trim();
      const resultado = conteudo.querySelector("#resultado-moderacao");
      if (!texto) {
        resultado.textContent = "";
        return;
      }
      const aprovado = config.moderacao.moderar(texto);
      resultado.textContent = aprovado
        ? `Aprovado por ${config.moderacao.constructor.name}.`
        : `Recusado por ${config.moderacao.constructor.name}: a publicação não segue a regra da comunidade.`;
      resultado.dataset.aprovado = String(aprovado);
    });
    conteudo.querySelector(".botao-seguir").addEventListener("click", (evento) => {
      const seguindo = evento.currentTarget.getAttribute("aria-pressed") !== "true";
      evento.currentTarget.setAttribute("aria-pressed", String(seguindo));
      evento.currentTarget.textContent = seguindo ? "✓ Seguindo" : "+ Seguir";
    });
  } catch (erro) {
    conteudo.innerHTML = `<p class="erro">Não foi possível montar a comunidade: ${escaparHtml(erro.message)}</p>`;
  }
  document.getElementById("passos").innerHTML = (criador ? criador.passos : []).map((p) => `<li>${escaparHtml(p)}</li>`).join("");
  grupoFamilias.querySelectorAll("[data-familia]").forEach((botao) => {
    botao.setAttribute("aria-pressed", String(botao.dataset.familia === familiaAtual));
  });
}

seletorExemplo.addEventListener("change", () => {
  exemploAtual = EXEMPLOS.find((e) => e.id === seletorExemplo.value);
  familiaAtual = exemploAtual.familia;
  montarComunidade();
});

grupoFamilias.addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-familia]");
  if (!botao) return;
  familiaAtual = botao.dataset.familia;
  montarComunidade();
});

montarComunidade();
