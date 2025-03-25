import { z } from 'zod';

// Constantes
export const RESERVATION_SOURCES = {
  BACKOFFICE: 'BACKOFFICE',
  APP: 'APP',
  WEBSITE: 'WEBSITE',
  BOOKING: 'BOOKING',
  WHATSAPP: 'WHATSAPP',
  OTHER_PORTAL: 'OTHER_PORTAL',
  OTHERS: 'OTHERS',
} as const;

// Schemas base
export const reservationSourceSchema = z.enum([
  RESERVATION_SOURCES.BACKOFFICE,
  RESERVATION_SOURCES.APP,
  RESERVATION_SOURCES.WEBSITE,
  RESERVATION_SOURCES.BOOKING,
  RESERVATION_SOURCES.WHATSAPP,
  RESERVATION_SOURCES.OTHER_PORTAL,
  RESERVATION_SOURCES.OTHERS,
]);

export const passengerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  age: z.number(),
  email: z.string(),
  phone: z.string(),
});

// Request schemas
export const createReservationRequestSchema = z.object({
  categoryId: z.string(),
  checkInDate: z.string(),
  checkInTime: z.string(),
  checkOutDate: z.string(),
  checkOutTime: z.string(),
  notes: z.string().default(''),
  extraDiscount: z.number().default(0),
  discountId: z.string().optional(),
  mainPassenger: passengerSchema,
  source: reservationSourceSchema.default(RESERVATION_SOURCES.BACKOFFICE),
});

export const confirmReservationRequestSchema = z.object({
  id: z.string(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
});

export const cancelReservationRequestSchema = z.object({
  id: z.string(),
  cancelType: z.enum(['CANCELED', 'OVERBOOKED']),
});

export const editReservationRequestSchema = z.object({
  id: z.string(),
  notes: z.string().optional(),
  extraDiscount: z.number().optional(),
  discountId: z.string().optional(),
  roomId: z.string().optional(),
  source: reservationSourceSchema.optional(),
});

// Query schemas
export const listReservationsRequestSchema = z.object({
  value: z.string().optional(),
});

// Response schemas
export const createReservationResponseSchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
  checkInDate: z.string(),
  checkInTime: z.string(),
  checkOutDate: z.string(),
  checkOutTime: z.string(),
  notes: z.string(),
  extraDiscount: z.number(),
  discountId: z.string().optional(),
  discountName: z.string().optional(),
  discountDescription: z.string().optional(),
  discountValue: z.number().optional(),
  mainPassenger: passengerSchema,
  source: reservationSourceSchema,
});

export const listReservationsByStatusResponseSchema = z.object({
  id: z.string(),
  checkInDate: z.string(),
  checkInTime: z.string(),
  checkOutDate: z.string(),
  checkOutTime: z.string(),
  notes: z.string(),
  appliedDiscount: z.number(),
  source: reservationSourceSchema,
  status: z.object({
    id: z.string(),
    value: z.string(),
    description: z.string(),
  }),
  discount: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      discount: z.number(),
    })
    .optional(),
  passengers: z.array(passengerSchema),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const reservationStatusResponseSchema = z.object({
  id: z.string(),
  value: z.string(),
  description: z.string(),
});

export const confirmReservationResponseSchema = z.object({
  id: z.string(),
  status: z.object({
    id: z.string(),
    value: z.string(),
    description: z.string(),
  }),
});

export const cancelReservationResponseSchema = z.object({
  id: z.string(),
  status: z.object({
    id: z.string(),
    value: z.string(),
    description: z.string(),
  }),
});

export const editReservationResponseSchema = z.object({
  id: z.string(),
  notes: z.string(),
  extraDiscount: z.number(),
  source: reservationSourceSchema,
  discount: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      discount: z.number(),
    })
    .optional(),
  room: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
});

// Inference types
export type Passenger = z.infer<typeof passengerSchema>;
export type CreateReservationRequest = z.infer<typeof createReservationRequestSchema>;
export type CreateReservationResponse = z.infer<typeof createReservationResponseSchema>;
export type ListReservationsRequest = z.infer<typeof listReservationsRequestSchema>;
export type ListReservationsByStatusResponse = z.infer<
  typeof listReservationsByStatusResponseSchema
>;
export type ReservationStatusResponse = z.infer<typeof reservationStatusResponseSchema>;
export type ConfirmReservationRequest = z.infer<typeof confirmReservationRequestSchema>;
export type ConfirmReservationResponse = z.infer<typeof confirmReservationResponseSchema>;
export type CancelReservationRequest = z.infer<typeof cancelReservationRequestSchema>;
export type CancelReservationResponse = z.infer<typeof cancelReservationResponseSchema>;
export type EditReservationRequest = z.infer<typeof editReservationRequestSchema>;
export type EditReservationResponse = z.infer<typeof editReservationResponseSchema>;
