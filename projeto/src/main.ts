import { DecoratorDemo, type Tema } from './DecoratorDemo.js';
import './styles.css';

const app = document.querySelector<HTMLElement>('#app')!;
const formulario = document.querySelector<HTMLFormElement>('#temas')!;
const composicao = document.querySelector<HTMLOutputElement>('#composicao')!;

function atualizar(): void {
  const temas = Array.from(formulario.querySelectorAll<HTMLInputElement>('input:checked'))
    .filter(input => input.value !== 'padrao')
    .map(input => input.value as Tema);
  DecoratorDemo.main(app, temas);
  composicao.textContent = DecoratorDemo.descrever(temas);
}

formulario.addEventListener('change', atualizar);
formulario.addEventListener('reset', event => {
  event.preventDefault();
  for (const input of formulario.querySelectorAll<HTMLInputElement>('input[type="radio"]')) {
    input.checked = input.value === 'padrao';
  }
  atualizar();
});

// Uma interação local da Home, preservada por delegação após trocar a composição.
app.addEventListener('click', event => {
  const botao = (event.target as Element).closest<HTMLButtonElement>('.salvar');
  if (!botao) return;
  const salvo = botao.getAttribute('aria-pressed') !== 'true';
  botao.setAttribute('aria-pressed', String(salvo));
  botao.setAttribute('aria-label', salvo ? 'Remover notícia dos salvos' : 'Salvar notícia');
});

atualizar();
