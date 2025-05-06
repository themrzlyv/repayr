import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AccountModule } from '../modules/account/account.module';
import { AuthModule } from '../modules/auth/auth.module';
import { CategoryModule } from '../modules/category/category.module';
import { DebtModule } from '../modules/debt/debt.module';
import { IS_DEV_ENV } from '../shared/utils/is-dev.util';

import { PrismaModule } from './prisma/prisma.module';
import { SessionModule } from '../modules/session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: !IS_DEV_ENV,
    }),
    PrismaModule,
    SessionModule,
    AccountModule,
    AuthModule,
    CategoryModule,
    DebtModule,
  ],
})
export class CoreModule {}
