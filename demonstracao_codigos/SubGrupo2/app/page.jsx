"use client";

import { useState } from "react";

const STATES = {
  DRAFT: "Rascunho",
  REVIEW: "Em análise",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
  CHANGES: "Ajustes necessários",
  PRODUCTION: "Em produção",
  PUBLISHED: "Publicada",
};

const ACTION_LABELS = {
  submit: "Submeter para análise",
  validate: "Executar Chain novamente",
  approve: "Aprovar postagem",
  reject: "Rejeitar postagem",
  changes: "Solicitar ajustes",
  resubmit: "Devolver para análise",
  produce: "Encaminhar para produção",
  publish: "Publicar no portal",
};

const HANDLERS = [
  ["ConteudoObrigatorioHandler", "título e resumo"],
  ["FonteHandler", "fonte identificada"],
  ["RevisaoEditorialHandler", "clareza e linguagem"],
  ["ModeracaoHandler", "política editorial"],
];

class ValidationHandler {
  constructor(name, validate) {
    this.name = name;
    this.validate = validate;
    this.next = null;
  }

  setNext(handler) {
    this.next = handler;
    return handler;
  }

  handle(logs, activeHandlers) {
    activeHandlers.push(this.name);
    logs.unshift({ message: `${this.name} recebeu a postagem.`, type: "handler" });
    const result = this.validate();
    if (!result.ok) {
      logs.unshift({ message: `${this.name} interrompeu a Chain: ${result.reason}`, type: "error" });
      return result;
    }
    logs.unshift({ message: `${this.name} aprovou e encaminhou para o próximo handler.`, type: "handler" });
    return this.next ? this.next.handle(logs, activeHandlers) : { ok: true };
  }
}

function createValidationChain() {
  const content = new ValidationHandler("ConteudoObrigatorioHandler", () => ({ ok: true }));
  const source = new ValidationHandler("FonteHandler", () => ({ ok: true }));
  const editorial = new ValidationHandler("RevisaoEditorialHandler", () => ({ ok: true }));
  const moderation = new ValidationHandler("ModeracaoHandler", () => ({ ok: true }));
  content.setNext(source).setNext(editorial).setNext(moderation);
  return content;
}

class Publication {
  constructor() {
    this.state = STATES.DRAFT;
    this.logs = [];
    this.transitionCount = 0;
  }

  transition(nextState, message) {
    this.state = nextState;
    this.transitionCount += 1;
    this.logs.unshift({ message, type: "state" });
  }

  run(action) {
    const activeHandlers = [];
    let feedback = { text: "", type: "success" };

    if (this.state === STATES.DRAFT && action === "submit") {
      this.transition(STATES.REVIEW, "State Rascunho → Em análise.");
      this.logs.unshift({ message: "State Rascunho delegou a responsabilidade para a Chain.", type: "state" });
      feedback = { text: "Postagem submetida. O State delegou a análise para a Chain.", type: "success" };
      return this.validate(activeHandlers, feedback);
    }

    if (this.state === STATES.REVIEW) {
      if (action === "validate") {
        this.logs.unshift({ message: "State Em análise delegou a validação para a Chain.", type: "state" });
        return this.validate(activeHandlers, feedback);
      }
      const reviewTransitions = {
        approve: [STATES.APPROVED, "Fluxo aprovado: a postagem foi aprovada pela editoria.", "State Em análise → Aprovada."],
        reject: [STATES.REJECTED, "Fluxo rejeitado: a política editorial recusou a postagem.", "State Em análise → Rejeitada."],
        changes: [STATES.CHANGES, "Fluxo de retorno: a postagem precisa de ajustes.", "State Em análise → Ajustes necessários."],
      };
      if (reviewTransitions[action]) {
        const [nextState, text, logMessage] = reviewTransitions[action];
        this.transition(nextState, logMessage);
        feedback = { text, type: action === "reject" ? "error" : action === "changes" ? "warning" : "success" };
        return { feedback, activeHandlers };
      }
    }

    if (this.state === STATES.CHANGES && action === "resubmit") {
      this.transition(STATES.REVIEW, "State Ajustes necessários → Em análise.");
      feedback = { text: "A postagem voltou para análise após os ajustes.", type: "success" };
      return { feedback, activeHandlers };
    }

    if (this.state === STATES.APPROVED && action === "produce") {
      this.transition(STATES.PRODUCTION, "State Aprovada → Em produção.");
      feedback = { text: "A postagem foi encaminhada para produção.", type: "success" };
      return { feedback, activeHandlers };
    }

    if (this.state === STATES.PRODUCTION && action === "publish") {
      this.transition(STATES.PUBLISHED, "State Em produção → Publicada.");
      feedback = { text: "Postagem publicada no Portal Burburinho.", type: "success" };
      return { feedback, activeHandlers };
    }

    this.logs.unshift({ message: `State ${this.state} recusou a ação "${action}".`, type: "error" });
    return { feedback: { text: `A transição não é permitida a partir de ${this.state}.`, type: "error" }, activeHandlers };
  }

  validate(activeHandlers, feedback) {
    const result = createValidationChain().handle(this.logs, activeHandlers);
    if (result.ok) {
      this.logs.unshift({ message: "Chain concluída: todos os handlers aprovaram.", type: "success" });
      return { feedback: { text: "Chain concluída: todos os handlers aprovaram a postagem.", type: "success" }, activeHandlers };
    }
    return { feedback: { text: `Chain interrompida: ${result.reason}`, type: "error" }, activeHandlers };
  }
}

function initialPublication() {
  return new Publication();
}

