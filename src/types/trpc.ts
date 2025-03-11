// Juan [NOTE, 2025-02-27] Definición de tipos para tRPC
// Este archivo define los tipos para la integración con el backend

import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { type AnyRouter } from '@trpc/server';

// Tipo para el router de tRPC
// En un entorno real, esto se importaría directamente del backend
// Por ahora, usamos un tipo any pero con la estructura correcta para tRPC
export type AppRouter = AnyRouter;

// Tipos inferidos para entradas y salidas
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
