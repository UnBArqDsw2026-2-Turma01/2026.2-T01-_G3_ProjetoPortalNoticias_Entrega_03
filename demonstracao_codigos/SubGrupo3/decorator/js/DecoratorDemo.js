import { PaginaBasePortal } from './decorator/PaginaBasePortal.js';
import { TemaNatalDecorator } from './decorator/TemaNatalDecorator.js';
import { TemaHalloweenDecorator } from './decorator/TemaHalloweenDecorator.js';
import { TemaDiaEstudanteDecorator } from './decorator/TemaDiaEstudanteDecorator.js';
import { BannerFestivoDecorator } from './decorator/BannerFestivoDecorator.js';
import { EnfeitesBordaDecorator } from './decorator/EnfeitesBordaDecorator.js';
import { AnimacaoFestivaDecorator } from './decorator/AnimacaoFestivaDecorator.js';
import { TextosFestivosDecorator } from './decorator/TextosFestivosDecorator.js';
const paletas = { natal: TemaNatalDecorator, halloween: TemaHalloweenDecorator, estudante: TemaDiaEstudanteDecorator };
const camadas = (tema) => [
    TextosFestivosDecorator, EnfeitesBordaDecorator, AnimacaoFestivaDecorator,
    BannerFestivoDecorator, paletas[tema],
];
// Client: cada data empilha cinco ConcreteDecorators com responsabilidades distintas.
export class DecoratorDemo {
    static compor(temas) {
        let pagina = new PaginaBasePortal();
        for (const tema of temas) {
            for (const Camada of camadas(tema))
                pagina = new Camada(pagina, tema);
        }
        return pagina;
    }
    static descrever(temas) {
        return temas.reduce((cadeia, tema) => camadas(tema).reduce((texto, Camada) => `${Camada.name}(${texto})`, cadeia), 'PaginaBasePortal');
    }
    static main(destino, temas = []) {
        destino.innerHTML = this.compor(temas).renderizar();
    }
}
