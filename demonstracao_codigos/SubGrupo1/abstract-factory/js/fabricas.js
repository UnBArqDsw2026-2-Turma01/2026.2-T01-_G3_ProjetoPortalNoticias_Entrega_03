// Abstract Factory: interface com os métodos de criação e uma fábrica concreta por família.
// Acrescentar uma família é criar uma nova fábrica com seus produtos; o cliente não muda.

class ComunidadeFactory {
  constructor() {
    if (new.target === ComunidadeFactory) {
      throw new Error("ComunidadeFactory é uma interface: use uma das fábricas concretas.");
    }
  }

  // Ponto único onde a categoria escolhida na criação da comunidade vira uma fábrica concreta.
  static definirFactory(categoria) {
    const fabricas = {
      tecnologia: ComunidadeTecnologiaFactory,
      esportes: ComunidadeEsportesFactory,
      cultura: ComunidadeCulturaFactory,
      politica: ComunidadePoliticaFactory,
    };
    const Fabrica = fabricas[categoria];
    if (!Fabrica) {
      throw new Error(`Categoria de comunidade desconhecida: ${categoria}`);
    }
    return new Fabrica();
  }

  criarTema() { throw new Error("criarTema() não implementado"); }
  criarPoliticaModeracao() { throw new Error("criarPoliticaModeracao() não implementado"); }
  criarWidgetPadrao() { throw new Error("criarWidgetPadrao() não implementado"); }
}

class ComunidadeTecnologiaFactory extends ComunidadeFactory {
  criarTema() { return new TemaTecnologia(); }
  criarPoliticaModeracao() { return new PoliticaModeracaoTecnica(); }
  criarWidgetPadrao() { return new WidgetTrendingTags(); }
}

class ComunidadeEsportesFactory extends ComunidadeFactory {
  criarTema() { return new TemaEsportes(); }
  criarPoliticaModeracao() { return new PoliticaModeracaoEsportes(); }
  criarWidgetPadrao() { return new WidgetPlacarAoVivo(); }
}

class ComunidadeCulturaFactory extends ComunidadeFactory {
  criarTema() { return new TemaCultura(); }
  criarPoliticaModeracao() { return new PoliticaModeracaoCultura(); }
  criarWidgetPadrao() { return new WidgetAgendaCultura(); }
}

class ComunidadePoliticaFactory extends ComunidadeFactory {
  criarTema() { return new TemaPolitica(); }
  criarPoliticaModeracao() { return new PoliticaModeracaoPolitica(); }
  criarWidgetPadrao() { return new WidgetPautaPolitica(); }
}
