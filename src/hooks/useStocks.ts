import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { trpcClient } from '@/api/trpc';

export interface Stock {
  fromDate: string;
  toDate: string;
  stockQuantity: number;
  price: number;
  categoryId: string;
}

interface UseStocksReturn {
  // Data states
  stocks: Stock[];
  isLoading: boolean;
  isCreating: boolean;
  error: Error | null;

  // Form state
  newStock: Stock;
  setNewStock: (stock: Stock) => void;

  // Search filters state
  dateRange: {
    startDate: string;
    endDate: string;
  };
  setDateRange: (range: { startDate: string; endDate: string }) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (categoryId: string) => void;

  // Actions
  fetchStocks: () => Promise<void>;
  createStock: () => Promise<void>;
  validateStock: (stock: Stock) => string | null;
}

const today = new Date();
const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const formatDateForApi = (dateStr: string): string => {
  // Convertir YYYY-MM-DD a YYYY-MM-DDT00:00:00.000Z
  return new Date(dateStr + 'T00:00:00.000Z').toISOString();
};

export const useStocks = (): UseStocksReturn => {
  // Data states
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Search filters state
  const [dateRange, setDateRange] = useState({
    startDate: formatDateForInput(today),
    endDate: formatDateForInput(nextWeek),
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Form state
  const [newStock, setNewStock] = useState<Stock>({
    fromDate: formatDateForInput(today),
    toDate: formatDateForInput(nextWeek),
    stockQuantity: 1,
    price: 100,
    categoryId: '',
  });

  const validateStock = useCallback((stock: Stock): string | null => {
    if (!stock.fromDate) return 'La fecha de inicio es requerida';
    if (!stock.toDate) return 'La fecha de fin es requerida';
    if (!stock.stockQuantity || stock.stockQuantity <= 0) return 'La cantidad debe ser mayor a 0';
    if (!stock.price || stock.price <= 0) return 'El precio debe ser mayor a 0';
    if (!stock.categoryId) return 'La categoría es requerida';

    const fromDate = new Date(stock.fromDate);
    const toDate = new Date(stock.toDate);
    if (fromDate > toDate) return 'La fecha de inicio debe ser anterior a la fecha de fin';

    return null;
  }, []);

  const fetchStocks = useCallback(async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error('Las fechas son requeridas');
      return;
    }

    setIsLoading(true);
    try {
      const response = await trpcClient.stocks.getStocksByFilters.query({
        fromDate: formatDateForApi(dateRange.startDate),
        toDate: formatDateForApi(dateRange.endDate),
        categoryId: selectedCategoryId || undefined,
      });

      // Transformar la respuesta al formato esperado por el estado
      const transformedStocks: Stock[] = response.individualStocks.map(stock => ({
        fromDate: typeof stock.date === 'string' ? stock.date : new Date(stock.date).toISOString(),
        toDate: typeof stock.date === 'string' ? stock.date : new Date(stock.date).toISOString(),
        stockQuantity: stock.count,
        price: stock.price,
        categoryId: selectedCategoryId || '',
      }));

      setStocks(transformedStocks);
      setError(null);
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError(err instanceof Error ? err : new Error('Error al cargar los stocks'));
      toast.error('Error al cargar los stocks');
    } finally {
      setIsLoading(false);
    }
  }, [dateRange.startDate, dateRange.endDate, selectedCategoryId]);

  const createStock = useCallback(async () => {
    const validationError = validateStock(newStock);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsCreating(true);
    try {
      // Construir el payload exactamente como lo espera el backend
      const payload = {
        fromDate: formatDateForApi(newStock.fromDate),
        toDate: formatDateForApi(newStock.toDate),
        stockQuantity: newStock.stockQuantity,
        price: newStock.price,
        categoryId: newStock.categoryId,
      };

      // Log para debugging
      console.log('Payload a enviar:', JSON.stringify(payload, null, 2));

      const result = await trpcClient.stocks.bulkCreateIndividualStocks.mutate(payload);
      console.log('Resultado:', result);

      toast.success('Stock creado exitosamente');
      fetchStocks();
    } catch (err) {
      console.error('Error creating stock:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el stock';
      toast.error(errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsCreating(false);
    }
  }, [newStock, fetchStocks, validateStock]);

  return {
    // Data states
    stocks,
    isLoading,
    isCreating,
    error,

    // Form state
    newStock,
    setNewStock,

    // Search filters state
    dateRange,
    setDateRange,
    selectedCategoryId,
    setSelectedCategoryId,

    // Actions
    fetchStocks,
    createStock,
    validateStock,
  };
};
