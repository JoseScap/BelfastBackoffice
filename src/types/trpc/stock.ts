import { z } from 'zod';
import { t } from '@/types/trpc/common';

// Constantes para mensajes de error
const ERROR_MESSAGES = {
  PACKAGE_NAME: {
    REQUIRED: 'El nombre del paquete es requerido',
    INVALID_TYPE: 'El nombre del paquete debe ser texto',
    MIN_LENGTH: 'El nombre del paquete debe tener al menos 1 caracter',
  },
  PRICE: {
    REQUIRED: 'El precio es requerido',
    INVALID_TYPE: 'El precio debe ser un número',
    POSITIVE: 'El precio debe ser mayor a 0',
  },
  STOCK_QUANTITY: {
    REQUIRED: 'La cantidad es requerida',
    INVALID_TYPE: 'La cantidad debe ser un número',
    POSITIVE: 'La cantidad debe ser mayor a 0',
  },
  DATE: {
    FROM_REQUIRED: 'La fecha de inicio es requerida',
    TO_REQUIRED: 'La fecha de fin es requerida',
    INVALID_TYPE: 'La fecha debe ser texto',
    INVALID_FORMAT: 'La fecha debe estar en formato ISO',
    INVALID_RANGE: 'La fecha de fin debe ser posterior a la fecha de inicio',
  },
  CATEGORY: {
    REQUIRED: 'La categoría es requerida',
    INVALID_TYPE: 'La categoría debe ser texto',
  },
  CREATED_STOCKS: {
    REQUIRED: 'La cantidad de stocks creados es requerida',
    INVALID_TYPE: 'La cantidad de stocks creados debe ser un número',
  },
} as const;

// Schema helpers
const createDateSchema = () =>
  z
    .string({
      required_error: ERROR_MESSAGES.DATE.FROM_REQUIRED,
      invalid_type_error: ERROR_MESSAGES.DATE.INVALID_TYPE,
    })
    .datetime({
      message: ERROR_MESSAGES.DATE.INVALID_FORMAT,
    });

// Request Schemas
const bulkCreateIndividualStocksRequestSchema = z
  .object({
    packageName: z
      .string({
        required_error: ERROR_MESSAGES.PACKAGE_NAME.REQUIRED,
        invalid_type_error: ERROR_MESSAGES.PACKAGE_NAME.INVALID_TYPE,
      })
      .min(1, ERROR_MESSAGES.PACKAGE_NAME.MIN_LENGTH)
      .optional(),
    isBundle: z
      .boolean({
        invalid_type_error: 'El campo debe ser verdadero o falso',
      })
      .default(false),
    price: z
      .number({
        required_error: ERROR_MESSAGES.PRICE.REQUIRED,
        invalid_type_error: ERROR_MESSAGES.PRICE.INVALID_TYPE,
      })
      .positive(ERROR_MESSAGES.PRICE.POSITIVE),
    categoryId: z.string({
      required_error: ERROR_MESSAGES.CATEGORY.REQUIRED,
      invalid_type_error: ERROR_MESSAGES.CATEGORY.INVALID_TYPE,
    }),
    stockQuantity: z
      .number({
        required_error: ERROR_MESSAGES.STOCK_QUANTITY.REQUIRED,
        invalid_type_error: ERROR_MESSAGES.STOCK_QUANTITY.INVALID_TYPE,
      })
      .positive(ERROR_MESSAGES.STOCK_QUANTITY.POSITIVE)
      .int('La cantidad debe ser un número entero'),
    fromDate: createDateSchema(),
    toDate: createDateSchema(),
  })
  .refine(data => new Date(data.fromDate) <= new Date(data.toDate), {
    message: ERROR_MESSAGES.DATE.INVALID_RANGE,
    path: ['toDate'],
  });

const getStocksByFiltersSchema = z
  .object({
    categoryId: z
      .string({
        invalid_type_error: ERROR_MESSAGES.CATEGORY.INVALID_TYPE,
      })
      .optional(),
    fromDate: createDateSchema(),
    toDate: createDateSchema(),
  })
  .refine(data => new Date(data.fromDate) <= new Date(data.toDate), {
    message: ERROR_MESSAGES.DATE.INVALID_RANGE,
    path: ['toDate'],
  });

// Response Schemas
const bulkCreateIndividualStocksResponseSchema = z.object({
  createdStocks: z.number({
    required_error: ERROR_MESSAGES.CREATED_STOCKS.REQUIRED,
    invalid_type_error: ERROR_MESSAGES.CREATED_STOCKS.INVALID_TYPE,
  }),
});

const getStocksGroupedByDateResponseSchema = z.object({
  date: z.date(),
  count: z.number().int().nonnegative(),
  price: z.number().nonnegative(),
});

const getStocksByFiltersResponseSchema = z.object({
  individualStocks: z.array(getStocksGroupedByDateResponseSchema),
});

// Router definition
export const stockRouter = t.router({
  bulkCreateIndividualStocks: t.procedure
    .input(bulkCreateIndividualStocksRequestSchema)
    .output(bulkCreateIndividualStocksResponseSchema)
    .mutation(async ({ input }) => {
      // Implementación temporal para pruebas
      console.log('Creando stocks con input:', input);
      return {
        createdStocks: 1,
      };
    }),
  getStocksByFilters: t.procedure
    .input(getStocksByFiltersSchema)
    .output(getStocksByFiltersResponseSchema)
    .query(async ({ input }) => {
      // Implementación temporal para pruebas
      console.log('Buscando stocks con filtros:', input);
      return {
        individualStocks: [],
      };
    }),
});
