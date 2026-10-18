import { PaginaBasePortal } from './decorator/PaginaBasePortal.js';
import { TemaNatalDecorator } from './decorator/TemaNatalDecorator.js';
import { TemaHalloweenDecorator } from './decorator/TemaHalloweenDecorator.js';
import { TemaDiaEstudanteDecorator } from './decorator/TemaDiaEstudanteDecorator.js';
import { BannerFestivoDecorator } from './decorator/BannerFestivoDecorator.js';
import { EnfeitesBordaDecorator } from './decorator/EnfeitesBordaDecorator.js';
import { AnimacaoFestivaDecorator } from './decorator/AnimacaoFestivaDecorator.js';
import { TextosFestivosDecorator } from './decorator/TextosFestivosDecorator.js';
import { DestaqueInteresseUsuarioDecorator } from './decorator/DestaqueInteresseUsuarioDecorator.js';
import { DestaqueComemorativoDecorator } from './decorator/DestaqueComemorativoDecorator.js';

const paletas = { natal: TemaNatalDecorator, halloween: TemaHalloweenDecorator, estudante: TemaDiaEstudanteDecorator };
const camadas = (tema) => [TextosFestivosDecorator, EnfeitesBordaDecorator,
  AnimacaoFestivaDecorator, BannerFestivoDecorator, paletas[tema]];

export class DecoratorDemo {
  static compor(temas = [], { destaqueInteresse = false, destaqueComemorativo = false } = {}) {
    let pagina = new PaginaBasePortal();
    const tema = temas.find(t => paletas[t]);
    if (destaqueComemorativo && tema)
      pagina = new DestaqueComemorativoDecorator(pagina, tema);
    // Camada exterior vê inclusive os cartões adicionados pela camada interior.
    if (destaqueInteresse)
      pagina = new DestaqueInteresseUsuarioDecorator(pagina);
    for (const t of temas.filter(t => paletas[t]))
      for (const Camada of camadas(t)) pagina = new Camada(pagina, t);
    return pagina;
  }

  static descrever(temas = [], { destaqueInteresse = false, destaqueComemorativo = false } = {}) {
    let cadeia = 'PaginaBasePortal';
    const tema = temas.find(t => paletas[t]);
    if (destaqueComemorativo && tema) cadeia = `DestaqueComemorativoDecorator(${cadeia})`;
    if (destaqueInteresse) cadeia = `DestaqueInteresseUsuarioDecorator(${cadeia})`;
    return temas.filter(t => paletas[t]).reduce((atual, t) =>
      camadas(t).reduce((texto, Camada) => `${Camada.name}(${texto})`, atual), cadeia);
  }

  static main(destino, temas = [], opcoes = {}) {
    destino.innerHTML = this.compor(temas, opcoes).renderizar();
  }
}
