import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DecoratorDemo } from '../js/DecoratorDemo.js';
import { PaginaBasePortal } from '../js/decorator/PaginaBasePortal.js';
import { TemaNatalDecorator } from '../js/decorator/TemaNatalDecorator.js';
import { TemaHalloweenDecorator } from '../js/decorator/TemaHalloweenDecorator.js';
import { TemaDiaEstudanteDecorator } from '../js/decorator/TemaDiaEstudanteDecorator.js';
import { BannerFestivoDecorator } from '../js/decorator/BannerFestivoDecorator.js';
import { EnfeitesBordaDecorator } from '../js/decorator/EnfeitesBordaDecorator.js';
import { AnimacaoFestivaDecorator } from '../js/decorator/AnimacaoFestivaDecorator.js';
import { TextosFestivosDecorator } from '../js/decorator/TextosFestivosDecorator.js';

import { noticias, obterNoticia, buscarNoticias } from '../js/home/noticias.js';
import { PaginaPortal } from '../js/decorator/PaginaPortal.js';
import { PaginaPortalDecorator } from '../js/decorator/PaginaPortalDecorator.js';

const paletas = [TemaNatalDecorator, TemaHalloweenDecorator, TemaDiaEstudanteDecorator];
const extras = [BannerFestivoDecorator, EnfeitesBordaDecorator, AnimacaoFestivaDecorator, TextosFestivosDecorator];

test('cada decorador delega uma única vez e preserva o conteúdo não tematizável', () => {
  for (const Classe of [...paletas, ...extras]) {
    let chamadas = 0;
    const pagina = { renderizar() { chamadas++; return '<article>Notícia original</article>'; } };
    const html = new Classe(pagina, 'natal').renderizar();
    assert.equal(chamadas, 1);
    assert.ok(html.includes('<article>Notícia original</article>'));
  }
});

test('paletas não acrescentam banners, partículas ou textos festivos', () => {
  for (const Classe of paletas) {
    const html = new Classe(new PaginaBasePortal()).renderizar();
    assert.ok(html.includes('--destaque:'));
    assert.ok(!html.includes('class="banner-tema"'));
    assert.ok(!html.includes('class="particulas '));
    assert.ok(html.includes('Bom dia, Giovanna!'));
  }
});

test('banner, enfeites e animação podem ser aplicados isoladamente', () => {
  const pagina = { renderizar: () => '<main>Home</main>' };
  const banner = new BannerFestivoDecorator(pagina, 'halloween').renderizar();
  assert.ok(banner.includes('🎃'));
  assert.ok(!banner.includes('enfeites-borda'));
  const borda = new EnfeitesBordaDecorator(pagina, 'estudante').renderizar();
  assert.ok(borda.includes('📚'));
  assert.ok(!borda.includes('banner-tema'));
  const animacao = new AnimacaoFestivaDecorator(pagina, 'natal').renderizar();
  assert.ok(animacao.includes('❄'));
  assert.ok(!animacao.includes('enfeites-borda'));
});

test('cada tema compõe cinco responsabilidades e mantém uma única Home', () => {
  for (const tema of ['natal', 'halloween', 'estudante']) {
    const html = DecoratorDemo.compor([tema]).renderizar();
    for (const classe of ['portal-home', 'banner-tema', 'enfeites-borda']) {
      assert.equal(html.split(`class="${classe}"`).length - 1, 1);
    }
    assert.equal(html.match(/class="particula particula-/g).length, 4);
    assert.equal(html.match(/class="selo-festivo" data-selo-post>[^<]+/g).length, 6);
    assert.equal(DecoratorDemo.descrever([tema]).match(/Decorator\(/g).length, 5);
  }
});

test('textos mudam nos espaços reservados, preservando títulos e categorias das notícias', () => {
  const base = new PaginaBasePortal().renderizar();
  const html = new TextosFestivosDecorator(new PaginaBasePortal(), 'natal').renderizar();
  assert.ok(html.includes('Feliz Natal, Giovanna!'));
  assert.ok(html.includes('Notícias para compartilhar'));
  assert.ok(html.includes('🎁 NATAL'));
  for (const noticia of noticias) {
    assert.ok(base.includes(noticia.titulo));
    assert.ok(html.includes(noticia.titulo));
  }
  assert.ok(html.includes('>Cultura</span>'));
  assert.ok(!html.includes('particulas-natal'));
});

test('compor e alternar temas não modifica a base compartilhada', () => {
  const base = new PaginaBasePortal();
  const original = base.renderizar();
  new BannerFestivoDecorator(new TemaNatalDecorator(base), 'natal').renderizar();
  assert.equal(base.renderizar(), original);
  const destino = { innerHTML: '' };
  DecoratorDemo.main(destino, ['natal']);
  DecoratorDemo.main(destino, ['halloween']);
  assert.ok(destino.innerHTML.includes('Bom Halloween, Giovanna!'));
  assert.ok(!destino.innerHTML.includes('Feliz Natal'));
  assert.ok(!destino.innerHTML.includes('particulas-natal'));
  DecoratorDemo.main(destino);
  assert.equal(destino.innerHTML, original);
});

test('Home logada não renderiza foto de perfil nem placeholder de nome', () => {
  const html = new PaginaBasePortal().renderizar();
  assert.ok(html.includes('Bom dia, Giovanna!'));
  assert.ok(html.includes('Meus Conteúdos'));
  assert.ok(!/perfil\.webp|John|COLOQUE AQUI/.test(html));
});


test('contratos abstratos não podem ser instanciados diretamente em JavaScript', () => {
  assert.throws(() => new PaginaPortal(), /contrato/);
  assert.throws(() => new PaginaPortalDecorator(new PaginaBasePortal()), /concreto/);
  assert.ok(new PaginaBasePortal() instanceof PaginaPortal);
});

test('dados editoriais têm IDs únicos, resumo e corpo para leitura', () => {
  const todas = [obterNoticia('destaque'), ...noticias];
  assert.equal(new Set(todas.map(noticia => noticia.id)).size, todas.length);
  for (const noticia of todas) {
    assert.ok(noticia.resumo && noticia.texto.length >= 2);
    assert.equal(obterNoticia(noticia.id), noticia);
  }
  assert.equal(obterNoticia('inexistente'), undefined);
});

test('busca encontra notícias por título, resumo e categoria, sem diferenciar acentos', () => {
  assert.ok(buscarNoticias('musica').some(noticia => noticia.id === 'flauta'));
  assert.ok(buscarNoticias('golpes').some(noticia => noticia.id === 'oficinas'));
  assert.equal(buscarNoticias(' TECNOLOGIA ').length, 2);
  assert.equal(buscarNoticias('').length, noticias.length);
  assert.equal(buscarNoticias('assunto inexistente').length, 0);
});
