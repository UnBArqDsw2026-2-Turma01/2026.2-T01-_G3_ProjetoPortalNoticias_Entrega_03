// Component: contrato comum, representado por uma classe abstrata em JavaScript.
export class PaginaPortal {
  constructor() {
    if (new.target === PaginaPortal) {
      throw new Error('PaginaPortal é um contrato: use uma página concreta ou um decorador.');
    }
  }

  renderizar() {
    throw new Error('renderizar() deve ser implementado.');
  }
}
