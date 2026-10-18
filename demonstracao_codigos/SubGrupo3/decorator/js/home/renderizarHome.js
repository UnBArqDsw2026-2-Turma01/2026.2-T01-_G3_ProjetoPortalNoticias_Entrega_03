import { icone } from './icones.js';
import { nomeUsuario } from './usuario.js';
import { noticias, assuntosEmAlta } from './noticias.js';
const asset = (nome) => `assets/${nome}`;
const salvar = () => `<button class="salvar" type="button" aria-label="Salvar notícia" aria-pressed="false">${icone('salvo')}</button>`;
// Estrutura e conteúdo da tela “Home Page Logado” do protótipo.
export function renderizarHome() {
    return `<div class="portal-home">
    <aside class="sidebar" aria-label="Navegação do portal">
      <img class="marca" src="${asset('LogoBurburinho.svg')}" alt="Burburinho" width="297" height="194" />
      <nav aria-label="Navegação principal">
        <a class="nav-item ativo" href="#inicio" aria-current="page">${icone('inicio')}Início</a>
        <a class="nav-item" href="#explorar">${icone('explorar')}Explorar</a>
        <a class="nav-item" href="#salvos">${icone('salvo')}Salvos</a>
        <a class="nav-item" href="#sugerir">${icone('mais')}Sugerir Publicação</a>
      </nav>
      <div class="comunidades">
        <h2>Meus Conteúdos</h2>
        <a href="#esporte"><span class="bolha esporte">${icone('esporte')}</span>Esporte</a>
        <a href="#cultura"><span class="bolha cultura">${icone('cultura')}</span>Cultura</a>
        <a href="#politica"><span class="bolha politica">${icone('politica')}</span>Política</a>
      </div>
      <a class="ver-todos" href="#conteudos">Ver todos</a>
    </aside>
    <div class="conteudo" id="inicio">
      <header class="cabecalho">
        <h1 data-saudacao>Bom dia, ${nomeUsuario}!</h1>
        <div class="acoes">
          <button aria-label="Acessibilidade" type="button">${icone('acesso')}</button>
          <button class="notificacoes" aria-label="Notificações: 3" type="button">${icone('sino')}<span>3</span></button>
        </div>
      </header>
      <div class="colunas">
        <section class="feed" aria-label="Notícias">
          <label class="busca">${icone('busca')}<input type="search" placeholder="Buscar conteúdos, notícias e assuntos" aria-label="Buscar conteúdos, notícias e assuntos" /></label>
          <article class="destaque cartao">
            <img class="foto-destaque" src="${asset('festival.webp')}" alt="Amigos em um festival de rua" />
            <div class="destaque-texto">
              ${salvar()}<span class="etiqueta destaque-label" data-selo>DESTAQUE</span>
              <h2>Festival de rua<br />movimenta o Centro<br />neste fim de semana</h2>
              <p>Shows, arte, gastronomia e atividades<br class="desktop" /> gratuitas prometem agitar o coração<br class="desktop" /> da cidade.</p>
              <footer><span class="autor-destaque"><b>C</b><strong>Centro</strong><span>•&nbsp; 10min</span></span><a class="ler" href="#noticia-destaque" data-abrir-noticia="destaque">Ler Notícia</a></footer>
            </div>
          </article>
          <section class="ultimas" id="noticias" aria-labelledby="titulo-ultimas">
            <header><h2 id="titulo-ultimas" data-titulo-secao>Últimas notícias</h2><a href="#noticias" data-ver-todas>Ver todas ${icone('seta')}</a></header>
            <div class="noticias">${noticias.map(n => `<article class="noticia cartao" data-noticia="${n.id}">
              <img class="foto-noticia" src="${asset(n.foto + '.webp')}" alt="${n.titulo}" />
              <div class="noticia-texto"><span class="categoria ${n.cor}">${icone(n.cor)}${n.categoria}</span>${salvar()}<span class="selo-festivo" data-selo-post></span>
                <h3><a href="#noticia-${n.id}" data-abrir-noticia="${n.id}">${n.titulo}</a></h3>
                <p class="resumo-noticia">${n.resumo}</p>
                <footer><b class="avatar ${n.foto}">${n.inicial}</b><strong>${n.autor}</strong><span>•&nbsp; ${n.tempo}</span></footer>
              </div>
            </article>`).join('')}</div>
            <p id="resultado-busca" class="resultado-busca" role="status" hidden>Nenhuma notícia encontrada.</p>
          </section>
        </section>
        <aside class="lateral" aria-label="Informações da região">
          <section class="em-alta cartao"><h2>${icone('alta')}Em alta na sua região</h2>
            <ol>${assuntosEmAlta.map(t => `<li>${t}</li>`).join('')}</ol>
          </section>
          <section class="evento cartao"><h2>${icone('calendario')}Próximo Evento</h2>
            <div class="evento-conteudo"><img src="${asset('feira.webp')}" alt="Feira cultural com bandeirinhas e barracas" /><div><h3>Feira Cultural da Praça</h3><p>Sáb, 17 de out&nbsp; • &nbsp;10h</p><p>${icone('local')}Praça da Sé (SP)</p></div></div>
            <a href="#eventos">Ver todos os eventos ${icone('seta')}</a>
          </section>
        </aside>
      </div>
    </div>
  </div>`;
}
