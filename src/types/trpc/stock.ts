import { t } from '@/types/trpc/common';
import { stockSchemas } from '@/types/schemas/stock';

// Router definition
export const stockRouter = t.router({
  bulkCreateIndividualStocks: t.procedure
    .input(stockSchemas.bulkCreate)
    .output(stockSchemas.bulkCreateResponse)
    .mutation(async () => {
      // Implementación temporal para pruebas
      return {
        createdStocks: 1,
      };
    }),
  getStocksByFilters: t.procedure
    .input(stockSchemas.getByFilters)
    .output(stockSchemas.getByFiltersResponse)
    .query(async () => {
      // Implementación temporal para pruebas
      return {
        individualStocks: [],
      };
    }),
  updateStocksPrice: t.procedure
    .input(stockSchemas.updatePrice)
    .output(stockSchemas.updatePriceResponse)
    .mutation(async () => {
      return {
        updatedStocks: 1,
      };
    }),
  deleteStocks: t.procedure
    .input(stockSchemas.delete)
    .output(stockSchemas.deleteResponse)
    .mutation(async () => {
      return {
        deletedStocks: 1,
      };
    }),
});
