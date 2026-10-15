import { PaginaPortalDecorator } from './PaginaPortalDecorator.js';
import { temas } from './temas.js';
import { nomeUsuario } from '../home/usuario.js';
// ConcreteDecorator: adapta apenas os espaços de texto identificados pela Home.
export class TextosFestivosDecorator extends PaginaPortalDecorator {
    tema;
    constructor(pagina, tema) {
        super(pagina);
        this.tema = tema;
    }
    renderizar() {
        const { saudacao, secao, selo } = temas[this.tema];
        return super.renderizar()
            .replace(/(<h1 data-saudacao>)[^<]*(<\/h1>)/, `$1${saudacao}, ${nomeUsuario}!$2`)
            .replace(/(<h2 id="titulo-ultimas" data-titulo-secao>)[^<]*(<\/h2>)/, `$1${secao}$2`)
            .replace(/(<span class="etiqueta destaque-label" data-selo>)[^<]*(<\/span>)/, `$1${selo}$2`)
            .replaceAll('<span class="selo-festivo" data-selo-post></span>', `<span class="selo-festivo" data-selo-post>${selo}</span>`);
    }
}
