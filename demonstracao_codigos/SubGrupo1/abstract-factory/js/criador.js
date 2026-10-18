// Cliente do padrão: recebe uma fábrica concreta e usa apenas a interface ComunidadeFactory.
// Não conhece TemaTecnologia, PoliticaModeracaoEsportes etc.

class ConfiguracaoComunidade {
  constructor(nome, descricao, tema, moderacao, widget) {
    this.nome = nome;
    this.descricao = descricao;
    this.tema = tema;
    this.moderacao = moderacao;
    this.widget = widget;
  }
}

class CriadorDeComunidade {
  constructor(factory) {  
    this.factory = factory;
    this.passos = [];
  }

  montarConfiguracao(nome, descricao) {
    this.passos = [];
    const tema = this.chamar("criarTema", () => this.factory.criarTema());
    const moderacao = this.chamar("criarPoliticaModeracao", () => this.factory.criarPoliticaModeracao());
    const widget = this.chamar("criarWidgetPadrao", () => this.factory.criarWidgetPadrao());
    this.garantirMesmaFamilia(tema, moderacao, widget);
    return new ConfiguracaoComunidade(nome, descricao, tema, moderacao, widget);
  }

  chamar(passo, fabricar) {
    const produto = fabricar();
    this.passos.push(`${passo}() → ${produto.constructor.name} (família: ${produto.familia})`);
    return produto;
  }

  garantirMesmaFamilia(...produtos) {
    const familias = new Set(produtos.map((p) => p.familia));
    if (familias.size > 1) {
      throw new Error(`Peças de famílias diferentes na mesma comunidade: ${[...familias].join(", ")}`);
    }
  }
}
