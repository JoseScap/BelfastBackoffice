'use client';
import HotelMetrics from '@/components/ecommerce/EcommerceMetrics';
import StatisticsChart from '@/components/ecommerce/StatisticsChart';
import MonthlyTarget from '@/components/ecommerce/MonthlyTarget';
import RecentReservations from '@/components/ecommerce/RecentOrders';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 2xl:p-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Dashboard de Gestión Hotelera
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Bienvenido al panel de control del sistema de gestión hotelera. Aquí podrás ver las
          estadísticas y métricas más importantes.
        </p>
      </div>

      {/* Hotel Metrics */}
      <HotelMetrics />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Statistics Chart */}
        <div className="xl:col-span-2">
          <StatisticsChart />
        </div>

        {/* Monthly Target */}
        <div>
          <MonthlyTarget />
        </div>
      </div>

      {/* Recent Reservations */}
      <RecentReservations />
    </div>
  );
}
