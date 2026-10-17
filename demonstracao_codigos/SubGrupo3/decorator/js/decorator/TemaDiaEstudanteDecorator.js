import { PaginaPortalDecorator } from './PaginaPortalDecorator.js';
// ConcreteDecorator: acrescenta a paleta de Dia do Estudante e o logo temático ao objeto envolvido.
export class TemaDiaEstudanteDecorator extends PaginaPortalDecorator {
    renderizar() {
        return this.adicionarTema('--destaque:#2457b3;--barra:#152b4f;--fundo:#f3f7ff;--cartao:#ffffff;--texto:#162d51;--borda:#dcac33;--suave:#566882;')
            .replace('LogoBurburinho.svg', 'BurburinhoEstudante.svg');
    }
}
