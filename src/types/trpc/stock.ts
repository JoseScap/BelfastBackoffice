import { t } from '@/types/trpc/common';
import { stockSchemas } from '@/types/schemas/stock';

// Router definition
export const stockRouter = t.router({
  bulkCreateIndividualStocks: t.procedure
    .input(stockSchemas.bulkCreate)
    .output(stockSchemas.bulkCreateResponse)
    .mutation(async ({ input }) => {
      // Implementación temporal para pruebas
      console.log('Creando stocks con input:', input);
      return {
        createdStocks: 1,
      };
    }),
  getStocksByFilters: t.procedure
    .input(stockSchemas.getByFilters)
    .output(stockSchemas.getByFiltersResponse)
    .query(async ({ input }) => {
      // Implementación temporal para pruebas
      console.log('Buscando stocks con filtros:', input);
      return {
        individualStocks: [],
      };
    }),
  updateStocksPrice: t.procedure
    .input(stockSchemas.updatePrice)
    .output(stockSchemas.updatePriceResponse)
    .mutation(async ({ input }) => {
      console.log('Actualizando precio de stocks:', input);
      return {
        updatedStocks: 1,
      };
    }),
  deleteStocks: t.procedure
    .input(stockSchemas.delete)
    .output(stockSchemas.deleteResponse)
    .mutation(async ({ input }) => {
      console.log('Eliminando stocks:', input);
      return {
        deletedStocks: 1,
      };
    }),
});
