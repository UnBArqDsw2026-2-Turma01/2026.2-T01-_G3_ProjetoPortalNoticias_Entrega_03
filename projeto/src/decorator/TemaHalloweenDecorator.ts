import { PaginaPortalDecorator } from './PaginaPortalDecorator.js';

// ConcreteDecorator: acrescenta somente a paleta de Halloween ao objeto envolvido.
export class TemaHalloweenDecorator extends PaginaPortalDecorator {
  override renderizar(): string {
    return this.adicionarTema(
      '--destaque:#b94708;--barra:#21162d;--fundo:#f6effa;--cartao:#fffbf7;--texto:#281a34;--borda:#ba692f;--suave:#67576f;',
    );
  }
}
