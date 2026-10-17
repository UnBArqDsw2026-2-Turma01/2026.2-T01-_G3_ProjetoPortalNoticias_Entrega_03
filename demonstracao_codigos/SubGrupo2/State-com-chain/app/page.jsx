"use client";

import { useEffect, useRef, useState } from "react";
import { Postagem, runValidationChain } from "./pattern";

const steps = ["Conte o que aconteceu", "Revise", "Envie"];
const patternCode = [
  {
    title: "Postagem + EstadoBase",
    code: `class Postagem {
  mudarEstado(estado) {
    this.estado = estado;
    this.estado.setContexto(this);
  }
}

class EstadoBase {
  avancar() {
    if (this.proximo) this.contexto.mudarEstado(this.proximo);
  }
  retornar() {
    if (this.aoRejeitar) this.contexto.mudarEstado(this.aoRejeitar);
  }
}`,
  },
  {
    title: "Estados concretos do diagrama",
    code: `class Rascunho extends EstadoBase {
  submeter() { this.avancar(); }
}

class EmModeracao extends EstadoBase {
  aprovar() { this.avancar(); }
  rejeitar() { this.retornar(); }
}

class Publicada extends EstadoBase {}`,
  },
  {
    title: "Ligações entre os estados",
    code: `rascunho.setNext(emModeracao);
emModeracao.setNext(publicada);
emModeracao.setOnReject(rascunho);`,
  },
  {
    title: "Chain de validação",
    code: `obrigatorio
  .setNext(fonte)
  .setNext(revisaoEditorial)
  .setNext(moderacao);

runValidationChain(postagem);`,
  },
];

