import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { verifyCsrfToken } from '../utils/csrf.util';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const csrfHeader = req.headers['x-csrf-token'];

    if (
      !csrfHeader ||
      !verifyCsrfToken(req.session.csrfSecret, String(csrfHeader))
    ) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    return true;
  }
}
