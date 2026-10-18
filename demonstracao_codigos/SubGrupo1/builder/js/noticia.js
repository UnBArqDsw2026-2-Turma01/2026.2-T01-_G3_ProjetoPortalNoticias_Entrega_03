// Produto do Builder: a Notícia e o seu Autor.

class Autor {
  constructor(nome, foto) {
    this.nome = nome;
    this.foto = foto;
  }

  getNome() {
    return this.nome;
  }

  getFoto() {
    return this.foto;
  }
}

// Visual de cada editoria (cores e ícones das etiquetas do protótipo)
const CATEGORIAS = {
  Cultura: { cor: "#be37bc", icone: "assets/icone-cultura.svg", tamanho: [22.3047, 22.3141] },
  Política: { cor: "#1e6bef", icone: "assets/icone-politica.svg", tamanho: [20, 20] },
  Esporte: { cor: "#fd8316", icone: "assets/icone-esporte.svg", tamanho: [19, 19] },
  Tecnologia: { cor: "#7a42e6", icone: "assets/icone-tecnologia.svg", tamanho: [22, 15.6] },
};

class Noticia {
  constructor(variante) {
    this.variante = variante; // "destaque" | "compacta" | "mista", definida pelo builder concreto
    this.posicaoTitulo = null; // só a versão mista usa: onde o título fica sobre a capa
    this.titulo = "";
    this.subtitulo = "";
    this.categoria = "";
    this.capa = null; // ImagemBloco
    this.autor = null; // Autor
    this.dataCriacao = new Date(); // gerada automaticamente: ninguém de fora define a data
    this.blocos = [];
    this.rodape = "";
  }

  adicionar(bloco) {
    this.blocos.push(bloco);
  }

  getDataCriacao() {
    return this.dataCriacao;
  }

  formatarData() {
    const hoje = new Date();
    const hora = this.dataCriacao.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const mesmoDia = this.dataCriacao.toDateString() === hoje.toDateString();
    return mesmoDia ? `Hoje, ${hora}` : `${this.dataCriacao.toLocaleDateString("pt-BR")}, ${hora}`;
  }

  renderizarCategoria() {
    if (!this.categoria) return "";
    const estilo = CATEGORIAS[this.categoria] || { cor: "#f14343", icone: null };
    const icone = estilo.icone
      ? `<img class="badge__icone" src="${estilo.icone}" width="${estilo.tamanho[0]}" height="${estilo.tamanho[1]}" alt="">`
      : "";
    return `<span class="badge" style="--cor-badge: ${estilo.cor}">${icone}${escaparHtml(this.categoria)}</span>`;
  }

  renderizarAutor() {
    if (!this.autor) return "";
    return `<div class="autor">
      <img class="autor__foto" src="${escaparHtml(this.autor.getFoto())}" width="50" height="50" alt="Foto de ${escaparHtml(this.autor.getNome())}">
      <div class="autor__info">
        <span class="autor__nome">Por ${escaparHtml(this.autor.getNome())}</span>
        <time class="autor__data" datetime="${this.dataCriacao.toISOString()}">${this.formatarData()}</time>
      </div>
    </div>`;
  }

  renderizar() {
    const capa = this.capa ? this.capa.renderizar() : "";
    const corpo = this.blocos.map((bloco) => bloco.renderizar()).join("\n");
    const subtitulo = this.subtitulo
      ? `<p class="noticia__subtitulo">${escaparHtml(this.subtitulo)}</p>`
      : "";
    const posicao = this.posicaoTitulo ? ` titulo-${this.posicaoTitulo}` : "";
    const rodape = this.rodape
      ? `<footer class="noticia__rodape">Fonte: ${escaparHtml(this.rodape)}</footer>`
      : "";

    return `<article class="noticia noticia--${this.variante}">
      <a class="voltar" href="#" onclick="history.back(); return false;">
        <img class="voltar__icone" src="assets/icone-voltar.svg" width="6" height="10.3708" alt="">
        Voltar
      </a>
      <header class="noticia__cabecalho${posicao}">
        <div class="noticia__titulos">
          <div class="noticia__chamada">
            ${this.renderizarCategoria()}
            <h1 class="noticia__titulo">${escaparHtml(this.titulo)}</h1>
            ${subtitulo}
          </div>
          <div class="noticia__meta">
            ${this.renderizarAutor()}
            <div class="acoes">
              <button type="button" class="acao">
                <img src="assets/icone-compartilhar.svg" width="18.625" height="20.2806" alt="">
                Compartilhar
              </button>
              <button type="button" class="acao">
                <img src="assets/icone-salvar.svg" width="14.9945" height="21.1761" alt="">
                Salvar
              </button>
            </div>
          </div>
        </div>
        ${capa}
      </header>
      <div class="noticia__corpo">
        ${corpo}
      </div>
      ${rodape}
    </article>`;
  }
}
