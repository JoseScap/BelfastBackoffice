'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { trpcClient } from '@/api/trpc/client';

// Definición de tipos para los roles de usuario
export type UserRole = 'admin' | 'recepcion' | 'restaurant' | 'spa';

// Tipo para el usuario
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  country?: string;
  city?: string;
  postalCode?: string;
};

// Tipo para actualizar datos del usuario
export type UserUpdateData = {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  country?: string;
  city?: string;
  postalCode?: string;
};

// Tipo para errores de autenticación
export type AuthError = {
  message: string;
  code?: string;
};

// Tipo para el contexto de autenticación
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: AuthError }>;
  logout: () => void;
  updateUserData: (data: UserUpdateData) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAttempts: number;
  isAccountLocked: boolean;
  lockoutEndTime: Date | null;
  resetLoginAttempts: () => void;
};

// Configuración de seguridad
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;
const CAPTCHA_THRESHOLD = 3;

// Creación del contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto de autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<Date | null>(null);
  const router = useRouter();

  // Verificar si el usuario está autenticado al cargar la página
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      trpcClient.auth.profile
        .query()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        });
    }

    // Recuperar información de intentos de login y bloqueo
    const storedLoginAttempts = localStorage.getItem('loginAttempts');
    const storedLockoutEndTime = localStorage.getItem('lockoutEndTime');

    if (storedLoginAttempts) {
      setLoginAttempts(parseInt(storedLoginAttempts, 10));
    }

    if (storedLockoutEndTime) {
      const lockoutEnd = new Date(storedLockoutEndTime);
      if (lockoutEnd > new Date()) {
        setIsAccountLocked(true);
        setLockoutEndTime(lockoutEnd);
      } else {
        // Si el tiempo de bloqueo ya pasó, resetear
        localStorage.removeItem('lockoutEndTime');
        localStorage.removeItem('loginAttempts');
        setLoginAttempts(0);
        setIsAccountLocked(false);
        setLockoutEndTime(null);
      }
    }

    setIsLoading(false);
  }, []);

  // Verificar si el tiempo de bloqueo ha terminado
  useEffect(() => {
    if (isAccountLocked && lockoutEndTime) {
      const checkLockoutInterval = setInterval(() => {
        if (lockoutEndTime < new Date()) {
          setIsAccountLocked(false);
          setLockoutEndTime(null);
          setLoginAttempts(0);
          localStorage.removeItem('lockoutEndTime');
          localStorage.removeItem('loginAttempts');
          clearInterval(checkLockoutInterval);
        }
      }, 10000); // Verificar cada 10 segundos

      return () => clearInterval(checkLockoutInterval);
    }
  }, [isAccountLocked, lockoutEndTime]);

  // Función para resetear los intentos de login
  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    localStorage.removeItem('loginAttempts');
  };

  // Función para bloquear la cuenta
  const lockAccount = () => {
    const lockoutEnd = new Date();
    lockoutEnd.setMinutes(lockoutEnd.getMinutes() + LOCKOUT_DURATION_MINUTES);

    setIsAccountLocked(true);
    setLockoutEndTime(lockoutEnd);
    localStorage.setItem('lockoutEndTime', lockoutEnd.toISOString());
  };

  // Función para iniciar sesión
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AuthError }> => {
    setIsLoading(true);

    // Verificar si la cuenta está bloqueada
    if (isAccountLocked) {
      setIsLoading(false);
      return {
        success: false,
        error: {
          message: `Cuenta bloqueada temporalmente. Intente nuevamente después de ${lockoutEndTime?.toLocaleTimeString()}.`,
          code: 'ACCOUNT_LOCKED',
        },
      };
    }

    // Verificar si se requiere captcha
    if (loginAttempts >= CAPTCHA_THRESHOLD) {
      // En un entorno real, aquí se verificaría el captcha
      console.log('Captcha requerido para este intento de inicio de sesión');
    }

    try {
      const { accessToken } = await trpcClient.auth.login.mutate({ email, password });

      // Guardar el token
      localStorage.setItem('token', accessToken);

      // Obtener el perfil del usuario
      const userData = await trpcClient.auth.profile.query();
      setUser(userData);
      resetLoginAttempts();
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      // Incrementar contador de intentos fallidos
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());

      // Verificar si se debe bloquear la cuenta
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        lockAccount();
        setIsLoading(false);
        return {
          success: false,
          error: {
            message: `Demasiados intentos fallidos. Cuenta bloqueada por ${LOCKOUT_DURATION_MINUTES} minutos.`,
            code: 'MAX_ATTEMPTS_EXCEEDED',
          },
        };
      }

      setIsLoading(false);
      return {
        success: false,
        error: {
          message: `Credenciales incorrectas. Intentos restantes: ${
            MAX_LOGIN_ATTEMPTS - newAttempts
          }.`,
          code: 'INVALID_CREDENTIALS',
        },
      };
    }
  };

  // Función para actualizar datos del usuario
  const updateUserData = async (data: UserUpdateData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Aquí deberías implementar la llamada real a la API para actualizar los datos
      // Por ahora mantenemos la simulación
      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        setIsLoading(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    router.push('/signin');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUserData,
        isAuthenticated: !!user,
        isLoading,
        loginAttempts,
        isAccountLocked,
        lockoutEndTime,
        resetLoginAttempts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
