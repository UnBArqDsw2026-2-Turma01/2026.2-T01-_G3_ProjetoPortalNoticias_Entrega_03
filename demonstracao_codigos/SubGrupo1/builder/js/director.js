// Director: recebe o roteiro definido pelo redator e chama os passos do builder
// exatamente na ordem escolhida. Ele não sabe qual builder concreto está usando.

const TipoBloco = Object.freeze({
  TEXTO: "TEXTO",
  IMAGEM: "IMAGEM",
  CARROSSEL: "CARROSSEL",
  TOPICOS: "TOPICOS",
});

class ItemRoteiro {
  constructor(tipo, conteudo) {
    this.tipo = tipo;
    this.conteudo = conteudo;
  }
}

class NoticiaDirector {
  constructor(builder) {
    this.builder = builder;
  }

  setBuilder(builder) {
    this.builder = builder;
  }

  construirPersonalizada(titulo, subtitulo, categoria, capa, autor, roteiro, fonte) {
    this.validar(roteiro);

    this.builder.reset();
    this.builder.definirCabecalho(titulo, categoria, capa);
    if (subtitulo) {
      this.builder.definirSubtitulo(subtitulo);
    }
    this.builder.definirAutor(autor);

    for (const item of roteiro) {
      switch (item.tipo) {
        case TipoBloco.TEXTO:
          this.builder.adicionarTexto(item.conteudo);
          break;
        case TipoBloco.IMAGEM:
          this.builder.adicionarImagem(item.conteudo);
          break;
        case TipoBloco.CARROSSEL:
          this.builder.adicionarCarrossel(item.conteudo);
          break;
        case TipoBloco.TOPICOS:
          this.builder.adicionarTopicos(item.conteudo);
          break;
      }
    }

    if (fonte) {
      this.builder.definirRodape(fonte);
    }
  }

  construirNoticiaPadrao(titulo, categoria, capa, autor, texto) {
    this.builder.reset();
    this.builder.definirCabecalho(titulo, categoria, capa);
    this.builder.definirAutor(autor);
    this.builder.adicionarTexto(texto);
  }

  validar(roteiro) {
    if (!Array.isArray(roteiro) || roteiro.length === 0) {
      throw new Error("O roteiro da notícia precisa ter pelo menos um bloco.");
    }

    roteiro.forEach((item, i) => {
      const posicao = `Bloco ${i + 1}`;
      if (!(item instanceof ItemRoteiro) || !Object.values(TipoBloco).includes(item.tipo)) {
        throw new Error(`${posicao}: tipo de bloco inválido.`);
      }
      const c = item.conteudo;
      switch (item.tipo) {
        case TipoBloco.TEXTO:
          if (typeof c !== "string" || c.trim() === "") throw new Error(`${posicao}: texto vazio.`);
          break;
        case TipoBloco.IMAGEM:
          if (!c || !c.url) throw new Error(`${posicao}: imagem sem URL.`);
          break;
        case TipoBloco.CARROSSEL:
          if (!Array.isArray(c) || c.length < 2) throw new Error(`${posicao}: o carrossel precisa de pelo menos 2 imagens.`);
          break;
        case TipoBloco.TOPICOS:
          if (!Array.isArray(c) || c.length === 0) throw new Error(`${posicao}: lista de tópicos vazia.`);
          break;
      }
    });
  }
}
