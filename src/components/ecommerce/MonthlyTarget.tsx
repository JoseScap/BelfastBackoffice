'use client';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export default function MonthlyTarget() {
  const options: ApexOptions = {
    chart: {
      height: 335,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
        },
        track: {
          background: '#F3F4F6',
          strokeWidth: '67%',
          margin: 0,
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '17px',
            fontFamily: 'Outfit, sans-serif',
          },
          value: {
            formatter: function (val) {
              return val + '%';
            },
            color: '#111',
            fontSize: '36px',
            fontFamily: 'Outfit, sans-serif',
            show: true,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#10B981'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Ocupación Mensual'],
  };

  const series = [85];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Ocupación Mensual
        </h3>
      </div>

      <div className="mt-5">
        <ReactApexChart options={options} series={series} type="radialBar" height={335} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.02]">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ocupación Actual</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">85%</p>
          <p className="mt-1 text-sm text-green-600 dark:text-green-500">+5% vs mes anterior</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.02]">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ingresos Mensuales</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">$52,450</p>
          <p className="mt-1 text-sm text-green-600 dark:text-green-500">+12% vs mes anterior</p>
        </div>
      </div>
    </div>
  );
}
