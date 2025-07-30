import { User } from "@/prisma/generated";

export type RequestUserEntity = Pick<User, 'id' | 'role' | 'currency'>;
