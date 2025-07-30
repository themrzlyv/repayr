import { JwtTokenService } from '@/src/modules/jwt-token/jwt-token.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    try {
      const payload = this.jwtTokenService.verifyAccessToken(token);
      req.accessPayload = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
