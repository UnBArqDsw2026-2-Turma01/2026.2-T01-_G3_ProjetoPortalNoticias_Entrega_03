import { PaginaPortalDecorator } from './PaginaPortalDecorator.js';
import { temas } from './temas.js';
import { nomeUsuario } from '../home/usuario.js';

// Texto de saudação e seção geral: sem selo em TODAS as notícias.
export class TextosFestivosDecorator extends PaginaPortalDecorator {
  constructor(pagina, tema) { super(pagina); this.tema = tema; }

  renderizar() {
    const { saudacao, secao } = temas[this.tema];
    return super.renderizar()
      .replace(/(<h1 data-saudacao>)[^<]*(<\/h1>)/, `$1${saudacao}, ${nomeUsuario}!$2`)
      .replace(/(<h2 id="titulo-ultimas" data-titulo-secao>)[^<]*(<\/h2>)/, `$1${secao}$2`);
  }
}
