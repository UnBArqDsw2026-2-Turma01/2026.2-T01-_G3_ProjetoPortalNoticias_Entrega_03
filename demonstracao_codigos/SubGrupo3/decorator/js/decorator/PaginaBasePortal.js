import { PaginaPortal } from './PaginaPortal.js';
import { renderizarHome } from '../home/renderizarHome.js';

// ConcreteComponent: apresenta a Home, sem conhecer os temas comemorativos.
export class PaginaBasePortal extends PaginaPortal {
  renderizar() {
    return renderizarHome();
  }
}
