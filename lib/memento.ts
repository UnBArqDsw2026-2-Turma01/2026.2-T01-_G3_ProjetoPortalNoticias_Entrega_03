export interface EstadoNoticia {
  readonly idNoticia: string;
  readonly titulo: string;
  readonly conteudo: string;
  readonly autor: string;
}

export class DraftMemento {
  private readonly estado: EstadoNoticia;
  private readonly instante: number;

  constructor(estado: EstadoNoticia, timestamp: number = Date.now()) {
    this.estado = { ...estado };
    this.instante = timestamp;
  }

  get idNoticia(): string {
    return this.estado.idNoticia;
  }

  get titulo(): string {
    return this.estado.titulo;
  }

  get conteudo(): string {
    return this.estado.conteudo;
  }

  get autor(): string {
    return this.estado.autor;
  }

  get timestamp(): number {
    return this.instante;
  }
}

export class NoticiaEditorOriginator {
  private estado: EstadoNoticia;

  constructor(estadoInicial: EstadoNoticia) {
    this.estado = { ...estadoInicial };
  }

  setEstado(estado: EstadoNoticia): void {
    this.estado = { ...estado };
  }

  getEstado(): EstadoNoticia {
    return { ...this.estado };
  }

  salvarSnapshot(): DraftMemento {
    return new DraftMemento(this.estado);
  }

  restaurar(memento: DraftMemento): void {
    this.estado = {
      idNoticia: memento.idNoticia,
      titulo: memento.titulo,
      conteudo: memento.conteudo,
      autor: memento.autor,
    };
  }
}

export class HistoricoRascunhosCaretaker {
  private readonly pilhaDesfazer: DraftMemento[] = [];
  private readonly pilhaRefazer: DraftMemento[] = [];

  constructor(private readonly originator: NoticiaEditorOriginator) {}

  get podeDesfazer(): boolean {
    return this.pilhaDesfazer.length > 1;
  }

  get podeRefazer(): boolean {
    return this.pilhaRefazer.length > 0;
  }

  backup(): DraftMemento {
    const snapshot = this.originator.salvarSnapshot();
    this.pilhaDesfazer.push(snapshot);
    this.pilhaRefazer.length = 0;
    return snapshot;
  }

  undo(): DraftMemento | null {
    if (!this.podeDesfazer) {
      return null;
    }

    const snapshotAtual = this.pilhaDesfazer.pop();
    if (!snapshotAtual) {
      return null;
    }

    this.pilhaRefazer.push(snapshotAtual);
    const snapshotAnterior = this.pilhaDesfazer[this.pilhaDesfazer.length - 1];
    this.originator.restaurar(snapshotAnterior);
    return snapshotAnterior;
  }

  redo(): DraftMemento | null {
    const snapshot = this.pilhaRefazer.pop();
    if (!snapshot) {
      return null;
    }

    this.pilhaDesfazer.push(snapshot);
    this.originator.restaurar(snapshot);
    return snapshot;
  }
}
