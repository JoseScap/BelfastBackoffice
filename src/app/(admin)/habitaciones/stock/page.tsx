'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PageMetadata from '@/components/common/PageMetadata';
import { mockRooms } from '@/mock-data';

// Tipos
interface RoomCategory {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface StockEntry {
  id: string;
  categoryId: string;
  startDate: Date;
  endDate: Date;
  price: number;
  availableRooms: number;
}

// Colores fijos para categorías
const CATEGORY_COLORS: Record<string, string> = {
  // Usaremos colores predefinidos para cada categoría
  Standard: '#4285F4', // Google Blue
  Deluxe: '#EA4335', // Google Red
  Suite: '#FBBC05', // Google Yellow
  Family: '#34A853', // Google Green
  Executive: '#8E24AA', // Purple
  // Colores adicionales por si hay más categorías
  default: '#00ACC1', // Cyan
};

// Extraer categorías únicas de las habitaciones mock
const extractCategories = (): RoomCategory[] => {
  const categoriesMap = new Map<string, RoomCategory>();

  mockRooms.forEach(room => {
    if (!categoriesMap.has(room.category.id)) {
      categoriesMap.set(room.category.id, {
        id: room.category.id,
        name: room.category.name,
        description: room.category.description,
        price: room.category.price,
      });
    }
  });

  return Array.from(categoriesMap.values());
};

// Obtener color para una categoría
const getCategoryColor = (categoryName: string): string => {
  return CATEGORY_COLORS[categoryName] || CATEGORY_COLORS.default;
};

// Generar datos de ejemplo para el stock
const generateMockStockData = (categories: RoomCategory[]): StockEntry[] => {
  const today = new Date();
  const stockEntries: StockEntry[] = [];

  categories.forEach(category => {
    // Crear algunas entradas para cada categoría
    // Aseguramos que no haya duplicados para la misma fecha
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + Math.floor(Math.random() * 5)); // Fecha cercana

    // Primera entrada - 3 días
    const endDate1 = new Date(startDate);
    endDate1.setDate(startDate.getDate() + 2); // 3 días

    stockEntries.push({
      id: `stock-${category.id}-1`,
      categoryId: category.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate1),
      price: Math.round(category.price * 100) / 100,
      availableRooms: Math.floor(Math.random() * 5) + 3, // 3-7 habitaciones
    });

    // Segunda entrada - 4 días, después de la primera
    const startDate2 = new Date(endDate1);
    startDate2.setDate(startDate2.getDate() + 1); // Un día después

    const endDate2 = new Date(startDate2);
    endDate2.setDate(startDate2.getDate() + 3); // 4 días

    stockEntries.push({
      id: `stock-${category.id}-2`,
      categoryId: category.id,
      startDate: new Date(startDate2),
      endDate: new Date(endDate2),
      price: Math.round(category.price * 1.2 * 100) / 100, // 20% más caro
      availableRooms: Math.floor(Math.random() * 3) + 1, // 1-3 habitaciones
    });

    // Tercera entrada - 5 días, más adelante en el mes
    const startDate3 = new Date(today);
    startDate3.setDate(today.getDate() + 15 + Math.floor(Math.random() * 5)); // A mitad de mes

    const endDate3 = new Date(startDate3);
    endDate3.setDate(startDate3.getDate() + 4); // 5 días

    stockEntries.push({
      id: `stock-${category.id}-3`,
      categoryId: category.id,
      startDate: new Date(startDate3),
      endDate: new Date(endDate3),
      price: Math.round(category.price * 0.9 * 100) / 100, // 10% más barato
      availableRooms: Math.floor(Math.random() * 4) + 5, // 5-8 habitaciones
    });
  });

  return stockEntries;
};

