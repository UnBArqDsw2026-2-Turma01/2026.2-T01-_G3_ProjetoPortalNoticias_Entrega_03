# Demonstração Next.js — State + Chain of Responsibility

Esta pasta contém uma aplicação **Next.js 14 com React e App Router** para demonstrar a adaptação **State combinado com Chain of Responsibility** no fluxo de publicação do Portal Burburinho.

## Como executar

Instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

Depois, abra `http://localhost:3000`. Para gerar uma versão de produção, use `npm run build` e `npm start`.

## Roteiro para o vídeo

1. Preencha os dados e clique em **Submeter para análise**: a etapa **Revise** abre um modal de confirmação com o conteúdo preenchido.
2. No modal, clique em **Continuar e submeter** para que o `Rascunho` mude para `EmModeracao` e delegue a validação para a Chain. Observe no **Log da Chain** a ordem `ConteudoObrigatorioHandler → FonteHandler → RevisaoEditorialHandler → ModeracaoHandler`.
3. No estado **Em moderação**, demonstre **Aprovar postagem** para mudar para `Publicada`, ou **Rejeitar postagem** para registrar a decisão sem criar um estado que não existe no diagrama.

## Correspondência com os papéis

- `Publication`: contexto que mantém o estado atual e encaminha ações.
- `PublicationState` e estados concretos: encapsulam as transições permitidas.
- `ValidationHandler`: interface/base dos handlers da Chain.
- `createValidationChain`: conecta os handlers na ordem da validação.
- `runValidationChain`: ponto em que o State delega a responsabilidade à Chain.

## O que é verificado na execução

- O contexto da notícia é exibido com título, resumo, autora e localização.
- O estado atual controla quais ações aparecem na tela e impede transições não permitidas.
- O log registra a delegação do State e cada encaminhamento da Chain.
- A execução válida percorre os quatro handlers na ordem configurada.
- O fluxo aprovado chega a `Publicada`.
- A rejeição é registrada como uma decisão da análise; o diagrama não define `Rejeitada` como estado concreto.

Os cenários são testes manuais guiados pela interface para a demonstração em vídeo. A implementação atual demonstra uma Chain válida, na qual todos os handlers aprovam; a rejeição é uma decisão explícita da etapa de análise.

O código React e as classes dos padrões estão em [`app/page.jsx`](./app/page.jsx), o layout e metadados em [`app/layout.jsx`](./app/layout.jsx), e os estilos globais em [`styles.css`](./styles.css).
