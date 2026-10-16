
import { PaginaPortalDecorator } from './PaginaPortalDecorator.js';
import { interessesUsuario } from '../home/usuario.js';
import { noticias, noticiasComemorativas } from '../home/noticias.js';

// Normaliza os termos para comparação sem diferenças de
// acentuação ou letras maiúsculas e minúsculas.
function normalizar(texto) {
    return String(texto ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

// ConcreteDecorator: destaca notícias de interesse da usuária.
export class DestaqueInteresseUsuarioDecorator extends PaginaPortalDecorator {

    constructor(pagina, interesses = interessesUsuario) {
        super(pagina);
        this.interesses = new Set(interesses.map(normalizar));
    }

    // Verifica se uma notícia corresponde aos interesses.
    correspondeInteresse(noticia) {
        const termos = [
            noticia.categoria,
            ...(noticia.tags ?? [])
        ].map(normalizar);

        return termos.some(termo => this.interesses.has(termo));
    }

    renderizar() {
        const todasNoticias = [...noticias, ...noticiasComemorativas];

        const noticiasPorId = new Map(
            todasNoticias.map(noticia => [noticia.id, noticia])
        );

        return super.renderizar().replace(
            /(<article\b[^>]*\bdata-noticia="([^"]+)"[^>]*>)([\s\S]*?)(<\/article>)/g,
            (cartao, abertura, id, conteudo, fechamento) => {

                const noticia = noticiasPorId.get(id);

                // Preserva os cartões que não são de interesse.
                if (!noticia || !this.correspondeInteresse(noticia)) {
                    return cartao;
                }

                // Acrescenta uma classe sem remover as existentes.
                const novaAbertura = abertura.replace(
                    /class="([^"]+)"/,
                    (_, classes) => `class="${classes} noticia-interesse"`
                );

                // Adiciona uma identificação exclusiva de interesse.
                const novoConteudo = conteudo.replace(
                    '<h3>',
                    '<span class="selo-interesse">✦ Para você</span><h3>'
                );

                return `${novaAbertura}${novoConteudo}${fechamento}`;
            }
        );
    }
}
