// Juan [NOTE, 2025-02-27] Configuración de la API

// URL base para la API REST
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// URL para tRPC
export const TRPC_URL = process.env.NEXT_PUBLIC_TRPC_URL || 'http://localhost:3001/trpc';
