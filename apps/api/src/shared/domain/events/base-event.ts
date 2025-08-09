import { EventName } from "./event-types";

export interface BaseEventMeta {
  correlationId?: string; 
  occurredAt: Date;
}

export class BaseEvent<N extends EventName, P> {
  readonly name: N;
  readonly actorId: string; // olayı tetikleyen kullanıcı
  readonly payload: P;
  readonly meta: BaseEventMeta;

  constructor(params: {
    name: N;
    actorId: string;
    payload: P;
    meta?: Partial<BaseEventMeta>;
  }) {
    this.name = params.name;
    this.actorId = params.actorId;
    this.payload = params.payload;
    this.meta = { occurredAt: new Date(), ...params.meta };
  }
}
