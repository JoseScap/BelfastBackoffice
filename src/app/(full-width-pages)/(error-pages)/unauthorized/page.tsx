import Button from '@/components/ui/button/Button';
import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-16 bg-white dark:bg-gray-900">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">403</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Acceso no autorizado
        </h2>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          No tienes permisos para acceder a esta página.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/admin/dashboard">
            <Button>Volver al Dashboard</Button>
          </Link>
          <Link href="/signin">
            <Button variant="outline">Iniciar sesión con otra cuenta</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