// Función para verificar si ya existe una entrada para la categoría en la fecha
const hasEntryForCategoryAndDate = (
  entries: StockEntry[],
  categoryId: string,
  date: Date
): boolean => {
  const dateToCheck = new Date(date);
  dateToCheck.setHours(0, 0, 0, 0);

  return entries.some(entry => {
    if (entry.categoryId !== categoryId) return false;

    const startDate = new Date(entry.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(entry.endDate);
    endDate.setHours(0, 0, 0, 0);

    return dateToCheck >= startDate && dateToCheck <= endDate;
  });
};

// Función para agrupar entradas continuas con el mismo precio
const groupContinuousEntries = (entries: StockEntry[]): StockEntry[] => {
  if (entries.length <= 1) return entries;

  // Ordenar por categoría, luego por fecha de inicio
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.categoryId !== b.categoryId) {
      return a.categoryId.localeCompare(b.categoryId);
    }
    return a.startDate.getTime() - b.startDate.getTime();
  });

  const result: StockEntry[] = [];
  let currentEntry: StockEntry | null = null;

  for (const entry of sortedEntries) {
    if (!currentEntry) {
      currentEntry = { ...entry };
      continue;
    }

    // Si es la misma categoría, mismo precio y las fechas son continuas
    if (
      currentEntry.categoryId === entry.categoryId &&
      currentEntry.price === entry.price &&
      currentEntry.availableRooms === entry.availableRooms
    ) {
      const currentEndTime = new Date(currentEntry.endDate).getTime();
      const nextStartTime = new Date(entry.startDate).getTime();
      const oneDayMs = 24 * 60 * 60 * 1000;

      // Si la diferencia es de un día o menos, unir las entradas
      if (nextStartTime - currentEndTime <= oneDayMs) {
        currentEntry.endDate = new Date(
          Math.max(currentEndTime, new Date(entry.endDate).getTime())
        );
        continue;
      }
    }

    result.push(currentEntry);
    currentEntry = { ...entry };
  }

  if (currentEntry) {
    result.push(currentEntry);
  }

  return result;
};

