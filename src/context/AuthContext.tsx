'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Definición de tipos para los roles de usuario
export type UserRole = 'admin' | 'recepcion' | 'restaurant' | 'spa';

// Interfaz para el usuario
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  country?: string;
  city?: string;
  postalCode?: string;
}

// Interfaz para actualizar datos del usuario
export interface UserUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  country?: string;
  city?: string;
  postalCode?: string;
}

// Interfaz para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserData: (data: UserUpdateData) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

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
  const router = useRouter();

  // Verificar si el usuario está autenticado al cargar la página
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulación de una petición a un servidor
    return new Promise(resolve => {
      setTimeout(() => {
        // Verificar credenciales del usuario de prueba
        if (email === TEST_USER.email && password === 'admin123') {
          setUser(TEST_USER);
          localStorage.setItem('user', JSON.stringify(TEST_USER));
          setIsLoading(false);
          resolve(true);
        } else {
          setIsLoading(false);
          resolve(false);
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
