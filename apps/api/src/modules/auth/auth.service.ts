import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';

import { CreateAccountInput } from './inputs/create-account.input';

import { LoginInput } from './inputs/login.input';
import { hash, verify } from 'argon2';
import { IS_DEV_ENV } from '@/src/shared/utils/is-dev.util';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { generateCsrfSecret } from '@/src/shared/utils/csrf.util';

@Injectable()
export class AuthService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async login(input: LoginInput, req: Request, res: Response) {
    const user = await this.prismaService.user.findUnique({
      where: { email: input.email },
    });
    if (!user || !user.password)
      throw new NotFoundException('Invalid credentials');

    const isPasswordValid = await verify(user.password, input.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const { password, ...safeUser } = user;

    return new Promise<void>((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          reject(new Error('Failed to regenerate session: ' + err.message));
          return;
        }

        const metadata = getSessionMetadata(req, req.headers['user-agent']);

        req.session.isAuthenticated = true;
        req.session.userId = user.id;
        req.session.role = user.role;
        req.session.metadata = metadata;
        req.session.csrfSecret = generateCsrfSecret();

        req.session.save((err) => {
          if (err) {
            reject(new Error('Failed to save session: ' + err.message));
          } else {
            res.status(200).json({ user: safeUser });
            resolve();
          }
        });
      });
    });
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
      const { email, provider, provider_id, first_name, last_name, avatar } =
        user;
      const isExistEmail = await this.prismaService.user.findUnique({
        where: { email: user.email },
      });

      if (isExistEmail) throw new ConflictException('Email already exists');
      existUser = await this.prismaService.user.create({
        data: {
          email,
          first_name,
          last_name,
          provider,
          provider_id,
          avatar,
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

    req.session.isAuthenticated = true;
    req.session.userId = existUser.id;
    req.session.role = existUser.role;
    req.session.metadata = getSessionMetadata(req, req.headers['user-agent']);
    req.session.csrfSecret = generateCsrfSecret();

    return res.send(`
      <script>
        window.opener?.postMessage('google-auth-success', '*');
        window.close();
      </script>
  `);
  }

  public async register(input: CreateAccountInput) {
    const { email, password, first_name, last_name } = input;
    const isExistEmail = await this.prismaService.user.findUnique({
      where: { email: input.email },
    });

    if (isExistEmail) throw new ConflictException('Email already exists');
    await this.prismaService.user.create({
      data: {
        email,
        password: await hash(password),
        first_name,
        last_name,
      },
    });

    return true;
  }

  public async logout(req: Request, res: Response) {
    return new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(new Error('Failed to destroy session: ' + err.message));
        } else {
          res.clearCookie('repayr.sid', {
            httpOnly: true,
            secure: !IS_DEV_ENV,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: IS_DEV_ENV ? 'lax' : 'strict',
            path: '/',
          });
          res.status(200).json({ message: 'Logged out successfully' });
          setImmediate(() => resolve());
        }
      });
    });
  }
}
