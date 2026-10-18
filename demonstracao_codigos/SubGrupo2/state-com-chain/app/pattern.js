export class EstadoBase {
  constructor() {
    this.proximo = null;
    this.aoRejeitar = null;
    this.contexto = null;
  }

  setNext(estado) {
    this.proximo = estado;
    return estado;
  }

  setOnReject(estado) {
    this.aoRejeitar = estado;
    return estado;
  }

  setContexto(postagem) {
    this.contexto = postagem;
  }

  avancar() {
    if (this.proximo) this.contexto.mudarEstado(this.proximo);
  }

  retornar() {
    if (this.aoRejeitar) this.contexto.mudarEstado(this.aoRejeitar);
  }
}

export class Rascunho extends EstadoBase {
  submeter() {
    this.avancar();
  }
}

export class EmModeracao extends EstadoBase {
  aprovar() {
    this.avancar();
  }

  rejeitar() {
    this.retornar();
  }
}

export class Publicada extends EstadoBase {}

export class Postagem {
  constructor() {
    this.estado = new Rascunho();
    this.rascunho = this.estado;
    this.emModeracao = new EmModeracao();
    this.publicada = new Publicada();
    this.rascunho.setNext(this.emModeracao);
    this.emModeracao.setNext(this.publicada);
    this.emModeracao.setOnReject(this.rascunho);
    this.estado.setContexto(this);
  }

  mudarEstado(estado) {
    this.estado = estado;
    this.estado.setContexto(this);
  }

  submeter() {
    this.estado.submeter?.();
  }

  aprovar() {
    this.estado.aprovar?.();
  }

  rejeitar() {
    this.estado.rejeitar?.();
  }

  registrarAnalise(analise) {
    return analise;
  }
}

export class ValidationHandler {
  setNext(handler) {
    this.proximo = handler;
    return handler;
  }

  handle(postagem) {
    this.validar(postagem);
    this.proximo?.handle(postagem);
  }
}

export class ConteudoObrigatorioHandler extends ValidationHandler {
  validar(postagem) {
    if (!postagem.title || !postagem.summary) throw new Error("Título e resumo são obrigatórios.");
  }
}

export class FonteHandler extends ValidationHandler {
  validar(postagem) {
    if (!postagem.category) throw new Error("A fonte da publicação é obrigatória.");
  }
}

export class RevisaoEditorialHandler extends ValidationHandler {
  validar() {}
}

export class ModeracaoHandler extends ValidationHandler {
  validar() {}
}

export function createValidationChain() {
  const obrigatorio = new ConteudoObrigatorioHandler();
  obrigatorio
    .setNext(new FonteHandler())
    .setNext(new RevisaoEditorialHandler())
    .setNext(new ModeracaoHandler());
  return obrigatorio;
}

export function runValidationChain(postagem) {
  createValidationChain().handle(postagem);
}
