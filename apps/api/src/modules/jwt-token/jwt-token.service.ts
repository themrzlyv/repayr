import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService, JwtSignOptions } from '@nestjs/jwt';
import { TokenPayloadDto } from './dtos/token-payload.dto';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: NestJwtService) {}

  private readonly accessTokenOptions: JwtSignOptions = {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: '15m',
  };

  private readonly refreshTokenOptions: JwtSignOptions = {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',
  };

  generateAccessToken(payload: TokenPayloadDto): string {
    return this.jwtService.sign(payload, this.accessTokenOptions);
  }

  generateRefreshToken(
    payload: TokenPayloadDto,
    options?: JwtSignOptions,
  ): string {
    return this.jwtService.sign(payload, { ...this.refreshTokenOptions, ...options });
  }

  verifyAccessToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: this.accessTokenOptions.secret,
    });
  }

  verifyRefreshToken(token: string): TokenPayloadDto {
    return this.jwtService.verify(token, {
      secret: this.refreshTokenOptions.secret,
    });
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
