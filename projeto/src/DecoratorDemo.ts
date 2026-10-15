import type { PaginaPortal } from './decorator/PaginaPortal.js';
import { PaginaBasePortal } from './decorator/PaginaBasePortal.js';
import { TemaNatalDecorator } from './decorator/TemaNatalDecorator.js';
import { TemaHalloweenDecorator } from './decorator/TemaHalloweenDecorator.js';
import { TemaDiaEstudanteDecorator } from './decorator/TemaDiaEstudanteDecorator.js';
import { BannerFestivoDecorator } from './decorator/BannerFestivoDecorator.js';
import { EnfeitesBordaDecorator } from './decorator/EnfeitesBordaDecorator.js';
import { AnimacaoFestivaDecorator } from './decorator/AnimacaoFestivaDecorator.js';
import { TextosFestivosDecorator } from './decorator/TextosFestivosDecorator.js';
import type { Tema } from './decorator/temas.js';
export type { Tema } from './decorator/temas.js';

const paletas = { natal: TemaNatalDecorator, halloween: TemaHalloweenDecorator, estudante: TemaDiaEstudanteDecorator };
type Camada = new (pagina: PaginaPortal, tema: Tema) => PaginaPortal;
const camadas = (tema: Tema): Camada[] => [
  TextosFestivosDecorator, EnfeitesBordaDecorator, AnimacaoFestivaDecorator,
  BannerFestivoDecorator, paletas[tema],
];

// Client: cada data empilha cinco ConcreteDecorators com responsabilidades distintas.
export class DecoratorDemo {
  static compor(temas: readonly Tema[]): PaginaPortal {
    let pagina: PaginaPortal = new PaginaBasePortal();
    for (const tema of temas) {
      for (const Camada of camadas(tema)) pagina = new Camada(pagina, tema);
    }
    return pagina;
  }

  static descrever(temas: readonly Tema[]): string {
    return temas.reduce((cadeia, tema) => camadas(tema).reduce(
      (texto, Camada) => `${Camada.name}(${texto})`, cadeia,
    ), 'PaginaBasePortal');
  }

  static main(destino: HTMLElement, temas: readonly Tema[] = []): void {
    destino.innerHTML = this.compor(temas).renderizar();
  }
}
