'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir al login
    if (!isLoading && !isAuthenticated) {
      router.push(`/signin?redirect=${pathname}`);
      return;
    }

    // Si hay roles permitidos y el usuario no tiene uno de esos roles, redirigir
    if (
      !isLoading &&
      isAuthenticated &&
      allowedRoles.length > 0 &&
      user &&
      !allowedRoles.includes(user.role)
    ) {
      router.push('/unauthorized');
    }
  }, [isLoading, isAuthenticated, router, pathname, user, allowedRoles]);

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si no está autenticado o no tiene los roles permitidos, no mostrar nada
  if (!isAuthenticated || (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role))) {
    return null;
  }

  // Si está autenticado y tiene los roles permitidos, mostrar el contenido
  return <>{children}</>;
}
