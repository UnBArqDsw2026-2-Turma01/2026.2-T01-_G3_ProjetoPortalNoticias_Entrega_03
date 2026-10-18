# UGC News — Observer e Template Method

Implementação em Next.js (App Router + TypeScript) do módulo de notificações do SubGrupo 2.

O `EventBus` publica eventos para os observadores registrados, enquanto `NotificationHandler` usa Template Method para padronizar a resolução de destinatários, a montagem da mensagem e o envio.

## Padrões e onde estão no código

| Papel GoF | Classe | Arquivo |
|---|---|---|
| Subject (Observer) | `EventBus` | `application/EventBus.ts` |
| Observer | `EventHandler` | `application/EventHandler.ts` |
| AbstractClass (Template Method) | `NotificationHandler` | `application/NotificationHandler.ts` |
| ConcreteClass | `NewPostHandler`, `ApprovedHandler`, `RejectedHandler` | `application/handlers/` |
| Eventos | `PostApprovedEvent`, `PostRejectedEvent` | `domain/events/` |
| Portas | `NotificationRepository`, `FollowersRepository`, `WebChannel` | `domain/ports/` |
| Composition root | `buildContainer()` | `src/lib/container.ts` |

`NotificationHandler.handle()` é o template: `resolveRecipients` → `buildMessage` → `persistAndSend`.

## Rodar

```bash
npm install
npm test        # 5 testes de domínio (node:test + tsx)
npm run dev     # http://localhost:3000
```

Na tela: escolha um usuário, abra outra aba com outro usuário e aprove/reprove os posts pendentes.

## O que trocar no projeto real
- `InMemory*Repository` → banco (Prisma/Drizzle). Handlers não mudam.
- `userId` por query → sessão autenticada; validar papel de moderador nas rotas `/api/moderation/*`.
- `ModerationService` + `InMemoryPostRepository` → seu módulo de posts real (só precisa chamar `bus.publish`).
- SSE em memória funciona em 1 instância. Com várias (serverless), use Redis Pub/Sub no `WebChannel`.
