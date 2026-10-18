import { test } from "node:test";
import assert from "node:assert/strict";
import { buildContainer } from "../src/lib/container";

test("aprovação avisa autor e seguidores (exceto o autor duas vezes)", async () => {
  const { moderation, notifications } = buildContainer();
  await moderation.approve("p1");

  const ana = await notifications.findByRecipient("ana");
  const bruno = await notifications.findByRecipient("bruno");
  const carla = await notifications.findByRecipient("carla");

  assert.deepEqual(ana.map((n) => n.type), ["POST_APPROVED"]);
  assert.deepEqual(bruno.map((n) => n.type), ["NEW_POST_IN_COMMUNITY"]);
  assert.deepEqual(carla.map((n) => n.type), ["NEW_POST_IN_COMMUNITY"]);
});

test("reprovação avisa só o autor, com o motivo", async () => {
  const { moderation, notifications } = buildContainer();
  await moderation.reject("p2", "Conteúdo duplicado");

  const ana = await notifications.findByRecipient("ana");
  const bruno = await notifications.findByRecipient("bruno");

  assert.equal(ana.length, 1);
  assert.equal(ana[0].type, "POST_REJECTED");
  assert.match(ana[0].message, /Conteúdo duplicado/);
  assert.equal(bruno.length, 0);
});

test("canal web entrega em tempo real a quem está conectado", async () => {
  const { moderation, channel } = buildContainer();
  const received: string[] = [];
  channel.connect("bruno", (chunk) => received.push(chunk));

  await moderation.approve("p1");

  assert.equal(received.length, 1);
  assert.match(received[0], /event: notification/);
});

test("falha em um handler não derruba a moderação nem os outros handlers", async () => {
  const { moderation, notifications, bus } = buildContainer();
  bus.subscribe({
    eventType: "PostApproved",
    handle: async () => {
      throw new Error("boom");
    },
  });
  const origError = console.error;
  console.error = () => {};
  await moderation.approve("p1");
  console.error = origError;

  assert.equal((await notifications.findByRecipient("ana")).length, 1);
});

test("não é possível moderar duas vezes o mesmo post", async () => {
  const { moderation } = buildContainer();
  await moderation.approve("p1");
  await assert.rejects(() => moderation.reject("p1", "x"), /já foi moderado/);
});
