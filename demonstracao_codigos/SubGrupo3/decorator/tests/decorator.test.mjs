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

import { noticias, noticiasComemorativas, obterNoticia, buscarNoticias } from '../js/home/noticias.js';
import { DestaqueInteresseUsuarioDecorator } from '../js/decorator/DestaqueInteresseUsuarioDecorator.js';
import { DestaqueComemorativoDecorator } from '../js/decorator/DestaqueComemorativoDecorator.js';
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
    assert.doesNotMatch(html, /class="selo-festivo" data-selo-post>[^<]+/);
    assert.equal(DecoratorDemo.descrever([tema]).match(/Decorator\(/g).length, 5);
  }
});

test('textos mudam nos espaços reservados, preservando títulos e categorias das notícias', () => {
  const base = new PaginaBasePortal().renderizar();
  const html = new TextosFestivosDecorator(new PaginaBasePortal(), 'natal').renderizar();
  assert.ok(html.includes('Feliz Natal, Giovanna!'));
  assert.ok(html.includes('Notícias para compartilhar'));
  assert.ok(html.includes('data-selo>DESTAQUE</span>'));
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


test('interesse do usuário seleciona só as notícias correspondentes', () => {
  const html = new DestaqueInteresseUsuarioDecorator(new PaginaBasePortal()).renderizar();
  const ids = [...html.matchAll(/<article class="noticia cartao noticia-interesse" data-noticia="([^"]+)"/g)]
    .map(item => item[1]);
  assert.deepEqual(ids, ['tecnologia', 'flauta', 'oficinas']);
  assert.equal((html.match(/class="selo-interesse"/g) ?? []).length, 3);
  assert.ok(!new DestaqueInteresseUsuarioDecorator(new PaginaBasePortal(), []).renderizar()
    .includes('noticia-interesse'));
});

test('comemorativo acrescenta três notícias no início, preservando as seis originais', () => {
  for (const tema of ['natal', 'halloween', 'estudante']) {
    const base = new PaginaBasePortal();
    const original = base.renderizar();
    const html = new DestaqueComemorativoDecorator(base, tema).renderizar();
    const ids = [...html.matchAll(/<article\b[^>]*data-noticia="([^"]+)"/g)].map(x => x[1]);
    assert.equal(ids.length, 9);
    assert.deepEqual(ids.slice(0, 3), noticiasComemorativas.filter(n => n.tema === tema).map(n => n.id));
    assert.equal(base.renderizar(), original);
  }
});

test('composição de dois decorators identifica sobreposição (premium)', () => {
  for (const tema of ['natal', 'halloween', 'estudante']) {
    const html = DecoratorDemo.compor([tema],
      { destaqueInteresse: true, destaqueComemorativo: true }).renderizar();
    const cards = [...html.matchAll(/<article\b[^>]*data-noticia="([^"]+)"[\s\S]*?<\/article>/g)]
      .map(x => x[0]);
    assert.equal(cards.length, 9);
    assert.equal(cards.filter(c => c.includes('noticia-comemorativa')).length, 3);
    assert.ok(cards.some(c => c.includes('noticia-comemorativa') && c.includes('noticia-interesse')));
    assert.equal(DecoratorDemo.descrever([tema],
      { destaqueInteresse: true, destaqueComemorativo: true }).match(/Decorator\(/g).length, 7);
  }
  assert.equal(DecoratorDemo.compor().renderizar(), new PaginaBasePortal().renderizar());
});

test('notícias especiais têm texto e IDs únicos; modal consegue obter os dados', () => {
  assert.equal(noticiasComemorativas.length, 9);
  const todas = [obterNoticia('destaque'), ...noticias, ...noticiasComemorativas];
  assert.equal(new Set(todas.map(n => n.id)).size, todas.length);
  for (const noticia of noticiasComemorativas) {
    assert.equal(obterNoticia(noticia.id), noticia);
    assert.ok(noticia.foto && noticia.texto.length >= 2);
  }
});

test('busca só pesquisa as notícias exibidas no tema e no modo selecionado', () => {
  assert.equal(buscarNoticias('').length, 6);
  assert.equal(buscarNoticias('', { tema: 'natal', incluirComemorativas: true }).length, 9);
  assert.equal(buscarNoticias('', { tema: 'halloween', incluirComemorativas: true }).length, 9);
  assert.ok(buscarNoticias('coral', { tema: 'natal', incluirComemorativas: true })
    .some(n => n.id === 'coral-natal'));
  assert.equal(buscarNoticias('coral', { tema: 'halloween', incluirComemorativas: true }).length, 0);
  assert.equal(buscarNoticias('coral').length, 0);
});
