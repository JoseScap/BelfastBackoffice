import { t } from '@/types/trpc/common';
import { authRouter } from '@/types/trpc/auth';
import { statusRouter } from '@/types/trpc/status';
import { LoginInput, RegisterInput, User, LoginResponse } from '@/types/api/auth';
import { PingResponse } from '@/types/api/status';

// Definir el router principal
export const appRouter = t.router({
  auth: authRouter,
  status: statusRouter,
});

// Tipos inferidos para entradas y salidas
export type AppRouter = typeof appRouter;

export type RouterInputs = {
  auth: {
    login: LoginInput;
    register: RegisterInput;
  };
};

export type RouterOutputs = {
  auth: {
    login: LoginResponse;
    register: LoginResponse;
    profile: User;
  };
  status: {
    ping: PingResponse;
  };
};
