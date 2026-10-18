/**
 * Classe base dos eventos de domínio (imutáveis).
 * Eventos carregam todos os dados que os handlers precisam,
 * assim o módulo de notificação NÃO depende do módulo de posts.
 */
export abstract class DomainEvent {
  abstract readonly type: string;
  readonly occurredAt: Date = new Date();
}
