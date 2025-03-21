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
});
