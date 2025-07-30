import { JwtTokenService } from '@/src/modules/jwt-token/jwt-token.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CSRF_TOKEN, REFRESH_TOKEN } from '../data/constants';
import { generateDeviceFingerprint } from '../utils/session-metadata.util';
import { SessionService } from '@/src/modules/session/session.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const refreshToken = req.cookies[REFRESH_TOKEN];
    const csrfSecret = req.cookies[CSRF_TOKEN];

    if (!refreshToken || !csrfSecret) {
      throw new UnauthorizedException('Refresh token missing');
    }

    try {
      const fingerprint = generateDeviceFingerprint(
        req,
        req.headers['user-agent'],
      );

      await this.sessionService.validateSession({
        token: refreshToken,
        csrfSecret,
        fingerprint,
      });

      const payload = this.jwtTokenService.verifyRefreshToken(refreshToken);
      req.refreshPayload = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
