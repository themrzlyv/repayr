import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';

import { CreateAccountDto } from './dtos/create-account.dto';

import { LoginDto } from './dtos/login.dto';
import { hash, verify } from 'argon2';
import {
  generateCsrfSecret,
  generateCsrfToken,
} from '@/src/shared/utils/csrf.util';
import { slugify } from '@/src/shared/utils/slugify.util';
import { JwtTokenService } from '../jwt-token/jwt-token.service';
import { CookieService } from '@/src/shared/services/cookie.service';
import { generateDeviceFingerprint } from '@/src/shared/utils/session-metadata.util';
import { REFRESH_TOKEN } from '@/src/shared/data/constants';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthService {
  public constructor(
    private cookieService: CookieService,
    private readonly prismaService: PrismaService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly sessionService: SessionService,
  ) {}

  public async refresh(req: Request, res: Response) {
    const oldRefreshToken = req.cookies[REFRESH_TOKEN];
    const { sub, role, currency } = req.refreshPayload;

    const newCsrfSecret = generateCsrfSecret();
    const csrfToken = generateCsrfToken(newCsrfSecret);

    const accessToken = this.jwtTokenService.generateAccessToken({
      sub,
      role,
      currency,
    });

    const refreshToken = this.jwtTokenService.generateRefreshToken(
      {
        sub,
        role,
        currency,
      },
      { expiresIn: req.refreshPayload.exp },
    );

    await this.sessionService.updateSessionToken(
      oldRefreshToken,
      refreshToken,
      newCsrfSecret,
    );

    this.cookieService.setRefreshTokenCookie(res, refreshToken);

    this.cookieService.setCsrfSecretCookie(res, newCsrfSecret);
    return { accessToken, csrfToken };
  }

  public async login(input: LoginDto, req: Request, res: Response) {
    const user = await this.prismaService.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !user.password)
      throw new NotFoundException('Invalid credentials');

    const isPasswordValid = await verify(user.password, input.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const accessToken = this.jwtTokenService.generateAccessToken({
      sub: user.id,
      role: user.role,
      currency: user.currency,
    });

    const refreshToken = this.jwtTokenService.generateRefreshToken({
      sub: user.id,
      role: user.role,
      currency: user.currency,
    });

    const csrfSecret = generateCsrfSecret();

    const deviceFingerprint = generateDeviceFingerprint(
      req,
      req.headers['user-agent'],
    );

    await this.sessionService.createSession({
      token: refreshToken,
      csrfSecret,
      fingerprint: deviceFingerprint,
      expire: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: user.id,
    });

    this.cookieService.setCsrfSecretCookie(res, csrfSecret);

    this.cookieService.setRefreshTokenCookie(res, refreshToken);

    return { accessToken };
  }

  public async loginWithGoogle(
    user: Partial<User>,
    req: Request,
    res: Response,
  ) {
    let existUser = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });

    if (!existUser) {
      const { email, provider, providerId, firstName, lastName, avatar } = user;
      const isExistEmail = await this.prismaService.user.findUnique({
        where: { email: user.email },
      });

      if (isExistEmail) throw new ConflictException('Email already exists');

      const tagName = await this.generateUniqueTagName(firstName, lastName);

      existUser = await this.prismaService.user.create({
        data: {
          email,
          firstName,
          lastName,
          provider,
          providerId,
          avatar,
          tagName,
        },
      });
    }

    if (existUser.password && !existUser.provider) {
      const errorMessage = encodeURIComponent(
        'This email is already registered with a password.',
      );
      return res.send(`
        <script>
          window.opener?.postMessage({ type: 'google-auth-error', message: '${errorMessage}' }, '*');
          window.close();
        </script>
      `);
    }

    const accessToken = this.jwtTokenService.generateAccessToken({
      sub: existUser.id,
      role: existUser.role,
      currency: existUser.currency,
    });

    const refreshToken = this.jwtTokenService.generateRefreshToken({
      sub: existUser.id,
      role: existUser.role,
      currency: existUser.currency,
    });

    const csrfSecret = generateCsrfSecret();

    const deviceFingerprint = generateDeviceFingerprint(
      req,
      req.headers['user-agent'],
    );

    await this.sessionService.createSession({
      token: refreshToken,
      csrfSecret,
      fingerprint: deviceFingerprint,
      expire: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: existUser.id,
    });

    this.cookieService.setCsrfSecretCookie(res, csrfSecret);

    this.cookieService.setRefreshTokenCookie(res, refreshToken);

    return res.send(`
      <script>
        window.opener?.postMessage({type: 'google-auth-success', access: '${accessToken}' }, '*');
        window.close();
      </script>
  `);
  }

  public async register(input: CreateAccountDto) {
    const { email, password, firstName, lastName } = input;
    const isExistEmail = await this.prismaService.user.findUnique({
      where: { email: input.email },
    });

    if (isExistEmail) throw new ConflictException('Email already exists');

    const tagName = await this.generateUniqueTagName(firstName, lastName);

    await this.prismaService.user.create({
      data: {
        email,
        password: await hash(password),
        firstName,
        lastName,
        tagName,
      },
    });

    return true;
  }

  public async logout(req: Request, res: Response) {
    const refreshToken = req.cookies[REFRESH_TOKEN];
    await this.prismaService.session.delete({
      where: {
        token: refreshToken,
      },
    });
    return this.cookieService.clearTokensCookie(res);
  }

  private async generateUniqueTagName(
    firstName: string,
    lastName: string,
  ): Promise<string> {
    const baseSlug = slugify(`${firstName} ${lastName}`);
    let tagName = baseSlug;
    let suffix = 1;

    while (await this.prismaService.user.findUnique({ where: { tagName } })) {
      tagName = `${baseSlug}-${suffix++}`;
    }

    return tagName;
  }
}
