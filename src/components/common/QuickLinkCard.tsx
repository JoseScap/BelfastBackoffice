import Link from 'next/link';
import { ReactNode } from 'react';

interface RoomStat {
  status: string;
  count: number;
  label: string;
  color: string;
}

interface QuickLinkCardProps {
  title: string;
  description: string;
  path: string;
  icon?: ReactNode;
  showRoomStats?: boolean;
  roomStats?: RoomStat[];
}

const QuickLinkCard = ({ 
  title, 
  description, 
  path, 
  showRoomStats = false, 
  roomStats = [] 
}: QuickLinkCardProps) => (
  <Link href={path}>
    <div className="rounded-lg h-full border border-stroke bg-white p-4 text-center shadow-default dark:border-strokedark dark:bg-boxdark hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
      <div className="flex items-center justify-center">
        <h3 className="text-title-md font-bold text-black dark:text-white">
          {title}
        </h3>
      </div>
      <p className="mt-1 text-sm">{description}</p>
      
      {showRoomStats && roomStats.length > 0 && (
        <div className="mt-3 flex flex-wrap px-10 justify-center gap-2">
          {roomStats.map((stat, index) => (
            <div key={index} className="flex items-center gap-1">
              <span className={`h-3 w-3 rounded-full ${stat.color}`}></span>
              <span className="text-xs">{stat.count} {stat.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </Link>
);

export default QuickLinkCard; 