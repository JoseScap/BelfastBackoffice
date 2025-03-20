'use client';

import React, { useEffect } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PageMetadata from '@/components/common/PageMetadata';
import { useStocks } from '@/hooks/useStocks';
import { useCategories } from '@/hooks/useCategories';
import type { Stock, Category, DateRange } from '@/types/api/stock';

interface FormField {
  label: string;
  type: 'date' | 'number';
  value: string | number;
  onChange: (value: string) => void;
  min?: string;
  step?: string;
}

// Constantes para la configuración de la tabla
const TABLE_HEADERS = [
  { key: 'fromDate', label: 'Fecha Inicio' },
  { key: 'toDate', label: 'Fecha Fin' },
  { key: 'stockQuantity', label: 'Cantidad' },
  { key: 'price', label: 'Precio' },
  { key: 'categoryId', label: 'Categoría' },
] as const;

// Props interfaces
interface CreateStockFormProps {
  newStock: Stock;
  setNewStock: (stock: Stock) => void;
  categories: Category[];
  isLoadingCategories: boolean;
  isCreating: boolean;
  createStock: () => void;
}

interface SearchControlsProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  categories: Category[];
  isLoading: boolean;
  fetchStocks: () => void;
}

interface StocksTableProps {
  stocks: Stock[];
  categories: Category[];
  isLoading: boolean;
}

// Componente para el formulario de creación
const CreateStockForm: React.FC<CreateStockFormProps> = ({
  newStock,
  setNewStock,
  categories,
  isLoadingCategories,
  isCreating,
  createStock,
}) => {
  const formFields: FormField[] = [
    {
      label: 'Fecha Inicio',
      type: 'date',
      value: newStock.fromDate,
      onChange: (value: string) => setNewStock({ ...newStock, fromDate: value }),
    },
    {
      label: 'Fecha Fin',
      type: 'date',
      value: newStock.toDate,
      onChange: (value: string) => setNewStock({ ...newStock, toDate: value }),
    },
    {
      label: 'Cantidad',
      type: 'number',
      value: newStock.stockQuantity,
      onChange: (value: string) => {
        const numValue = Math.max(1, Math.floor(Number(value || 1)));
        setNewStock({ ...newStock, stockQuantity: numValue });
      },
      min: '1',
      step: '1',
    },
    {
      label: 'Precio',
      type: 'number',
      value: newStock.price,
      onChange: (value: string) => {
        const numValue = Math.max(0, Number(value || 0));
        setNewStock({ ...newStock, price: numValue });
      },
      min: '0',
      step: '0.01',
    },
  ];

  return (
    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Crear Nuevo Stock</h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {formFields.map(field => (
          <div key={field.label}>
            <label className="mb-2.5 block text-black dark:text-white">{field.label}</label>
            <input
              type={field.type}
              value={field.value}
              onChange={e => field.onChange(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              min={field.min}
              step={field.step}
              required
            />
          </div>
        ))}
        <div>
          <label className="mb-2.5 block text-black dark:text-white">Categoría</label>
          <select
            value={newStock.categoryId}
            onChange={e => setNewStock({ ...newStock, categoryId: e.target.value })}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
            disabled={isLoadingCategories}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={createStock}
          disabled={isCreating || isLoadingCategories}
          className="flex items-center gap-2 rounded-md bg-black py-2 px-4.5 font-medium text-white hover:bg-opacity-80"
        >
          {isCreating ? 'Creando...' : 'Crear Stock'}
        </button>
      </div>
    </div>
  );
};

// Componente para los controles de búsqueda
const SearchControls: React.FC<SearchControlsProps> = ({
  dateRange,
  setDateRange,
  selectedCategoryId,
  setSelectedCategoryId,
  categories,
  isLoading,
  fetchStocks,
}) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-4">
      {(['startDate', 'endDate'] as const).map(dateKey => (
        <div key={dateKey} className="w-full sm:w-auto">
          <input
            type="date"
            value={dateRange[dateKey]}
            onChange={e => setDateRange({ ...dateRange, [dateKey]: e.target.value })}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
          />
        </div>
      ))}
      <div className="w-full sm:w-auto">
        <select
          value={selectedCategoryId}
          onChange={e => setSelectedCategoryId(e.target.value)}
          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        >
          <option value="">Todas las categorías</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <button
        onClick={fetchStocks}
        className="flex items-center gap-2 rounded-md bg-black py-2 px-4.5 font-medium text-white hover:bg-opacity-80"
        disabled={isLoading}
      >
        {isLoading ? 'Cargando...' : 'Buscar Stocks'}
      </button>
    </div>
  </div>
);

// Componente para la tabla de stocks
const StocksTable: React.FC<StocksTableProps> = ({ stocks, categories, isLoading }) => (
  <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Stock Disponible</h4>
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {TABLE_HEADERS.map(header => (
              <th key={header.key} className="py-4 px-4 font-medium text-black dark:text-white">
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr key={index}>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {new Date(stock.fromDate).toLocaleDateString()}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {new Date(stock.toDate).toLocaleDateString()}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {stock.stockQuantity}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                ${stock.price}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {categories.find(c => c.id === stock.categoryId)?.name || stock.categoryId}
              </td>
            </tr>
          ))}
          {stocks.length === 0 && !isLoading && (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No hay stocks disponibles para el rango de fechas seleccionado
              </td>
            </tr>
          )}
          {isLoading && (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Cargando stocks...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// Componente principal
export default function StocksPage() {
  const {
    stocks,
    isLoading,
    isCreating,
    newStock,
    setNewStock,
    dateRange,
    setDateRange,
    selectedCategoryId,
    setSelectedCategoryId,
    createStock,
    fetchStocks,
  } = useStocks();

  const { categories, isLoading: isLoadingCategories, fetchCategories } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <PageMetadata
        title="Gestión de Stock | Belfast Backoffice"
        description="Gestión de stock para Belfast Backoffice"
      />
      <PageBreadcrumb pageTitle="Gestión de Stock" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <CreateStockForm
          newStock={newStock}
          setNewStock={setNewStock}
          categories={categories}
          isLoadingCategories={isLoadingCategories}
          isCreating={isCreating}
          createStock={createStock}
        />

        <SearchControls
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          categories={categories}
          isLoading={isLoading}
          fetchStocks={fetchStocks}
        />

        <StocksTable stocks={stocks} categories={categories} isLoading={isLoading} />
      </div>
    </>
  );
}
