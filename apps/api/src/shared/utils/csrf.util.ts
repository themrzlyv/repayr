import * as Tokens from 'csrf';

const tokens = new Tokens();

export function generateCsrfSecret(): string {
  return tokens.secretSync();
}

export function generateCsrfToken(secret: string): string {
  return tokens.create(secret);
}

export function verifyCsrfToken(secret: string, token: string): boolean {
  return tokens.verify(secret, token);
}
