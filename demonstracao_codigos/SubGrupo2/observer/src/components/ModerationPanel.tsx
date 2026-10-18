"use client";

import { useCallback, useEffect, useState } from "react";

type Post = { id: string; title: string; communityName: string; authorId: string };

/** Painel de demonstração: aprova/reprova e dispara os eventos. */
export function ModerationPanel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setPosts(await (await fetch("/api/moderation/pending")).json());
  }, []);
  useEffect(() => { load(); }, [load]);

  async function act(url: string, body: object) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setError(res.ok ? "" : (await res.json()).error);
    load();
  }

  return (
    <section>
      <h2>Moderação (demo)</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {posts.length === 0 && <p>Nenhum post pendente.</p>}
      <ul>
        {posts.map((p) => (
          <li key={p.id} style={{ marginBottom: 8 }}>
            <b>{p.title}</b> — {p.communityName} (autor: {p.authorId}){" "}
            <button onClick={() => act("/api/moderation/approve", { postId: p.id })}>Aprovar</button>{" "}
            <button onClick={() => act("/api/moderation/reject", { postId: p.id, reason: "Fora das regras da comunidade" })}>Reprovar</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
