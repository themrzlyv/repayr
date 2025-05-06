import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { User } from '@/prisma/generated';

export const Authorized = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const session = {
      id: request.sessionID,
      userId: request.session.userId,
      isAuthenticated: request.session.isAuthenticated,
      expire: request.session.expire,
      role: request.session.role,
      metadata: request.session.metadata,
    };

    return session;
  },
);
