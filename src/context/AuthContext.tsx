'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

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

// Usuario de prueba (superadmin)
const TEST_USER: User = {
  id: '1',
  name: 'Admin',
  email: 'admin@test.com',
  role: 'admin',
  phone: '+09 363 398 46',
  bio: 'Team Manager',
  country: 'United States',
  city: 'Phoenix, Arizona, United States.',
  postalCode: 'ERT 2489',
};

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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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
      // Para este ejemplo, asumimos que el captcha es válido
      console.log('Captcha requerido para este intento de inicio de sesión');
    }

    // Simulación de una petición a un servidor
    return new Promise(resolve => {
      setTimeout(() => {
        // Verificar credenciales del usuario de prueba
        if (email === TEST_USER.email && password === 'admin123') {
          setUser(TEST_USER);
          localStorage.setItem('user', JSON.stringify(TEST_USER));
          resetLoginAttempts();
          setIsLoading(false);
          resolve({ success: true });
        } else {
          // Incrementar contador de intentos fallidos
          const newAttempts = loginAttempts + 1;
          setLoginAttempts(newAttempts);
          localStorage.setItem('loginAttempts', newAttempts.toString());

          // Verificar si se debe bloquear la cuenta
          if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
            lockAccount();
            setIsLoading(false);
            resolve({
              success: false,
              error: {
                message: `Demasiados intentos fallidos. Cuenta bloqueada por ${LOCKOUT_DURATION_MINUTES} minutos.`,
                code: 'MAX_ATTEMPTS_EXCEEDED',
              },
            });
          } else {
            setIsLoading(false);
            resolve({
              success: false,
              error: {
                message: `Credenciales incorrectas. Intentos restantes: ${
                  MAX_LOGIN_ATTEMPTS - newAttempts
                }.`,
                code: 'INVALID_CREDENTIALS',
              },
            });
          }
        }
      }, 1000); // Simular retraso de red
    });
  };

  // Función para actualizar datos del usuario
  const updateUserData = async (data: UserUpdateData): Promise<boolean> => {
    setIsLoading(true);

    // Simulación de una petición a un servidor
    return new Promise(resolve => {
      setTimeout(() => {
        if (user) {
          const updatedUser = { ...user, ...data };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setIsLoading(false);
          resolve(true);
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 800); // Simular retraso de red
    });
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
