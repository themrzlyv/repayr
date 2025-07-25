import { Currency, Role, User } from '@/prisma/generated';
import { Session } from 'express-session';
import { SessionMetaData } from './session-metadata.types';

declare module 'express-session' {
  interface Session {
    isAuthenticated: boolean;
    expire: Date;
    user: Omit<User, 'password'>;
    metadata: SessionMetaData;
    csrfSecret: string;
  }
}
