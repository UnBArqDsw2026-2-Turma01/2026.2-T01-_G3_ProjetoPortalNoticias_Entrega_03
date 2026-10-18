// Builder: interface comum e os três builders concretos.
// Todos recebem exatamente as mesmas chamadas do Director, mas montam notícias com visuais diferentes.

class NoticiaBuilder {
  constructor() {
    if (new.target === NoticiaBuilder) {
      throw new Error("NoticiaBuilder é uma interface: use NoticiaDestaqueBuilder, NoticiaCompactaBuilder ou NoticiaMistaBuilder.");
    }
  }

  reset() { throw new Error("reset() não implementado"); }
  definirCabecalho(titulo, categoria, capa) { throw new Error("definirCabecalho() não implementado"); }
  definirSubtitulo(subtitulo) { throw new Error("definirSubtitulo() não implementado"); }
  definirAutor(autor) { throw new Error("definirAutor() não implementado"); }
  adicionarTexto(texto) { throw new Error("adicionarTexto() não implementado"); }
  adicionarImagem(img) { throw new Error("adicionarImagem() não implementado"); }
  adicionarCarrossel(imgs) { throw new Error("adicionarCarrossel() não implementado"); }
  adicionarTopicos(itens) { throw new Error("adicionarTopicos() não implementado"); }
  definirRodape(fonte) { throw new Error("definirRodape() não implementado"); }
  getResultado() { throw new Error("getResultado() não implementado"); }
}

// Versão destaque (protótipo do Figma): capa grande ocupando toda a largura,
// letra capitular no primeiro parágrafo e carrossel de slides grandes.
class NoticiaDestaqueBuilder extends NoticiaBuilder {
  constructor() {
    super();
    this.reset();
  }

  reset() {
    this.noticia = new Noticia("destaque");
    this.primeiroTexto = true;
  }

  definirCabecalho(titulo, categoria, capa) {
    this.noticia.titulo = titulo;
    this.noticia.categoria = categoria;
    this.noticia.capa = new ImagemBloco(capa.url, { legenda: capa.legenda, largura: 100, classe: "capa" });
  }

  definirSubtitulo(subtitulo) {
    this.noticia.subtitulo = subtitulo;
  }

  definirAutor(autor) {
    this.noticia.autor = autor;
  }

  adicionarTexto(texto) {
    this.noticia.adicionar(new TextoBloco(texto, { capitular: this.primeiroTexto }));
    this.primeiroTexto = false;
  }

  adicionarImagem(img) {
    this.noticia.adicionar(new ImagemBloco(img.url, { legenda: img.legenda, largura: 100 }));
  }

  adicionarCarrossel(imgs) {
    this.noticia.adicionar(new CarrosselBloco(imgs, { modo: "slides" }));
  }

  adicionarTopicos(itens) {
    this.noticia.adicionar(new TopicosBloco(itens));
  }

  definirRodape(fonte) {
    this.noticia.rodape = fonte;
  }

  getResultado() {
    const resultado = this.noticia;
    this.reset();
    return resultado;
  }
}

// Versão compacta: capa pequena ao lado do título, imagens menores ao lado do texto,
// sem capitular e carrossel em faixa de miniaturas.
class NoticiaCompactaBuilder extends NoticiaBuilder {
  constructor() {
    super();
    this.reset();
  }

  reset() {
    this.noticia = new Noticia("compacta");
  }

  definirCabecalho(titulo, categoria, capa) {
    this.noticia.titulo = titulo;
    this.noticia.categoria = categoria;
    this.noticia.capa = new ImagemBloco(capa.url, { legenda: capa.legenda, largura: 100, classe: "capa capa--miniatura" });
  }

  definirSubtitulo(subtitulo) {
    this.noticia.subtitulo = subtitulo;
  }

  definirAutor(autor) {
    this.noticia.autor = autor;
  }

  adicionarTexto(texto) {
    this.noticia.adicionar(new TextoBloco(texto));
  }

  adicionarImagem(img) {
    this.noticia.adicionar(new ImagemBloco(img.url, { legenda: img.legenda, largura: 40, alinhamento: "direita" }));
  }

  adicionarCarrossel(imgs) {
    this.noticia.adicionar(new CarrosselBloco(imgs, { modo: "miniaturas" }));
  }

  adicionarTopicos(itens) {
    this.noticia.adicionar(new TopicosBloco(itens));
  }

  definirRodape(fonte) {
    this.noticia.rodape = fonte;
  }

  getResultado() {
    const resultado = this.noticia;
    this.reset();
    return resultado;
  }
}

// Posições possíveis do título sobre a capa (configuração do builder misto)
const PosicaoTitulo = Object.freeze({
  SUPERIOR_ESQUERDA: "superior-esquerda",
  SUPERIOR_DIREITA: "superior-direita",
  INFERIOR_ESQUERDA: "inferior-esquerda",
  INFERIOR_DIREITA: "inferior-direita",
  CENTRO: "centro",
});

// Versão mista: mistura as outras duas. A capa fica em destaque com o título e o subtítulo
// escritos sobre a imagem (na posição escolhida), o primeiro parágrafo tem capitular como no
// destaque e as imagens do corpo ficam ao lado do texto como na compacta.
// A posição do título é apresentação, então é configurada no builder e não passa pelo Director.
class NoticiaMistaBuilder extends NoticiaBuilder {
  constructor(posicaoTitulo = PosicaoTitulo.INFERIOR_ESQUERDA) {
    super();
    if (!Object.values(PosicaoTitulo).includes(posicaoTitulo)) {
      throw new Error(`Posição do título inválida: ${posicaoTitulo}`);
    }
    this.posicaoTitulo = posicaoTitulo;
    this.reset();
  }

  reset() {
    this.noticia = new Noticia("mista");
    this.noticia.posicaoTitulo = this.posicaoTitulo;
    this.primeiroTexto = true;
  }

  definirCabecalho(titulo, categoria, capa) {
    this.noticia.titulo = titulo;
    this.noticia.categoria = categoria;
    this.noticia.capa = new ImagemBloco(capa.url, { legenda: capa.legenda, largura: 100, classe: "capa capa--com-titulo" });
  }

  definirSubtitulo(subtitulo) {
    this.noticia.subtitulo = subtitulo;
  }

  definirAutor(autor) {
    this.noticia.autor = autor;
  }

  adicionarTexto(texto) {
    this.noticia.adicionar(new TextoBloco(texto, { capitular: this.primeiroTexto }));
    this.primeiroTexto = false;
  }

  adicionarImagem(img) {
    this.noticia.adicionar(new ImagemBloco(img.url, { legenda: img.legenda, largura: 40, alinhamento: "direita" }));
  }

  adicionarCarrossel(imgs) {
    this.noticia.adicionar(new CarrosselBloco(imgs, { modo: "slides" }));
  }

  adicionarTopicos(itens) {
    this.noticia.adicionar(new TopicosBloco(itens));
  }

  definirRodape(fonte) {
    this.noticia.rodape = fonte;
  }

  getResultado() {
    const resultado = this.noticia;
    this.reset();
    return resultado;
  }
}
