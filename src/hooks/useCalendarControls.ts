import { useState, useCallback } from 'react';

type ViewMode = 'month' | 'week' | 'biweek';

interface UseCalendarControlsReturn {
  currentDate: Date;
  viewMode: ViewMode;
  formattedPeriod: string;
  setViewMode: (mode: ViewMode) => void;
  goToPrevPeriod: () => void;
  goToNextPeriod: () => void;
  goToToday: () => void;
}

export const useCalendarControls = (
  initialViewMode: ViewMode = 'biweek'
): UseCalendarControlsReturn => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  const goToPrevPeriod = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'month') {
        newDate.setMonth(prev.getMonth() - 1);
      } else if (viewMode === 'biweek') {
        newDate.setDate(prev.getDate() - 14);
      } else {
        newDate.setDate(prev.getDate() - 7);
      }
      return newDate;
    });
  }, [viewMode]);

  const goToNextPeriod = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'month') {
        newDate.setMonth(prev.getMonth() + 1);
      } else if (viewMode === 'biweek') {
        newDate.setDate(prev.getDate() + 14);
      } else {
        newDate.setDate(prev.getDate() + 7);
      }
      return newDate;
    });
  }, [viewMode]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const formattedPeriod = useCallback(
    (date: Date) => {
      if (viewMode === 'month') {
        return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      } else if (viewMode === 'week' || viewMode === 'biweek') {
        const currentDay = new Date(date);
        const dayOfWeek = currentDay.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        const monday = new Date(date);
        monday.setDate(date.getDate() - diff);

        const endDay = new Date(monday);
        endDay.setDate(monday.getDate() + (viewMode === 'week' ? 6 : 13));

        const startFormatted = monday.toLocaleDateString('es-ES', { day: 'numeric' });
        const endFormatted = endDay.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

        return `${startFormatted} - ${endFormatted}`;
      }

      return '';
    },
    [viewMode]
  );

  return {
    currentDate,
    viewMode,
    formattedPeriod: formattedPeriod(currentDate),
    setViewMode,
    goToPrevPeriod,
    goToNextPeriod,
    goToToday,
  };
};
