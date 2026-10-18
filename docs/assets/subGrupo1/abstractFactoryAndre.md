# Abstract Factory de Comunidades

<style>
  .af-zoom__controles {
    position: sticky;
    top: 3.6rem;
    z-index: 1;
    display: flex;
    gap: 0.4rem;
    justify-content: flex-end;
    padding: 0.4rem 0;
    background: var(--md-default-bg-color);
  }
  .af-zoom__controles button {
    min-width: 2.6rem;
    padding: 0.25rem 0.6rem;
    border: 1px solid var(--md-default-fg-color--lighter);
    border-radius: 0.3rem;
    background: var(--md-default-bg-color);
    color: var(--md-default-fg-color);
    font: inherit;
    cursor: pointer;
  }
  .af-zoom__controles button:hover {
    border-color: var(--md-accent-fg-color);
  }
  .af-zoom__area {
    overflow: auto;
  }
  /* O SVG do Mermaid ocupa a largura do contêiner, então o zoom aumenta essa largura. */
  .af-zoom__area > * {
    width: calc(var(--af-zoom, 1) * 100%);
  }
</style>

<div class="af-zoom" markdown>
<div class="af-zoom__controles" role="group" aria-label="Zoom do diagrama">
<button type="button" data-af-zoom="out" aria-label="Diminuir zoom">−</button>
<button type="button" data-af-zoom="reset" aria-label="Restaurar zoom">100%</button>
<button type="button" data-af-zoom="in" aria-label="Aumentar zoom">+</button>
</div>

<div class="af-zoom__area" markdown>

