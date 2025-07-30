import { applyDecorators, UseGuards } from '@nestjs/common';

import { CsrfGuard } from '../guards/csrf.guard';
import { JwtAccessGuard } from '../guards/jwt-access.guard';

export function Auth() {
  return applyDecorators(UseGuards(JwtAccessGuard, CsrfGuard));
}
