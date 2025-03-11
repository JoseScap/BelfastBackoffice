// Juan [NOTE, 2025-02-27] Definición de tipos para tRPC
// Este archivo define los tipos para la integración con el backend

import { initTRPC } from '@trpc/server';
import { z } from 'zod';

// Schemas de validación
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  role: z.string(),
});

// Tipos inferidos
type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  email: string;
  password: string;
  fullName: string;
};

type User = z.infer<typeof userSchema>;

type LoginResponse = {
  token: string;
  user: User;
};

// Inicializar tRPC
const t = initTRPC.create();

// Definir los procedimientos
const authRouter = t.router({
  login: t.procedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async () => {
      throw new Error('Not implemented');
    }),
  register: t.procedure
    .input(z.object({ email: z.string().email(), password: z.string(), fullName: z.string() }))
    .mutation(async () => {
      throw new Error('Not implemented');
    }),
  profile: t.procedure.query(async () => {
    throw new Error('Not implemented');
  }),
});

const statusRouter = t.router({
  ping: t.procedure.query(async () => {
    return { status: 'ok' };
  }),
});

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
    ping: { status: string };
  };
};
