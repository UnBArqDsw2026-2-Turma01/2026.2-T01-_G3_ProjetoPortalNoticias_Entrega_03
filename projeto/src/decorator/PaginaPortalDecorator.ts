import type { PaginaPortal } from './PaginaPortal.js';

// Decorator: envolve qualquer Component, inclusive outro decorador.
export abstract class PaginaPortalDecorator implements PaginaPortal {
  constructor(protected readonly pagina: PaginaPortal) {}

  renderizar(): string {
    return this.pagina.renderizar();
  }

  protected adicionarTema(css: string): string {
    return `<section class="tema" style="${css}">
      ${this.pagina.renderizar()}
    </section>`;
  }
}
