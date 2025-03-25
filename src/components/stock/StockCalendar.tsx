import React, { useRef, useMemo } from 'react';
import type { Stock } from '@/types/api/stock';
import { getCategoryConfig } from '@/utils/statusColors';
import { BsHouseFill } from 'react-icons/bs';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

interface StockCalendarProps {
  currentDate: Date;
  viewMode: 'month' | 'week' | 'biweek';
  stocks: Stock[];
  categories: { id: string; name: string }[];
  onDayClick: (date: Date) => void;
  onStockClick?: (stock: Stock) => void;
}

// Función para verificar si dos fechas son el mismo día
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Helper function to parse dates correctly
const parseDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const StockCalendar: React.FC<StockCalendarProps> = ({
  currentDate,
  viewMode,
  stocks,
  categories,
  onDayClick,
  onStockClick,
}) => {
  const calendarRef = useRef<HTMLDivElement>(null);

  // Obtener días según el modo de vista
  const days = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();
    const days: CalendarDay[] = [];

    if (viewMode === 'month') {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const firstDayOfWeek = firstDay.getDay();
      const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

      // Días del mes anterior
      const prevMonth = new Date(year, month, 0);
      const prevMonthDays = prevMonth.getDate();
      for (let i = adjustedFirstDayOfWeek - 1; i >= 0; i--) {
        days.push({
          date: new Date(year, month - 1, prevMonthDays - i),
          isCurrentMonth: false,
        });
      }

      // Días del mes actual
      for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push({
          date: new Date(year, month, i),
          isCurrentMonth: true,
        });
      }

      // Días del mes siguiente
      const nextMonthDays = 42 - days.length;
      for (let i = 1; i <= nextMonthDays; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false,
        });
      }
    } else {
      // Para vista de semana o quincena
      const currentDay = new Date(year, month, date);
      const dayOfWeek = currentDay.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const monday = new Date(year, month, date - diff);

      const daysToShow = viewMode === 'week' ? 7 : 14;
      for (let i = 0; i < daysToShow; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        days.push({
          date: day,
          isCurrentMonth: day.getMonth() === month,
        });
      }
    }

    return days;
  }, [currentDate, viewMode]);

  // Obtener entradas para una fecha específica
  const getEntriesForDate = (date: Date) => {
    return stocks.filter(stock => {
      // Convertir la fecha del calendario a YYYY-MM-DD
      const calendarDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];

      // La fecha del stock ya está en formato YYYY-MM-DD
      return stock.fromDate === calendarDate;
    });
  };

  return (
    <div ref={calendarRef} className="calendar-container">
      {/* Cabecera de días de la semana */}
      <div className="grid grid-cols-7 border-b border-stroke dark:border-strokedark">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
          <div
            key={day}
            className={`py-3 text-center font-medium text-black dark:text-white ${
              index === 5 || index === 6 ? 'text-primary dark:text-primary' : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del calendario */}
      <div
        className={`grid grid-cols-7 ${
          viewMode === 'month'
            ? 'grid-rows-6'
            : viewMode === 'biweek'
            ? 'grid-rows-2'
            : 'grid-rows-1'
        } relative`}
      >
        {days.map((day, index) => {
          const entriesForDay = getEntriesForDate(day.date);
          const isToday = isSameDay(new Date(), day.date);

          return (
            <div
              key={index}
              onClick={e => {
                // Solo disparar onDayClick si se hace clic directamente en la celda
                if (e.currentTarget === e.target) {
                  onDayClick(day.date);
                }
              }}
              className={`${
                viewMode === 'month'
                  ? 'min-h-[140px]'
                  : viewMode === 'biweek'
                  ? 'min-h-[250px]'
                  : 'min-h-[500px]'
              } border-b border-r border-stroke dark:border-strokedark relative`}
            >
              <div
                className={`flex justify-between mb-3 p-2 border-b border-gray-100 dark:border-gray-700 ${
                  !day.isCurrentMonth
                    ? 'text-gray-400 dark:text-gray-600'
                    : 'text-black dark:text-white'
                } ${
                  isToday
                    ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/[0.12] dark:text-brand-400'
                    : ''
                }`}
              >
                <span className="flex items-center justify-between gap-1 w-full">
                  {day.date.getDate()}{' '}
                </span>
              </div>

              {/* Entradas de stock para este día */}
              <div className="mt-1 flex flex-col gap-1 p-2">
                {entriesForDay.length === 0 && day.isCurrentMonth && (
                  <div className="text-xs text-red-500 font-medium">Sin stock</div>
                )}
                {entriesForDay.map(entry => {
                  const category = categories.find(c => c.id === entry.categoryId);
                  const categoryConfig = getCategoryConfig(category?.name);

                  return (
                    <div
                      key={`${entry.categoryId}-${entry.price}-${entry.stockQuantity}-${entry.fromDate}`}
                      onClick={e => {
                        e.stopPropagation();
                        onStockClick?.(entry);
                      }}
                      className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs hover:shadow-sm transition-shadow cursor-pointer text-black bg-blue-light-100 border-l-[4px] ${categoryConfig.border}`}
                      title={`${category?.name} - $${entry.price}/n - ${entry.stockQuantity} habitaciones disponibles`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium w-full">{category?.name}</span>
                        <span className="text-[10px] opacity-90">
                          {parseDate(entry.fromDate).toLocaleDateString()}
                          {!isSameDay(parseDate(entry.fromDate), parseDate(entry.toDate)) &&
                            ` - ${parseDate(entry.toDate).toLocaleDateString()}`}
                        </span>
                        <span className="font-bold text-sm">
                          ${entry.price.toLocaleString('es-ES', { maximumFractionDigits: 0 })}/n
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] bg-white/20 rounded px-1 flex items-center justify-center gap-1">
                          <BsHouseFill size={15} />
                          {entry.stockQuantity}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
