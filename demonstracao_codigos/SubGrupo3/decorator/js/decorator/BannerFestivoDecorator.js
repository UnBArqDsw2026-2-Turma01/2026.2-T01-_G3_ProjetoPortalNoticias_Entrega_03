import { PaginaPortalDecorator } from './PaginaPortalDecorator.js';
import { temas } from './temas.js';
// ConcreteDecorator: acrescenta somente o cabeçalho comemorativo.
export class BannerFestivoDecorator extends PaginaPortalDecorator {
    tema;
    constructor(pagina, tema) {
        super(pagina);
        this.tema = tema;
    }
    renderizar() {
        const { nome, data, simbolo, mensagem } = temas[this.tema];
        return `<div class="camada-banner">
      <header class="banner-tema" role="note">
        <span class="simbolo-banner" aria-hidden="true">${simbolo}</span>
        <div><strong>${nome} · ${data}</strong><p>${mensagem}</p></div>
        <span class="ornamento-banner" aria-hidden="true">✦ · ✧ · ✦</span>
      </header>
      ${super.renderizar()}
    </div>`;
    }
}
