"use client";

import { useState } from "react";

const steps = ["Conte o que aconteceu", "Revise", "Envie"];

export default function DemoPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [feedback, setFeedback] = useState("");

  function advance() {
    if (step === 1 && (!category || !title || !summary)) {
      setFeedback("Preencha o tipo, o título e o resumo para continuar.");
      return;
    }
    if (step < 3) {
      setStep((current) => current + 1);
      setFeedback(step === 1 ? "Conteúdo salvo. Revise os dados antes de enviar." : "Publicação enviada para análise.");
    } else {
      setFeedback("Sua publicação foi enviada com sucesso.");
    }
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

          <form className="publication-form" onSubmit={(event) => { event.preventDefault(); advance(); }}>
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
            <button className="submit-button" type="submit">{step === 3 ? "Enviar publicação" : "Continuar"}</button>
          </form>
        </div>
      </main>
    </div>
  );
}
