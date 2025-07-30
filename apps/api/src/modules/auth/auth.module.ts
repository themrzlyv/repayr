import { Module } from '@nestjs/common';

import { GoogleStrategy } from '@/src/shared/strategies/google.strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtTokenModule } from '../jwt-token/jwt-token.module';
import { CookieService } from '@/src/shared/services/cookie.service';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [JwtTokenModule, SessionModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, CookieService],
})
export class AuthModule {}
