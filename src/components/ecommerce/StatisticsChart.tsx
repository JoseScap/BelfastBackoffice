'use client';
import React from 'react';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export default function StatisticsChart() {
  const options: ApexOptions = {
    colors: ['#465FFF', '#10B981'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Outfit',
      fontSize: '14px',
      fontWeight: 500,
      labels: {
        colors: '#667085',
      },
      itemMargin: {
        horizontal: 10,
      },
      markers: {
        offsetX: -4,
        offsetY: -1,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#667085',
          fontFamily: 'Outfit',
          fontWeight: 400,
        },
      },
    },
    xaxis: {
      type: 'category',
      categories: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ],
      labels: {
        style: {
          colors: '#667085',
          fontFamily: 'Outfit',
          fontWeight: 400,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    grid: {
      show: true,
      borderColor: '#E4E7EC',
      strokeDashArray: 5,
      position: 'back',
    },
  };

  const series = [
    {
      name: 'Ocupación',
      data: [68, 75, 81, 78, 87, 95, 91, 90, 85, 70, 78, 82],
    },
    {
      name: 'Ingresos (miles $)',
      data: [35, 41, 45, 42, 50, 55, 52, 49, 47, 38, 42, 47],
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Estadísticas Anuales
        </h3>
      </div>

      <div className="mt-5">
        <ReactApexChart options={options} series={series} type="area" height={350} />
      </div>
    </div>
  );
}
