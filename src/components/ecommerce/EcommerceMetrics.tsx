'use client';
import { FaHotel, FaUsers, FaMoneyBillWave, FaPercentage } from 'react-icons/fa';

export default function HotelMetrics() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {/* Ocupación */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ocupación</h3>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">85%</h4>
            <p className="mt-1 text-sm text-green-600 dark:text-green-500">+5.2% vs mes anterior</p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
            <FaPercentage className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          </div>
        </div>
      </div>

      {/* Habitaciones Disponibles */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Habitaciones Disponibles
          </h3>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">12</h4>
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">-3 vs mes anterior</p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20">
            <FaHotel className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Huéspedes */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Huéspedes</h3>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">124</h4>
            <p className="mt-1 text-sm text-green-600 dark:text-green-500">+12 vs mes anterior</p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
            <FaUsers className="h-5 w-5 text-green-600 dark:text-green-500" />
          </div>
        </div>
      </div>

      {/* Ingresos */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ingresos</h3>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">$52,450</h4>
            <p className="mt-1 text-sm text-green-600 dark:text-green-500">+8.4% vs mes anterior</p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20">
            <FaMoneyBillWave className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
