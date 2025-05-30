import type { SessionValueObject } from "../../domain/value-objects/session.value-object"

export type VerifySessionResponse = {
  session: SessionValueObject;
  csrfToken: string;
}