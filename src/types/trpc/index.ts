import { t } from '@/types/trpc/common';
import { authRouter } from '@/types/trpc/auth';
import { statusRouter } from '@/types/trpc/status';
import { roomRouter } from '@/types/trpc/room';
import { roomCategoryRouter } from '@/types/trpc/roomCategory';
import { roomStatusRouter } from '@/types/trpc/roomStatus';
import { stockRouter } from '@/types/trpc/stock';
import { reservationRouter } from '@/types/trpc/reservation';

import { LoginInput, RegisterInput, User, LoginResponse } from '@/types/api/auth';
import { PingResponse } from '@/types/api/status';
import { ActionResponse } from '@/types/api/common';
import {
  RoomResponse,
  CreateRoomInput,
  UpdateRoomInput,
  UpdateRoomStatusInput,
  DeleteRoomInput,
  RestoreRoomInput,
  GetRoomsByFilterInput,
  GetRoomByIdInput,
  GetAllFloorsInput,
  GetAllSectorsInput,
} from '@/types/api/room';
import {
  RoomCategoryResponse,
  CreateRoomCategoryInput,
  UpdateRoomCategoryInput,
  DeleteRoomCategoryInput,
  RestoreRoomCategoryInput,
  GetAllRoomCategoriesInput,
  GetRoomCategoryByIdInput,
} from '@/types/api/roomCategory';
import { RoomStatusResponse } from '@/types/api/roomStatus';
import {
  bulkCreateStocksInput,
  GetStocksByFiltersInput,
  bulkCreateStocksResponse,
  GetStocksByFiltersResponse,
} from '@/types/api/stock';
import {
  ListReservationsByStatusResponse,
  CreateReservationRequest as CreateReservationInput,
  EditReservationRequest as UpdateReservationInput,
  CancelReservationRequest as UpdateReservationStatusInput,
  EditReservationRequest as DeleteReservationInput,
  EditReservationRequest as RestoreReservationInput,
  EditReservationRequest as GetReservationByIdInput,
  ListReservationsRequest as GetReservationsByFilterInput,
} from '@/types/api/reservation';

// Definir el router principal
export const appRouter = t.router({
  auth: authRouter,
  status: statusRouter,
  rooms: roomRouter,
  roomCategories: roomCategoryRouter,
  roomStatus: roomStatusRouter,
  stocks: stockRouter,
  reservations: reservationRouter,
});

// Tipo del router
export type AppRouter = typeof appRouter;

// Tipos de entrada
export type RouterInputs = {
  auth: {
    login: LoginInput;
    register: RegisterInput;
  };
  room: {
    create: CreateRoomInput;
    getByFilter: GetRoomsByFilterInput;
    getById: GetRoomByIdInput;
    getAllFloors: GetAllFloorsInput;
    getAllSectors: GetAllSectorsInput;
    update: UpdateRoomInput;
    updateStatus: UpdateRoomStatusInput;
    delete: DeleteRoomInput;
    restore: RestoreRoomInput;
  };
  roomCategory: {
    create: CreateRoomCategoryInput;
    getAll: GetAllRoomCategoriesInput;
    getById: GetRoomCategoryByIdInput;
    update: UpdateRoomCategoryInput;
    delete: DeleteRoomCategoryInput;
    restore: RestoreRoomCategoryInput;
  };
  stocks: {
    bulkCreateStocks: bulkCreateStocksInput;
    getStocksByFilters: GetStocksByFiltersInput;
  };
  reservations: {
    create: CreateReservationInput;
    getByFilter: GetReservationsByFilterInput;
    getById: GetReservationByIdInput;
    update: UpdateReservationInput;
    updateStatus: UpdateReservationStatusInput;
    delete: DeleteReservationInput;
    restore: RestoreReservationInput;
  };
};

// Tipos de salida
export type RouterOutputs = {
  auth: {
    login: LoginResponse;
    register: LoginResponse;
    profile: User;
  };
  status: {
    ping: PingResponse;
  };
  room: {
    create: RoomResponse;
    getByFilter: RoomResponse[];
    getById: RoomResponse;
    getAllFloors: string[];
    getAllSectors: string[];
    update: RoomResponse;
    updateStatus: ActionResponse;
    delete: ActionResponse;
    restore: ActionResponse;
  };
  roomCategory: {
    create: RoomCategoryResponse;
    getAll: RoomCategoryResponse[];
    getById: RoomCategoryResponse;
    update: RoomCategoryResponse;
    delete: ActionResponse;
    restore: ActionResponse;
  };
  roomStatus: {
    getAll: RoomStatusResponse[];
  };
  stocks: {
    bulkCreateStocks: bulkCreateStocksResponse;
    getStocksByFilters: GetStocksByFiltersResponse;
  };
  reservations: {
    create: ListReservationsByStatusResponse;
    getByFilter: ListReservationsByStatusResponse[];
    getById: ListReservationsByStatusResponse;
    update: ListReservationsByStatusResponse;
    updateStatus: ActionResponse;
    delete: ActionResponse;
    restore: ActionResponse;
  };
};
