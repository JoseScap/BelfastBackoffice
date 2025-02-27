// Juan [NOTE, 2025-02-27] Cliente tRPC para realizar peticiones al backend
// Este cliente está preparado pero no se utilizará hasta que se decida integrar tRPC
// Por ahora, usamos un cliente mock para evitar errores de TypeScript

// Cuando se decida integrar tRPC, descomentar este código:
/*
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../types/trpc';
import { TRPC_URL } from '../config';

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: TRPC_URL,
      // Añadimos headers para autenticación si es necesario
      headers: () => {
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
        return {
          Authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
});
*/

// Cliente mock para desarrollo
export const trpcClient = {
  status: {
    health: {
      query: async () => ({ status: 'ok' }),
    },
  },
  auth: {
    login: {
      mutate: async ({ email, password }: { email: string; password: string }) => ({
        token: 'mock-token',
        user: { id: '1', email, fullName: 'Usuario de Prueba', role: 'admin' },
      }),
    },
    register: {
      mutate: async ({
        fullName,
        email,
        password,
      }: {
        fullName: string;
        email: string;
        password: string;
      }) => ({
        token: 'mock-token',
        user: { id: '1', email, fullName, role: 'user' },
      }),
    },
    profile: {
      query: async () => ({
        id: '1',
        email: 'usuario@ejemplo.com',
        fullName: 'Usuario de Prueba',
        role: 'admin',
      }),
    },
  },
  hotel: {
    create: { mutate: async () => ({}) },
    getAll: { query: async () => [] },
    getById: { query: async () => ({}) },
    update: { mutate: async () => ({}) },
    delete: { mutate: async () => ({}) },
    activate: { mutate: async () => ({}) },
  },
  employee: {
    create: { mutate: async () => ({}) },
    getAll: { query: async () => [] },
    getById: { query: async () => ({}) },
    update: { mutate: async () => ({}) },
    delete: { mutate: async () => ({}) },
    activate: { mutate: async () => ({}) },
  },
  roomCategories: {
    create: { mutate: async () => ({}) },
    getAll: { query: async () => [] },
    getById: { query: async () => ({}) },
    update: { mutate: async () => ({}) },
    delete: { mutate: async () => ({}) },
    activate: { mutate: async () => ({}) },
  },
  rooms: {
    create: { mutate: async () => ({}) },
    getAll: { query: async () => [] },
    getById: { query: async () => ({}) },
    update: { mutate: async () => ({}) },
    delete: { mutate: async () => ({}) },
    activate: { mutate: async () => ({}) },
  },
};
