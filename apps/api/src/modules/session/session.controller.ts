import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';

import { SessionService } from './session.service';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { Session } from '@/prisma/generated';
import { SessionAuthGuard } from '@/src/shared/guards/session-auth.guard';
import { RolesGuard } from '@/src/shared/guards/roles.guard';
import { generateCsrfToken } from '@/src/shared/utils/csrf.util';
import { Request } from 'express';

@Controller('session')
@UseGuards(SessionAuthGuard, RolesGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('user-sessions')
  public getUserSessions(@Authorized() session: Session) {
    return this.sessionService.getUserSessions(session.userId);
  }

  @Get('/')
  public session(@Req() req: Request, @Authorized() session: Session) {
    const csrfToken = generateCsrfToken(req.session.csrfSecret);
    return { session, csrfToken };
  }

  @Delete(':id')
  async deleteSession(@Param('id') id: string) {
    return await this.sessionService.deleteSession(id);
  }
}
