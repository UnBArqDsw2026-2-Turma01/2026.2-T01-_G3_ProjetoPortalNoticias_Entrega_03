# Singleton · Repositório de Notícias

Demonstração do padrão **Singleton** (GoF criacional) no Burburinho: todas as telas do portal leem
as notícias publicadas de um único `RepositorioNoticias`.

## Como rodar

**Terminal** (precisa do Node.js):

```bash
cd demonstracao_codigos/SubGrupo1/singleton
node demo.js            # roda tudo de uma vez
node demo.js --pausar   # espera ENTER entre as etapas
```

**Navegador:** abra o `index.html`. A página segue a Home e as páginas de categoria do protótipo no Figma.
Abra o painel **Singleton · RepositorioNoticias** no canto inferior direito, escolha uma notícia e um builder
e clique em **Publicar no repositório**. A notícia aparece no Destaque, nas Últimas notícias e na página
da categoria (pela barra lateral).

## Arquivos

| Arquivo | Papel no padrão |
| ------- | --------------- |
| `js/repositorioNoticias.js` | O **Singleton**: instância única, construtor bloqueado e `getInstancia()` |
| `js/telas.js` | **Clientes**: Página inicial, Página de categoria e Destaques |
| `js/redacao.js` | Monta a notícia com o Builder (`../builder`) e publica no repositório |
| `demo.js` | Demonstração no terminal |
| `index.html`, `js/app.js`, `css/singleton.css` | Demonstração no navegador (telas do Figma) |
| `assets/` | Logo, ícones, banners e imagens exportados do Figma |

O código do Builder é carregado da pasta `../builder`, sem cópia.
