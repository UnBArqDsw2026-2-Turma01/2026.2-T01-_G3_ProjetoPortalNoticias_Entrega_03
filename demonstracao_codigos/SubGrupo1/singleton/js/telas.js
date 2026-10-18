// Clientes do Singleton: as telas do portal que exibem notícias.
// Nenhuma tela cria o repositório nem guarda uma cópia das notícias: todas pedem por getInstancia().

class Tela {
  get repositorio() {
    return RepositorioNoticias.getInstancia();
  }

  noticias() {
    throw new Error("noticias() deve ser implementado pela tela.");
  }
}

class PaginaInicial extends Tela {
  constructor(quantidade = 5) {
    super();
    this.nome = "Página inicial";
    this.quantidade = quantidade;
  }

  noticias() {
    return this.repositorio.listarRecentes(this.quantidade);
  }
}

class PaginaCategoria extends Tela {
  constructor(categoria) {
    super();
    this.categoria = categoria;
  }

  get nome() {
    return `Categoria ${this.categoria}`;
  }

  noticias() {
    return this.repositorio.listarPorCategoria(this.categoria);
  }
}

class SecaoDestaques extends Tela {
  constructor() {
    super();
    this.nome = "Destaques";
  }

  noticias() {
    return this.repositorio.listarDestaques();
  }
}
