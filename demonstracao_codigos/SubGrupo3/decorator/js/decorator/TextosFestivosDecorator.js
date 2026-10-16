
import { PaginaPortalDecorator } from './PaginaPortalDecorator.js';
import { temas } from './temas.js';
import { nomeUsuario } from '../home/usuario.js';

// ConcreteDecorator: personaliza apenas textos gerais da página.
export class TextosFestivosDecorator extends PaginaPortalDecorator {
    tema;

    constructor(pagina, tema) {
        super(pagina);
        this.tema = tema;
    }

    renderizar() {
        const { saudacao, secao } = temas[this.tema];

        return super.renderizar()
            .replace(
                /(<h1 data-saudacao>)[^<]*(<\/h1>)/,
                `$1${saudacao}, ${nomeUsuario}!$2`
            )
            .replace(
                /(<h2 id="titulo-ultimas" data-titulo-secao>)[^<]*(<\/h2>)/,
                `$1${secao}$2`
            );
    }
}