export default function DemoPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [publicationState, setPublicationState] = useState("draft");
  const [moderationDecision, setModerationDecision] = useState(null);
  const [lastDecision, setLastDecision] = useState(null);
  const [chainLog, setChainLog] = useState([]);
  const postagem = useRef(new Postagem());

  const stateLabels = {
    draft: "Rascunho",
    moderation: "Em moderação",
    published: "Publicada",
  };
  const expectedResults = {
    draft: "Preencha os dados obrigatórios e avance para a revisão antes de enviar.",
    moderation: "A postagem está em moderação. Aprove para mudar para Publicada ou registre uma rejeição.",
    published: "Fluxo concluído: a aprovação em EmModeracao levou a postagem para Publicada.",
  };
  const stateTrackLabels = ["Rascunho", "Em moderação", "Publicada"];
  const chainHandlers = [
    ["ConteudoObrigatorioHandler", "Confere título e resumo preenchidos"],
    ["FonteHandler", "Valida a origem do conteúdo"],
    ["RevisaoEditorialHandler", "Verifica clareza e adequação editorial"],
    ["ModeracaoHandler", "Aplica a decisão de moderação"],
  ];

  useEffect(() => {
    if (!isDetailsOpen && !isReviewOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key !== "Escape") return;
      setIsDetailsOpen(false);
      if (isReviewOpen) cancelReview();
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isDetailsOpen, isReviewOpen]);

  function advance() {
    if (step === 1 && (!category || !title || !summary)) {
      setFeedback("Preencha o tipo, o título e o resumo para continuar.");
      return;
    }
    setStep(2);
    setIsReviewOpen(true);
  }

  function cancelReview() {
    setIsReviewOpen(false);
    setStep(1);
  }

  function submitPublication() {
    setIsReviewOpen(false);
    setStep(3);
    postagem.current.title = title;
    postagem.current.summary = summary;
    postagem.current.category = category;
    runValidationChain(postagem.current);
    postagem.current.submeter();
    setPublicationState("moderation");
    setModerationDecision(null);
    setLastDecision(null);
    setChainLog([
      "State: DraftState → ReviewState",
      "ConteudoObrigatorioHandler: conteúdo obrigatório aprovado",
      "FonteHandler: fonte validada",
      "RevisaoEditorialHandler: revisão editorial aprovada",
      "ModeracaoHandler: conteúdo liberado para análise",
      "Publication.registrarAnalise: análise registrada",
    ]);
    setFeedback("A publicação foi enviada para análise. Escolha o próximo passo da demonstração.");
  }

  function transitionTo(nextState, message) {
    if (nextState === "published") postagem.current.aprovar();
    setPublicationState(nextState);
    setModerationDecision(null);
    setFeedback(message);
  }

  function rejectPublication() {
    postagem.current.rejeitar();
    setPublicationState("draft");
    setStep(1);
    setModerationDecision("rejected");
    setLastDecision("rejected");
    setFeedback("Postagem rejeitada. O estado EmModeracao retornou para Rascunho; revise e submeta novamente quando quiser.");
  }

  function restartDemo() {
    setStep(1);
    setCategory("");
    setTitle("");
    setSummary("");
    setFeedback("");
    setPublicationState("draft");
    setModerationDecision(null);
    setLastDecision(null);
    setChainLog([]);
  }

  return (
    <div className={`portal ${darkMode ? "portal--dark" : ""}`}>
      <aside className="sidebar">
        <img className="sidebar__logo" src="/assets/logo.svg" alt="Burburinho" />
        <nav className="sidebar__nav" aria-label="Navegação principal">
          <a className="nav-item nav-item--active" href="#inicio"><span>⌂</span>Início</a>
          <a className="nav-item" href="#explorar"><span>◎</span>Explorar</a>
          <a className="nav-item" href="#salvos"><span>♡</span>Salvos</a>
          <a className="nav-item" href="#sugerir"><span>⊕</span>Sugerir Publicação</a>
        </nav>
        <div className="sidebar__section">
          <p>Meus Conteúdos</p>
          <a className="category" href="#esporte"><b className="category__icon category__icon--orange">◈</b>Esporte</a>
          <a className="category" href="#cultura"><b className="category__icon category__icon--purple">♨</b>Cultura</a>
          <a className="category" href="#politica"><b className="category__icon category__icon--blue">♜</b>Política</a>
          <button className="all-button" type="button">Ver todos</button>
        </div>
        <button className="theme-toggle" type="button" onClick={() => setDarkMode((current) => !current)}>
          <span aria-hidden="true">{darkMode ? "☼" : "☾"}</span>{darkMode ? "Modo claro" : "Modo escuro"}
        </button>
      </aside>

      <main className="content" id="sugerir">
        <section className="hero">
          <img className="hero__reporter" src="/assets/reporter.svg" alt="Repórteres do Burburinho" />
          <div className="hero__title"><span>Sugerir</span><strong>Publicação</strong></div>
        </section>

        <div className="form-content">
          <ol className="timeline" aria-label="Etapas da publicação">
            {steps.map((label, index) => {
              const number = index + 1;
              return (
                <li className={number <= step ? "timeline__item timeline__item--active" : "timeline__item"} key={label}>
                  <span className="timeline__number">{number}</span><span>{label}</span>
                  {index < steps.length - 1 && <i />}
                </li>
              );
            })}
          </ol>

          {publicationState === "draft" && <form className="publication-form" onSubmit={(event) => { event.preventDefault(); advance(); }}>
            {lastDecision === "rejected" && <div className="decision-feedback" role="status"><strong>Postagem rejeitada</strong><span>O fluxo retornou para Rascunho. Você pode editar os dados e submeter novamente.</span></div>}
            <label htmlFor="category">Escolha um Conteúdo</label>
            <select id="category" value={category} onChange={(event) => setCategory(event.target.value)} disabled={step > 1}>
              <option value="">Selecione o tipo do seu conteúdo</option>
              <option>Notícia</option><option>Esporte</option><option>Cultura</option><option>Política</option>
            </select>

            <label htmlFor="title">Título da Publicação</label>
            <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Feira cultural movimenta a Praça da Liberdade" disabled={step > 1} />

            <label htmlFor="summary">Resumo da Publicação</label>
            <textarea id="summary" value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Conte os principais detalhes da sua publicação" rows="5" disabled={step > 1} />

            {feedback && <p className="form-feedback" role="status">{feedback}</p>}
            <button className="submit-button" type="submit">Submeter para análise</button>
          </form>}

          {publicationState !== "draft" && (
            <section className="workflow-panel" aria-live="polite">
              <div className="workflow-panel__header">
                <div>
                  <p className="details-modal__eyebrow">Publication</p>
                  <h2>{stateLabels[publicationState]}</h2>
                </div>
                <span className={`workflow-badge workflow-badge--${moderationDecision || publicationState}`}>
                  {moderationDecision === "rejected" ? "Decisão: Rejeitada" : stateLabels[publicationState]}
                </span>
              </div>
              <div className="workflow-publication">
                <span className="workflow-publication__category">{category}</span>
                <h3>{title}</h3>
                <p>{summary}</p>
              </div>
              {chainLog.length > 0 && (
                <div className="chain-log">
                  <h3>Log da Chain</h3>
                  {chainLog.map((entry) => <p key={entry}><span aria-hidden="true">✓</span>{entry}</p>)}
                </div>
              )}
              <div className="workflow-actions">
                {publicationState === "moderation" && !moderationDecision && <>
                  <button className="submit-button" type="button" onClick={() => transitionTo("published", "Postagem aprovada e publicada no portal.")}>Aprovar postagem</button>
                  <button className="secondary-button" type="button" onClick={rejectPublication}>Rejeitar postagem</button>
                </>}
                {publicationState === "published" && <p className="workflow-success">✓ Fluxo concluído: a notícia está publicada no portal.</p>}
              </div>
              <button className="restart-button" type="button" onClick={restartDemo}>Reiniciar demonstração</button>
            </section>
          )}
        </div>
      </main>

      <button
        className="details-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isDetailsOpen}
        onClick={() => setIsDetailsOpen(true)}
      >
        <span aria-hidden="true">i</span>
        Ver detalhes da demonstração
      </button>

      {isDetailsOpen && (
        <div className="details-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsDetailsOpen(false);
        }}>
          <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title">
            <div className="details-modal__header">
              <div>
                <p className="details-modal__eyebrow">Visão técnica</p>
                <h2 id="details-title">O que acontece por trás da publicação</h2>
              </div>
              <button className="details-modal__close" type="button" aria-label="Fechar detalhes" onClick={() => setIsDetailsOpen(false)}>×</button>
            </div>

            <div className="details-modal__body">
              <section className="details-card details-card--state">
                <div className="details-card__heading">
                  <h3>Estado atual</h3>
                  <span className={`details-status ${moderationDecision === "rejected" ? "details-status--rejected" : ""}`}>
                    {moderationDecision === "rejected" ? "Decisão: Rejeitada" : stateLabels[publicationState]}
                  </span>
                </div>
                <p>O contexto <code>Publication</code> mantém o estado e libera apenas as ações correspondentes à etapa atual.
                  {moderationDecision === "rejected" && " A decisão de rejeição foi registrada durante a moderação."}
                </p>
                <div className="state-track">
                  {stateTrackLabels.map((label, index) => (
                    <div className={index <= ["draft", "moderation", "published"].indexOf(publicationState) ? "state-track__item state-track__item--active" : "state-track__item"} key={label}>
                      <span>{index + 1}</span>{label}
                    </div>
                  ))}
                </div>
              </section>

              <section className="details-card">
                <div className="details-card__heading">
                  <h3>Log da Chain</h3>
                  <span className="details-muted">{chainLog.length ? "validação executada" : "aguardando envio"}</span>
                </div>
                <p>A validação é delegada pelo State aos handlers na ordem abaixo:</p>
                <ol className="handler-list">
                  {chainHandlers.map(([handler, description], index) => (
                    <li key={handler}>
                      <span className="handler-list__number">{index + 1}</span>
                      <span><code>{handler}</code><small>{description}</small></span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="details-card">
                <div className="details-card__heading">
                  <h3>Dados recebidos pelo contexto</h3>
                  <span className="details-muted">não exibidos no formulário</span>
                </div>
                <dl className="details-data">
                  <div><dt>Tipo</dt><dd>{category || "Ainda não informado"}</dd></div>
                  <div><dt>Título</dt><dd>{title || "Ainda não informado"}</dd></div>
                  <div><dt>Resumo</dt><dd>{summary || "Ainda não informado"}</dd></div>
                  <div><dt>Próxima ação</dt><dd>{publicationState === "draft" ? (isReviewOpen ? "Confirmar ou voltar para revisar" : "Preencher dados obrigatórios") : publicationState === "moderation" ? (moderationDecision ? "Reiniciar demonstração" : "Aprovar ou rejeitar a postagem") : "Reiniciar demonstração"}</dd></div>
                </dl>
              </section>

              <section className="details-card details-card--note">
                <h3>Resultado esperado</h3>
                <p>{lastDecision === "rejected" ? "A rejeição acionou setOnReject e retornou a postagem para Rascunho. Edite o conteúdo ou submeta novamente." : expectedResults[publicationState]}</p>
              </section>

              <section className="details-card code-showcase">
                <div className="details-card__heading">
                  <h3>Código correspondente ao diagrama</h3>
                  <span className="details-muted">app/pattern.js</span>
                </div>
                <p>Use estes trechos durante o vídeo para relacionar cada elemento UML à implementação executável.</p>
                <div className="code-showcase__list">
                  {patternCode.map(({ title, code }) => (
                    <details key={title} className="code-block">
                      <summary>{title}</summary>
                      <pre><code>{code}</code></pre>
                    </details>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </div>
      )}

      {isReviewOpen && (
        <div className="details-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) cancelReview();
        }}>
          <section className="details-modal review-modal" role="dialog" aria-modal="true" aria-labelledby="review-title">
            <div className="details-modal__header">
              <div>
                <p className="details-modal__eyebrow">Revise antes de enviar</p>
                <h2 id="review-title">Tem certeza do que escreveu?</h2>
              </div>
              <button className="details-modal__close" type="button" aria-label="Fechar revisão" onClick={cancelReview}>×</button>
            </div>
            <div className="review-modal__body">
              <p>Confira os dados abaixo. Ao continuar, sua publicação será submetida para análise e a validação da Chain será executada.</p>
              <dl className="details-data">
                <div><dt>Tipo</dt><dd>{category}</dd></div>
                <div><dt>Título</dt><dd>{title}</dd></div>
                <div><dt>Resumo</dt><dd>{summary}</dd></div>
              </dl>
              <div className="review-modal__actions">
                <button className="secondary-button" type="button" onClick={cancelReview}>Voltar e revisar</button>
                <button className="submit-button" type="button" onClick={submitPublication}>Continuar e submeter</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
