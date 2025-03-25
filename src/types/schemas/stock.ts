import { z } from 'zod';

export const STOCK_ERROR_MESSAGES = {
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
      required_error: STOCK_ERROR_MESSAGES.DATE.FROM_REQUIRED,
      invalid_type_error: STOCK_ERROR_MESSAGES.DATE.INVALID_TYPE,
    })
    .datetime({
      message: STOCK_ERROR_MESSAGES.DATE.INVALID_FORMAT,
    });

export const stockSchemas = {
  bulkCreate: z
    .object({
      packageName: z
        .string({
          required_error: STOCK_ERROR_MESSAGES.PACKAGE_NAME.REQUIRED,
          invalid_type_error: STOCK_ERROR_MESSAGES.PACKAGE_NAME.INVALID_TYPE,
        })
        .min(1, STOCK_ERROR_MESSAGES.PACKAGE_NAME.MIN_LENGTH)
        .optional(),
      isBundle: z
        .boolean({
          invalid_type_error: 'El campo debe ser verdadero o falso',
        })
        .default(false),
      price: z
        .number({
          required_error: STOCK_ERROR_MESSAGES.PRICE.REQUIRED,
          invalid_type_error: STOCK_ERROR_MESSAGES.PRICE.INVALID_TYPE,
        })
        .positive(STOCK_ERROR_MESSAGES.PRICE.POSITIVE),
      categoryId: z.string({
        required_error: STOCK_ERROR_MESSAGES.CATEGORY.REQUIRED,
        invalid_type_error: STOCK_ERROR_MESSAGES.CATEGORY.INVALID_TYPE,
      }),
      stockQuantity: z
        .number({
          required_error: STOCK_ERROR_MESSAGES.STOCK_QUANTITY.REQUIRED,
          invalid_type_error: STOCK_ERROR_MESSAGES.STOCK_QUANTITY.INVALID_TYPE,
        })
        .positive(STOCK_ERROR_MESSAGES.STOCK_QUANTITY.POSITIVE)
        .int('La cantidad debe ser un número entero'),
      fromDate: createDateSchema(),
      toDate: createDateSchema(),
    })
    .refine(data => new Date(data.fromDate) <= new Date(data.toDate), {
      message: STOCK_ERROR_MESSAGES.DATE.INVALID_RANGE,
      path: ['toDate'],
    }),

  getByFilters: z
    .object({
      categoryId: z
        .string({
          invalid_type_error: STOCK_ERROR_MESSAGES.CATEGORY.INVALID_TYPE,
        })
        .optional(),
      fromDate: createDateSchema(),
      toDate: createDateSchema(),
    })
    .refine(data => new Date(data.fromDate) <= new Date(data.toDate), {
      message: STOCK_ERROR_MESSAGES.DATE.INVALID_RANGE,
      path: ['toDate'],
    }),

  bulkCreateResponse: z.object({
    createdStocks: z.number({
      required_error: STOCK_ERROR_MESSAGES.CREATED_STOCKS.REQUIRED,
      invalid_type_error: STOCK_ERROR_MESSAGES.CREATED_STOCKS.INVALID_TYPE,
    }),
  }),

  getByFiltersResponse: z.object({
    individualStocks: z.array(
      z.object({
        date: z.date(),
        count: z.number().int().nonnegative(),
        price: z.number().nonnegative(),
        categoryId: z.string(),
        categoryName: z.string(),
      })
    ),
  }),

  updatePrice: z
    .object({
      fromDate: createDateSchema(),
      toDate: createDateSchema(),
      categoryId: z.string({
        required_error: STOCK_ERROR_MESSAGES.CATEGORY.REQUIRED,
        invalid_type_error: STOCK_ERROR_MESSAGES.CATEGORY.INVALID_TYPE,
      }),
      price: z
        .number({
          required_error: STOCK_ERROR_MESSAGES.PRICE.REQUIRED,
          invalid_type_error: STOCK_ERROR_MESSAGES.PRICE.INVALID_TYPE,
        })
        .positive(STOCK_ERROR_MESSAGES.PRICE.POSITIVE),
    })
    .refine(data => new Date(data.fromDate) <= new Date(data.toDate), {
      message: STOCK_ERROR_MESSAGES.DATE.INVALID_RANGE,
      path: ['toDate'],
    }),

  updatePriceResponse: z.object({
    updatedStocks: z.number().int().nonnegative(),
  }),

  delete: z
    .object({
      fromDate: createDateSchema(),
      toDate: createDateSchema(),
      categoryId: z.string({
        required_error: STOCK_ERROR_MESSAGES.CATEGORY.REQUIRED,
        invalid_type_error: STOCK_ERROR_MESSAGES.CATEGORY.INVALID_TYPE,
      }),
      quantity: z
        .number({
          required_error: STOCK_ERROR_MESSAGES.STOCK_QUANTITY.REQUIRED,
          invalid_type_error: STOCK_ERROR_MESSAGES.STOCK_QUANTITY.INVALID_TYPE,
        })
        .positive(STOCK_ERROR_MESSAGES.STOCK_QUANTITY.POSITIVE)
        .int('La cantidad debe ser un número entero'),
    })
    .refine(data => new Date(data.fromDate) <= new Date(data.toDate), {
      message: STOCK_ERROR_MESSAGES.DATE.INVALID_RANGE,
      path: ['toDate'],
    }),

  deleteResponse: z.object({
    deletedStocks: z.number().int().nonnegative(),
  }),
} as const;
