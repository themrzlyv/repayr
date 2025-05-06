import { Module } from '@nestjs/common';

import { GoogleStrategy } from '@/src/shared/strategies/google.strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
