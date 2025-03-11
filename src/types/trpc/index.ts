import { t } from '@/types/trpc/common';
import { authRouter } from '@/types/trpc/auth';
import { statusRouter } from '@/types/trpc/status';
import { roomRouter } from '@/types/trpc/room';
import { roomCategoryRouter } from '@/types/trpc/roomCategory';
import { roomStatusRouter } from '@/types/trpc/roomStatus';

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

// Definir el router principal
export const appRouter = t.router({
  auth: authRouter,
  status: statusRouter,
  room: roomRouter,
  roomCategory: roomCategoryRouter,
  roomStatus: roomStatusRouter,
});

// Tipos inferidos para entradas y salidas
export type AppRouter = typeof appRouter;

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
};

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
};
