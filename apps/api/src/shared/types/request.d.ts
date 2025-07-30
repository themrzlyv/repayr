import { TokenPayloadDto } from '@/src/modules/auth/dto/token-payload.dto';

declare module 'express' {
  interface Request {
    refreshPayload?: TokenPayloadDto;
    accessPayload?: TokenPayloadDto;
  }
}
