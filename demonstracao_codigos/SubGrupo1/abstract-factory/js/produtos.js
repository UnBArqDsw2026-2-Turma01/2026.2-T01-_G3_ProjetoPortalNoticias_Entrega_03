// Produtos abstratos e concretos. Cada família (tecnologia, esportes, cultura, política)
// fornece um conjunto completo de peças; o cliente nunca instancia essas classes diretamente.

function escaparHtml(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

class TemaVisual {
  constructor(familia, corPrimaria, corSecundaria, icone, banner) {
    if (new.target === TemaVisual) {
      throw new Error("TemaVisual é abstrata: use uma das implementações de família.");
    }
    this.familia = familia;
    this.corPrimaria = corPrimaria;
    this.corSecundaria = corSecundaria;
    this.icone = icone;
    this.banner = banner;
  }

  aplicar(pagina) {
    pagina.style.setProperty("--cor-primaria", this.corPrimaria);
    pagina.style.setProperty("--cor-secundaria", this.corSecundaria);
    // URL absoluta: dentro de var(), um caminho relativo seria resolvido a partir de css/.
    pagina.style.setProperty("--banner", `url("${new URL(this.banner, document.baseURI).href}")`);
  }
}

class TemaTecnologia extends TemaVisual {
  constructor() { super("tecnologia", "#7a42e6", "#fdfbfa", "img/icone-tecnologia.svg", "img/banner-tecnologia.jpg"); }
}

class TemaEsportes extends TemaVisual {
  constructor() { super("esportes", "#fd8316", "#fdfbfa", "img/icone-esportes.svg", "img/banner-esportes.jpg"); }
}

class TemaCultura extends TemaVisual {
  constructor() { super("cultura", "#be37bc", "#fdfbfa", "img/icone-cultura.svg", "img/banner-cultura.jpg"); }
}

class TemaPolitica extends TemaVisual {
  constructor() { super("politica", "#1e6bef", "#fdfbfa", "img/icone-politica.svg", "img/banner-politica.jpg"); }
}

class PoliticaModeracao {
  constructor(familia, nivelRigor, exigeAprovacaoPrevia, regra) {
    if (new.target === PoliticaModeracao) {
      throw new Error("PoliticaModeracao é abstrata: use uma das implementações de família.");
    }
    this.familia = familia;
    this.nivelRigor = nivelRigor;
    this.exigeAprovacaoPrevia = exigeAprovacaoPrevia;
    this.regra = regra;
  }

  moderar(conteudo) { throw new Error("moderar() não implementado"); }
}

class PoliticaModeracaoTecnica extends PoliticaModeracao {
  constructor() {
    super("tecnologia", "moderado", false, "Exemplos de código precisam ser reproduzíveis; links de divulgação sem contexto são removidos.");
  }

  moderar(conteudo) {
    const temLink = /https?:\/\//.test(conteudo);
    const palavrasSemLink = conteudo.replace(/https?:\/\/\S+/g, "").trim().split(/\s+/).filter(Boolean);
    return !temLink || palavrasSemLink.length >= 8;
  }
}

class PoliticaModeracaoEsportes extends PoliticaModeracao {
  constructor() {
    super("esportes", "moderado", false, "Resultados de partidas precisam do placar e da competição; ofensas a atletas ou torcidas são removidas.");
  }

  moderar(conteudo) {
    const ofensivo = /\b(lixo|vagabundo|idiota)\b/i.test(conteudo);
    const citaResultado = /\b(venceu|perdeu|empatou|resultado)\b/i.test(conteudo);
    const temPlacar = /\b\d+\s*[x×-]\s*\d+\b/.test(conteudo);
    return !ofensivo && (!citaResultado || temPlacar);
  }
}

class PoliticaModeracaoCultura extends PoliticaModeracao {
  constructor() {
    super("cultura", "moderado", false, "Imagens de terceiros precisam de crédito de autoria na legenda.");
  }

  moderar(conteudo) {
    const citaImagem = /\b(imagem|foto|fotografia)\b/i.test(conteudo);
    return !citaImagem || /(cr[eé]dito|©)/i.test(conteudo);
  }
}

class PoliticaModeracaoPolitica extends PoliticaModeracao {
  constructor() {
    super("politica", "alto", true, "Afirmações políticas precisam de fonte primária e identificação do autor.");
  }

  moderar(conteudo) {
    return /fonte:/i.test(conteudo) && /autor:/i.test(conteudo);
  }
}

class WidgetPadrao {
  constructor(familia, titulo, posicao, itens) {
    if (new.target === WidgetPadrao) {
      throw new Error("WidgetPadrao é abstrata: use uma das implementações de família.");
    }
    this.familia = familia;
    this.titulo = titulo;
    this.posicao = posicao;
    this.itens = itens;
  }

  renderizar() {
    const itens = this.itens.map((item) => `<li>${escaparHtml(item)}</li>`).join("");
    return `
      <aside class="widget widget--${this.posicao}">
        <h3>${escaparHtml(this.titulo)}</h3>
        <ul>${itens}</ul>
      </aside>`;
  }
}

class WidgetTrendingTags extends WidgetPadrao {
  constructor() {
    super("tecnologia", "Tags em alta", "lateral", ["#javascript", "#ia", "#arquitetura"]);
  }
}

class WidgetPlacarAoVivo extends WidgetPadrao {
  constructor() {
    super("esportes", "Placar ao vivo", "topo", ["Brasília 2 x 1 Gama · 2º tempo", "Final do vôlei universitário · 19h"]);
  }
}

class WidgetAgendaCultura extends WidgetPadrao {
  constructor() {
    super("cultura", "Agenda cultural", "lateral", ["Feira Cultural da Praça · 14/10", "Aulas de flauta · 16/10"]);
  }
}

class WidgetPautaPolitica extends WidgetPadrao {
  constructor() {
    super("politica", "Pauta do dia", "topo", ["Debate sobre os rumos do país", "Dia das eleições chegando"]);
  }
}
