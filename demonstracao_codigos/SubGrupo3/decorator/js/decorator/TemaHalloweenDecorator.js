import { PaginaPortalDecorator } from './PaginaPortalDecorator.js';
// ConcreteDecorator: acrescenta a paleta de Halloween e o logo temático ao objeto envolvido.
export class TemaHalloweenDecorator extends PaginaPortalDecorator {
    renderizar() {
        return this.adicionarTema('--destaque:#b94708;--barra:#21162d;--fundo:#f6effa;--cartao:#fffbf7;--texto:#281a34;--borda:#ba692f;--suave:#67576f;')
            .replace('LogoBurburinho.svg', 'BurburinhoHalloween.svg');
    }
}
