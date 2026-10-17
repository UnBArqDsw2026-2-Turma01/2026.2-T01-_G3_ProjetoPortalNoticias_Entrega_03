# Histórico de Rascunho — Memento

Demonstração independente do padrão Memento aplicada ao histórico de uma notícia. Os papéis são:

- `DraftMemento`: guarda uma cópia do estado da notícia e o instante do snapshot.
- `NoticiaEditorOriginator`: cria snapshots e restaura um estado salvo.
- `HistoricoRascunhosCaretaker`: mantém as pilhas de desfazer e refazer sem alterar o conteúdo do snapshot.

O editor permite alterar título e conteúdo, salvar versões e navegar entre elas com Undo e Redo. O autor e o identificador da notícia também fazem parte do estado guardado.

## Identidade visual

A tela segue o protótipo do portal demonstrado pelo SubGrupo 1: sidebar escura, fundo branco, tipografia Inter e vermelho para ações e destaques. Ela reutiliza o logo existente em `../SubGrupo1/singleton/assets/`, sem duplicar o arquivo de imagem.

## Como executar

Não é necessário instalar dependências nem iniciar um servidor:

1. Abra a pasta `demonstracao_codigos/subGrupo2` no Explorador de Arquivos.
2. Abra `index.html` com duplo clique (ou escolha seu navegador).
3. Digite um título e conteúdo, clique em **Salvar Snapshot**, faça outra alteração e salve novamente. Use **Desfazer** e **Refazer** para navegar entre as versões.

No PowerShell, a partir da raiz do repositório, também é possível abrir a página com:

```powershell
Start-Process .\demonstracao_codigos\subGrupo2\index.html
```

Os arquivos desta pasta formam uma demonstração executável sem build. A integração React/TypeScript do projeto fica em `app/page.tsx` e a implementação tipada da regra de negócio em `lib/memento.ts`.
