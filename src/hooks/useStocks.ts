import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { toast } from 'react-hot-toast';
import { trpcClient } from '@/api/trpc/client';
import { STOCK_ERROR_MESSAGES } from '@/types/schemas/stock';
import type { Stock, UpdateStocksPriceInput } from '@/types/api/stock';

interface StockResponse {
  date: string;
  price: number;
  count: number;
  categoryId: string;
  categoryName: string;
}

interface UseStocksReturn {
  // Data states
  stocks: Stock[];
  isLoading: boolean;
  isCreating: boolean;
  error: Error | null;

  // Form state
  newStock: Stock;
  setNewStock: Dispatch<SetStateAction<Stock>>;

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
  updateStockPrice: (params: {
    fromDate: string;
    toDate: string;
    categoryId: string;
    price: number;
  }) => Promise<void>;
  deleteStock: (params: {
    fromDate: string;
    toDate: string;
    categoryId: string;
    quantity: number;
  }) => Promise<void>;
  validateStock: (stock: Stock) => string | null;
}

const today = new Date();
const nextMonth = new Date(today);
nextMonth.setMonth(nextMonth.getMonth() + 1);

const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const formatDateForApi = (dateStr: string): string => {
  // Si ya está en formato YYYY-MM-DD, lo retornamos tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  // Si es una fecha ISO o cualquier otro formato, la convertimos a YYYY-MM-DD
  const date = new Date(dateStr);
  // Ajustar a la zona horaria local
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().split('T')[0];
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
    endDate: formatDateForInput(nextMonth),
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Form state
  const [newStock, setNewStock] = useState<Stock>({
    fromDate: formatDateForInput(today),
    toDate: formatDateForInput(nextMonth),
    stockQuantity: 1,
    price: 100,
    categoryId: '',
  });

  const validateStock = useCallback((stock: Stock): string | null => {
    if (!stock.fromDate) return STOCK_ERROR_MESSAGES.DATE.FROM_REQUIRED;
    if (!stock.toDate) return STOCK_ERROR_MESSAGES.DATE.TO_REQUIRED;
    if (!stock.stockQuantity || stock.stockQuantity <= 0)
      return STOCK_ERROR_MESSAGES.STOCK_QUANTITY.POSITIVE;
    if (!stock.price || stock.price <= 0) return STOCK_ERROR_MESSAGES.PRICE.POSITIVE;
    if (!stock.categoryId) return STOCK_ERROR_MESSAGES.CATEGORY.REQUIRED;
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
      const transformedStocks: Stock[] = (response.individualStocks as StockResponse[]).map(
        stock => ({
          fromDate: formatDateForApi(stock.date),
          toDate: formatDateForApi(stock.date),
          stockQuantity: stock.count,
          price: stock.price,
          categoryId: stock.categoryId,
          categoryName: stock.categoryName,
        })
      );

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

      await trpcClient.stocks.bulkCreateStocks.mutate(payload);
      toast.success('Stock creado exitosamente');
      await fetchStocks();
    } catch (err) {
      // Verificar si el error es por exceder la cantidad de habitaciones disponibles
      if (err instanceof Error && err.message.includes('not enough rooms available')) {
        // Extraer los números del mensaje de error usando regex
        const currentStock = err.message.match(/Current stock: (\d+)/)?.[1];
        const totalRooms = err.message.match(/Total rooms: (\d+)/)?.[1];

        if (currentStock && totalRooms) {
          const availableRooms = Number(totalRooms) - Number(currentStock);
          toast.error(
            `No hay suficientes habitaciones disponibles. Quedan ${availableRooms} habitaciones disponibles en esta categoría.`
          );
        } else {
          toast.error('No hay suficientes habitaciones disponibles en esta categoría.');
        }
      } else {
        toast.error('Ha ocurrido un error al crear el stock. Por favor, inténtalo de nuevo.');
      }
      setError(err instanceof Error ? err : new Error('Error al crear el stock'));
    } finally {
      setIsCreating(false);
    }
  }, [newStock, fetchStocks, validateStock]);

  const updateStockPrice = useCallback(
    async (params: { fromDate: string; toDate: string; categoryId: string; price: number }) => {
      try {
        const updateInput: UpdateStocksPriceInput = {
          date: formatDateForApi(params.fromDate),
          fromDate: formatDateForApi(params.fromDate),
          toDate: formatDateForApi(params.toDate),
          categoryId: params.categoryId,
          price: params.price,
        };

        await trpcClient.stocks.updateStocksPrice.mutate(updateInput);

        toast.success('Precio actualizado exitosamente');
        await fetchStocks();
      } catch (err) {
        console.error('Error updating stock price:', err);
        toast.error('Error al actualizar el precio');
        throw err;
      }
    },
    [fetchStocks]
  );

  const deleteStock = useCallback(
    async (params: { fromDate: string; toDate: string; categoryId: string; quantity: number }) => {
      try {
        await trpcClient.stocks.deleteStocks.mutate({
          fromDate: formatDateForApi(params.fromDate),
          toDate: formatDateForApi(params.toDate),
          categoryId: params.categoryId,
          quantity: params.quantity,
        });

        toast.success('Stock eliminado exitosamente');
        await fetchStocks();
      } catch (err) {
        console.error('Error deleting stock:', err);
        toast.error('Error al eliminar el stock');
        throw err;
      }
    },
    [fetchStocks]
  );

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
    updateStockPrice,
    deleteStock,
    validateStock,
  };
};
