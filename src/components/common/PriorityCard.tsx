import { DashboardIcons, IconWrapper } from './icons';

interface PriorityCardProps {
  title: string;
  count: number;
  priority: 'high' | 'medium' | 'low';
}

const PriorityCard = ({ title, count, priority }: PriorityCardProps) => {
  const getIconColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'fill-danger';
      case 'medium':
        return 'fill-warning';
      case 'low':
        return 'fill-success';
      default:
        return 'fill-gray-500';
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
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          <IconWrapper className={getIconColor(priority)}>
            <DashboardIcons.Alert />
          </IconWrapper>
        </div>
      </div>
    </div>
  );
};

export default PriorityCard; 