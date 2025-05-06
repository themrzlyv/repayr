import { Role, User } from '@/prisma/generated';
import { Session } from 'express-session';
import { SessionMetaData } from './session-metadata.types';

declare module 'express-session' {
  interface Session {
    userId: string;
    isAuthenticated: boolean;
    expire: Date;
    role: Role;
    metadata: SessionMetaData;
    csrfSecret: string;
  }
}
