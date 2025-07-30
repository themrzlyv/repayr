import { Module } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { SessionService } from './session.service';

@Module({
  providers: [PrismaService, SessionService],
  exports: [SessionService],
})
export class SessionModule {}
