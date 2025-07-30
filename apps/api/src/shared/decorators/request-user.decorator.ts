import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { TokenPayloadDto } from '@/src/modules/jwt-token/dtos/token-payload.dto';
import { RequestUserEntity } from '../types/request-user.entity';

export const RequestUser = createParamDecorator<RequestUserEntity>(
  (data, ctx: ExecutionContext): RequestUserEntity => {
    const request = ctx.switchToHttp().getRequest();

    const { sub, role, currency } = request.accessPayload as TokenPayloadDto;

    const user: RequestUserEntity = {
      id: sub,
      role: role,
      currency: currency,
    };

    return user;
  },
);
