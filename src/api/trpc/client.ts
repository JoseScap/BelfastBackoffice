// Juan [NOTE, 2025-02-27] Cliente tRPC para realizar peticiones al backend
// Este cliente está preparado pero no se utilizará hasta que se decida integrar tRPC
// Por ahora, usamos un cliente mock para evitar errores de TypeScript

// Juan [TOIMPLE, 2025-02-27] Implementar cliente tRPC real cuando se decida usar en producción
// Descomentar el código comentado y eliminar el cliente mock

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter, ApiStructure } from '../../types/trpc';
import { TRPC_URL } from '../config';

// Creamos el cliente tRPC con el tipo AppRouter
// Este cliente se usará para hacer peticiones al backend
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: TRPC_URL,
      // Configuración de headers para autenticación
      headers() {
        // Solo enviamos el token si existe
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

        // Si no hay token, no enviamos el encabezado Authorization
        if (!token) {
          return {};
        }

        return {
          Authorization: `Bearer ${token}`,
        };
      },
    }),
  ],
});

// Cliente mock para desarrollo - Mantenemos como fallback en caso de error de conexión
// Este cliente implementa la misma interfaz que el cliente real pero con datos mock
export const mockTrpcClient: ApiStructure = {
  status: {
    ping: {
      query: async () => 'pong',
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
    getByFilter: { query: async () => [] },
    getById: { query: async () => ({}) },
    getAllFloors: { query: async () => [] },
    getAllSectors: { query: async () => [] },
    update: { mutate: async () => ({}) },
    updateStatus: { mutate: async () => ({}) },
    delete: { mutate: async () => ({}) },
    restore: { mutate: async () => ({}) },
  },
  roomStatus: {
    getAll: { query: async () => [] },
  },
};
