import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DecoratorDemo } from '../.test-dist/DecoratorDemo.js';
import { PaginaBasePortal } from '../.test-dist/decorator/PaginaBasePortal.js';
import { TemaNatalDecorator } from '../.test-dist/decorator/TemaNatalDecorator.js';
import { TemaHalloweenDecorator } from '../.test-dist/decorator/TemaHalloweenDecorator.js';
import { TemaDiaEstudanteDecorator } from '../.test-dist/decorator/TemaDiaEstudanteDecorator.js';
import { BannerFestivoDecorator } from '../.test-dist/decorator/BannerFestivoDecorator.js';
import { EnfeitesBordaDecorator } from '../.test-dist/decorator/EnfeitesBordaDecorator.js';
import { AnimacaoFestivaDecorator } from '../.test-dist/decorator/AnimacaoFestivaDecorator.js';
import { TextosFestivosDecorator } from '../.test-dist/decorator/TextosFestivosDecorator.js';

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
    assert.equal(html.match(/class="selo-festivo" data-selo-post>[^<]+/g).length, 3);
    assert.equal(DecoratorDemo.descrever([tema]).match(/Decorator\(/g).length, 5);
  }
});

test('textos mudam nos espaços reservados, preservando títulos e categorias das notícias', () => {
  const base = new PaginaBasePortal().renderizar();
  const html = new TextosFestivosDecorator(new PaginaBasePortal(), 'natal').renderizar();
  assert.ok(html.includes('Feliz Natal, Giovanna!'));
  assert.ok(html.includes('Notícias para compartilhar'));
  assert.ok(html.includes('🎁 NATAL'));
  for (const titulo of [...base.matchAll(/<h3>([^<]+)<\/h3>/g)].map(m => m[1])) {
    assert.ok(html.includes(`<h3>${titulo}</h3>`));
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
