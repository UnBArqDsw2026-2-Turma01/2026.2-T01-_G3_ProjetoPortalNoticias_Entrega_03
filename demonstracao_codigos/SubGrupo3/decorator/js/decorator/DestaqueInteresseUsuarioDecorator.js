import { PaginaPortalDecorator } from './PaginaPortalDecorator.js';
import { interessesUsuario } from '../home/usuario.js';
import { noticias, noticiasComemorativas } from '../home/noticias.js';

function normalizar(texto) {
  return String(texto ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim();
}

export class DestaqueInteresseUsuarioDecorator extends PaginaPortalDecorator {
  constructor(pagina, interesses = interessesUsuario) {
    super(pagina);
    this.interesses = new Set(interesses.map(normalizar));
  }

  correspondeInteresse(noticia) {
    return [noticia.categoria, ...(noticia.tags ?? [])]
      .map(normalizar).some(termo => this.interesses.has(termo));
  }

  renderizar() {
    const mapa = new Map([...noticias, ...noticiasComemorativas].map(n => [n.id, n]));
    return super.renderizar().replace(
      /(<article\b[^>]*\bdata-noticia="([^"]+)"[^>]*>)([\s\S]*?)(<\/article>)/g,
      (cartao, abertura, id, conteudo, fechamento) => {
        const noticia = mapa.get(id);
        if (!noticia || !this.correspondeInteresse(noticia)) return cartao;
        const novaAbertura = abertura.replace(/class="([^"]+)"/,
          (_, classes) => `class="${classes} noticia-interesse"`);
        const novoConteudo = conteudo.replace('<h3>',
          '<span class="selo-interesse">Para você</span><h3>');
        return `${novaAbertura}${novoConteudo}${fechamento}`;
      }
    );
  }
}
