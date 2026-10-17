"use client";

import { useEffect, useState } from "react";

type N = {
  id: string;
  type: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
};

export function NotificationBell({ userId }: { userId: string }) {
  const [items, setItems] = useState<N[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    setItems([]);

    fetch(`/api/notifications?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => alive && setItems(data));

    // Tempo real: o servidor empurra via SSE (SseWebChannel)
    const es = new EventSource(`/api/notifications/stream?userId=${userId}`);
    es.addEventListener("notification", (e) => {
      const n: N = JSON.parse((e as MessageEvent).data);
      setItems((prev) => [n, ...prev]);
    });

    return () => {
      alive = false;
      es.close();
    };
  }, [userId]);

  const unread = items.filter((i) => !i.read).length;

  async function markRead(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, id }),
    });
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen((o) => !o)} aria-label="Notificações">
        🔔 {unread > 0 && <strong>({unread})</strong>}
      </button>

      {open && (
        <ul style={{ position: "absolute", right: 0, width: 320, margin: 0, padding: 8, listStyle: "none", background: "#fff", color: "#111", border: "1px solid #ccc", borderRadius: 8, zIndex: 10 }}>
          {items.length === 0 && <li>Sem notificações</li>}
          {items.map((n) => (
            <li key={n.id} style={{ padding: "6px 0", fontWeight: n.read ? 400 : 700 }}>
              <a href={n.link} onClick={() => markRead(n.id)}>{n.message}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
