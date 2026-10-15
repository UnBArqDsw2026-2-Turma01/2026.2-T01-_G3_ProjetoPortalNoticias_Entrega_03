import type { PaginaPortal } from './PaginaPortal.js';
import { PaginaPortalDecorator } from './PaginaPortalDecorator.js';
import { temas, type Tema } from './temas.js';

// ConcreteDecorator: acrescenta partículas animadas somente nas margens da Home.
export class AnimacaoFestivaDecorator extends PaginaPortalDecorator {
  constructor(pagina: PaginaPortal, private readonly tema: Tema) { super(pagina); }

  override renderizar(): string {
    const particulas = temas[this.tema].particulas.map((simbolo, indice) =>
      `<span class="particula particula-${indice}">${simbolo}</span>`,
    ).join('');
    return `<div class="camada-animada">
      <div class="particulas particulas-${this.tema}" aria-hidden="true">${particulas}</div>
      ${super.renderizar()}
    </div>`;
  }
}
