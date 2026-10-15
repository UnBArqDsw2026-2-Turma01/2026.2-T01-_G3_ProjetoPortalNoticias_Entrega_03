import { DecoratorDemo } from './DecoratorDemo.js';
import { buscarNoticias, obterNoticia } from './home/noticias.js';

const app = document.querySelector('#app');
const formulario = document.querySelector('#temas');
const composicao = document.querySelector('#composicao');
function atualizar() {
    const temas = Array.from(formulario.querySelectorAll('input:checked'))
        .filter(input => input.value !== 'padrao')
        .map(input => input.value);
    DecoratorDemo.main(app, temas);
    composicao.textContent = DecoratorDemo.descrever(temas);
}
formulario.addEventListener('change', atualizar);
formulario.addEventListener('reset', event => {
    event.preventDefault();
    for (const input of formulario.querySelectorAll('input[type="radio"]')) {
        input.checked = input.value === 'padrao';
    }
    atualizar();
});
// Uma interação local da Home, preservada por delegação após trocar a composição.
app.addEventListener('click', event => {
    const botao = event.target.closest('.salvar');
    if (!botao)
        return;
    const salvo = botao.getAttribute('aria-pressed') !== 'true';
    botao.setAttribute('aria-pressed', String(salvo));
    botao.setAttribute('aria-label', salvo ? 'Remover notícia dos salvos' : 'Salvar notícia');
});
atualizar();


// Leitura e busca são interações da demonstração; o GoF fica nas classes de decoradores.
const leitura = document.querySelector('#leitura');

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
  const ids = new Set(buscarNoticias(termo).map(noticia => noticia.id));
  app.querySelectorAll('[data-noticia]').forEach(cartao => {
    cartao.hidden = !ids.has(cartao.dataset.noticia);
  });
  app.querySelector('#resultado-busca').hidden = ids.size > 0;
}

app.addEventListener('input', event => {
  if (event.target.matches('input[type="search"]')) filtrarNoticias(event.target.value);
});

app.addEventListener('click', event => {
  const link = event.target.closest('[data-abrir-noticia]');
  if (link) {
    event.preventDefault();
    abrirNoticia(link.dataset.abrirNoticia);
  }
  if (event.target.closest('[data-ver-todas]')) {
    app.querySelector('input[type="search"]').value = '';
    filtrarNoticias('');
  }
});
