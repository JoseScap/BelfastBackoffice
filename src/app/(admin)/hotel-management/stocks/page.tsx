'use client';

import React, { useState, useCallback, useEffect } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PageMetadata from '@/components/common/PageMetadata';
import { StockCalendar } from '@/components/stock/StockCalendar';
import { AddStockModal } from '@/components/modals/AddStockModal';
import { ViewStockModal } from '@/components/modals/ViewStockModal';
import { useStocks } from '@/hooks/useStocks';
import { useCategories } from '@/hooks/useCategories';
import type { Stock } from '@/types/api/stock';

// Función auxiliar para formatear fechas
const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const StocksPage = () => {
  // Estados para el calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'biweek'>('biweek');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  // Hooks
  const {
    stocks,
    isLoading: isLoadingStocks,
    newStock,
    setNewStock,
    setSelectedCategoryId,
    fetchStocks,
    createStock,
    updateStockPrice,
  } = useStocks();

  const { categories, isLoading: isLoadingCategories, fetchCategories } = useCategories();

  // Cargar stocks y categorías al montar el componente
  useEffect(() => {
    fetchStocks();
    fetchCategories();
  }, [fetchStocks, fetchCategories]);

  // Actualizar stocks cuando cambie la categoría seleccionada
  useEffect(() => {
    if (selectedCategory !== 'all') {
      setSelectedCategoryId(selectedCategory);
      fetchStocks();
    }
  }, [selectedCategory, setSelectedCategoryId, fetchStocks]);

  // Manejar clic en un día
  const handleDayClick = useCallback(
    (date: Date) => {
      // Asegurarnos de que la fecha esté en la zona horaria local y sin tiempo
      const localDate = new Date(date);
      localDate.setHours(0, 0, 0, 0);

      setNewStock({
        fromDate: localDate.toISOString().split('T')[0],
        toDate: localDate.toISOString().split('T')[0],
        stockQuantity: 1,
        price: 100,
        categoryId: selectedCategory === 'all' ? '' : selectedCategory,
      });

      setShowAddModal(true);
    },
    [selectedCategory, setNewStock]
  );

  // Manejar clic en un stock existente
  const handleStockClick = useCallback((stock: Stock) => {
    setSelectedStock(stock);
  }, []);

  // Manejar navegación del calendario
  const goToPrevPeriod = () => {
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
  };

  const goToNextPeriod = () => {
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
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Formatear período para mostrar
  const formatPeriod = (date: Date) => {
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
  };

  // Estado de carga
  const isLoading = isLoadingStocks || isLoadingCategories;

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
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={e => {
                const value = e.target.value;
                setSelectedCategory(value);
                setSelectedCategoryId(value === 'all' ? '' : value);
              }}
              className="rounded-md border border-stroke px-3 py-2 dark:border-strokedark dark:bg-boxdark"
              disabled={isLoadingCategories}
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
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);

                setNewStock({
                  fromDate: formatDateForInput(today),
                  toDate: formatDateForInput(tomorrow),
                  stockQuantity: 1,
                  price: 100,
                  categoryId: selectedCategory === 'all' ? '' : selectedCategory,
                });
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 rounded-md bg-primary py-2 px-4 font-medium text-white hover:bg-opacity-80"
              disabled={isLoading}
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
          <StockCalendar
            currentDate={currentDate}
            viewMode={viewMode}
            stocks={stocks}
            categories={categories}
            onDayClick={handleDayClick}
            onStockClick={handleStockClick}
          />
        </div>
      </div>

      {/* Modal para añadir stock */}
      <AddStockModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={async () => {
          await createStock();
        }}
        newStock={newStock}
        setNewStock={setNewStock}
        categories={categories}
      />

      {/* Modal para ver detalles del stock */}
      {selectedStock && (
        <ViewStockModal
          isOpen={!!selectedStock}
          onClose={() => setSelectedStock(null)}
          stock={selectedStock}
          category={categories.find(c => c.id === selectedStock.categoryId)}
          onUpdatePrice={updateStockPrice}
        />
      )}
    </>
  );
};

export default StocksPage;
