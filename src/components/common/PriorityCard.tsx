interface PriorityCardProps {
  title: string;
  count: number;
  priority: 'high' | 'medium' | 'low';
}

const PriorityCard = ({ title, count, priority }: PriorityCardProps) => {
  const getBackgroundColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-success-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {count}
          </h4>
        </div>
        <div className={`h-2 w-2 rounded-full ${getBackgroundColor(priority)}`} />
      </div>
    </div>
  );
};

export default PriorityCard; 