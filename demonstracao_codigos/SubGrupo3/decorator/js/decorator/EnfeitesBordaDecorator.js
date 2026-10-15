import { PaginaPortalDecorator } from './PaginaPortalDecorator.js';
import { temas } from './temas.js';
// ConcreteDecorator: acrescenta uma moldura estática e um padrão sutil nas bordas.
export class EnfeitesBordaDecorator extends PaginaPortalDecorator {
    tema;
    constructor(pagina, tema) {
        super(pagina);
        this.tema = tema;
    }
    renderizar() {
        const enfeites = temas[this.tema].enfeites.map((simbolo, indice) => `<span class="enfeite enfeite-${indice}">${simbolo}</span>`).join('');
        return `<div class="moldura-festiva moldura-${this.tema}">
      <div class="enfeites-borda" aria-hidden="true">${enfeites}</div>
      ${super.renderizar()}
    </div>`;
    }
}
