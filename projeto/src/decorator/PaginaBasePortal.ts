import type { PaginaPortal } from './PaginaPortal.js';
import { renderizarHome } from '../home/renderizarHome.js';

// ConcreteComponent: apresenta a Home original, sem conhecer os temas.
export class PaginaBasePortal implements PaginaPortal {
  renderizar(): string {
    return renderizarHome();
  }
}