```mermaid
classDiagram
direction TB
    class CriadorDeComunidade {
        -factory: ComunidadeFactory
        -passos: List~String~
        +CriadorDeComunidade(factory: ComunidadeFactory)
        +montarConfiguracao(nome: String, descricao: String) ConfiguracaoComunidade
        -garantirMesmaFamilia(produtos: List) void
    }

    class ComunidadeFactory {
        +definirFactory(categoria: String)$ ComunidadeFactory
        +criarTema() TemaVisual
        +criarPoliticaModeracao() PoliticaModeracao
        +criarWidgetPadrao() WidgetPadrao
    }

    class ComunidadeTecnologiaFactory {
        +criarTema() TemaVisual
        +criarPoliticaModeracao() PoliticaModeracao
        +criarWidgetPadrao() WidgetPadrao
    }
    class ComunidadeEsportesFactory {
        +criarTema() TemaVisual
        +criarPoliticaModeracao() PoliticaModeracao
        +criarWidgetPadrao() WidgetPadrao
    }
    class ComunidadeCulturaFactory {
        +criarTema() TemaVisual
        +criarPoliticaModeracao() PoliticaModeracao
        +criarWidgetPadrao() WidgetPadrao
    }
    class ComunidadePoliticaFactory {
        +criarTema() TemaVisual
        +criarPoliticaModeracao() PoliticaModeracao
        +criarWidgetPadrao() WidgetPadrao
    }

    class TemaVisual {
        #familia: String
        #corPrimaria: String
        #corSecundaria: String
        #icone: String
        #banner: String
        +aplicar(pagina: HTMLElement) void
    }
    class TemaTecnologia
    class TemaEsportes
    class TemaCultura
    class TemaPolitica

    class PoliticaModeracao {
        #familia: String
        #nivelRigor: String
        #exigeAprovacaoPrevia: boolean
        #regra: String
        +moderar(conteudo: String) boolean
    }
    class PoliticaModeracaoTecnica
    class PoliticaModeracaoEsportes
    class PoliticaModeracaoCultura
    class PoliticaModeracaoPolitica

    class WidgetPadrao {
        #familia: String
        #titulo: String
        #posicao: String
        #itens: List~String~
        +renderizar() String
    }
    class WidgetTrendingTags
    class WidgetPlacarAoVivo
    class WidgetAgendaCultura
    class WidgetPautaPolitica

    class ConfiguracaoComunidade {
        -nome: String
        -descricao: String
        -tema: TemaVisual
        -moderacao: PoliticaModeracao
        -widget: WidgetPadrao
    }

    class Comunidade {
        -corTema: String
        -regrasModeracao: String
        +atualizarDados(descricao: String, regras: String) void
    }

    <<abstract>> ComunidadeFactory
    <<abstract>> TemaVisual
    <<abstract>> PoliticaModeracao
    <<abstract>> WidgetPadrao

    note for ComunidadeFactory "definirFactory() recebe a categoria escolhida
    na área de criação de comunidade e devolve
    a fábrica concreta correspondente"

    CriadorDeComunidade o--> ComunidadeFactory : factory
    CriadorDeComunidade --> TemaVisual : usa
    CriadorDeComunidade --> PoliticaModeracao : usa
    CriadorDeComunidade --> WidgetPadrao : usa
    CriadorDeComunidade ..> ConfiguracaoComunidade : cria
    ConfiguracaoComunidade ..> Comunidade : preenche corTema e regrasModeracao

    ComunidadeFactory <|-- ComunidadeTecnologiaFactory
    ComunidadeFactory <|-- ComunidadeEsportesFactory
    ComunidadeFactory <|-- ComunidadeCulturaFactory
    ComunidadeFactory <|-- ComunidadePoliticaFactory

    TemaVisual <|-- TemaTecnologia
    TemaVisual <|-- TemaEsportes
    TemaVisual <|-- TemaCultura
    TemaVisual <|-- TemaPolitica
    PoliticaModeracao <|-- PoliticaModeracaoTecnica
    PoliticaModeracao <|-- PoliticaModeracaoEsportes
    PoliticaModeracao <|-- PoliticaModeracaoCultura
    PoliticaModeracao <|-- PoliticaModeracaoPolitica
    WidgetPadrao <|-- WidgetTrendingTags
    WidgetPadrao <|-- WidgetPlacarAoVivo
    WidgetPadrao <|-- WidgetAgendaCultura
    WidgetPadrao <|-- WidgetPautaPolitica

    ComunidadeTecnologiaFactory ..> TemaTecnologia : cria
    ComunidadeTecnologiaFactory ..> PoliticaModeracaoTecnica : cria
    ComunidadeTecnologiaFactory ..> WidgetTrendingTags : cria

    ComunidadeEsportesFactory ..> TemaEsportes : cria
    ComunidadeEsportesFactory ..> PoliticaModeracaoEsportes : cria
    ComunidadeEsportesFactory ..> WidgetPlacarAoVivo : cria

    ComunidadeCulturaFactory ..> TemaCultura : cria
    ComunidadeCulturaFactory ..> PoliticaModeracaoCultura : cria
    ComunidadeCulturaFactory ..> WidgetAgendaCultura : cria

    ComunidadePoliticaFactory ..> TemaPolitica : cria
    ComunidadePoliticaFactory ..> PoliticaModeracaoPolitica : cria
    ComunidadePoliticaFactory ..> WidgetPautaPolitica : cria
```

</div>
</div>

<script>
  (() => {
    if (window.afZoomAtivo) return;
    window.afZoomAtivo = true;
    document.addEventListener("click", (evento) => {
      const botao = evento.target.closest("[data-af-zoom]");
      if (!botao) return;
      const caixa = botao.closest(".af-zoom");
      const area = caixa.querySelector(".af-zoom__area");
      const atual = parseFloat(area.dataset.zoom || "1");
      const acao = botao.dataset.afZoom;
      const zoom = acao === "in" ? Math.min(3, atual + 0.25) : acao === "out" ? Math.max(0.5, atual - 0.25) : 1;
      area.dataset.zoom = String(zoom);
      area.style.setProperty("--af-zoom", zoom);
      caixa.querySelector('[data-af-zoom="reset"]').textContent = `${Math.round(zoom * 100)}%`;
    });
  })();
</script>
