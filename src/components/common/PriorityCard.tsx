import { PriorityKey, getPriorityConfig } from '@/utils/priorityConfig';

interface PriorityCardProps {
  title: string;
  count: number;
  priority: PriorityKey;
}

const PriorityCard = ({ title, count, priority }: PriorityCardProps) => {
  const { background } = getPriorityConfig(priority);

  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
          <h4 className="text-title-md font-bold text-black dark:text-white">{count}</h4>
        </div>
        <div className={`h-2 w-2 rounded-full ${background}`} />
      </div>
    </div>
  );
};

export default PriorityCard;
