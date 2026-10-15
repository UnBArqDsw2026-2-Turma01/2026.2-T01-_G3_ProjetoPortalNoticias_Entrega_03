
# Builder de notícias com Director

```mermaid
classDiagram
direction TB
    class Cliente {
    }

    class NoticiaDirector {
	    -builder: NoticiaBuilder
	    +NoticiaDirector(builder: NoticiaBuilder)
	    +setBuilder(builder: NoticiaBuilder) void
	    +construirPersonalizada(titulo: String, subtitulo: String, categoria: String, capa: Imagem, autor: Autor, roteiro: List~ItemRoteiro~, fonte: String) void
	    +construirNoticiaPadrao(titulo: String, categoria: String, capa: Imagem, autor: Autor, texto: String) void
	    -validar(roteiro: List~ItemRoteiro~) void
    }

    class NoticiaBuilder {
	    +reset() void
	    +definirCabecalho(titulo: String, categoria: String, capa: Imagem) void
	    +definirSubtitulo(subtitulo: String) void
	    +definirAutor(autor: Autor) void
	    +adicionarTexto(texto: String) void
	    +adicionarImagem(img: Imagem) void
	    +adicionarCarrossel(imgs: List~Imagem~) void
	    +adicionarTopicos(itens: List~String~) void
	    +definirRodape(fonte: String) void
	    +getResultado() Noticia
    }

    class NoticiaDestaqueBuilder {
	    -noticia: Noticia
	    +definirCabecalho(titulo, categoria, capa) void
	    +definirSubtitulo(subtitulo) void
	    +definirAutor(autor) void
	    +adicionarCarrossel(imgs) void
	    +getResultado() Noticia
    }

    class NoticiaCompactaBuilder {
	    -noticia: Noticia
	    +definirCabecalho(titulo, categoria, capa) void
	    +definirSubtitulo(subtitulo) void
	    +definirAutor(autor) void
	    +adicionarCarrossel(imgs) void
	    +getResultado() Noticia
    }

    class NoticiaMistaBuilder {
	    -noticia: Noticia
	    -posicaoTitulo: PosicaoTitulo
	    +NoticiaMistaBuilder(posicaoTitulo: PosicaoTitulo)
	    +definirCabecalho(titulo, categoria, capa) void
	    +definirSubtitulo(subtitulo) void
	    +definirAutor(autor) void
	    +adicionarImagem(img) void
	    +adicionarCarrossel(imgs) void
	    +getResultado() Noticia
    }

    class Noticia {
	    -titulo: String
	    -subtitulo: String
	    -categoria: String
	    -capa: ImagemBloco
	    -posicaoTitulo: PosicaoTitulo
	    -autor: Autor
	    -dataCriacao: Date
	    -blocos: List~Bloco~
	    -rodape: String
	    +Noticia()
	    +adicionar(b: Bloco) void
	    +getDataCriacao() Date
	    +renderizar() String
    }

    class Bloco {
	    +renderizar() String
    }

    class TextoBloco {
    }

    class ImagemBloco {
	    -url: String
	    -largura: int
    }

    class CarrosselBloco {
    }

    class TopicosBloco {
    }

	<<interface>> NoticiaBuilder
	<<abstract>> Bloco

	note for Noticia "dataCriacao é gerada automaticamente
no construtor (new Date()): nem o
Cliente nem o Builder informam a data"
	note for NoticiaMistaBuilder "título e subtítulo ficam sobre a capa,
na posição recebida no construtor"
	note for Noticia "As informações do autor serão obtidas pelo servidor 
	(id do user no banco por exemplo)"

    Cliente --> NoticiaDirector : usa
    Cliente ..> NoticiaDestaqueBuilder : escolhe um
    Cliente ..> NoticiaCompactaBuilder : escolhe um
    Cliente ..> NoticiaMistaBuilder : escolhe um e a posição
    NoticiaDirector o--> NoticiaBuilder : builder
    NoticiaBuilder <|.. NoticiaDestaqueBuilder
    NoticiaBuilder <|.. NoticiaCompactaBuilder
    NoticiaBuilder <|.. NoticiaMistaBuilder
    NoticiaDestaqueBuilder --> Noticia : constrói
    NoticiaCompactaBuilder --> Noticia : constrói
    NoticiaMistaBuilder --> Noticia : constrói
    Noticia *-- Bloco
    Bloco <|-- TextoBloco
    Bloco <|-- ImagemBloco
    Bloco <|-- CarrosselBloco
    Bloco <|-- TopicosBloco
```

