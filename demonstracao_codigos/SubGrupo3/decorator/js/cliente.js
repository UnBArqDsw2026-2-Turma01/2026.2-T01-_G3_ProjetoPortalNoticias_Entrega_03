import { DecoratorDemo } from './DecoratorDemo.js';
import { buscarNoticias, obterNoticia } from './home/noticias.js';

const app = document.querySelector('#app');
const formulario = document.querySelector('#temas');
const composicao = document.querySelector('#composicao');
const leitura = document.querySelector('#leitura');
let temaAtivo = null;
let comemorativoAtivo = false;

function atualizar() {
  const selecionado = formulario.querySelector('input[name="tema"]:checked')?.value;
  const temas = selecionado && selecionado !== 'padrao' ? [selecionado] : [];
  const controle = formulario.querySelector('#destaque-comemorativo');
  controle.disabled = temas.length === 0;
  const opcoes = {
    destaqueInteresse: formulario.querySelector('#destaque-interesse').checked,
    destaqueComemorativo: controle.checked && !controle.disabled
  };
  temaAtivo = temas[0] ?? null;
  comemorativoAtivo = opcoes.destaqueComemorativo;
  DecoratorDemo.main(app, temas, opcoes);
  composicao.textContent = DecoratorDemo.descrever(temas, opcoes);
}

formulario.addEventListener('change', atualizar);
formulario.addEventListener('reset', event => {
  event.preventDefault();
  formulario.querySelectorAll('input[type="radio"]').forEach(input => {
    input.checked = input.value === 'padrao';
  });
  formulario.querySelector('#destaque-interesse').checked = false;
  formulario.querySelector('#destaque-comemorativo').checked = false;
  atualizar();
});

app.addEventListener('click', event => {
  const botao = event.target.closest('.salvar');
  if (!botao) return;
  const salvo = botao.getAttribute('aria-pressed') !== 'true';
  botao.setAttribute('aria-pressed', String(salvo));
  botao.setAttribute('aria-label', salvo ? 'Remover notícia dos salvos' : 'Salvar notícia');
});

function abrirNoticia(id) {
  const noticia = obterNoticia(id);
  if (!noticia) return;
  leitura.innerHTML = `
    <form method="dialog"><button class="fechar-leitura" aria-label="Fechar notícia">✕</button></form>
    <p class="aviso-ficticio">NOTÍCIA FICTÍCIA · DEMONSTRAÇÃO ACADÊMICA</p>
    <p class="categoria-leitura">${noticia.categoria} · ${noticia.autor} · ${noticia.tempo}</p>
    <h2 id="titulo-leitura">${noticia.titulo}</h2>
    <p class="resumo-leitura">${noticia.resumo}</p>
    <img src="assets/${noticia.foto}.webp" alt="Imagem ilustrativa da notícia" />
    ${noticia.texto.map(paragrafo => `<p>${paragrafo}</p>`).join('')}`;
  leitura.showModal();
}

function filtrarNoticias(termo) {
  const ids = new Set(buscarNoticias(termo, {
    tema: temaAtivo, incluirComemorativas: comemorativoAtivo
  }).map(n => n.id));
  let encontrados = 0;
  app.querySelectorAll('[data-noticia]').forEach(cartao => {
    const corresponde = ids.has(cartao.dataset.noticia);
    cartao.hidden = !corresponde;
    if (corresponde) encontrados++;
  });
  app.querySelector('#resultado-busca').hidden = encontrados > 0;
}

app.addEventListener('input', event => {
  if (event.target.matches('input[type="search"]')) filtrarNoticias(event.target.value);
});

app.addEventListener('click', event => {
  const link = event.target.closest('[data-abrir-noticia]');
  if (link) { event.preventDefault(); abrirNoticia(link.dataset.abrirNoticia); }
  if (event.target.closest('[data-ver-todas]')) {
    app.querySelector('input[type="search"]').value = '';
    filtrarNoticias('');
  }
});

atualizar();
