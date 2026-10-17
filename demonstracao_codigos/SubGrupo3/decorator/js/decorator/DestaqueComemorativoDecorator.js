import { PaginaPortalDecorator } from './PaginaPortalDecorator.js';
import { noticiasComemorativas } from '../home/noticias.js';
import { temas } from './temas.js';
import { icone } from '../home/icones.js';

// Adiciona notícias temáticas no INÍCIO da listagem existente.
export class DestaqueComemorativoDecorator extends PaginaPortalDecorator {
  constructor(pagina, tema) { super(pagina); this.tema = tema; }

  obterNoticiasComemorativas() {
    return noticiasComemorativas.filter(n => n.tema === this.tema);
  }

  renderizarCartao(noticia) {
    const configuracao = temas[this.tema];
    return `<article class="noticia cartao noticia-comemorativa" data-noticia="${noticia.id}" data-comemoracao="${this.tema}">
      <img class="foto-noticia" src="assets/${noticia.foto}.webp" alt="${noticia.titulo}" />
      <div class="noticia-texto">
        <span class="categoria ${noticia.cor}">${icone(noticia.cor)}${noticia.categoria}</span>
        <button class="salvar" type="button" aria-label="Salvar notícia" aria-pressed="false">${icone('salvo')}</button>
        <span class="selo-comemorativo">${configuracao.simbolo} Especial ${configuracao.nome}</span>
        <h3><a href="#noticia-${noticia.id}" data-abrir-noticia="${noticia.id}">${noticia.titulo}</a></h3>
        <p class="resumo-noticia">${noticia.resumo}</p>
        <footer><b class="avatar ${noticia.cor}">${noticia.inicial}</b><strong>${noticia.autor}</strong><span>•&nbsp; ${noticia.tempo}</span></footer>
      </div>
    </article>`;
  }

  renderizar() {
    const html = super.renderizar();
    const noticias = this.obterNoticiasComemorativas();
    if (!noticias.length || !html.includes('<div class="noticias">')) return html;
    return html.replace('<div class="noticias">',
      `<div class="noticias">${noticias.map(n => this.renderizarCartao(n)).join('')}`);
  }
}
