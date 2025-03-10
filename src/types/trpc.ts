// Juan [NOTE, 2025-02-27] Definición de tipos para tRPC
// Este archivo define los tipos para la integración con el backend

import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { type AnyRouter } from '@trpc/server';

// Definimos el tipo AppRouter como un tipo genérico para evitar errores de compilación
// En un entorno real, esto se importaría directamente del backend
export type AppRouter = AnyRouter;

// Definimos la estructura de la API para ayudar con el desarrollo
// Esta interfaz se usa solo para tipado y no afecta la compilación
export interface ApiStructure {
  status: {
    ping: {
      query: () => Promise<string>;
    };
  };
  auth: {
    login: {
      mutate: (input: {
        email: string;
        password?: string;
      }) => Promise<{ token: string; user: any }>;
    };
    register: {
      mutate: (input: {
        fullName: string;
        email: string;
        password?: string;
      }) => Promise<{ token: string; user: any }>;
    };
    profile: {
      query: () => Promise<any>;
    };
  };
  hotel: {
    create: { mutate: (input: any) => Promise<any> };
    getAll: { query: () => Promise<any[]> };
    getById: { query: (input: { id: string }) => Promise<any> };
    update: { mutate: (input: any) => Promise<any> };
    delete: { mutate: (input: { id: string }) => Promise<any> };
    activate: { mutate: (input: { id: string }) => Promise<any> };
  };
  employee: {
    create: { mutate: (input: any) => Promise<any> };
    getAll: { query: () => Promise<any[]> };
    getById: { query: (input: { id: string }) => Promise<any> };
    update: { mutate: (input: any) => Promise<any> };
    delete: { mutate: (input: { id: string }) => Promise<any> };
    activate: { mutate: (input: { id: string }) => Promise<any> };
  };
  roomCategories: {
    create: { mutate: (input: any) => Promise<any> };
    getAll: { query: () => Promise<any[]> };
    getById: { query: (input: { id: string }) => Promise<any> };
    update: { mutate: (input: any) => Promise<any> };
    delete: { mutate: (input: { id: string }) => Promise<any> };
    activate: { mutate: (input: { id: string }) => Promise<any> };
  };
  rooms: {
    create: { mutate: (input: any) => Promise<any> };
    getByFilter: { query: (input: any) => Promise<any[]> };
    getById: { query: (input: { id: string }) => Promise<any> };
    getAllFloors: { query: (input: any) => Promise<string[]> };
    getAllSectors: { query: (input: any) => Promise<string[]> };
    update: { mutate: (input: any) => Promise<any> };
    updateStatus: { mutate: (input: any) => Promise<any> };
    delete: { mutate: (input: { id: string }) => Promise<any> };
    restore: { mutate: (input: { id: string }) => Promise<any> };
  };
  roomStatus: {
    getAll: { query: () => Promise<any[]> };
  };
}

// Tipos inferidos para entradas y salidas
// Estos tipos se usan para tipar las entradas y salidas de los procedimientos
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
