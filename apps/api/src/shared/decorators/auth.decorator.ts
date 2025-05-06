import { applyDecorators, UseGuards } from '@nestjs/common';

import { SessionAuthGuard } from '../guards/session-auth.guard';
import { CsrfGuard } from '../guards/csrf.guard';

export function Auth() {
  return applyDecorators(UseGuards(SessionAuthGuard, CsrfGuard));
}
