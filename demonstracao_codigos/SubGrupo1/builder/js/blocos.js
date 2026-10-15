// Partes do Produto: cada bloco sabe se renderizar como HTML.
// Os builders concretos decidem COMO cada bloco é configurado (tamanho, alinhamento, modo).

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

class Bloco {
  constructor() {
    if (new.target === Bloco) {
      throw new Error("Bloco é abstrato: use TextoBloco, ImagemBloco, CarrosselBloco ou TopicosBloco.");
    }
  }

  renderizar() {
    throw new Error("renderizar() deve ser implementado pela subclasse.");
  }
}

class TextoBloco extends Bloco {
  constructor(texto, { capitular = false } = {}) {
    super();
    this.texto = texto;
    this.capitular = capitular;
  }

  renderizar() {
    if (!this.capitular) {
      return `<p class="bloco-texto">${escaparHtml(this.texto)}</p>`;
    }
    // Letra capitular (primeira letra em destaque, como no protótipo)
    const primeira = this.texto.charAt(0);
    const resto = this.texto.slice(1);
    return `<p class="bloco-texto bloco-texto--capitular"><span class="capitular" aria-hidden="true">${escaparHtml(primeira)}</span><span class="sr-only">${escaparHtml(primeira)}</span>${escaparHtml(resto)}</p>`;
  }
}

class ImagemBloco extends Bloco {
  constructor(url, { legenda = "", largura = 100, alinhamento = "centro", classe = "" } = {}) {
    super();
    this.url = url;
    this.legenda = legenda;
    this.largura = largura; // porcentagem da coluna de conteúdo
    this.alinhamento = alinhamento; // "centro" | "direita"
    this.classe = classe;
  }

  renderizar() {
    const legenda = this.legenda
      ? `<figcaption>${escaparHtml(this.legenda)}</figcaption>`
      : "";
    return `<figure class="bloco-imagem bloco-imagem--${this.alinhamento} ${this.classe}" style="--largura: ${this.largura}%">
      <img src="${escaparHtml(this.url)}" alt="${escaparHtml(this.legenda)}" loading="lazy">
      ${legenda}
    </figure>`;
  }
}

class CarrosselBloco extends Bloco {
  constructor(imagens, { modo = "slides" } = {}) {
    super();
    this.imagens = imagens; // [{ url, legenda }]
    this.modo = modo; // "slides" (um por vez, com setas) | "miniaturas" (faixa rolável)
  }

  renderizar() {
    const itens = this.imagens
      .map(
        (img, i) => `<li class="carrossel__item">
          <img src="${escaparHtml(img.url)}" alt="${escaparHtml(img.legenda || `Imagem ${i + 1}`)}" loading="lazy">
          ${img.legenda ? `<span class="carrossel__legenda">${escaparHtml(img.legenda)}</span>` : ""}
        </li>`
      )
      .join("");

    const setas =
      this.modo === "slides"
        ? `<button type="button" class="carrossel__seta carrossel__seta--anterior" aria-label="Imagem anterior">‹</button>
           <button type="button" class="carrossel__seta carrossel__seta--proxima" aria-label="Próxima imagem">›</button>`
        : "";

    return `<div class="bloco-carrossel bloco-carrossel--${this.modo}" data-carrossel>
      <ul class="carrossel__trilho">${itens}</ul>
      ${setas}
    </div>`;
  }
}

class TopicosBloco extends Bloco {
  constructor(itens) {
    super();
    this.itens = itens;
  }

  renderizar() {
    const lis = this.itens.map((item) => `<li>${escaparHtml(item)}</li>`).join("");
    return `<ul class="bloco-topicos">${lis}</ul>`;
  }
}
