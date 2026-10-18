(function () {
  'use strict';

  class DraftMemento {
    #estado;
    #timestamp;

    constructor(estado, timestamp = Date.now()) {
      this.#estado = Object.freeze({ ...estado });
      this.#timestamp = timestamp;
      Object.freeze(this);
    }

    get idNoticia() {
      return this.#estado.idNoticia;
    }

    get titulo() {
      return this.#estado.titulo;
    }

    get conteudo() {
      return this.#estado.conteudo;
    }

    get autor() {
      return this.#estado.autor;
    }

    get timestamp() {
      return this.#timestamp;
    }
  }

  class NoticiaEditorOriginator {
    #estado;

    constructor(estadoInicial) {
      this.#estado = { ...estadoInicial };
    }

    setEstado(estado) {
      this.#estado = { ...estado };
    }

    getEstado() {
      return { ...this.#estado };
    }

    salvarSnapshot() {
      return new DraftMemento(this.#estado);
    }

    restaurar(memento) {
      this.#estado = {
        idNoticia: memento.idNoticia,
        titulo: memento.titulo,
        conteudo: memento.conteudo,
        autor: memento.autor,
      };
    }
  }

  class HistoricoRascunhosCaretaker {
    #originator;
    #pilhaDesfazer = [];
    #pilhaRefazer = [];

    constructor(originator) {
      this.#originator = originator;
    }

    get snapshots() {
      return [...this.#pilhaDesfazer];
    }

    get podeDesfazer() {
      return this.#pilhaDesfazer.length > 1;
    }

    get podeRefazer() {
      return this.#pilhaRefazer.length > 0;
    }

    backup() {
      const snapshot = this.#originator.salvarSnapshot();
      this.#pilhaDesfazer.push(snapshot);
      this.#pilhaRefazer = [];
      return snapshot;
    }

    undo() {
      if (!this.podeDesfazer) {
        return null;
      }

      const snapshotAtual = this.#pilhaDesfazer.pop();
      this.#pilhaRefazer.push(snapshotAtual);
      const snapshotAnterior = this.#pilhaDesfazer[this.#pilhaDesfazer.length - 1];
      this.#originator.restaurar(snapshotAnterior);
      return snapshotAnterior;
    }

    redo() {
      const snapshot = this.#pilhaRefazer.pop();
      if (!snapshot) {
        return null;
      }

      this.#pilhaDesfazer.push(snapshot);
      this.#originator.restaurar(snapshot);
      return snapshot;
    }
  }

  window.MementoDraft = {
    DraftMemento,
    NoticiaEditorOriginator,
    HistoricoRascunhosCaretaker,
  };
})();
