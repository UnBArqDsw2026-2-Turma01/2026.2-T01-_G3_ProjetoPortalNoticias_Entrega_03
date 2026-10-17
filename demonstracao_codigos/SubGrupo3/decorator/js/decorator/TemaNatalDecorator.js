import { PaginaPortalDecorator } from './PaginaPortalDecorator.js';
// ConcreteDecorator: acrescenta a paleta de Natal e o logo temático ao objeto envolvido.
export class TemaNatalDecorator extends PaginaPortalDecorator {
    renderizar() {
        return this.adicionarTema('--destaque:#ba303b;--barra:#173b31;--fundo:#fffaf3;--cartao:#fffdf8;--texto:#172d25;--borda:#cfa85b;--suave:#52645a;')
            .replace('LogoBurburinho.svg', 'BurburinhoNatal.svg');
    }
}
