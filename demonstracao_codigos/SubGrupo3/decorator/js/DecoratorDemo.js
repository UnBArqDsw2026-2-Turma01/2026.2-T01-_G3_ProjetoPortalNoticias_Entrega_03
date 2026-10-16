import { PaginaBasePortal } from './decorator/PaginaBasePortal.js';
import { TemaNatalDecorator } from './decorator/TemaNatalDecorator.js';
import { TemaHalloweenDecorator } from './decorator/TemaHalloweenDecorator.js';
import { TemaDiaEstudanteDecorator } from './decorator/TemaDiaEstudanteDecorator.js';
import { BannerFestivoDecorator } from './decorator/BannerFestivoDecorator.js';
import { EnfeitesBordaDecorator } from './decorator/EnfeitesBordaDecorator.js';
import { AnimacaoFestivaDecorator } from './decorator/AnimacaoFestivaDecorator.js';
import { TextosFestivosDecorator } from './decorator/TextosFestivosDecorator.js';
import { DestaqueInteresseUsuarioDecorator } from './decorator/DestaqueInteresseUsuarioDecorator.js';

const paletas = {
    natal: TemaNatalDecorator,
    halloween: TemaHalloweenDecorator,
    estudante: TemaDiaEstudanteDecorator
};

const camadas = (tema) => [
    TextosFestivosDecorator,
    EnfeitesBordaDecorator,
    AnimacaoFestivaDecorator,
    BannerFestivoDecorator,
    paletas[tema]
];

export class DecoratorDemo {

    static compor(temas = [], { destaqueInteresse = false } = {}) {
        let pagina = new PaginaBasePortal();

        // Aplica o destaque personalizado quando solicitado.
        if (destaqueInteresse) {
            pagina = new DestaqueInteresseUsuarioDecorator(pagina);
        }

        // Mantém a composição dos Decorators festivos.
        for (const tema of temas) {
            for (const Camada of camadas(tema)) {
                pagina = new Camada(pagina, tema);
            }
        }

        return pagina;
    }

    static descrever(temas = [], { destaqueInteresse = false } = {}) {
        let cadeia = 'PaginaBasePortal';

        if (destaqueInteresse) {
            cadeia = `DestaqueInteresseUsuarioDecorator(${cadeia})`;
        }

        return temas.reduce(
            (atual, tema) => camadas(tema).reduce(
                (texto, Camada) => `${Camada.name}(${texto})`,
                atual
            ),
            cadeia
        );
    }

    static main(destino, temas = [], opcoes = {}) {
        destino.innerHTML = this.compor(temas, opcoes).renderizar();
    }
}
