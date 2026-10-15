import { PaginaPortalDecorator } from './PaginaPortalDecorator.js';
import { temas } from './temas.js';
// ConcreteDecorator: acrescenta partículas animadas somente nas margens da Home.
export class AnimacaoFestivaDecorator extends PaginaPortalDecorator {
    tema;
    constructor(pagina, tema) {
        super(pagina);
        this.tema = tema;
    }
    renderizar() {
        const particulas = temas[this.tema].particulas.map((simbolo, indice) => `<span class="particula particula-${indice}">${simbolo}</span>`).join('');
        return `<div class="camada-animada">
      <div class="particulas particulas-${this.tema}" aria-hidden="true">${particulas}</div>
      ${super.renderizar()}
    </div>`;
    }
}
