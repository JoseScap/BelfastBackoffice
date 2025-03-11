import { z } from 'zod';

// Schemas de validación
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  role: z.string(),
});

// Tipos inferidos
export type User = z.infer<typeof userSchema>;

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  fullName: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};
