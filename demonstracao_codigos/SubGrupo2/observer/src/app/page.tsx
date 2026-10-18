"use client";

import { useState } from "react";
import { NotificationBell } from "@/components/NotificationBell";
import { ModerationPanel } from "@/components/ModerationPanel";

const USERS = ["ana", "bruno", "carla"];

export default function Home() {
  const [user, setUser] = useState("ana");

  return (
    <main>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>UGC News</h1>
        <div>
          <select value={user} onChange={(e) => setUser(e.target.value)}>
            {USERS.map((u) => <option key={u}>{u}</option>)}
          </select>{" "}
          <NotificationBell userId={user} />
        </div>
      </header>
      <p>
        Ana é autora dos posts pendentes. Ana, Bruno e Carla seguem Tecnologia; só Bruno segue Games.
        Abra outra aba como outro usuário e aprove/reprove para ver os avisos chegarem em tempo real.
      </p>
      <ModerationPanel />
    </main>
  );
}
