# Decorator na Home do Burburinho

Demonstração local em TypeScript do padrão GoF estrutural Decorator. A Home logada vem do protótipo fornecido; os temas comemorativos são extensões autorizadas para esta atividade.

## Executar

Pré-requisito: Node.js 22.12 ou superior e npm.

```bash
cd projeto
npm ci
npm run dev
```

Abra o endereço informado pelo Vite (normalmente http://127.0.0.1:5173). Não abra `index.html` diretamente: o navegador precisa da compilação de TypeScript pelo Vite.

```bash
npm test       # delegação, composição, isolamento e restauração
npm run build # checagem estrita de TypeScript e compilação
npm run preview # prévia do build, após npm run build
```

A demonstração não exige backend, conta de usuário, API ou conexão com serviços externos depois de instalar as dependências. As imagens são locais. Não representa o portal completo: os links de navegação são âncoras ilustrativas, sem outras telas; busca, notificações e acessibilidade não têm fluxo implementado. O botão de salvar alterna seu estado local; esse estado é descartado ao recriar a Home.

## Demonstrar no vídeo

1. Selecione **Padrão** e mostre a Home logada: “Bom dia, Giovanna!”, sem foto de perfil.
2. Selecione Natal, Halloween e Dia do Estudante; observe símbolos, bordas, partículas, saudação, título da seção e selos dos cards.
3. Mostre a cadeia no painel: cada tema empilha cinco decoradores, um por responsabilidade.
4. Abra `PaginaPortal`, `PaginaBasePortal`, `PaginaPortalDecorator` e um dos decoradores concretos no editor.
5. Mostre `npm test` e use **Restaurar original**. Também é possível voltar pelo seletor Padrão.

O painel pertence à demonstração e fica fora do HTML produzido pelo padrão. A Home mantém a composição desktop do protótipo (1440 × 900); o painel e o banner acrescentam altura e podem exigir rolagem. Em telas estreitas há rolagem horizontal. As animações ficam estáticas se o sistema solicitar movimento reduzido.

## Organização e papéis

| Arquivo | Papel / responsabilidade |
| --- | --- |
| `src/decorator/PaginaPortal.ts` | Component: `renderizar(): string`. |
| `src/decorator/PaginaBasePortal.ts` | ConcreteComponent: Home sem temas. |
| `src/decorator/PaginaPortalDecorator.ts` | Decorator abstrato: referência à página e delegação. |
| `src/decorator/TemaNatalDecorator.ts` | ConcreteDecorator de paleta natalina. |
| `src/decorator/TemaHalloweenDecorator.ts` | ConcreteDecorator de paleta de Halloween. |
| `src/decorator/TemaDiaEstudanteDecorator.ts` | ConcreteDecorator de paleta do Dia do Estudante. |
| `src/decorator/TextosFestivosDecorator.ts` | ConcreteDecorator de saudação, seção e selos comemorativos. |
| `src/decorator/EnfeitesBordaDecorator.ts` | ConcreteDecorator de moldura e enfeites estáticos. |
| `src/decorator/AnimacaoFestivaDecorator.ts` | ConcreteDecorator de neve, morcegos ou confetes. |
| `src/decorator/BannerFestivoDecorator.ts` | ConcreteDecorator do cabeçalho comemorativo. |
| `src/decorator/temas.ts` | Dados e símbolos das datas. |
| `src/DecoratorDemo.ts` | Client: monta e descreve as camadas. |
| `src/home/usuario.ts` | Nome da usuária fictícia logada. |
| `src/home/renderizarHome.ts` | Estrutura e conteúdo do protótipo, com espaços delimitados para os textos festivos. |
| `src/main.ts`, `index.html` | Seleção de uma data por vez e restauração. |
| `src/styles.css` | Layout, apresentação das camadas e animações com movimento reduzido. |
| `tests/decorator.test.mjs` | Sete testes de delegação, independência, composição, textos e restauração. |

Isso é Decorator por composição de objetos, não a sintaxe `@` do TypeScript.

## Composição

No Natal, a Home é envolvida assim (os decoradores parametrizados também recebem `natal` no construtor):

```text
TemaNatalDecorator(
  BannerFestivoDecorator(
    AnimacaoFestivaDecorator(
      EnfeitesBordaDecorator(
        TextosFestivosDecorator(PaginaBasePortal)
      )
    )
  )
)
```

A paleta externa fornece variáveis CSS para todas as camadas. Cada ConcreteDecorator delega uma única vez e acrescenta somente sua responsabilidade. A cadeia no painel vem da mesma lista de classes usada para construir os objetos. A interface seleciona uma data por vez; o empilhamento ocorre entre responsabilidades, sem misturar datas. Uma nova composição é criada em cada troca para evitar resíduos.

Os textos são transformados apenas nos atributos `data-*` reservados pela Home. O helper e os decoradores recebem constantes internas confiáveis. Conteúdo futuro fornecido por usuários precisa de escape/sanitização ou renderização segura em um framework.

## Suposições e decisões para conferir

- O nome veio como “[COLOQUE AQUI O NOME]”; foi adotado **Giovanna** pela autoria no projeto. Para trocar, edite `src/home/usuario.ts`.
- Sessão logada demonstrativa, sem backend; a foto de perfil foi retirada da marcação e o alinhamento dos controles foi ajustado.
- Uma data por vez, com cinco ConcreteDecorators empilhados por tema. Os símbolos e textos comemorativos são propostas autorizadas, pois não estão no protótipo.
- Mudança manual para gravar o vídeo; sem calendário automático ou persistência.
- Títulos, fotografias, categorias e demais notícias ficam preservados; saudações, seção e selos variam por data.
- Dados, horários e eventos continuam estáticos, inclusive a data do evento da referência.
- Desktop 1440 × 900, com rolagem em telas menores. Fonte Arial/Helvetica e ícones reconstruídos podem apresentar diferenças em relação ao protótipo.
- Respeita `prefers-reduced-motion`; partículas decorativas não interceptam cliques nem são anunciadas por leitores de tela.
- O relatório da SubEquipe 03 abriga a contribuição estrutural individual, sem substituir o GoF comportamental mínimo do grupo.
- O PDF não contém rubrica específica de envio; seguiram-se o relatório local e a organização de MonitoreSeuTreino. Conferir diretrizes adicionais do Aprender3.
- A autora deve gravar/incorporar o vídeo, revisar o relato e registrar os commits da entrega.

## Proveniência dos assets

As fotos em `public/assets/` foram extraídas de imagens embutidas em `Home Page Logado.svg`, do arquivo `Protótipo.zip` fornecido pela autora, e convertidas para WebP para uso local. `marca.png` é uma extração da marca da mesma tela, preservando sua transparência. Não foram usadas imagens externas. Os ícones em `src/home/icones.ts` são reconstruções vetoriais dos controles da referência.

A documentação, incluindo os trechos de código, está integrada em `docs/Base/Relatórios/1.1.3.SubEquipe_03.md`. Toda a contribuição está no bloco expansível “Giovanna Aguiar — Decorator”, incluindo o espaço para o vídeo. A organização segue a referência [MonitoreSeuTreino](https://github.com/UnBArqDsw2026-1-Turma01/2026.1-T01-_G7_MonitoreSeuTreino_Entrega_03/blob/main/docs/content/padroes-de-projeto/3-2-gofs-estruturais.md).
