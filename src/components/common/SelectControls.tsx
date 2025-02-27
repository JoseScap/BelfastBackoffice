import React from 'react';
import { ROOM_STATUS } from '@/types/hotel';
import { getRoomStatusConfig } from '@/utils/statusColors';

// Tipos base
type FloorSelectProps = {
  value: number;
  floors: number[];
  onChange: (floor: number) => void;
};

type DateSelectProps = {
  value: string;
  onChange: (date: string) => void;
};

type CategoryLegendProps = {
  categories: string[];
  getCategoryColor: (name: string) => string;
};

// Componente de selección de piso
export const FloorSelect = React.memo(({ value, floors, onChange }: FloorSelectProps) => (
  <select
    className="w-full rounded-md border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
    value={value}
    onChange={e => onChange(Number(e.target.value))}
  >
    {floors.map(floor => (
      <option key={floor} value={floor}>
        Piso {floor}
      </option>
    ))}
  </select>
));
FloorSelect.displayName = 'FloorSelect';

// Componente de selección de fecha
export const DateSelect = React.memo(({ value, onChange }: DateSelectProps) => (
  <input
    type="date"
    className="w-full rounded-md border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
    value={value}
    onChange={e => onChange(e.target.value)}
  />
));
DateSelect.displayName = 'DateSelect';

// Componente de leyenda de estados
export const StatusLegend = React.memo(() => (
  <div className="flex flex-col gap-2">
    <h5 className="font-medium text-black dark:text-white">Estado</h5>
    <div className="flex flex-wrap gap-3">
      {Object.values(ROOM_STATUS).map(status => {
        const { background } = getRoomStatusConfig(status);
        return (
          <div key={status} className="flex items-center gap-1.5">
            <span className={`h-4 w-4 rounded-full ${background}`} />
            <span className="text-sm">{status}</span>
          </div>
        );
      })}
    </div>
  </div>
));
StatusLegend.displayName = 'StatusLegend';

// Componente de leyenda de categorías
export const CategoryLegend = React.memo(
  ({ categories, getCategoryColor }: CategoryLegendProps) => (
    <div className="flex flex-col gap-2">
      <h5 className="font-medium text-black dark:text-white">Categorías de Habitación</h5>
      <div className="flex flex-wrap gap-3">
        {categories.map(category => (
          <div key={category} className="flex items-center gap-1.5">
            <span
              className="h-4 w-4 rounded-sm border border-stroke dark:border-strokedark"
              style={{ backgroundColor: getCategoryColor(category) }}
            />
            <span className="text-sm">{category}</span>
          </div>
        ))}
      </div>
    </div>
  )
);
CategoryLegend.displayName = 'CategoryLegend';