## Código do diagrama

```text
classDiagram
direction TB
    class Cliente {
    }

    class NoticiaDirector {
	    -builder: NoticiaBuilder
	    +NoticiaDirector(builder: NoticiaBuilder)
	    +setBuilder(builder: NoticiaBuilder) void
	    +construirPersonalizada(titulo: String, subtitulo: String, categoria: String, capa: Imagem, autor: Autor, roteiro: List~ItemRoteiro~, fonte: String) void
	    +construirNoticiaPadrao(titulo: String, categoria: String, capa: Imagem, autor: Autor, texto: String) void
	    -validar(roteiro: List~ItemRoteiro~) void
    }

    class NoticiaBuilder {
	    +reset() void
	    +definirCabecalho(titulo: String, categoria: String, capa: Imagem) void
	    +definirSubtitulo(subtitulo: String) void
	    +definirAutor(autor: Autor) void
	    +adicionarTexto(texto: String) void
	    +adicionarImagem(img: Imagem) void
	    +adicionarCarrossel(imgs: List~Imagem~) void
	    +adicionarTopicos(itens: List~String~) void
	    +definirRodape(fonte: String) void
	    +getResultado() Noticia
    }

    class NoticiaDestaqueBuilder {
	    -noticia: Noticia
	    +definirCabecalho(titulo, categoria, capa) void
	    +definirSubtitulo(subtitulo) void
	    +definirAutor(autor) void
	    +adicionarCarrossel(imgs) void
	    +getResultado() Noticia
    }

    class NoticiaCompactaBuilder {
	    -noticia: Noticia
	    +definirCabecalho(titulo, categoria, capa) void
	    +definirSubtitulo(subtitulo) void
	    +definirAutor(autor) void
	    +adicionarCarrossel(imgs) void
	    +getResultado() Noticia
    }

    class NoticiaMistaBuilder {
	    -noticia: Noticia
	    -posicaoTitulo: PosicaoTitulo
	    +NoticiaMistaBuilder(posicaoTitulo: PosicaoTitulo)
	    +definirCabecalho(titulo, categoria, capa) void
	    +definirSubtitulo(subtitulo) void
	    +definirAutor(autor) void
	    +adicionarImagem(img) void
	    +adicionarCarrossel(imgs) void
	    +getResultado() Noticia
    }

    class Noticia {
	    -titulo: String
	    -subtitulo: String
	    -categoria: String
	    -capa: ImagemBloco
	    -posicaoTitulo: PosicaoTitulo
	    -autor: Autor
	    -dataCriacao: Date
	    -blocos: List~Bloco~
	    -rodape: String
	    +Noticia()
	    +adicionar(b: Bloco) void
	    +getDataCriacao() Date
	    +renderizar() String
    }

    class Bloco {
	    +renderizar() String
    }

    class TextoBloco {
    }

    class ImagemBloco {
	    -url: String
	    -largura: int
    }

    class CarrosselBloco {
    }

    class TopicosBloco {
    }

	<<interface>> NoticiaBuilder
	<<abstract>> Bloco

	note for Noticia "dataCriacao é gerada automaticamente
no construtor (new Date()): nem o
Cliente nem o Builder informam a data"
	note for NoticiaMistaBuilder "título e subtítulo ficam sobre a capa,
na posição recebida no construtor"
	note for Noticia "As informações do autor serão obtidas pelo servidor 
	(id do user no banco por exemplo)"

    Cliente --> NoticiaDirector : usa
    Cliente ..> NoticiaDestaqueBuilder : escolhe um
    Cliente ..> NoticiaCompactaBuilder : escolhe um
    Cliente ..> NoticiaMistaBuilder : escolhe um e a posição
    NoticiaDirector o--> NoticiaBuilder : builder
    NoticiaBuilder <|.. NoticiaDestaqueBuilder
    NoticiaBuilder <|.. NoticiaCompactaBuilder
    NoticiaBuilder <|.. NoticiaMistaBuilder
    NoticiaDestaqueBuilder --> Noticia : constrói
    NoticiaCompactaBuilder --> Noticia : constrói
    NoticiaMistaBuilder --> Noticia : constrói
    Noticia *-- Bloco
    Bloco <|-- TextoBloco
    Bloco <|-- ImagemBloco
    Bloco <|-- CarrosselBloco
    Bloco <|-- TopicosBloco
```
