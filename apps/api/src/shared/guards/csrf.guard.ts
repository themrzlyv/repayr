import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { verifyCsrfToken } from '../utils/csrf.util';
import { CSRF_TOKEN } from '../data/constants';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const csrfHeader = req.headers['x-csrf-token'];

    if (
      !csrfHeader ||
      !verifyCsrfToken(req.cookies[CSRF_TOKEN], String(csrfHeader))
    ) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    return true;
  }
}
