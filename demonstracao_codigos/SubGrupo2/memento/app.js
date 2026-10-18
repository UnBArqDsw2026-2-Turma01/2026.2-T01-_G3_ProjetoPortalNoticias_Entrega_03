(function () {
  'use strict';

  const AUTOR = 'Redação Burburinho';
  const estadoInicial = {
    idNoticia: 'noticia-demo-001',
    titulo: '',
    conteudo: '',
    autor: AUTOR,
  };
  const originator = new MementoDraft.NoticiaEditorOriginator(estadoInicial);
  const historico = new MementoDraft.HistoricoRascunhosCaretaker(originator);

  const tituloInput = document.querySelector('#titulo');
  const conteudoInput = document.querySelector('#conteudo');
  const autorLabel = document.querySelector('#autor');
  const feedback = document.querySelector('#save-feedback');
  const saveButton = document.querySelector('#save-button');
  const undoButton = document.querySelector('#undo-button');
  const redoButton = document.querySelector('#redo-button');
  const countLabel = document.querySelector('#snapshot-count');
  const snapshotList = document.querySelector('#snapshot-list');
  const menuLinks = document.querySelectorAll('.menu__item[href^="#"]');

  autorLabel.textContent = AUTOR;

  function atualizarNavegacao() {
    const secaoAtual = window.location.hash || '#editor';
    menuLinks.forEach((link) => {
      if (link.getAttribute('href') === secaoAtual) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  window.addEventListener('hashchange', atualizarNavegacao);
  atualizarNavegacao();

  function atualizarEstadoDoEditor() {
    originator.setEstado({
      ...originator.getEstado(),
      titulo: tituloInput.value,
      conteudo: conteudoInput.value,
    });
  }

  function formatarData(timestamp) {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(timestamp);
  }

  function renderizarHistorico() {
    const snapshots = historico.snapshots;
    countLabel.textContent = String(snapshots.length);
    undoButton.disabled = !historico.podeDesfazer;
    redoButton.disabled = !historico.podeRefazer;

    if (snapshots.length === 0) {
      snapshotList.innerHTML = '<li class="empty-state">Seus snapshots aparecerão aqui.</li>';
      return;
    }

    snapshotList.replaceChildren(
      ...snapshots.map((snapshot, index) => {
        const item = document.createElement('li');
        item.className = 'snapshot-item';
        if (index === snapshots.length - 1) {
          item.classList.add('snapshot-current');
        }

        const title = document.createElement('strong');
        title.className = 'snapshot-title';
        title.textContent = snapshot.titulo || 'Rascunho sem título';

        const details = document.createElement('span');
        details.className = 'snapshot-details';
        details.textContent = `${snapshot.autor} · ${formatarData(snapshot.timestamp)}`;

        item.append(title, details);
        return item;
      }).reverse(),
    );
  }

  function restaurarNoEditor() {
    const estado = originator.getEstado();
    tituloInput.value = estado.titulo;
    conteudoInput.value = estado.conteudo;
    feedback.textContent = 'Versão restaurada do histórico';
    renderizarHistorico();
  }

  tituloInput.addEventListener('input', atualizarEstadoDoEditor);
  conteudoInput.addEventListener('input', atualizarEstadoDoEditor);

  saveButton.addEventListener('click', () => {
    atualizarEstadoDoEditor();
    const snapshot = historico.backup();
    feedback.textContent = `Snapshot salvo às ${formatarData(snapshot.timestamp)}`;
    renderizarHistorico();
  });

  undoButton.addEventListener('click', () => {
    if (historico.undo()) {
      restaurarNoEditor();
    }
  });

  redoButton.addEventListener('click', () => {
    if (historico.redo()) {
      restaurarNoEditor();
    }
  });
})();
