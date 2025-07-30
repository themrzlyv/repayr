import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { isDev } from '../utils/is-dev.util';
import { CSRF_TOKEN, REFRESH_TOKEN } from '../data/constants';

@Injectable()
export class CookieService {
  public constructor(private configService: ConfigService) {}
  setRefreshTokenCookie(res: Response, token: string): void {
    const isDevelopment = isDev(this.configService);
    res.cookie(REFRESH_TOKEN, token, {
      httpOnly: true,
      secure: !isDevelopment,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: isDevelopment ? 'lax' : 'strict',
      path: '/',
    });
  }

  setCsrfSecretCookie(res: Response, token: string): void {
    const isDevelopment = isDev(this.configService);
    res.cookie(CSRF_TOKEN, token, {
      httpOnly: true,
      secure: !isDevelopment,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: isDevelopment ? 'lax' : 'strict',
      path: '/',
    });
  }

  clearTokensCookie(res: Response): void {
    const isDevelopment = isDev(this.configService);
    res.cookie(REFRESH_TOKEN, '', {
      httpOnly: true,
      secure: !isDevelopment,
      sameSite: isDevelopment ? 'lax' : 'strict',
      expires: new Date(0),
    });

    res.cookie(CSRF_TOKEN, '', {
      httpOnly: true,
      secure: !isDevelopment,
      sameSite: isDevelopment ? 'lax' : 'strict',
      expires: new Date(0),
    });
  }
}
