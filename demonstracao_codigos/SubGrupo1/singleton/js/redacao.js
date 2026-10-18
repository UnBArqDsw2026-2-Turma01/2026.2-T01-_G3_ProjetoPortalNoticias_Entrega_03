// Redação: liga os dois padrões do subgrupo. Monta a notícia com o Builder (Director + builder
// concreto, código em ../builder) e publica o resultado no Singleton RepositorioNoticias.

class Redacao {
  static #builders = {
    destaque: () => new NoticiaDestaqueBuilder(),
    compacta: () => new NoticiaCompactaBuilder(),
    mista: () => new NoticiaMistaBuilder(),
  };

  static get versoes() {
    return Object.keys(Redacao.#builders);
  }

  publicar(exemplo, versao) {
    const criarBuilder = Redacao.#builders[versao];
    if (!criarBuilder) {
      throw new Error(`Builder desconhecido: ${versao}`);
    }

    const builder = criarBuilder();
    const director = new NoticiaDirector(builder);
    director.construirPersonalizada(
      exemplo.titulo,
      exemplo.subtitulo,
      exemplo.categoria,
      exemplo.capa,
      new Autor(exemplo.autor.nome, exemplo.autor.foto),
      exemplo.blocos.map(([tipo, conteudo]) => new ItemRoteiro(TipoBloco[tipo], conteudo)),
      exemplo.fonte
    );
    const noticia = builder.getResultado();

    const publicada = RepositorioNoticias.getInstancia().publicar(noticia);
    return { noticia, publicada };
  }
}
