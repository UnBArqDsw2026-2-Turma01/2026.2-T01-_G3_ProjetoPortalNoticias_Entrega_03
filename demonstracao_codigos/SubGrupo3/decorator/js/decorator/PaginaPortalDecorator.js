import { PaginaPortal } from './PaginaPortal.js';

// Decorator abstrato: envolve um Component, inclusive outro decorador.
export class PaginaPortalDecorator extends PaginaPortal {
  constructor(pagina) {
    super();
    if (new.target === PaginaPortalDecorator) {
      throw new Error('Use um decorador concreto.');
    }
    this.pagina = pagina;
  }

  renderizar() {
    return this.pagina.renderizar();
  }

  adicionarTema(css) {
    return `<section class="tema" style="${css}">
      ${this.pagina.renderizar()}
    </section>`;
  }
}
