'use client';

import { useRef, useState } from 'react';
import {
  HistoricoRascunhosCaretaker,
  NoticiaEditorOriginator,
  type EstadoNoticia,
} from '../lib/memento';

const ESTADO_INICIAL: EstadoNoticia = {
  idNoticia: 'noticia-demo-001',
  titulo: '',
  conteudo: '',
  autor: 'Redação Burburinho',
};

export default function Home() {
  const originatorRef = useRef<NoticiaEditorOriginator | null>(null);
  const historicoRef = useRef<HistoricoRascunhosCaretaker | null>(null);

  if (originatorRef.current === null) {
    originatorRef.current = new NoticiaEditorOriginator(ESTADO_INICIAL);
    historicoRef.current = new HistoricoRascunhosCaretaker(originatorRef.current);
  }

  const originator = originatorRef.current;
  const historico = historicoRef.current;
  const [estado, setEstado] = useState<EstadoNoticia>(() => originator.getEstado());
  const [, atualizarHistorico] = useState(0);

  function atualizarCampo(campo: 'titulo' | 'conteudo', valor: string): void {
    const novoEstado: EstadoNoticia = { ...estado, [campo]: valor };
    originator.setEstado(novoEstado);
    setEstado(novoEstado);
  }

  function salvarSnapshot(): void {
    historico.backup();
    atualizarHistorico((versao) => versao + 1);
  }

  function desfazer(): void {
    const snapshot = historico.undo();
    if (snapshot) {
      setEstado(originator.getEstado());
      atualizarHistorico((versao) => versao + 1);
    }
  }

  function refazer(): void {
    const snapshot = historico.redo();
    if (snapshot) {
      setEstado(originator.getEstado());
      atualizarHistorico((versao) => versao + 1);
    }
  }

  return (
    <main>
      <h1>Histórico de Rascunho</h1>

      <form onSubmit={(evento) => evento.preventDefault()}>
        <div>
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            value={estado.titulo}
            onChange={(evento) => atualizarCampo('titulo', evento.target.value)}
          />
        </div>

        <div>
          <label htmlFor="conteudo">Conteúdo</label>
          <textarea
            id="conteudo"
            name="conteudo"
            value={estado.conteudo}
            onChange={(evento) => atualizarCampo('conteudo', evento.target.value)}
            rows={8}
          />
        </div>

        <div>
          <button type="button" onClick={salvarSnapshot}>
            Salvar Snapshot
          </button>
          <button type="button" onClick={desfazer} disabled={!historico.podeDesfazer}>
            Desfazer (Undo)
          </button>
          <button type="button" onClick={refazer} disabled={!historico.podeRefazer}>
            Refazer (Redo)
          </button>
        </div>
      </form>
    </main>
  );
}
