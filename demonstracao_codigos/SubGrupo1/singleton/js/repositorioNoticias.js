// Singleton: o repositório único das notícias publicadas no portal.
// Toda tela que precisa de notícias pede o repositório por getInstancia() e recebe sempre o
// mesmo objeto, então o que é publicado num lugar aparece igual em todos os outros.

class RepositorioNoticias {
  static #instancia = null;
  static #liberado = false; // só o getInstancia() pode chamar o construtor
  static #instanciasCriadas = 0; // contador usado só para provar o padrão na demonstração

  #noticias = [];

  constructor() {
    // JavaScript não tem construtor privado, então o construtor recusa qualquer chamada
    // que não venha do getInstancia()
    if (!RepositorioNoticias.#liberado) {
      throw new Error("RepositorioNoticias é um Singleton: use RepositorioNoticias.getInstancia() em vez de new.");
    }
    RepositorioNoticias.#instanciasCriadas++;
    this.id = RepositorioNoticias.#instanciasCriadas;
    this.criadoEm = new Date();
  }

  // Ponto global de acesso: cria a instância só na primeira chamada (inicialização preguiçosa)
  static getInstancia() {
    if (RepositorioNoticias.#instancia === null) {
      RepositorioNoticias.#liberado = true;
      try {
        RepositorioNoticias.#instancia = new RepositorioNoticias();
      } finally {
        RepositorioNoticias.#liberado = false;
      }
    }
    return RepositorioNoticias.#instancia;
  }

  static get instanciasCriadas() {
    return RepositorioNoticias.#instanciasCriadas;
  }

  // Recebe a notícia já montada (pelo Builder) e guarda. Recusa notícia repetida.
  publicar(noticia) {
    if (!noticia || !noticia.titulo) {
      throw new Error("Só é possível publicar uma notícia com título.");
    }
    if (this.#noticias.some((n) => n.titulo === noticia.titulo)) {
      return false;
    }
    this.#noticias.push(noticia);
    return true;
  }

  // As consultas devolvem listas novas: quem lê não consegue mexer na lista interna
  listarRecentes(quantidade = 5) {
    return this.#noticias.slice(-quantidade).reverse();
  }

  listarPorCategoria(categoria) {
    return this.#noticias.filter((n) => n.categoria === categoria).reverse();
  }

  // Destaques são as notícias montadas pelo NoticiaDestaqueBuilder
  listarDestaques() {
    return this.#noticias.filter((n) => n.variante === "destaque").reverse();
  }

  get total() {
    return this.#noticias.length;
  }
}