// Función para ordenar las entradas por duración (las más largas primero)
const sortEntriesByDuration = (entries: StockEntry[]): StockEntry[] => {
  return [...entries].sort((a, b) => {
    // Calcular duración en días
    const durationA =
      (new Date(a.endDate).getTime() - new Date(a.startDate).getTime()) / (1000 * 60 * 60 * 24);
    const durationB =
      (new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / (1000 * 60 * 60 * 24);

    // Ordenar por duración (descendente)
    return durationB - durationA;
  });
};

// Añadir esta función
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const CalendarStockPage = () => {
  const categories = extractCategories();
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'biweek'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<StockEntry>>({
    price: 0,
    availableRooms: 1,
  });

  // Referencia para el contenedor del calendario
  const calendarRef = useRef<HTMLDivElement>(null);

  // Cargar datos de ejemplo al iniciar
  useEffect(() => {
    setStockEntries(generateMockStockData(categories));
  }, []);

  // Filtrar entradas por categoría seleccionada
  const filteredEntries =
    selectedCategory === 'all'
      ? stockEntries
      : stockEntries.filter(entry => entry.categoryId === selectedCategory);

  // Agrupar entradas continuas con el mismo precio y ordenar por duración
  const groupedEntries = useMemo(() => {
    const grouped = groupContinuousEntries(filteredEntries);
    return sortEntriesByDuration(grouped);
  }, [filteredEntries]);

  // Obtener días según el modo de vista (semana, quincena o mes)
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();

    // Para vista de mes
    if (viewMode === 'month') {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      // Obtener el día de la semana del primer día (0 = Domingo, 1 = Lunes, etc.)
      const firstDayOfWeek = firstDay.getDay();

      // Ajustar para que la semana comience en lunes (0 = Lunes, 6 = Domingo)
      const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

      // Crear array con los días del mes
      const days = [];

      // Añadir días del mes anterior para completar la primera semana
      const prevMonth = new Date(year, month, 0);
      const prevMonthDays = prevMonth.getDate();

      for (let i = adjustedFirstDayOfWeek - 1; i >= 0; i--) {
        days.push({
          date: new Date(year, month - 1, prevMonthDays - i),
          isCurrentMonth: false,
        });
      }

      // Añadir días del mes actual
      for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push({
          date: new Date(year, month, i),
          isCurrentMonth: true,
        });
      }

      // Añadir días del mes siguiente para completar la última semana
      const nextMonthDays = 42 - days.length; // 6 semanas * 7 días = 42

      for (let i = 1; i <= nextMonthDays; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false,
        });
      }

      return days;
    }
    // Para vista de semana
    else if (viewMode === 'week') {
      const days = [];

      // Encontrar el lunes de la semana actual
      const currentDay = new Date(year, month, date);
      const dayOfWeek = currentDay.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajustar para que la semana comience en lunes

      const monday = new Date(year, month, date - diff);

      // Añadir 7 días a partir del lunes
      for (let i = 0; i < 7; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        days.push({
          date: day,
          isCurrentMonth: day.getMonth() === month,
        });
      }

      return days;
    }
    // Para vista de quincena
    else if (viewMode === 'biweek') {
      const days = [];

      // Encontrar el lunes de la semana actual
      const currentDay = new Date(year, month, date);
      const dayOfWeek = currentDay.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajustar para que la semana comience en lunes

      const monday = new Date(year, month, date - diff);

      // Añadir 14 días a partir del lunes
      for (let i = 0; i < 14; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        days.push({
          date: day,
          isCurrentMonth: day.getMonth() === month,
        });
      }

      return days;
    }

    return [];
  };

  const days = getDaysInMonth();

  // Formatear período para mostrar según el modo de vista
  const formatPeriod = (date: Date) => {
    if (viewMode === 'month') {
      return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    } else if (viewMode === 'week' || viewMode === 'biweek') {
      // Encontrar el lunes de la semana actual
      const currentDay = new Date(date);
      const dayOfWeek = currentDay.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajustar para que la semana comience en lunes

      const monday = new Date(date);
      monday.setDate(date.getDate() - diff);

      // Calcular el último día del período
      const endDay = new Date(monday);
      endDay.setDate(monday.getDate() + (viewMode === 'week' ? 6 : 13));

      // Formatear fechas
      const startFormatted = monday.toLocaleDateString('es-ES', { day: 'numeric' });
      const endFormatted = endDay.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      return `${startFormatted} - ${endFormatted}`;
    }

    return '';
  };

  // Navegar al período anterior según el modo de vista
  const goToPrevPeriod = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'month') {
        newDate.setMonth(prev.getMonth() - 1);
      } else if (viewMode === 'biweek') {
        newDate.setDate(prev.getDate() - 14);
      } else {
        // week
        newDate.setDate(prev.getDate() - 7);
      }
      return newDate;
    });
  };

  // Navegar al período siguiente según el modo de vista
  const goToNextPeriod = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'month') {
        newDate.setMonth(prev.getMonth() + 1);
      } else if (viewMode === 'biweek') {
        newDate.setDate(prev.getDate() + 14);
      } else {
        // week
        newDate.setDate(prev.getDate() + 7);
      }
      return newDate;
    });
  };

  // Ir al mes actual
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Función para verificar si una fecha tiene entradas de stock
  const getEntriesForDate = (date: Date) => {
    return groupedEntries.filter(entry => {
      const entryStartDate = new Date(entry.startDate);
      const entryEndDate = new Date(entry.endDate);

      // Resetear horas para comparar solo fechas
      const dateToCheck = new Date(date);
      dateToCheck.setHours(0, 0, 0, 0);

      const startDateToCheck = new Date(entryStartDate);
      startDateToCheck.setHours(0, 0, 0, 0);

      const endDateToCheck = new Date(entryEndDate);
      endDateToCheck.setHours(0, 0, 0, 0);

      return dateToCheck >= startDateToCheck && dateToCheck <= endDateToCheck;
    });
  };

  // Manejar clic en un día para añadir nueva entrada
  const handleDayClick = (date: Date) => {
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + 1); // Por defecto, 1 día

    setNewEntry({
      ...newEntry,
      startDate: date,
      endDate,
      categoryId: selectedCategory === 'all' ? categories[0]?.id : selectedCategory,
    });

    setShowAddModal(true);
  };

  // Guardar nueva entrada
  const handleSaveEntry = () => {
    if (
      !newEntry.categoryId ||
      !newEntry.startDate ||
      !newEntry.endDate ||
      !newEntry.price ||
      !newEntry.availableRooms
    ) {
      alert('Por favor, completa todos los campos');
      return;
    }

    // Verificar si ya existe una entrada para esta categoría en estas fechas
    const startDate = new Date(newEntry.startDate as Date);
    const endDate = new Date(newEntry.endDate as Date);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (hasEntryForCategoryAndDate(stockEntries, newEntry.categoryId as string, currentDate)) {
        alert(
          `Ya existe una entrada para esta categoría en la fecha ${currentDate.toLocaleDateString()}`
        );
        return;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const entry: StockEntry = {
      id: `stock-${Date.now()}`,
      categoryId: newEntry.categoryId as string,
      startDate: newEntry.startDate as Date,
      endDate: newEntry.endDate as Date,
      price: newEntry.price as number,
      availableRooms: newEntry.availableRooms as number,
    };

    setStockEntries(prev => [...prev, entry]);
    setShowAddModal(false);
    setNewEntry({
      price: 0,
      availableRooms: 1,
    });
  };

  return (
    <>
      <PageMetadata
        title="Calendario de Stock | Belfast Backoffice"
        description="Gestión de stock de habitaciones para Belfast Backoffice"
      />
      <PageBreadcrumb pageTitle="Calendario de Stock" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {/* Controles del calendario */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPeriod}
              className="rounded-md border border-stroke p-2 hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4"
              aria-label={
                viewMode === 'month'
                  ? 'Mes anterior'
                  : viewMode === 'biweek'
                  ? 'Quincena anterior'
                  : 'Semana anterior'
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <h2 className="text-xl font-semibold text-black dark:text-white">
              {formatPeriod(currentDate)}
            </h2>

            <button
              onClick={goToNextPeriod}
              className="rounded-md border border-stroke p-2 hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4"
              aria-label={
                viewMode === 'month'
                  ? 'Mes siguiente'
                  : viewMode === 'biweek'
                  ? 'Quincena siguiente'
                  : 'Semana siguiente'
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              onClick={goToToday}
              className="ml-2 rounded-md border border-stroke px-3 py-1 text-sm hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4"
            >
              Hoy
            </button>

            <div className="ml-4 flex items-center border border-stroke rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 text-sm ${
                  viewMode === 'week'
                    ? 'bg-slate-200 text-black'
                    : 'hover:bg-gray-100 dark:hover:bg-meta-4'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setViewMode('biweek')}
                className={`px-3 py-1 text-sm border-l border-r border-stroke ${
                  viewMode === 'biweek'
                    ? 'bg-slate-200 text-black'
                    : 'hover:bg-gray-100 dark:hover:bg-meta-4'
                }`}
              >
                Quincena
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 text-sm ${
                  viewMode === 'month'
                    ? 'bg-slate-200 text-black'
                    : 'hover:bg-gray-100 dark:hover:bg-meta-4'
                }`}
              >
                Mes
              </button>
            </div>

            <div className="ml-4">
              <select
                value={viewMode}
                onChange={e => setViewMode(e.target.value as 'month' | 'week' | 'biweek')}
                className="rounded-md border border-stroke px-3 py-1 text-sm dark:border-strokedark dark:bg-boxdark"
              >
                <option value="month">Mes</option>
                <option value="week">Semana</option>
                <option value="biweek">Quincena</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="rounded-md border border-stroke px-3 py-2 dark:border-strokedark dark:bg-boxdark"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setNewEntry({
                  ...newEntry,
                  startDate: new Date(),
                  endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
                  categoryId: selectedCategory === 'all' ? categories[0]?.id : selectedCategory,
                });
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 rounded-md bg-primary py-2 px-4 font-medium text-white hover:bg-opacity-80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Añadir Stock
            </button>
          </div>
        </div>

        {/* Calendario */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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

            {/* Días según el modo de vista */}
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
                const isToday = new Date().toDateString() === day.date.toDateString();

                // Determinar la posición de la celda en la cuadrícula (fila y columna)
                const row = Math.floor(index / 7);
                const col = index % 7;

                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day.date)}
                    className={`${
                      viewMode === 'month'
                        ? 'min-h-[140px]'
                        : viewMode === 'biweek'
                        ? 'min-h-[250px]'
                        : 'min-h-[500px]'
                    } border-b border-r border-stroke p-2 dark:border-strokedark relative ${
                      !day.isCurrentMonth ? 'bg-gray-50 dark:bg-meta-4/30' : ''
                    } ${isToday ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                    data-row={row}
                    data-col={col}
                    data-date={day.date.toISOString().split('T')[0]}
                  >
                    <div
                      className={`flex justify-between mb-3 pb-1 border-b border-gray-100 dark:border-gray-700 ${
                        !day.isCurrentMonth
                          ? 'text-gray-400 dark:text-gray-600'
                          : 'text-black dark:text-white'
                      } ${isToday ? 'font-bold text-primary' : ''}`}
                    >
                      <span>{day.date.getDate()}</span>
                      {entriesForDay.length > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                          {entriesForDay.length}
                        </span>
                      )}
                    </div>

                    {/* Entradas de stock para este día */}
                    <div className="mt-1 flex flex-col gap-1">
                      {entriesForDay.length === 0 && day.isCurrentMonth && (
                        <div className="text-xs text-red-500 font-medium">Sin stock</div>
                      )}
                      {entriesForDay.map(entry => {
                        const category = categories.find(c => c.id === entry.categoryId);
                        const categoryColor = category
                          ? getCategoryColor(category.name)
                          : CATEGORY_COLORS.default;

                        return (
                          <div
                            key={entry.id}
                            className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs hover:shadow-sm transition-shadow cursor-pointer"
                            style={{
                              backgroundColor: `${categoryColor}15`, // Color con muy baja opacidad
                              borderLeft: `3px solid ${categoryColor}`,
                              borderBottom: `1px solid ${categoryColor}30`,
                            }}
                            title={`${category?.name} - $${entry.price}/noche - ${entry.availableRooms} habitaciones disponibles`}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium truncate" style={{ maxWidth: '80px' }}>
                                {category?.name}
                              </span>
                              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                {new Date(entry.startDate).toLocaleDateString()}
                                {!isSameDay(entry.startDate, entry.endDate) &&
                                  ` - ${new Date(entry.endDate).toLocaleDateString()}`}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-bold text-sm">${entry.price}/noche</span>
                              <span className="text-[10px] bg-white dark:bg-gray-700 bg-opacity-70 rounded px-1 flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-2.5 w-2.5 mr-0.5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                                {entry.availableRooms}
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
        </div>
      </div>

      {/* Modal para añadir nueva entrada */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-boxdark shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Añadir Stock de Habitaciones
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Categoría de Habitación
              </label>
              <select
                value={newEntry.categoryId}
                onChange={e => setNewEntry({ ...newEntry, categoryId: e.target.value })}
                className="w-full rounded-lg border border-stroke px-3 py-2 dark:border-strokedark dark:bg-meta-4 focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Fecha inicio
                </label>
                <input
                  type="date"
                  value={newEntry.startDate ? newEntry.startDate.toISOString().split('T')[0] : ''}
                  onChange={e => {
                    const date = new Date(e.target.value);
                    setNewEntry({ ...newEntry, startDate: date });
                    // Si no hay fecha fin, establecerla igual a la fecha inicio
                    if (!newEntry.endDate) {
                      setNewEntry(prev => ({ ...prev, endDate: date }));
                    }
                  }}
                  className="w-full rounded-lg border border-stroke px-3 py-2 dark:border-strokedark dark:bg-meta-4 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Fecha fin
                </label>
                <input
                  type="date"
                  value={newEntry.endDate ? newEntry.endDate.toISOString().split('T')[0] : ''}
                  onChange={e => {
                    const date = new Date(e.target.value);
                    setNewEntry({ ...newEntry, endDate: date });
                  }}
                  min={newEntry.startDate ? newEntry.startDate.toISOString().split('T')[0] : ''}
                  className="w-full rounded-lg border border-stroke px-3 py-2 dark:border-strokedark dark:bg-meta-4 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Precio por noche ($)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={newEntry.price}
                    onChange={e => setNewEntry({ ...newEntry, price: Number(e.target.value) })}
                    className="w-full rounded-lg border border-stroke pl-3 pr-10 py-2 dark:border-strokedark dark:bg-meta-4 focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Precio por noche"
                    min="0"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    $
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Habitaciones disponibles
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={newEntry.availableRooms}
                    onChange={e =>
                      setNewEntry({ ...newEntry, availableRooms: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-stroke pl-3 pr-10 py-2 dark:border-strokedark dark:bg-meta-4 focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Número de habitaciones"
                    min="0"
                    step="1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2 mb-4">
              <div className="p-3 bg-gray-50 dark:bg-meta-4 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-black dark:text-white">Resumen</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {newEntry.startDate && newEntry.endDate
                      ? `${
                          Math.ceil(
                            (newEntry.endDate.getTime() - newEntry.startDate.getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) + 1
                        } días`
                      : 'Selecciona fechas'}
                  </span>
                </div>

                {newEntry.categoryId && categories.find(c => c.id === newEntry.categoryId) && (
                  <div className="flex items-center mt-1">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{
                        backgroundColor: getCategoryColor(
                          categories.find(c => c.id === newEntry.categoryId)?.name || ''
                        ),
                      }}
                    ></div>
                    <span className="text-sm">
                      {categories.find(c => c.id === newEntry.categoryId)?.name}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">Precio total por habitación:</span>
                  <span className="font-bold">
                    {newEntry.price && newEntry.startDate && newEntry.endDate
                      ? `$${
                          newEntry.price *
                          (Math.ceil(
                            (newEntry.endDate.getTime() - newEntry.startDate.getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) +
                            1)
                        } ($${newEntry.price}/noche × ${
                          Math.ceil(
                            (newEntry.endDate.getTime() - newEntry.startDate.getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) + 1
                        } noches)`
                      : '$0'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-stroke px-4 py-2 text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEntry}
                disabled={
                  !newEntry.categoryId ||
                  !newEntry.startDate ||
                  !newEntry.endDate ||
                  (newEntry.price !== undefined && newEntry.price <= 0) ||
                  (newEntry.availableRooms !== undefined && newEntry.availableRooms <= 0)
                }
                className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90 disabled:bg-opacity-50 disabled:cursor-not-allowed"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarStockPage;
