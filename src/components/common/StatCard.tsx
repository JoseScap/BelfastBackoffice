import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <div className="rounded-lg border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <h4 className="text-title-md font-bold text-black dark:text-white">{value}</h4>
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {icon}
      </div>
    </div>
  </div>
);

export default StatCard;