export default function DemoPage() {
  const [publication, setPublication] = useState(initialPublication);
  const [feedback, setFeedback] = useState({ text: "", type: "success" });
  const [activeHandlers, setActiveHandlers] = useState([]);

  function runAction(action) {
    const nextPublication = Object.assign(Object.create(Object.getPrototypeOf(publication)), publication);
    nextPublication.logs = [...publication.logs];
    const result = nextPublication.run(action);
    setPublication(nextPublication);
    setActiveHandlers(result.activeHandlers);
    setFeedback(result.feedback);
  }

  function reset() {
    setPublication(initialPublication());
    setActiveHandlers([]);
    setFeedback({ text: "Demonstração reiniciada.", type: "success" });
  }

  const actions = {
    [STATES.DRAFT]: ["submit"],
    [STATES.REVIEW]: ["validate", "approve", "reject", "changes"],
    [STATES.APPROVED]: ["produce"],
    [STATES.CHANGES]: ["resubmit"],
    [STATES.PRODUCTION]: ["publish"],
  }[publication.state] || [];
  const latestStateLog = publication.logs.find((log) => log.type === "state");

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Portal de Notícias Burburinho · Subequipe 02</p>
          <h1>Fluxo de publicação</h1>
          <p className="hero__description">Demonstração executável do <strong>State</strong> combinado com a <strong>Chain of Responsibility</strong>.</p>
        </div>
        <span className="pattern-badge">State + Chain</span>
      </header>

      <section className="post-card" aria-labelledby="post-title">
        <div className="post-card__heading">
          <div><p className="eyebrow">Contexto da postagem</p><h2 id="post-title">Feira comunitária movimenta a Praça Central</h2></div>
          <div className="state-badge" data-state={publication.state}>{publication.state}</div>
        </div>
        <p>A edição deste mês reúne produtores locais, oficinas e apresentações culturais gratuitas para a comunidade.</p>
        <div className="post-meta"><span>✍️ Ana Souza · Editora</span><span>📍 Brasília, DF</span><span>{publication.transitionCount} {publication.transitionCount === 1 ? "transição" : "transições"}</span></div>
      </section>

      <section className="layout-grid">
        <div className="panel">
          <div className="panel__heading"><div><p className="eyebrow">Demonstração</p><h2>Ações permitidas pelo State atual</h2></div><button className="button button--quiet" type="button" onClick={reset}>Reiniciar</button></div>
          <p className="panel__description">{stateDescription(publication.state)}</p>
          <div className="action-list">{actions.map((action) => <button className="action-button" key={action} type="button" onClick={() => runAction(action)}>{ACTION_LABELS[action]}</button>)}</div>
          <div className={`feedback feedback--${feedback.type}`} role="status" aria-live="polite">{feedback.text}</div>
        </div>

        <div className="panel chain-panel">
          <div className="panel__heading"><div><p className="eyebrow">Chain of Responsibility</p><h2>Ordem de encaminhamento</h2></div><span className="chain-status">4 handlers</span></div>
          <ol className="chain-list">{HANDLERS.map(([name, description], index) => <li className={activeHandlers.includes(name) ? "is-active" : ""} key={name}><span>{index + 1}</span><strong>{name}</strong><small>{description}</small></li>)}</ol>
          <p className="chain-note">A corrente para no primeiro handler que encontra uma falha.</p>
        </div>
      </section>

      <section className="panel execution-panel">
        <div className="panel__heading"><div><p className="eyebrow">Evidência da execução</p><h2>Rastreador de responsabilidades</h2></div><span className={`result-label result-label--${publication.logs[0]?.type === "error" ? "error" : "success"}`}>{publication.logs[0]?.message || "Aguardando ação"}</span></div>
        <div className="execution-columns"><div><h3>Delegação do State</h3><p>{latestStateLog?.message || "O estado atual ainda não delegou uma responsabilidade."}</p></div><div><h3>Log da Chain</h3><ul className="event-log">{publication.logs.slice(0, 12).map((log, index) => <li key={`${log.message}-${index}`}><strong>{log.type === "handler" ? "Chain" : "State"}</strong> · {log.message}</li>)}</ul></div></div>
      </section>

      <section className="transition-map panel"><div className="panel__heading"><div><p className="eyebrow">State</p><h2>Transições permitidas</h2></div></div><div className="states"><span>Rascunho</span><b>→</b><span>Em análise</span><b>→</b><span>Aprovada</span><b>→</b><span>Em produção</span><b>→</b><span>Publicada</span></div><div className="states states--secondary"><span>Em análise</span><b>→</b><span>Rejeitada</span><span className="states__separator">ou</span><span>Em análise</span><b>→</b><span>Ajustes necessários</span><b>→</b><span>Em análise</span></div></section>
      <footer><span>Implementação Next.js · Entrega 03 · Luís Felipe Parreira Cunha</span><a href="https://github.com/UnBArqDsw2026-2-Turma01/2026.2-T01-_G3_ProjetoPortalNoticias_Entrega_03/tree/main/demonstracao_codigos/SubGrupo2" target="_blank" rel="noreferrer">Ver código no repositório</a></footer>
    </main>
  );
}

function stateDescription(state) {
  return {
    [STATES.DRAFT]: "O State permite submeter a postagem para a cadeia de validação.",
    [STATES.REVIEW]: "A postagem está em análise e pode ser aprovada, rejeitada ou retornar para ajustes.",
    [STATES.APPROVED]: "A Chain concluiu sem falhas; o State permite encaminhar para produção.",
    [STATES.REJECTED]: "O fluxo terminou como rejeitado. Reinicie a demonstração para tentar novamente.",
    [STATES.CHANGES]: "O autor deve corrigir a postagem antes de devolvê-la para a análise.",
    [STATES.PRODUCTION]: "A postagem aprovada está sendo preparada para publicação.",
    [STATES.PUBLISHED]: "Ciclo concluído: a postagem já está disponível para a comunidade.",
  }[state];
}
