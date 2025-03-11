import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/types/trpc';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${BACKEND_URL}/trpc`,
      // Opcional: Configuración de headers si necesitas autenticación
      headers: () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        return {
          Authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
});

// Ejemplo de uso:
// const result = await trpcClient.status.ping.query();

// Cliente mock para desarrollo
export const trpcClientMock = {
  status: {
    health: {
      query: async () => ({ status: 'ok' }),
    },
  },
  auth: {
    login: {
      mutate: async ({ email }: { email: string }) => ({
        token: 'mock-token',
        user: { id: '1', email, fullName: 'Usuario de Prueba', role: 'admin' },
      }),
    },
    register: {
      mutate: async ({ fullName, email }: { fullName: string; email: string }) => ({
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
