import { PaginaPortalDecorator } from './PaginaPortalDecorator.js';
// ConcreteDecorator: acrescenta somente a paleta de Dia do Estudante ao objeto envolvido.
export class TemaDiaEstudanteDecorator extends PaginaPortalDecorator {
    renderizar() {
        return this.adicionarTema('--destaque:#2457b3;--barra:#152b4f;--fundo:#f3f7ff;--cartao:#ffffff;--texto:#162d51;--borda:#dcac33;--suave:#566882;');
    }
}
